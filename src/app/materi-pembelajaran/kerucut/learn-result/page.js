'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function KerucutLearnResult() {
  const [buildResult, setBuildResult] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalSurfaceArea, setTotalSurfaceArea] = useState(0);
  const [objectDetails, setObjectDetails] = useState([]);

  useEffect(() => {
    // Load build result from localStorage
    const savedResult = localStorage.getItem('kerucutBuildResult');
    if (savedResult) {
      const result = JSON.parse(savedResult);
      setBuildResult(result);
      
      // Get custom sizes or use defaults (dalam meter)
      const customSizes = result.customSizes || {
        base: { radius: 12, height: 10 },
        body: { radius: 5, height: 25 },
        nose: { radius: 5, height: 12 }
      };
      
      // Calculate totals and details based on completed items
      if (result.items && result.items.length > 0) {
        let volume = 0;
        let surfaceArea = 0;
        const details = [];

        result.items.forEach((item, index) => {
          // Check if all parts are filled
          const allPartsFilled = item.parts.every(part => part.filled);
          if (!allPartsFilled) return; // Skip incomplete items
          
          let objVolume = 0;
          let objSurfaceArea = 0;
          let radius = 0;
          let radiusTop = 0;
          let height = 0;
          let color = '';
          let name = '';
          let formula = '';

          // Map index to rocket components
          if (index === 0) {
            // Frustum Base
            radius = customSizes.base.radius;
            radiusTop = customSizes.body.radius;
            height = customSizes.base.height;
            color = '#FFA500';
            name = 'Frustum Dasar';
            formula = '⅓πh(r₁²+r₁r₂+r₂²)';
            // Volume frustum = (1/3)πh(r₁² + r₁r₂ + r₂²)
            objVolume = (1/3) * Math.PI * height * (radius * radius + radius * radiusTop + radiusTop * radiusTop);
            // Luas permukaan frustum
            const slant = Math.sqrt((radius - radiusTop) * (radius - radiusTop) + height * height);
            objSurfaceArea = Math.PI * (radius * radius + radiusTop * radiusTop + (radius + radiusTop) * slant);
          } else if (index === 1) {
            // Cylinder Body
            radius = customSizes.body.radius;
            height = customSizes.body.height;
            color = '#E8E8E8';
            name = 'Badan Roket';
            formula = 'πr²t';
            // Volume tabung = πr²t
            objVolume = Math.PI * radius * radius * height;
            // Luas permukaan tabung = 2πr(r + t)
            objSurfaceArea = 2 * Math.PI * radius * (radius + height);
          } else if (index === 2) {
            // Cone Nose
            radius = customSizes.nose.radius;
            height = customSizes.nose.height;
            color = '#FF4444';
            name = 'Kerucut Hidung';
            formula = '⅓πr²t';
            // Volume kerucut = (1/3)πr²t
            objVolume = (1/3) * Math.PI * radius * radius * height;
            // Luas permukaan kerucut
            const slant = Math.sqrt(radius * radius + height * height);
            objSurfaceArea = Math.PI * radius * (radius + slant);
          }

          volume += objVolume;
          surfaceArea += objSurfaceArea;

          details.push({
            id: index + 1,
            name,
            radius: radius,
            radiusTop: radiusTop || null,
            height: height,
            volume: objVolume.toFixed(2),
            surfaceArea: objSurfaceArea.toFixed(2),
            formula,
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
    if (!buildResult || !buildResult.items) return { level: 'Belum Selesai', color: 'text-gray-500', bg: 'bg-gray-100' };
    
    // Count completed components (all parts filled)
    const completedCount = buildResult.items.filter(item => 
      item.parts.every(part => part.filled)
    ).length;
    
    if (completedCount === 3) {
      return { level: 'Sempurna! 🚀', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (completedCount === 2) {
      return { level: 'Bagus! 👍', color: 'text-blue-600', bg: 'bg-blue-50' };
    } else if (completedCount === 1) {
      return { level: 'Coba Lagi! 💪', color: 'text-orange-600', bg: 'bg-orange-50' };
    } else {
      return { level: 'Belum Mulai', color: 'text-gray-500', bg: 'bg-gray-100' };
    }
  };

  const performance = getPerformanceLevel();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">🚀 Hasil Build Challenge</h1>
              <p className="text-orange-100">Peluncur Roket Mini</p>
            </div>
            <div className="text-right">
              <Link href="/materi-pembelajaran/kerucut">
                <button className="bg-white text-orange-700 hover:bg-orange-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md">
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
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🚀</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {objectDetails.length} / 3
                  </div>
                  <p className="text-sm text-gray-600">Komponen Selesai</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">📏</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalVolume}</div>
                  <p className="text-sm text-gray-600">Total Volume (m³)</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{totalSurfaceArea}</div>
                  <p className="text-sm text-gray-600">Total Luas (m²)</p>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Detail Setiap Komponen</h2>
              
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
                        <div className="text-center bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-600">
                            {obj.radiusTop ? `${obj.radius}→${obj.radiusTop}` : obj.radius} m
                          </div>
                          <p className="text-xs text-gray-600">Jari-jari (r)</p>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">{obj.height} m</div>
                          <p className="text-xs text-gray-600">Tinggi (t)</p>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-purple-600">{obj.volume} m³</div>
                          <p className="text-xs text-gray-600">Volume (V)</p>
                          <p className="text-[10px] text-gray-400 mt-1">{obj.formula}</p>
                        </div>
                        <div className="text-center bg-pink-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-pink-600">{obj.surfaceArea} m²</div>
                          <p className="text-xs text-gray-600">Luas (L)</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🚀</div>
                  <p>Belum ada komponen yang dibangun</p>
                </div>
              )}
            </div>

            {/* Learning Points */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Poin Pembelajaran</h2>
              
              <div className="space-y-4">
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-orange-800 mb-2">🎯 Konsep Roket</h3>
                  <p className="text-orange-700 text-sm">
                    Roket peluncur mini ini menggabungkan 3 bangun ruang: <strong>frustum (kerucut terpotong)</strong> sebagai 
                    dasar stabilizer, <strong>tabung</strong> sebagai badan roket, dan <strong>kerucut</strong> sebagai hidung. 
                    Desain ini aerodinamis dan struktural stabil!
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">📐 Rumus Volume</h3>
                  <p className="text-blue-700 text-sm">
                    <strong>• Frustum:</strong> V = ⅓πh(r₁² + r₁r₂ + r₂²) - menggabungkan dua jari-jari berbeda<br/>
                    <strong>• Tabung:</strong> V = πr²t - bentuk silinder sempurna<br/>
                    <strong>• Kerucut:</strong> V = ⅓πr²t - seperti tabung tapi 1/3 volume
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">📏 Luas Permukaan</h3>
                  <p className="text-purple-700 text-sm">
                    Luas permukaan masing-masing komponen dihitung untuk mengetahui material yang dibutuhkan. 
                    Total luas permukaan = {totalSurfaceArea} m² menunjukkan berapa luas material pelindung panas 
                    yang diperlukan untuk roket!
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="font-semibold text-green-800 mb-2">🚀 Aplikasi Praktis</h3>
                  <p className="text-green-700 text-sm">
                    Desain roket dengan frustum + tabung + kerucut adalah standar dalam <strong>aerospace engineering</strong>. 
                    Digunakan untuk roket model, roket penelitian, hingga roket komersial! Prinsip matematika bangun ruang 
                    = kunci teknologi luar angkasa. 🌌
                  </p>
                </div>
              </div>
            </div>

            {/* Trivia: Aerodinamika & Stabilitas Roket */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🧮</span>
                </div>
                <h2 className="font-semibold text-gray-800">Trivia: Aerodinamika & Stabilitas Roket Anda!</h2>
              </div>
              
              <div className="bg-white rounded-xl p-5 mb-4">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center space-x-2">
                  <span>📐</span>
                  <span>Analisis Struktur Roket Peluncur</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Data yang diketahui */}
                  <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      📝 Yang kita ketahui dari roket Anda:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• Jumlah komponen: <strong className="text-amber-800">{objectDetails.length} bagian</strong> (Frustum + Tabung + Kerucut)</li>
                      <li>• Total tinggi roket: <strong className="text-amber-800">{objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} m</strong></li>
                      <li>• Total volume: <strong className="text-amber-800">{totalVolume} m³ = {(parseFloat(totalVolume) * 1000).toFixed(0)} liter</strong></li>
                      <li>• Luas permukaan: <strong className="text-amber-800">{totalSurfaceArea} m²</strong> (untuk material pelindung)</li>
                    </ul>
                  </div>

                  {/* Konsep Aerodinamika */}
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                    <p className="text-sm font-bold text-red-800 mb-3">🌬️ Kenapa Bentuk Kerucut di Hidung?</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-red-700">1. Mengurangi Hambatan Udara (Drag):</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Kerucut tajam membelah udara dengan smooth, mengurangi hambatan hingga <strong>80%</strong> 
                          dibanding ujung tumpul. Udara mengalir di sekitar permukaan tanpa turbulensi berlebihan.
                        </p>
                        <div className="bg-red-100 p-2 rounded text-xs text-red-800 mt-2">
                          💡 <strong>Analogi:</strong> Seperti pisau memotong mentega vs sendok mendorong mentega. 
                          Tajam = lebih mudah menembus!
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-red-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-red-700">2. Efisiensi Aerodinamis:</strong>
                        </p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-red-200">
                              <th className="text-left py-2 text-red-800">Bentuk Hidung</th>
                              <th className="text-right py-2 text-red-800">Drag Coefficient</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700">
                            <tr className="border-b border-red-100">
                              <td className="py-2">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mr-2">✓</span>
                                Kerucut Tajam
                              </td>
                              <td className="text-right font-mono font-bold text-green-700">0.15 - 0.25</td>
                            </tr>
                            <tr className="border-b border-red-100">
                              <td className="py-2">
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold mr-2">~</span>
                                Hemisphere (Setengah Bola)
                              </td>
                              <td className="text-right font-mono text-yellow-700">0.42</td>
                            </tr>
                            <tr className="border-b border-red-100">
                              <td className="py-2">
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold mr-2">❌</span>
                                Flat/Tumpul
                              </td>
                              <td className="text-right font-mono text-red-700">1.28</td>
                            </tr>
                          </tbody>
                        </table>
                        <p className="text-xs text-gray-500 mt-2">
                          *Semakin rendah coefficient = semakin efisien menembus udara
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Konsep Stabilitas */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <p className="text-sm font-bold text-blue-800 mb-3">⚖️ Kenapa Frustum Lebar di Bawah?</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">1. Pusat Gravitasi Rendah:</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Frustum dengan basis lebar (r = {objectDetails[0]?.radius || 12}m) di bawah membuat 
                          <strong> pusat gravitasi rendah</strong>. Roket tidak mudah terbalik saat peluncuran!
                        </p>
                        <div className="bg-blue-100 p-2 rounded text-xs text-blue-800 mt-2">
                          💡 <strong>Prinsip:</strong> Sama seperti gasing atau boneka bangun. 
                          Berat di bawah = stabil & tidak gampang roboh!
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">2. Analisis Stabilitas:</strong>
                        </p>
                        <div className="bg-blue-50 p-3 rounded mb-2">
                          <p className="text-xs font-mono text-gray-700 mb-1">
                            Tinggi Frustum: {objectDetails[0]?.height || 10} m
                          </p>
                          <p className="text-xs font-mono text-gray-700 mb-1">
                            Tinggi Badan: {objectDetails[1]?.height || 25} m
                          </p>
                          <p className="text-xs font-mono text-gray-700 mb-1">
                            Tinggi Hidung: {objectDetails[2]?.height || 12} m
                          </p>
                          <hr className="my-2 border-blue-200" />
                          <p className="text-xs font-mono text-blue-700 font-bold">
                            Ratio Stabilitas = Tinggi Frustum / Tinggi Total
                          </p>
                          <p className="text-xs font-mono text-blue-700 font-bold">
                            = {objectDetails[0]?.height || 10} / {objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} 
                            = {((parseFloat(objectDetails[0]?.height || 10) / objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0)) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Ratio 20-25% adalah ideal untuk roket stabil. Roket Anda: <strong className="text-blue-700">
                          {((parseFloat(objectDetails[0]?.height || 10) / objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0)) * 100).toFixed(1)}%
                          </strong> ✓
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Perhitungan Volume & Kapasitas */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <p className="text-sm font-bold text-green-800 mb-3">🔋 Kapasitas Bahan Bakar:</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Asumsi Distribusi Volume:</strong>
                        </p>
                        <ul className="text-sm text-gray-600 space-y-1 ml-4">
                          <li>• <strong>Frustum (Stabilizer):</strong> 10% untuk struktur pendukung</li>
                          <li>• <strong>Badan Roket:</strong> 70% untuk tangki bahan bakar</li>
                          <li>• <strong>Kerucut Hidung:</strong> 20% untuk payload & elektronik</li>
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Perhitungan Kapasitas Fuel:</strong>
                        </p>
                        <div className="bg-green-100 p-3 rounded">
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            Volume Badan = {objectDetails[1]?.volume || 0} m³
                          </p>
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            Kapasitas Fuel (70%) = {(parseFloat(objectDetails[1]?.volume || 0) * 0.7).toFixed(2)} m³
                          </p>
                          <p className="text-sm font-mono text-gray-800 font-bold text-green-700">
                            = {(parseFloat(objectDetails[1]?.volume || 0) * 0.7 * 1000).toFixed(0)} liter bahan bakar! ⛽
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                          Cukup untuk peluncuran hingga ketinggian beberapa kilometer!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kesimpulan */}
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                    <p className="text-sm font-bold text-purple-800 mb-2">🎯 Kesimpulan Analisis:</p>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Roket Anda memiliki tinggi <strong className="text-purple-700">{objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} meter</strong> 
                          dengan desain aerodinamis optimal
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Kerucut hidung mengurangi hambatan udara, frustum dasar memberikan stabilitas maksimal
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Total volume {totalVolume} m³ = {(parseFloat(totalVolume) * 1000).toFixed(0)} liter, 
                          cukup untuk misi peluncuran riil!
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Luas permukaan {totalSurfaceArea} m² menentukan kebutuhan material heat shield
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-100 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>💡 Fun Fact:</strong> Roket SpaceX Falcon 9 menggunakan prinsip yang sama! 
                  Nose cone tajam, badan silinder untuk fuel tank, dan booster besar di bawah. 
                  Matematika bangun ruang yang Anda pelajari = fondasi teknologi aerospace engineering! 🚀🌌
                </p>
              </div>
            </div>

            {/* Dampak Edukatif & Keterampilan */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🎓</span>
                </div>
                <h2 className="font-semibold text-gray-800">Dampak Edukatif: Keterampilan yang Anda Kembangkan</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🚀</span>
                    <h3 className="font-bold text-red-800">Keterampilan Aerospace & Fisika</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Aerodynamics & Drag</p>
                        <p className="text-xs text-gray-600">Memahami bagaimana bentuk kerucut mengurangi hambatan udara</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Center of Gravity</p>
                        <p className="text-xs text-gray-600">Menganalisis pusat gravitasi untuk stabilitas peluncuran</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Structural Analysis</p>
                        <p className="text-xs text-gray-600">Menghitung beban dan distribusi gaya pada struktur roket</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-red-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Thrust-to-Weight Ratio</p>
                        <p className="text-xs text-gray-600">Memahami hubungan antara volume fuel dan massa roket</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">📐</span>
                    <h3 className="font-bold text-blue-800">Keterampilan Matematika & Geometri</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Complex Volume Calculation</p>
                        <p className="text-xs text-gray-600">Menghitung volume 3 bangun ruang berbeda (frustum, tabung, kerucut)</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Surface Area Analysis</p>
                        <p className="text-xs text-gray-600">Menghitung luas permukaan untuk estimasi material pelindung</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Proportional Scaling</p>
                        <p className="text-xs text-gray-600">Memahami proporsi optimal antar komponen roket</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">3D Spatial Reasoning</p>
                        <p className="text-xs text-gray-600">Visualisasi dan manipulasi objek 3D kompleks</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🛠️</span>
                    <h3 className="font-bold text-purple-800">Keterampilan Engineering & Design</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Multi-Component Integration</p>
                        <p className="text-xs text-gray-600">Menggabungkan 3 komponen berbeda menjadi sistem terintegrasi</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Alignment & Precision</p>
                        <p className="text-xs text-gray-600">Memastikan alignment perfect antar komponen untuk stabilitas</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Iterative Design</p>
                        <p className="text-xs text-gray-600">Menyesuaikan ukuran komponen untuk optimasi performa</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Systems Thinking</p>
                        <p className="text-xs text-gray-600">Memahami bagaimana setiap komponen berkontribusi pada sistem total</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">💼</span>
                    <h3 className="font-bold text-orange-800">Keterampilan Praktis & Industri</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Fuel Capacity Planning</p>
                        <p className="text-xs text-gray-600">Menghitung kapasitas bahan bakar berdasarkan volume</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Material Estimation</p>
                        <p className="text-xs text-gray-600">Estimasi kebutuhan material heat shield dari luas permukaan</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Safety Standards</p>
                        <p className="text-xs text-gray-600">Memahami standar keamanan untuk struktur aerospace</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Real-World Application</p>
                        <p className="text-xs text-gray-600">Menghubungkan konsep matematika dengan teknologi nyata</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm font-bold text-green-800 mb-2">🌟 Penerapan dalam Kehidupan Nyata:</p>
                <p className="text-sm text-gray-700">
                  Keterampilan ini sangat berharga untuk karir di bidang <strong>aerospace engineering</strong>, 
                  <strong> rocket science</strong>, <strong>mechanical engineering</strong>, hingga <strong>research & development</strong>. 
                  Dari merancang roket model untuk kompetisi, mengembangkan drone delivery system, hingga berkontribusi 
                  di proyek space exploration seperti Mars mission - semua dimulai dari pemahaman matematika bangun ruang! 🚀🌌
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/materi-pembelajaran/kerucut/build-challenge">
                <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg">
                  🔄 Rakit Roket Baru
                </button>
              </Link>
              
              <Link href="/materi-pembelajaran/kerucut">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
                  ✅ Lanjut ke Uji Pemahaman
                </button>
              </Link>
            </div>

          </>
        ) : (
          // No build result found
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Belum Ada Hasil Build</h2>
            <p className="text-gray-600 mb-6">
              Anda belum menyelesaikan build challenge roket. Mari mulai membangun roket peluncur!
            </p>
            
            <Link href="/materi-pembelajaran/kerucut/build-challenge">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-700 transition-all shadow-lg">
                🚀 Mulai Build Challenge
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
