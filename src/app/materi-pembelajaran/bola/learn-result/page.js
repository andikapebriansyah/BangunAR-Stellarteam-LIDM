'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BolaLearnResult() {
  const [buildResult, setBuildResult] = useState(null);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalSurfaceArea, setTotalSurfaceArea] = useState(0);
  const [objectDetails, setObjectDetails] = useState([]);
  const [braceletCircumference, setBraceletCircumference] = useState(0);

  useEffect(() => {
    // Load build result from localStorage
    const savedResult = localStorage.getItem('lastBuildResult');
    if (savedResult) {
      const result = JSON.parse(savedResult);
      setBuildResult(result);
      
      // Get custom sizes or use default
      const customSizes = result.customSizes || {
        large: { radius: 8 } // Default 8mm
      };
      
      // Calculate totals and details based on completed items (9 spheres)
      if (result.items && result.items.length > 0) {
        let volume = 0;
        let surfaceArea = 0;
        
        // Filter completed spheres - struktur data: item.filled (bukan item.parts)
        const completedSpheres = result.items.filter(item => item.filled === true);
        
        const sphereRadiusMM = customSizes.large.radius; // Dalam mm
        const sphereRadiusCM = sphereRadiusMM / 10; // Konversi ke cm untuk perhitungan
        
        // Calculate per sphere (karena semua sama, hitung 1x saja) - PAKAI CM untuk perhitungan
        const sphereVolume = (4/3) * Math.PI * Math.pow(sphereRadiusCM, 3);
        const sphereSurfaceArea = 4 * Math.PI * Math.pow(sphereRadiusCM, 2);
        
        // Total = per sphere × jumlah bola selesai
        volume = sphereVolume * completedSpheres.length;
        surfaceArea = sphereSurfaceArea * completedSpheres.length;
        
        // Bracelet circumference calculation - RUMUS BENAR: R = r / sin(π/n) - PAKAI CM
        const braceletRadius = sphereRadiusCM / Math.sin(Math.PI / 9);
        const circumference = 2 * Math.PI * braceletRadius;
        
        setTotalVolume(volume.toFixed(2));
        setTotalSurfaceArea(surfaceArea.toFixed(2));
        setBraceletCircumference(circumference.toFixed(2));
        
        // Detail bola - CUKUP 1 SAJA karena semua sama - SIMPAN MM dan CM
        setObjectDetails([{
          radiusMM: sphereRadiusMM,
          radiusCM: sphereRadiusCM.toFixed(2),
          diameterMM: (sphereRadiusMM * 2).toFixed(1),
          diameterCM: (sphereRadiusCM * 2).toFixed(2),
          volume: sphereVolume.toFixed(2),
          surfaceArea: sphereSurfaceArea.toFixed(2),
          count: completedSpheres.length
        }]);
      }
    }
  }, []);

  const getPerformanceLevel = () => {
    if (!buildResult || !buildResult.items) return { level: 'Belum Selesai', color: 'text-gray-500', bg: 'bg-gray-100' };
    
    // Count completed spheres - struktur data: item.filled (bukan item.parts)
    const completedCount = buildResult.items.filter(item => item.filled === true).length;
    
    if (completedCount === 9) {
      return { level: 'Sempurna! 🎉', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (completedCount >= 6) {
      return { level: 'Bagus! 👍', color: 'text-blue-600', bg: 'bg-blue-50' };
    } else if (completedCount >= 3) {
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
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">💍 Hasil Build Challenge</h1>
              <p className="text-purple-100">Gelang dari 9 Bola Rainbow</p>
            </div>
            <div className="text-right">
              <Link href="/materi-pembelajaran/bola">
                <button className="bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md">
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
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🔵</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {objectDetails[0]?.count || 0} / 9
                  </div>
                  <p className="text-sm text-gray-600">Bola Selesai</p>
                </div>
                
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">📏</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">{totalVolume}</div>
                  <p className="text-sm text-gray-600">Total Volume (cm³)</p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">🎯</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{totalSurfaceArea}</div>
                  <p className="text-sm text-gray-600">Total Luas (cm²)</p>
                </div>
                
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <div className="w-12 h-12 bg-amber-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-white text-lg">💍</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-600">{braceletCircumference}</div>
                  <p className="text-sm text-gray-600">Keliling Gelang (cm)</p>
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">🔍 Detail Setiap Bola</h2>
              
              {objectDetails.length > 0 ? (
                <div className="space-y-4">
                  {objectDetails.map((obj, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            <div className="w-4 h-4 rounded-full bg-red-500" />
                            <div className="w-4 h-4 rounded-full bg-orange-500" />
                            <div className="w-4 h-4 rounded-full bg-yellow-500" />
                            <div className="w-4 h-4 rounded-full bg-green-500" />
                            <div className="w-4 h-4 rounded-full bg-cyan-500" />
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <div className="w-4 h-4 rounded-full bg-indigo-500" />
                            <div className="w-4 h-4 rounded-full bg-purple-500" />
                            <div className="w-4 h-4 rounded-full bg-pink-500" />
                          </div>
                          <h3 className="font-semibold text-gray-800">Semua Bola (Rainbow)</h3>
                        </div>
                        <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                          {obj.count} bola
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center bg-blue-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-blue-600">{obj.radiusMM} mm</div>
                          <p className="text-xs text-gray-600">Jari-jari (r)</p>
                          <p className="text-[10px] text-blue-500 italic">≈ {obj.radiusCM} cm</p>
                        </div>
                        <div className="text-center bg-green-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-green-600">{obj.diameterMM} mm</div>
                          <p className="text-xs text-gray-600">Diameter (d)</p>
                          <p className="text-[10px] text-green-500 italic">≈ {obj.diameterCM} cm</p>
                        </div>
                        <div className="text-center bg-purple-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-purple-600">{obj.volume} cm³</div>
                          <p className="text-xs text-gray-600">Volume (V)</p>
                          <p className="text-[10px] text-purple-500 italic">per bola</p>
                        </div>
                        <div className="text-center bg-pink-50 rounded-lg p-3">
                          <div className="text-lg font-bold text-pink-600">{obj.surfaceArea} cm²</div>
                          <p className="text-xs text-gray-600">Luas (L)</p>
                          <p className="text-[10px] text-pink-500 italic">per bola</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <p className="text-sm text-amber-800">
                          <strong>📝 Catatan:</strong> Semua {obj.count} bola memiliki ukuran yang sama (radius = {obj.radiusMM} mm atau {obj.radiusCM} cm). 
                          Ini membuat gelang terlihat seragam dan simetris. Total volume dan luas permukaan dihitung dengan 
                          mengalikan nilai per bola dengan jumlah bola yang terpasang.
                        </p>
                      </div>
                      
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-2 font-semibold">💡 Konversi Satuan:</p>
                        <div className="space-y-1 text-xs text-blue-800">
                          <p>• <strong>1 cm = 10 mm</strong> (mili ke centi)</p>
                          <p>• Radius: {obj.radiusMM} mm = {obj.radiusMM} ÷ 10 = {obj.radiusCM} cm</p>
                          <p>• Diameter: {obj.diameterMM} mm = {obj.diameterMM} ÷ 10 = {obj.diameterCM} cm</p>
                          <p className="text-[11px] text-blue-600 mt-2 italic">
                            📏 Untuk perhitungan volume dan luas, kita gunakan satuan cm agar hasilnya dalam cm³ dan cm²
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Formula Volume Bola:</p>
                          <p className="text-sm font-mono text-gray-800">V = (4/3)πr³</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Formula Luas Permukaan:</p>
                          <p className="text-sm font-mono text-gray-800">L = 4πr²</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Belum ada bola yang diselesaikan</p>
                </div>
              )}
            </div>

            {/* Trivia: Perhitungan Keliling Gelang */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 shadow-lg border-2 border-amber-200">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🧮</span>
                </div>
                <h2 className="font-semibold text-gray-800">Trivia: Menghitung Keliling Gelang Anda!</h2>
              </div>
              
              <div className="bg-white rounded-xl p-5 mb-4">
                <h3 className="font-bold text-amber-800 mb-3 flex items-center space-x-2">
                  <span>📐</span>
                  <span>Cara Menghitung Keliling/Lebar Gelang</span>
                </h3>
                
                <div className="space-y-4">
                  {/* Data yang diketahui */}
                  <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300">
                    <p className="text-sm text-gray-700 mb-2 font-semibold">
                      📝 Yang kita ketahui:
                    </p>
                    <ul className="text-sm text-gray-700 space-y-1 ml-4">
                      <li>• Jumlah bola: <strong className="text-amber-800">n = 9 bola</strong></li>
                      <li>• Radius tiap bola: <strong className="text-amber-800">r = {objectDetails[0]?.radius || 0.8} cm</strong></li>
                      <li>• Diameter tiap bola: <strong className="text-amber-800">d = 2r = {objectDetails[0]?.diameter || 1.6} cm</strong></li>
                    </ul>
                  </div>

                  {/* Pertanyaan Kunci */}
                  <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-sm font-bold text-red-800 mb-2">❓ Pertanyaan Penting:</p>
                    <p className="text-sm text-gray-700 mb-2">
                      &ldquo;Kenapa tidak bisa langsung jumlahkan semua diameter bola saja?&rdquo;<br/>
                      Jumlah diameter = <span className="font-mono bg-red-100 px-2 py-1 rounded">9 × {objectDetails[0]?.diameter || 1.6} = {(9 * parseFloat(objectDetails[0]?.diameter || 1.6)).toFixed(2)} cm</span>
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Jawaban:</strong> Karena pusat-pusat bola tersusun dalam bentuk <strong>lingkaran</strong>, 
                      bukan garis lurus! 🔵⭕
                    </p>
                  </div>

                  {/* Penjelasan Visual */}
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                    <p className="text-sm font-bold text-blue-800 mb-3">🔍 Penjelasan:</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">1. Garis Lurus (Chord) vs Busur Lingkaran:</strong>
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Jarak antara 2 pusat bola bersebelahan = diameter = {objectDetails[0]?.diameter || 1.6} cm (garis lurus/chord).
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          Tapi pusat-pusat bola ada di <strong>lingkaran</strong>, jadi jarak sebenarnya mengikuti <strong>busur</strong> (lengkungan), 
                          yang sedikit lebih panjang dari garis lurus.
                        </p>
                        <div className="bg-blue-100 p-2 rounded text-xs text-blue-800 mt-2">
                          💡 <strong>Analogi:</strong> Bayangkan berjalan dari titik A ke B di lingkaran. Jalan lurus (chord) lebih pendek 
                          daripada jalan mengikuti tepi lingkaran (busur).
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-blue-700">2. Perbandingan Perhitungan:</strong>
                        </p>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-blue-200">
                              <th className="text-left py-2 text-blue-800">Metode</th>
                              <th className="text-right py-2 text-blue-800">Hasil</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700">
                            <tr className="border-b border-blue-100">
                              <td className="py-2">
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold mr-2">❌</span>
                                Jumlah diameter (salah)
                              </td>
                              <td className="text-right font-mono">{(9 * parseFloat(objectDetails[0]?.diameter || 1.6)).toFixed(2)} cm</td>
                            </tr>
                            <tr className="border-b border-blue-100">
                              <td className="py-2">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold mr-2">✓</span>
                                Keliling pusat bola (benar)
                              </td>
                              <td className="text-right font-mono font-bold text-green-700">{braceletCircumference} cm</td>
                            </tr>
                            <tr>
                              <td className="py-2 text-amber-700 font-semibold" colSpan="2">
                                Selisih: ~{((parseFloat(braceletCircumference) - (9 * parseFloat(objectDetails[0]?.diameter || 1.6))) / (9 * parseFloat(objectDetails[0]?.diameter || 1.6)) * 100).toFixed(1)}% lebih besar
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Formula yang Benar */}
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                    <p className="text-sm font-bold text-green-800 mb-3">✅ Rumus yang Benar:</p>
                    
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Langkah 1:</strong> Cari radius lingkaran gelang (R)
                        </p>
                        <div className="bg-green-100 p-3 rounded">
                          <p className="text-sm font-mono text-gray-800 mb-1">
                            R = r / sin(π / n)
                          </p>
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            R = {objectDetails[0]?.radius || 0.8} / sin(π / 9)
                          </p>
                          <p className="text-sm font-mono text-gray-800 font-bold text-green-700">
                            R ≈ {((objectDetails[0]?.radius || 0.8) / Math.sin(Math.PI / 9)).toFixed(2)} cm
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 italic">
                          * sin(π/9) ≈ sin(20°) ≈ 0.342
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Langkah 2:</strong> Hitung keliling lingkaran pusat bola
                        </p>
                        <div className="bg-green-100 p-3 rounded">
                          <p className="text-sm font-mono text-gray-800 mb-1">
                            K = 2πR
                          </p>
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            K = 2π × {((objectDetails[0]?.radius || 0.8) / Math.sin(Math.PI / 9)).toFixed(2)}
                          </p>
                          <p className="text-sm font-mono text-gray-800 font-bold text-green-700">
                            K ≈ {braceletCircumference} cm
                          </p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-green-200">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong className="text-green-700">Langkah 3 (Opsional):</strong> Keliling bagian luar gelang
                        </p>
                        <div className="bg-green-100 p-3 rounded">
                          <p className="text-sm font-mono text-gray-800 mb-1">
                            K luar = 2π(R + r)
                          </p>
                          <p className="text-sm font-mono text-gray-800 mb-2">
                            K luar = 2π × ({((objectDetails[0]?.radius || 0.8) / Math.sin(Math.PI / 9)).toFixed(2)} + {objectDetails[0]?.radius || 0.8})
                          </p>
                          <p className="text-sm font-mono text-gray-800 font-bold text-green-700">
                            K luar ≈ {(2 * Math.PI * (((objectDetails[0]?.radius || 0.8) / Math.sin(Math.PI / 9)) + (objectDetails[0]?.radius || 0.8))).toFixed(2)} cm
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 italic">
                          * Ini mengukur keliling di tepi luar bola-bola
                        </p>
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
                          Gelang dengan 9 bola (r={objectDetails[0]?.radius || 0.8} cm) memiliki <strong className="text-purple-700">keliling pusat ~{braceletCircumference} cm</strong>
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          Cocok untuk pergelangan tangan anak-anak hingga remaja (keliling pergelangan ~14-16 cm)
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-purple-600 mt-0.5">✓</span>
                        <span>
                          <strong>Jangan langsung jumlahkan diameter</strong> — hasilnya kurang akurat (lebih kecil ~2% dari nilai sebenarnya)
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Catatan Penyederhanaan */}
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-300">
                    <p className="text-sm font-bold text-gray-800 mb-2">📚 Catatan untuk Pendekatan Sederhana:</p>
                    <p className="text-sm text-gray-700 mb-2">
                      Jika tidak perlu ketelitian tinggi (misalnya soal estimasi), kamu <strong>boleh</strong> pakai:
                    </p>
                    <div className="bg-white p-3 rounded border border-gray-300">
                      <p className="text-sm font-mono text-gray-800 mb-1">
                        Perkiraan keliling ≈ n × d = 9 × {objectDetails[0]?.diameter || 1.6} = {(9 * parseFloat(objectDetails[0]?.diameter || 1.6)).toFixed(2)} cm
                      </p>
                      <p className="text-xs text-amber-700 mt-2">
                        ⚠️ Tapi ingat: ini <strong>perkiraan kasar</strong>, hasilnya sedikit lebih kecil (~{((parseFloat(braceletCircumference) - (9 * parseFloat(objectDetails[0]?.diameter || 1.6))) / parseFloat(braceletCircumference) * 100).toFixed(1)}%) dari keliling sebenarnya.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-100 p-4 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>💡 Fun Fact:</strong> Perhitungan ini sangat berguna kalau kamu mau bikin gelang sungguhan! 
                  Kamu bisa hitung berapa panjang tali/kawat yang dibutuhkan, berapa banyak manik-manik yang perlu dibeli, 
                  dan apakah ukurannya pas untuk pergelangan tanganmu. Ini contoh nyata matematika dalam kehidupan sehari-hari! 🎨✨
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
                    <span className="text-2xl">💼</span>
                    <h3 className="font-bold text-purple-800">Keterampilan Wirausaha</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Product Design & Prototyping</p>
                        <p className="text-xs text-gray-600">Merancang produk perhiasan (gelang) dari konsep hingga visualisasi 3D</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Cost Calculation</p>
                        <p className="text-xs text-gray-600">Menghitung material (9 bola) dan estimasi biaya produksi</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Market Understanding</p>
                        <p className="text-xs text-gray-600">Memahami dimensi produk (lebar gelang) untuk target market</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-purple-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Creative Innovation</p>
                        <p className="text-xs text-gray-600">Mengeksplorasi variasi warna dan desain untuk diferensiasi produk</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">📋</span>
                    <h3 className="font-bold text-blue-800">Keterampilan Perencanaan</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Project Planning</p>
                        <p className="text-xs text-gray-600">Merencanakan urutan assembly (9 bola → 1 gelang)</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Resource Management</p>
                        <p className="text-xs text-gray-600">Mengelola komponen (memastikan 9 bola tersedia dan terpakai)</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Quality Control</p>
                        <p className="text-xs text-gray-600">Memastikan setiap bola terposisi dengan benar dalam formasi circular</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Problem Solving</p>
                        <p className="text-xs text-gray-600">Mengatasi tantangan spatial positioning dan snap accuracy</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🎨</span>
                    <h3 className="font-bold text-pink-800">Kreativitas & Estetika</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Color Theory</p>
                        <p className="text-xs text-gray-600">Memahami komposisi warna rainbow yang harmonis</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Visual Design</p>
                        <p className="text-xs text-gray-600">Menciptakan produk yang menarik secara visual (jewelry design)</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-pink-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Symmetry & Balance</p>
                        <p className="text-xs text-gray-600">Menerapkan prinsip keseimbangan dalam formasi melingkar</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-xl p-5">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-2xl">🔧</span>
                    <h3 className="font-bold text-orange-800">Keterampilan Teknis</h3>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">3D Spatial Awareness</p>
                        <p className="text-xs text-gray-600">Memahami dan memanipulasi objek dalam ruang 3 dimensi</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Precision & Accuracy</p>
                        <p className="text-xs text-gray-600">Melatih ketelitian dalam positioning dan snap to target</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-orange-500 mt-1">✓</span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">Digital Literacy</p>
                        <p className="text-xs text-gray-600">Menggunakan teknologi 3D interaktif untuk pembelajaran</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border-2 border-green-300">
                <p className="text-sm font-bold text-green-800 mb-2">🌟 Penerapan dalam Kehidupan Nyata:</p>
                <p className="text-sm text-gray-700">
                  Keterampilan ini sangat berguna jika Anda ingin memulai bisnis <strong>pembuatan perhiasan handmade</strong>, 
                  <strong> craft & accessories</strong>, atau bahkan <strong>desain produk digital</strong>. Kemampuan menghitung 
                  material, merencanakan produksi, dan menciptakan desain yang menarik adalah fondasi penting dalam 
                  kewirausahaan kreatif! 💎🎨
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/materi-pembelajaran/bola/build-challenge">
                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105">
                  🔄 Coba Lagi
                </button>
              </Link>
              
              <Link href="materi-pembelajaran/bola">
                <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105">
                  ✅ Lanjut ke Uji Pemahaman
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tidak Ada Hasil</h2>
            <p className="text-gray-600 mb-6">Belum ada hasil build challenge yang tersimpan.</p>
            <Link href="/materi-pembelajaran/bola/build-challenge">
              <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Mulai Build Challenge
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
