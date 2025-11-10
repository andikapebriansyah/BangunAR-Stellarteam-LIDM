/**
 * InstructionPanel - Interactive instructions and size customization
 */

'use client';

import { useState, forwardRef } from 'react';

export const InstructionPanel = forwardRef(({ 
  customSizes, 
  onSizeChange, 
  validationErrors,
  onConfirmSizes,
  shouldBlink,
  sizesConfirmed
}, ref) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSizeChange = (cylinderType, dimension, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onSizeChange(cylinderType, dimension, numValue);
    }
  };

  const allSizesValid = Object.keys(validationErrors).length === 0;

  return (
    <div ref={ref} className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-blue-200">
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 text-lg">
              {activeTab === 'instructions' ? '📖' : '⚙️'}
            </span>
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">
              {activeTab === 'instructions' ? 'Petunjuk Penggunaan' : 'Kustomisasi Ukuran'}
            </h2>
            <p className="text-blue-100 text-xs">
              {activeTab === 'instructions' ? 'Cara merakit tabung' : 'Atur ukuran untuk perhitungan'}
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
                  ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              📖 Petunjuk Merakit
            </button>
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-6 py-3 font-bold text-base transition-all relative ${
                activeTab === 'customize'
                  ? 'text-orange-600 border-b-4 border-orange-600 bg-orange-50'
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
              <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-4 border-2 border-orange-400 shadow-md">
                <h3 className="font-bold text-orange-900 text-base mb-2 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span> 
                  PENTING! Langkah 1: Atur Ukuran Custom
                </h3>
                <p className="text-orange-900 text-sm leading-relaxed font-medium">
                  Sebelum mulai merakit, <strong className="text-orange-700 text-base">WAJIB</strong> klik tab 
                  <strong className="text-orange-700 bg-orange-200 px-2 py-0.5 rounded mx-1">⚙️ Ukuran Custom</strong> 
                  untuk mengatur jari-jari dan tinggi setiap tabung, lalu klik tombol 
                  <strong className="text-green-700 bg-green-200 px-2 py-0.5 rounded mx-1">✅ Konfirmasi</strong>.
                </p>
                <p className="text-orange-800 text-xs mt-2 italic">
                  💡 Ukuran ini akan digunakan untuk perhitungan volume dan luas permukaan di hasil akhir.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">🧩 Langkah 2: Spawn Komponen</h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Setelah konfirmasi ukuran, klik tombol komponen (⭕ Lingkaran atau ▭ Selimut) untuk menambahkan ke scene. 
                  Setiap komponen hanya bisa di-spawn sekali.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-900 text-sm mb-2">🎨 Langkah 3: Drag & Drop</h3>
                <p className="text-purple-800 text-xs leading-relaxed">
                  Drag komponen 2D ke <strong>hotspot berwarna hijau</strong> (lingkaran untuk alas/tutup) 
                  atau <strong>merah</strong> (ring untuk selimut) yang sesuai warna tabungnya.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 text-sm mb-2">✅ Langkah 4: Selesaikan</h3>
                <p className="text-green-800 text-xs leading-relaxed">
                  Pasang semua 3 parts (alas, selimut, tutup) untuk setiap tabung. 
                  Tabung akan berubah solid saat lengkap! Lihat hasil perhitungan di halaman hasil.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-yellow-800 text-xs font-medium">
                  💡 <strong>Tips:</strong> Susun dari besar ke kecil untuk menara yang stabil!
                </p>
              </div>
            </div>
          )}

          {/* Customize Tab */}
          {activeTab === 'customize' && (
            <div className="space-y-4">
              {/* Info Banner */}
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-400 rounded-lg p-3 shadow-sm">
                <p className="text-blue-900 text-sm font-semibold flex items-center">
                  <span className="text-xl mr-2">ℹ️</span>
                  Atur ukuran di bawah, lalu klik <strong className="text-green-700 mx-1">Konfirmasi</strong>
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

              {/* Large Cylinder */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-amber-700"></div>
                  <h3 className="font-bold text-amber-900">🟫 Tabung Besar</h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Jari-jari (r)</span>
                      <span className="text-amber-700">{customSizes.large.radius}</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="20"
                      step="1"
                      value={customSizes.large.radius}
                      onChange={(e) => handleSizeChange('large', 'radius', e.target.value)}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Tinggi (t)</span>
                      <span className="text-amber-700">{customSizes.large.height}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={customSizes.large.height}
                      onChange={(e) => handleSizeChange('large', 'height', e.target.value)}
                      className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Medium Cylinder */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-blue-600"></div>
                  <h3 className="font-bold text-blue-900">🟦 Tabung Sedang</h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Jari-jari (r)</span>
                      <span className="text-blue-700">{customSizes.medium.radius}</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="19"
                      step="1"
                      value={customSizes.medium.radius}
                      onChange={(e) => handleSizeChange('medium', 'radius', e.target.value)}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Tinggi (t)</span>
                      <span className="text-blue-700">{customSizes.medium.height}</span>
                    </label>
                    <input
                      type="range"
                      min="4"
                      max="29"
                      step="1"
                      value={customSizes.medium.height}
                      onChange={(e) => handleSizeChange('medium', 'height', e.target.value)}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Small Cylinder */}
              <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-4 h-4 rounded-full bg-red-600"></div>
                  <h3 className="font-bold text-red-900">🟥 Tabung Kecil</h3>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Jari-jari (r)</span>
                      <span className="text-red-700">{customSizes.small.radius}</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="18"
                      step="1"
                      value={customSizes.small.radius}
                      onChange={(e) => handleSizeChange('small', 'radius', e.target.value)}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-700 font-medium flex items-center justify-between">
                      <span>Tinggi (t)</span>
                      <span className="text-red-700">{customSizes.small.height}</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="28"
                      step="1"
                      value={customSizes.small.height}
                      onChange={(e) => handleSizeChange('small', 'height', e.target.value)}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
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
                  ? '✅ Selamat Mengerjakan!' 
                  : allSizesValid 
                  ? '✅ Konfirmasi & Mulai Rakit' 
                  : '⚠️ Perbaiki Ukuran Dulu'}
              </button>

              <div className="bg-gray-50 rounded-lg p-2 text-center">
                <p className="text-gray-600 text-xs">
                  <strong>Aturan:</strong> Sedang {"<"} Besar, Kecil {"<"} Sedang
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

InstructionPanel.displayName = 'InstructionPanel';
