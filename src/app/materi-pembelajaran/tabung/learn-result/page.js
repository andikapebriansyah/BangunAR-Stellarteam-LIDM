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
      
      // Get custom sizes or use defaults (dalam cm)
      const customSizes = result.customSizes || {
        large: { radius: 15, height: 25 },
        medium: { radius: 12, height: 20 },
        small: { radius: 10, height: 15 }
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
          let height = 0;
          let color = '';
          let name = '';
          let sizeKey = '';

          // Map index to cylinder size
          if (index === 0) {
            sizeKey = 'large';
            radius = customSizes.large.radius;
            height = customSizes.large.height;
            color = '#8B4513';
            name = 'Tabung Besar';
          } else if (index === 1) {
            sizeKey = 'medium';
            radius = customSizes.medium.radius;
            height = customSizes.medium.height;
            color = '#4169E1';
            name = 'Tabung Sedang';
          } else if (index === 2) {
            sizeKey = 'small';
            radius = customSizes.small.radius;
            height = customSizes.small.height;
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
            sizeKey,
            name,
            radius: radius,
            height: height,
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
    if (!buildResult || !buildResult.items) return { level: 'Belum Selesai', color: 'text-gray-500', bg: 'bg-gray-100' };
    
    // Count completed cylinders (all parts filled)
    const completedCount = buildResult.items.filter(item => 
      item.parts.every(part => part.filled)
    ).length;
    
    if (completedCount === 3) {
      return { level: 'Sempurna! 🎉', color: 'text-green-600', bg: 'bg-green-50' };
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
                <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md">
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
                    {objectDetails.length} / 3
                  </div>
                  <p className="text-sm text-gray-600">Tabung Selesai</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">📏</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalVolume}</div>
                  <p className="text-sm text-gray-600">Total Volume (cm³)</p>
                </div>
                
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{totalSurfaceArea}</div>
                  <p className="text-sm text-gray-600">Total Luas (cm²)</p>
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
                        <div className="text-center bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-600">{obj.radius} cm</div>
                          <p className="text-xs text-gray-600">Jari-jari (r)</p>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">{obj.height} cm</div>
                          <p className="text-xs text-gray-600">Tinggi (t)</p>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-purple-600">{obj.volume} cm³</div>
                          <p className="text-xs text-gray-600">Volume (V)</p>
                          <p className="text-[10px] text-gray-400 mt-1">πr²t</p>
                        </div>
                        <div className="text-center bg-pink-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-pink-600">{obj.surfaceArea} cm²</div>
                          <p className="text-xs text-gray-600">Luas (L)</p>
                          <p className="text-[10px] text-gray-400 mt-1">2πr(r+t)</p>
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

            {/* Trivia: Perhitungan Stabilitas Menara */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🧮</span>
                </div>
                <h2 className="font-semibold text-gray-800">Trivia: Menghitung Stabilitas & Tinggi Menara Anda!</h2>
              </div>
              
              <div className="bg-white rounded-xl p-5 mb-4">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center space-x-2">
                  <span>📐</span>
                  <span>Analisis Struktur Menara Bertingkat</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Data yang diketahui */}
                  <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      📝 Yang kita ketahui dari menara Anda:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• Jumlah tabung: <strong className="text-amber-800">{objectDetails.length} tabung</strong></li>
                      <li>• Total tinggi menara: <strong className="text-amber-800">{objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} cm = {(objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0) / 100).toFixed(2)} m</strong></li>
                      <li>• Total volume: <strong className="text-amber-800">{totalVolume} cm³ = {(parseFloat(totalVolume) / 1000000).toFixed(3)} m³</strong></li>
                    </ul>
                  </div>

                  {/* Konsep Stabilitas */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <p className="text-sm font-bold text-blue-800 mb-3">🏗️ Kenapa Tabung Besar di Bawah?</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">1. Prinsip Pusat Gravitasi:</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Struktur stabil jika <strong>pusat gravitasi rendah</strong>. Dengan tabung besar di bawah, 
                          massa terbesar ada di bagian bawah menara, membuat struktur lebih sulit roboh.
                        </p>
                        <div className="bg-blue-100 p-2 rounded text-xs text-blue-800 mt-2">
                          💡 <strong>Analogi:</strong> Seperti piramida Mesir - lebar di bawah, lancip di atas. 
                          Ini membuat bangunan berdiri ribuan tahun!
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">2. Perbandingan Stabilitas:</strong>
                        </p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-blue-200">
                              <th className="text-left py-2 text-blue-800">Susunan</th>
                              <th className="text-right py-2 text-blue-800">Stabilitas</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700">
                            <tr className="border-b border-blue-100">
                              <td className="py-2">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mr-2">✓</span>
                                Besar → Sedang → Kecil
                              </td>
                              <td className="text-right font-mono font-bold text-green-700">Sangat Stabil</td>
                            </tr>
                            <tr className="border-b border-blue-100">
                              <td className="py-2">
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold mr-2">❌</span>
                                Kecil → Sedang → Besar
                              </td>
                              <td className="text-right font-mono text-red-700">Tidak Stabil</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Perhitungan Tinggi Total */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <p className="text-sm font-bold text-green-800 mb-3">✅ Perhitungan Tinggi Total Menara:</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Rumus Sederhana:</strong>
                        </p>
                        <div className="bg-green-100 p-3 rounded">
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            Tinggi Total = t₁ + t₂ + t₃
                          </p>
                          {objectDetails.length > 0 && (
                            <>
                              <p className="text-sm font-mono text-gray-800 mb-2">
                                = {objectDetails.map(obj => `${obj.height}`).join(' + ')} cm
                              </p>
                              <p className="text-sm font-mono text-gray-800 font-bold text-green-700">
                                = {objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} cm 
                                = {(objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0) / 100).toFixed(2)} meter
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Perbandingan Ukuran:</strong>
                        </p>
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600">
                            • Setinggi <strong className="text-green-700">~{(objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0) / 30).toFixed(1)} penggaris</strong> (30 cm)
                          </p>
                          <p className="text-sm text-gray-600">
                            • Setinggi <strong className="text-green-700">~{(objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0) / 170).toFixed(2)} tinggi orang dewasa</strong> (170 cm)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kesimpulan */}
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-300">
                    <p className="text-sm font-bold text-purple-800 mb-2">🎯 Kesimpulan:</p>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Menara Anda memiliki tinggi total <strong className="text-purple-700">{objectDetails.reduce((sum, obj) => sum + parseFloat(obj.height), 0).toFixed(1)} cm</strong> dengan {objectDetails.length} tabung
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Susunan <strong>besar ke kecil</strong> (dari bawah ke atas) membuat struktur sangat stabil
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Total volume {totalVolume} cm³ menunjukkan kapasitas penyimpanan jika digunakan sebagai silo/tangki
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-100 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>💡 Fun Fact:</strong> Prinsip menara bertingkat ini dipakai di menara air, silo penyimpanan gandum, 
                  bahkan roket bertingkat SpaceX! Struktur dengan basis lebar dan puncak ramping adalah desain paling efisien 
                  untuk ketinggian maksimal dengan stabilitas optimal. 🚀🏗️
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
                    <span className="text-2xl">🏗️</span>
                    <h3 className="font-bold text-blue-800">Keterampilan Teknik & Konstruksi</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Structural Engineering</p>
                        <p className="text-xs text-gray-600">Memahami prinsip stabilitas struktur bertingkat dan distribusi beban</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Material Calculation</p>
                        <p className="text-xs text-gray-600">Menghitung volume material yang dibutuhkan untuk konstruksi</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Center of Gravity</p>
                        <p className="text-xs text-gray-600">Memahami konsep pusat gravitasi untuk desain yang stabil</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">3D Visualization</p>
                        <p className="text-xs text-gray-600">Kemampuan membayangkan dan merakit struktur 3 dimensi</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">📋</span>
                    <h3 className="font-bold text-purple-800">Keterampilan Perencanaan & Manajemen</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Sequential Assembly</p>
                        <p className="text-xs text-gray-600">Merencanakan urutan perakitan dari bawah ke atas</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Quality Control</p>
                        <p className="text-xs text-gray-600">Memastikan setiap komponen terpasang dengan alignment yang tepat</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Risk Assessment</p>
                        <p className="text-xs text-gray-600">Mengidentifikasi risiko ketidakstabilan dan cara mengatasinya</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Precision & Accuracy</p>
                        <p className="text-xs text-gray-600">Melatih ketelitian dalam penempatan dan pengukuran</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🎨</span>
                    <h3 className="font-bold text-pink-800">Keterampilan Desain & Estetika</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Architectural Design</p>
                        <p className="text-xs text-gray-600">Memahami prinsip desain arsitektur yang fungsional dan indah</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Symmetry & Proportion</p>
                        <p className="text-xs text-gray-600">Menerapkan keseimbangan visual dalam desain bertingkat</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Color Coordination</p>
                        <p className="text-xs text-gray-600">Mengorganisir elemen berbeda warna dalam satu struktur harmonis</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">💼</span>
                    <h3 className="font-bold text-orange-800">Keterampilan Industri & Wirausaha</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Cost Estimation</p>
                        <p className="text-xs text-gray-600">Menghitung biaya material berdasarkan volume yang dibutuhkan</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Storage Design</p>
                        <p className="text-xs text-gray-600">Merancang sistem penyimpanan (silo, tangki) yang efisien</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Safety Standards</p>
                        <p className="text-xs text-gray-600">Memahami standar keamanan struktur untuk aplikasi nyata</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm font-bold text-green-800 mb-2">🌟 Penerapan dalam Kehidupan Nyata:</p>
                <p className="text-sm text-gray-700">
                  Keterampilan ini sangat berharga untuk karir di bidang <strong>arsitektur</strong>, 
                  <strong> teknik sipil</strong>, <strong>desain industri</strong>, hingga <strong>manajemen konstruksi</strong>. 
                  Dari membangun menara air di desa, merancang silo penyimpanan untuk pertanian, hingga desain gedung bertingkat - 
                  semua menggunakan prinsip yang sama! 🏗️🌾
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/materi-pembelajaran/tabung/build-challenge">
                <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
                  🔄 Coba Lagi
                </button>
              </Link>
              
              <Link href="materi-pembelajaran/tabung">
                <button className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
                  ✅ Lanjut ke Uji Pemahaman
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
