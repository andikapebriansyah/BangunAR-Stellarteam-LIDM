/**
 * KerucutInstructionPanel - Interactive instructions and size customization for Rocket
 */

'use client';

import { useState, forwardRef } from 'react';

export const KerucutInstructionPanel = forwardRef(({ 
  baseRadius,
  customSizes, 
  onBaseRadiusChange, 
  validationErrors,
  onConfirmSizes,
  shouldBlink,
  sizesConfirmed
}, ref) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleRadiusChange = (value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onBaseRadiusChange(numValue);
    }
  };

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-orange-200">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-orange-500 to-red-600 p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-orange-600 text-lg">
              {activeTab === 'instructions' ? '📖' : '⚙️'}
            </span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">
              {activeTab === 'instructions' ? 'Petunjuk Penggunaan' : 'Kustomisasi Ukuran'}
            </h2>
            <p className="text-orange-100 text-xs">
              {activeTab === 'instructions' ? 'Cara merakit roket peluncur' : 'Atur ukuran untuk perhitungan'}
            </p>
          </div>
        </div>
        <button className="text-white text-2xl">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-4">
          {/* Tabs */}
          <div className="flex space-x-2 mb-4 border-b-2 border-gray-300">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-6 py-3 font-bold text-base transition-all relative ${
                activeTab === 'instructions'
                  ? 'text-orange-600 border-b-4 border-orange-600 bg-orange-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              📖 Petunjuk Merakit
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-6 py-3 font-bold text-base transition-all relative ${
                activeTab === 'customize'
                  ? 'text-red-600 border-b-4 border-red-600 bg-red-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              } ${shouldBlink ? 'animate-pulse' : ''}`}
            >
              <span className={shouldBlink ? 'inline-block animate-bounce' : ''}>⚙️</span> Ukuran Custom
              {shouldBlink && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>
          </div>

          {/* Instructions Tab */}
          {activeTab === 'instructions' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-orange-100 to-red-50 rounded-lg p-4 border-2 border-orange-400 shadow-md">
                <h3 className="font-bold text-orange-900 text-base mb-2 flex items-center">
                  <span className="text-2xl mr-2">🚀</span> 
                  Sistem Peluncur Roket Mini
                </h3>
                <p className="text-orange-900 text-sm leading-relaxed font-medium">
                  Rakit roket dari <strong>3 bagian utama</strong>: Kerucut Dasar (stabilizer), 
                  Badan Roket (cylinder), dan Kerucut Hidung (nose cone). Struktur aerodinamis 
                  untuk efisiensi peluncuran maksimal! 🔥
                </p>
              </div>

              <div className="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
                <h3 className="font-semibold text-red-900 text-sm mb-2">⚠️ Langkah 1: Atur Ukuran Custom</h3>
                <p className="text-red-800 text-xs leading-relaxed">
                  Klik tab <strong className="bg-red-200 px-2 py-0.5 rounded">⚙️ Ukuran Custom</strong> 
                  untuk mengatur dimensi setiap komponen roket, lalu klik 
                  <strong className="bg-green-200 px-2 py-0.5 rounded mx-1">✅ Konfirmasi</strong>.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">🧩 Langkah 2: Spawn Komponen 2D</h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Spawn komponen: <strong>Lingkaran</strong> (alas) dan <strong>Juring</strong> (selimut kerucut) 
                  + komponen tabung. Setiap komponen hanya bisa di-spawn sekali.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-900 text-sm mb-2">🎯 Langkah 3: Drag & Drop</h3>
                <p className="text-purple-800 text-xs leading-relaxed">
                  Drag komponen ke <strong>hotspot hijau</strong> yang sesuai. 
                  Komponen akan otomatis snap dan membentuk roket 3D yang solid!
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 text-sm mb-2">✅ Langkah 4: Selesaikan</h3>
                <p className="text-green-800 text-xs leading-relaxed">
                  Pasang semua komponen untuk melengkapi roket peluncur. 
                  Lihat hasil perhitungan volume dan aerodinamika di halaman hasil.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-yellow-800 text-xs font-medium">
                  💡 <strong>Tips:</strong> Susun dari bawah ke atas: Kerucut Dasar → Badan → Hidung Roket! 🚀
                </p>
              </div>
            </div>
          )}

          {/* Customize Tab */}
          {activeTab === 'customize' && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-400 rounded-lg p-4 shadow-sm">
                <p className="text-blue-900 text-sm font-bold flex items-center mb-2">
                  <span className="text-2xl mr-2">🎯</span>
                  Sistem Otomatis - Sederhanakan!
                </p>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Cukup atur <strong className="text-indigo-700">radius alas dasar frustum</strong> saja! 
                  Sistem akan otomatis menghitung ukuran komponen lainnya dengan <strong>proporsi aerodinamis sempurna</strong> 🚀
                </p>
              </div>

              {/* Single Input: Base Radius */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border-4 border-orange-400 shadow-lg">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center text-lg">
                  <span className="text-3xl mr-2">🎚️</span> Radius Alas Dasar Frustum
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-700 font-semibold flex items-center justify-between mb-3">
                      <span className="flex items-center">
                        <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                        Radius (r)
                      </span>
                      <span className="text-orange-700 font-bold text-2xl bg-orange-100 px-4 py-2 rounded-lg border-2 border-orange-500 shadow-md">
                        {baseRadius} m
                      </span>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="20"
                      step="1"
                      value={baseRadius}
                      onChange={(e) => handleRadiusChange(e.target.value)}
                      className="w-full h-4 bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 rounded-lg appearance-none cursor-pointer shadow-inner"
                      style={{
                        background: `linear-gradient(to right, #fb923c 0%, #f97316 ${((baseRadius - 8) / 12) * 100}%, #e5e7eb ${((baseRadius - 8) / 12) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1 font-medium">
                      <span>8 m (Min)</span>
                      <span>14 m (Ideal)</span>
                      <span>20 m (Max)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Auto-Calculated Sizes Display */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-5 border-2 border-gray-300 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🔄</span> Ukuran Otomatis (Berdasarkan Skala)
                </h3>
                
                <div className="space-y-3">
                  {/* Kerucut Dasar */}
                  <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3 border-2 border-orange-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-orange-900 flex items-center">
                        <span className="text-xl mr-2">🟧</span> Kerucut Dasar
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded px-2 py-1 border border-orange-300">
                        <span className="text-gray-600">Radius:</span>
                        <strong className="text-orange-700 ml-1">{customSizes.base.radius} m</strong>
                      </div>
                      <div className="bg-white rounded px-2 py-1 border border-orange-300">
                        <span className="text-gray-600">Tinggi:</span>
                        <strong className="text-orange-700 ml-1">{customSizes.base.height} m</strong>
                      </div>
                    </div>
                  </div>

                  {/* Badan Roket */}
                  <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg p-3 border-2 border-gray-400">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900 flex items-center">
                        <span className="text-xl mr-2">⬜</span> Badan Roket
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded px-2 py-1 border border-gray-400">
                        <span className="text-gray-600">Radius:</span>
                        <strong className="text-gray-700 ml-1">{customSizes.body.radius} m</strong>
                      </div>
                      <div className="bg-white rounded px-2 py-1 border border-gray-400">
                        <span className="text-gray-600">Tinggi:</span>
                        <strong className="text-gray-700 ml-1">{customSizes.body.height} m</strong>
                      </div>
                    </div>
                  </div>

                  {/* Kerucut Hidung */}
                  <div className="bg-gradient-to-r from-red-100 to-pink-100 rounded-lg p-3 border-2 border-red-300">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-red-900 flex items-center">
                        <span className="text-xl mr-2">🟥</span> Kerucut Hidung
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white rounded px-2 py-1 border border-red-300">
                        <span className="text-gray-600">Radius:</span>
                        <strong className="text-red-700 ml-1">{customSizes.nose.radius} m</strong>
                      </div>
                      <div className="bg-white rounded px-2 py-1 border border-red-300">
                        <span className="text-gray-600">Tinggi:</span>
                        <strong className="text-red-700 ml-1">{customSizes.nose.height} m</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Total Height */}
                <div className="mt-3 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3 border-2 border-purple-400">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 flex items-center">
                      <span className="text-xl mr-2">📏</span> Tinggi Total Roket
                    </span>
                    <span className="text-purple-700 font-bold text-xl bg-white px-3 py-1 rounded-lg border-2 border-purple-400">
                      {customSizes.base.height + customSizes.body.height + customSizes.nose.height} m
                    </span>
                  </div>
                </div>
              </div>

              {/* Scale Explanation */}
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 shadow-sm">
                <p className="text-yellow-900 text-xs font-semibold flex items-center mb-2">
                  <span className="text-lg mr-2">💡</span>
                  Penjelasan Skala Otomatis:
                </p>
                <ul className="text-yellow-800 text-xs space-y-1 ml-6">
                  <li>• <strong>Badan & Hidung:</strong> Radius = 41.67% dari radius dasar</li>
                  <li>• <strong>Tinggi Dasar:</strong> 83.33% dari radius dasar</li>
                  <li>• <strong>Tinggi Badan:</strong> 208.33% dari radius dasar (tinggi 2x+)</li>
                  <li>• <strong>Tinggi Hidung:</strong> 100% dari radius dasar (sama dengan radius)</li>
                </ul>
                <p className="text-yellow-800 text-xs mt-2 font-medium">
                  Proporsi ini memastikan <strong className="text-yellow-900">stabilitas aerodinamis</strong> maksimal! 🚀
                </p>
              </div>

              {/* Validation Warning */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3 shadow-md animate-pulse">
                  <p className="text-red-800 text-sm font-bold mb-1 flex items-center">
                    <span className="text-xl mr-2">⚠️</span> 
                    Validasi Error:
                  </p>
                  {Object.entries(validationErrors).map(([key, msg]) => (
                    <p key={key} className="text-red-700 text-xs ml-7">• {msg}</p>
                  ))}
                </div>
              )}

              {/* Confirm Button */}
              <button
                onClick={onConfirmSizes}
                disabled={sizesConfirmed}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  sizesConfirmed
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 hover:from-green-600 hover:via-green-700 hover:to-emerald-700 text-white transform hover:scale-105'
                }`}
              >
                {sizesConfirmed 
                  ? '✅ Roket Siap Dirakit!' 
                  : '✅ Konfirmasi & Mulai Rakit'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

KerucutInstructionPanel.displayName = 'KerucutInstructionPanel';
