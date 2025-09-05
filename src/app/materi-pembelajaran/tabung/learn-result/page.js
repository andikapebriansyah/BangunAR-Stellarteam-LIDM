'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TabungLearnResult() {
  const [buildResult, setBuildResult] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalSurfaceArea, setTotalSurfaceArea] = useState(0);
  const [objectDetails, setObjectDetails] = useState([]);

  useEffect(() => {
    // Load build result from localStorage
    const savedResult = localStorage.getItem('lastBuildResult');
    if (savedResult) {
      const result = JSON.parse(savedResult);
      setBuildResult(result);
      
      // Calculate totals and details
      if (result.objects && result.objects.length > 0) {
        let volume = 0;
        let surfaceArea = 0;
        const details = [];

        result.objects.forEach((obj, index) => {
          let objVolume = 0;
          let objSurfaceArea = 0;
          let radius = 0;
          let height = 0;
          let color = '';
          let name = '';

          // Calculate based on object type with correct dimensions
          if (obj.type === 'cylinder_large') {
            radius = 0.8;
            height = 1.0;
            color = '#8B4513';
            name = 'Tabung Besar';
          } else if (obj.type === 'cylinder_medium') {
            radius = 0.6;
            height = 0.8;
            color = '#4169E1';
            name = 'Tabung Sedang';
          } else if (obj.type === 'cylinder_small') {
            radius = 0.4;
            height = 0.6;
            color = '#FF6347';
            name = 'Tabung Kecil';
          }

          // Volume tabung = π × r² × t
          objVolume = Math.PI * radius * radius * height;
          // Luas permukaan tabung = 2πr(r + t)
          objSurfaceArea = 2 * Math.PI * radius * (radius + height);

          volume += objVolume;
          surfaceArea += objSurfaceArea;

          details.push({
            id: index + 1,
            type: obj.type,
            name,
            radius: radius.toFixed(2),
            height: height.toFixed(2),
            volume: objVolume.toFixed(2),
            surfaceArea: objSurfaceArea.toFixed(2),
            color
          });
        });

        setTotalVolume(volume.toFixed(2));
        setTotalSurfaceArea(surfaceArea.toFixed(2));
        setObjectDetails(details);
      }
    }
  }, []);

  const getPerformanceLevel = () => {
    if (!buildResult || !buildResult.objects) return { level: 'Belum Selesai', color: 'text-gray-500', bg: 'bg-gray-100' };
    
    const objectCount = buildResult.objects.length;
    if (objectCount === 3) {
      return { level: 'Sempurna!', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (objectCount === 2) {
      return { level: 'Bagus!', color: 'text-blue-600', bg: 'bg-blue-50' };
    } else if (objectCount === 1) {
      return { level: 'Coba Lagi!', color: 'text-orange-600', bg: 'bg-orange-50' };
    } else {
      return { level: 'Belum Mulai', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">🏗️ Hasil Build Challenge</h1>
              <p className="text-blue-100">Menara Tabung Bertingkat</p>
            </div>
            <div className="text-right">
              <Link href="/materi-pembelajaran/tabung">
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-sm transition-all">
                  ← Kembali ke Materi
                </button>
              </Link>
            </div>
          </div>
          
          <div className={`inline-block px-4 py-2 rounded-lg ${performance.bg}`}>
            <span className={`font-semibold ${performance.color}`}>
              Status: {performance.level}
            </span>
          </div>
        </div>

        {buildResult ? (
          <>
            {/* Build Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📊 Ringkasan Pembangunan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">📦</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {buildResult.objects ? buildResult.objects.length : 0}
                  </div>
                  <p className="text-sm text-gray-600">Tabung Digunakan</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">📏</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalVolume}</div>
                  <p className="text-sm text-gray-600">Total Volume</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{totalSurfaceArea}</div>
                  <p className="text-sm text-gray-600">Total Luas Permukaan</p>
                </div>
              </div>

              {buildResult.completedAt && (
                <p className="text-sm text-gray-500 text-center">
                  Diselesaikan pada: {new Date(buildResult.completedAt).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            {/* Object Details */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Detail Setiap Tabung</h2>
              
              {objectDetails.length > 0 ? (
                <div className="space-y-4">
                  {objectDetails.map((obj) => (
                    <div key={obj.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-6 h-6 rounded-full" 
                            style={{ backgroundColor: obj.color }}
                          />
                          <h3 className="font-semibold text-gray-800">{obj.name}</h3>
                        </div>
                        <span className="text-sm text-gray-500">#{obj.id}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{obj.radius}</div>
                          <p className="text-xs text-gray-600">Jari-jari (r)</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{obj.height}</div>
                          <p className="text-xs text-gray-600">Tinggi (t)</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{obj.volume}</div>
                          <p className="text-xs text-gray-600">Volume (π×r²×t)</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-600">{obj.surfaceArea}</div>
                          <p className="text-xs text-gray-600">Luas Permukaan</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🏗️</div>
                  <p>Belum ada tabung yang dibangun</p>
                </div>
              )}
            </div>

            {/* Learning Points */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Poin Pembelajaran</h2>
              
              <div className="space-y-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">🎯 Konsep Tabung</h3>
                  <p className="text-blue-700 text-sm">
                    Tabung adalah bangun ruang yang memiliki alas dan tutup berbentuk lingkaran dengan tinggi tertentu. 
                    Dalam menara ini, Anda belajar bahwa tabung dengan ukuran berbeda dapat disusun membentuk struktur yang stabil.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800 mb-2">📐 Rumus Volume</h3>
                  <p className="text-green-700 text-sm">
                    Volume tabung = π × r² × t, di mana r adalah jari-jari alas dan t adalah tinggi tabung. 
                    Semakin besar jari-jari atau tinggi, semakin besar pula volumenya.
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">📏 Luas Permukaan</h3>
                  <p className="text-purple-700 text-sm">
                    Luas permukaan tabung = 2πr(r + t). Ini mencakup luas kedua lingkaran (alas dan tutup) 
                    plus luas selimut tabung yang dapat dibuka menjadi persegi panjang.
                  </p>
                </div>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">🏗️ Aplikasi Praktis</h3>
                  <p className="text-orange-700 text-sm">
                    Konsep menara tabung ini banyak diterapkan dalam arsitektur, seperti menara air, silo penyimpanan, 
                    dan struktur bangunan bertingkat dengan desain silinder.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/materi-pembelajaran/tabung/build-challenge">
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
                  🔄 Coba Lagi
                </button>
              </Link>
              
              <Link href="/materi-pembelajaran/tabung">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
                  ✅ Lanjut ke Quiz
                </button>
              </Link>
            </div>

          </>
        ) : (
          // No build result found
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Hasil Build</h2>
            <p className="text-gray-600 mb-6">
              Anda belum menyelesaikan build challenge tabung. Mari mulai membangun menara!
            </p>
            
            <Link href="/materi-pembelajaran/tabung/build-challenge">
              <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
                🚀 Mulai Build Challenge
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
