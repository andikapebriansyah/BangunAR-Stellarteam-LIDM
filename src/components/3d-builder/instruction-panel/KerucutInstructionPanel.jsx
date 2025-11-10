/**
 * KerucutInstructionPanel - Interactive instructions and size customization for Rocket
 */

'use client';

import { useState, forwardRef } from 'react';

export const KerucutInstructionPanel = forwardRef(({ 
  customSizes, 
  onSizeChange, 
  validationErrors,
  onConfirmSizes,
  shouldBlink,
  sizesConfirmed
}, ref) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSizeChange = (componentType, dimension, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onSizeChange(componentType, dimension, numValue);
    }
  };

  const allSizesValid = Object.keys(validationErrors).length === 0;

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
              <div className="bg-gradient-to-r from-orange-100 to-red-100 border-2 border-orange-400 rounded-lg p-3 shadow-sm">
                <p className="text-orange-900 text-sm font-semibold flex items-center">
                  <span className="text-xl mr-2">ℹ️</span>
                  Atur ukuran setiap komponen roket, lalu klik <strong className="text-green-700 mx-1">Konfirmasi</strong>
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

              {/* Kerucut Dasar (Base Cone) */}
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border-2 border-orange-400 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🟧</span> Kerucut Dasar (Stabilizer)
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Jari-jari (r)</span>
                      <span className="text-orange-700 font-bold text-lg bg-orange-100 px-3 py-1 rounded-lg">{customSizes.base.radius} cm</span>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="15"
                      step="1"
                      value={customSizes.base.radius}
                      onChange={(e) => handleSizeChange('base', 'radius', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Tinggi (t)</span>
                      <span className="text-orange-700 font-bold text-lg bg-orange-100 px-3 py-1 rounded-lg">{customSizes.base.height} cm</span>
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="12"
                      step="1"
                      value={customSizes.base.height}
                      onChange={(e) => handleSizeChange('base', 'height', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Badan Roket (Cylinder Body) */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border-2 border-gray-400 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">⬜</span> Badan Roket (Cylinder)
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Jari-jari (r)</span>
                      <span className="text-gray-700 font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg">{customSizes.body.radius} cm</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="8"
                      step="1"
                      value={customSizes.body.radius}
                      onChange={(e) => handleSizeChange('body', 'radius', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-gray-200 to-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Tinggi (t)</span>
                      <span className="text-gray-700 font-bold text-lg bg-gray-100 px-3 py-1 rounded-lg">{customSizes.body.height} cm</span>
                    </label>
                    <input
                      type="range"
                      min="15"
                      max="30"
                      step="1"
                      value={customSizes.body.height}
                      onChange={(e) => handleSizeChange('body', 'height', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-gray-200 to-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Kerucut Hidung (Nose Cone) */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-4 border-2 border-red-400 shadow-md">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="text-2xl mr-2">🟥</span> Kerucut Hidung (Nose Cone)
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Jari-jari (r)</span>
                      <span className="text-red-700 font-bold text-lg bg-red-100 px-3 py-1 rounded-lg">{customSizes.nose.radius} cm</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="8"
                      step="1"
                      value={customSizes.nose.radius}
                      onChange={(e) => handleSizeChange('nose', 'radius', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-red-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                      <span>Tinggi (t)</span>
                      <span className="text-red-700 font-bold text-lg bg-red-100 px-3 py-1 rounded-lg">{customSizes.nose.height} cm</span>
                    </label>
                    <input
                      type="range"
                      min="8"
                      max="15"
                      step="1"
                      value={customSizes.nose.height}
                      onChange={(e) => handleSizeChange('nose', 'height', e.target.value)}
                      className="w-full h-3 bg-gradient-to-r from-red-200 to-pink-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={onConfirmSizes}
                disabled={!allSizesValid || sizesConfirmed}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                  sizesConfirmed
                    ? 'bg-gray-400 cursor-not-allowed'
                    : allSizesValid
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {sizesConfirmed 
                  ? '✅ Roket Siap Dirakit!' 
                  : allSizesValid 
                  ? '✅ Konfirmasi & Mulai Rakit' 
                  : '⚠️ Perbaiki Ukuran Dulu'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

KerucutInstructionPanel.displayName = 'KerucutInstructionPanel';
