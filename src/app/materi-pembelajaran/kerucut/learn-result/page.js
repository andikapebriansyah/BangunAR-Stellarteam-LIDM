/**
 * Kerucut Learn Result - Display completed rocket with calculations
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-orange-50 to-red-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500 mb-4"></div>
      <p className="text-orange-800 text-lg font-semibold">Memuat Hasil Roket...</p>
    </div>
  </div>
);

function RocketDisplay({ customSizes }) {
  const [containerRef, setContainerRef] = useState(null);

  useEffect(() => {
    if (!containerRef) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe8f4f8);

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.clientWidth / containerRef.clientHeight,
      0.1,
      1000
    );
    camera.position.set(20, 15, 25);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.clientWidth, containerRef.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffd0a0, 0.4);
    fillLight.position.set(-10, 5, -10);
    scene.add(fillLight);

    // Base Cone (Orange)
    const baseRadius = customSizes.base.radius / 10;
    const baseHeight = customSizes.base.height / 10;
    const baseCone = new THREE.Mesh(
      new THREE.ConeGeometry(baseRadius, baseHeight, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xff8800).multiplyScalar(1.5),
        metalness: 0.45,
        roughness: 0.2,
        envMapIntensity: 1.3
      })
    );
    baseCone.position.y = baseHeight / 2;
    baseCone.castShadow = true;
    scene.add(baseCone);

    // Cylinder Body (Silver)
    const bodyRadius = customSizes.body.radius / 10;
    const bodyHeight = customSizes.body.height / 10;
    const bodyY = baseHeight + bodyHeight / 2;
    const bodyCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(bodyRadius, bodyRadius, bodyHeight, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xc0c0c0).multiplyScalar(1.5),
        metalness: 0.45,
        roughness: 0.2,
        envMapIntensity: 1.3
      })
    );
    bodyCylinder.position.y = bodyY;
    bodyCylinder.castShadow = true;
    scene.add(bodyCylinder);

    // Nose Cone (Red)
    const noseRadius = customSizes.nose.radius / 10;
    const noseHeight = customSizes.nose.height / 10;
    const noseY = baseHeight + bodyHeight + noseHeight / 2;
    const noseCone = new THREE.Mesh(
      new THREE.ConeGeometry(noseRadius, noseHeight, 32),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(0xff0000).multiplyScalar(1.5),
        metalness: 0.45,
        roughness: 0.2,
        envMapIntensity: 1.3
      })
    );
    noseCone.position.y = noseY;
    noseCone.castShadow = true;
    scene.add(noseCone);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshStandardMaterial({ color: 0xddeeff, roughness: 0.8 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      containerRef?.removeChild(renderer.domElement);
    };
  }, [containerRef, customSizes]);

  return <div ref={setContainerRef} className="w-full h-[500px] rounded-lg overflow-hidden shadow-inner" />;
}

export default function KerucutLearnResult() {
  const router = useRouter();
  const [resultData, setResultData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem('kerucutBuildResult');
    if (data) {
      setResultData(JSON.parse(data));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!resultData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-800 mb-4">❌ Data roket tidak ditemukan</p>
          <button
            onClick={() => router.push('/materi-pembelajaran/kerucut/build-challenge')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Kembali ke Build Challenge
          </button>
        </div>
      </div>
    );
  }

  const { customSizes, volume, surfaceArea } = resultData;

  // Calculate individual components
  const baseVolume = (1 / 3) * Math.PI * Math.pow(customSizes.base.radius, 2) * customSizes.base.height;
  const bodyVolume = Math.PI * Math.pow(customSizes.body.radius, 2) * customSizes.body.height;
  const noseVolume = (1 / 3) * Math.PI * Math.pow(customSizes.nose.radius, 2) * customSizes.nose.height;
  
  const baseSlant = Math.sqrt(Math.pow(customSizes.base.radius, 2) + Math.pow(customSizes.base.height, 2));
  const noseSlant = Math.sqrt(Math.pow(customSizes.nose.radius, 2) + Math.pow(customSizes.nose.height, 2));

  const totalHeight = customSizes.base.height + customSizes.body.height + customSizes.nose.height;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center justify-center mb-2">
              <span className="text-5xl mr-3">🎉</span>
              Roket Peluncur Selesai!
              <span className="text-5xl ml-3">🚀</span>
            </h1>
            <p className="text-orange-100 text-base sm:text-lg">
              Analisis lengkap struktur dan perhitungan aerodinamis
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: 3D Model */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-orange-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">🚀</span>
              Model 3D Roket
            </h2>
            <RocketDisplay customSizes={customSizes} />
            
            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-orange-100 to-amber-50 p-3 rounded-lg text-center border-2 border-orange-400">
                <p className="text-orange-900 font-bold text-sm">🟧 Dasar</p>
                <p className="text-orange-700 text-xs">r={customSizes.base.radius}cm</p>
                <p className="text-orange-700 text-xs">t={customSizes.base.height}cm</p>
              </div>
              <div className="bg-gradient-to-br from-gray-100 to-slate-50 p-3 rounded-lg text-center border-2 border-gray-400">
                <p className="text-gray-900 font-bold text-sm">⬜ Badan</p>
                <p className="text-gray-700 text-xs">r={customSizes.body.radius}cm</p>
                <p className="text-gray-700 text-xs">t={customSizes.body.height}cm</p>
              </div>
              <div className="bg-gradient-to-br from-red-100 to-pink-50 p-3 rounded-lg text-center border-2 border-red-400">
                <p className="text-red-900 font-bold text-sm">🟥 Hidung</p>
                <p className="text-red-700 text-xs">r={customSizes.nose.radius}cm</p>
                <p className="text-red-700 text-xs">t={customSizes.nose.height}cm</p>
              </div>
            </div>
          </div>

          {/* Right: Calculations */}
          <div className="space-y-6">
            {/* Volume Section */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-green-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📊</span>
                Perhitungan Volume
              </h2>

              <div className="space-y-4">
                {/* Base Cone */}
                <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-400">
                  <h3 className="font-bold text-orange-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">🟧</span> Kerucut Dasar
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    V = ⅓πr²t = ⅓π({customSizes.base.radius})²({customSizes.base.height})
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {baseVolume.toFixed(2)} cm³
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    = {(baseVolume / 1000).toFixed(3)} liter
                  </p>
                </div>

                {/* Cylinder Body */}
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-400">
                  <h3 className="font-bold text-gray-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">⬜</span> Badan Tabung
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    V = πr²t = π({customSizes.body.radius})²({customSizes.body.height})
                  </p>
                  <p className="text-2xl font-bold text-gray-700">
                    {bodyVolume.toFixed(2)} cm³
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    = {(bodyVolume / 1000).toFixed(3)} liter
                  </p>
                </div>

                {/* Nose Cone */}
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-400">
                  <h3 className="font-bold text-red-900 mb-2 flex items-center">
                    <span className="text-xl mr-2">🟥</span> Kerucut Hidung
                  </h3>
                  <p className="text-sm text-gray-700 mb-2">
                    V = ⅓πr²t = ⅓π({customSizes.nose.radius})²({customSizes.nose.height})
                  </p>
                  <p className="text-2xl font-bold text-red-700">
                    {noseVolume.toFixed(2)} cm³
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    = {(noseVolume / 1000).toFixed(3)} liter
                  </p>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg shadow-lg">
                  <h3 className="font-bold text-white mb-2 text-lg">
                    🚀 Total Volume Roket
                  </h3>
                  <p className="text-3xl font-extrabold text-white">
                    {volume?.toFixed(2) || (baseVolume + bodyVolume + noseVolume).toFixed(2)} cm³
                  </p>
                  <p className="text-green-100 text-sm mt-1">
                    = {((baseVolume + bodyVolume + noseVolume) / 1000).toFixed(3)} liter
                  </p>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-blue-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-3xl mr-3">📐</span>
                Dimensi & Geometri
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-300">
                  <span className="text-gray-800 font-semibold">Tinggi Total</span>
                  <span className="text-blue-700 font-bold text-lg">
                    {totalHeight} cm = {(totalHeight / 100).toFixed(2)} m
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-300">
                  <span className="text-gray-800 font-semibold">Garis Pelukis Dasar</span>
                  <span className="text-orange-700 font-bold text-lg">
                    {baseSlant.toFixed(2)} cm
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-300">
                  <span className="text-gray-800 font-semibold">Garis Pelukis Hidung</span>
                  <span className="text-red-700 font-bold text-lg">
                    {noseSlant.toFixed(2)} cm
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-300">
                  <span className="text-gray-800 font-semibold">Rasio Aerodinamis</span>
                  <span className="text-purple-700 font-bold text-lg">
                    {(totalHeight / (customSizes.base.radius * 2)).toFixed(2)} : 1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Trivia */}
        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-6 border-4 border-purple-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">🎓</span>
            Fakta Menarik: Aerodinamika Roket
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-400">
              <h3 className="font-bold text-blue-900 mb-2 text-lg flex items-center">
                <span className="text-2xl mr-2">🌬️</span> Hambatan Udara
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Hidung kerucut mengurangi hambatan udara dengan membagi aliran udara secara smooth. 
                Sudut yang tajam = lebih aerodinamis!
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-4 rounded-lg border-2 border-orange-400">
              <h3 className="font-bold text-orange-900 mb-2 text-lg flex items-center">
                <span className="text-2xl mr-2">⚖️</span> Pusat Gravitasi
              </h3>
              <p className="text-orange-800 text-sm leading-relaxed">
                Kerucut dasar yang lebar memberikan stabilitas! Roket tetap lurus saat terbang 
                karena berat terpusat di bawah.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-400">
              <h3 className="font-bold text-purple-900 mb-2 text-lg flex items-center">
                <span className="text-2xl mr-2">📏</span> Juring Lingkaran
              </h3>
              <p className="text-purple-800 text-sm leading-relaxed">
                Selimut kerucut = juring lingkaran! Panjang busur = keliling alas kerucut. 
                Matematika bangun ruang di dunia nyata!
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/materi-pembelajaran/kerucut/build-challenge')}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">🔄</span>
            <span>Rakit Roket Baru</span>
          </button>

          <button
            onClick={() => router.push('/materi-pembelajaran')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <span className="text-2xl">📚</span>
            <span>Kembali ke Materi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
