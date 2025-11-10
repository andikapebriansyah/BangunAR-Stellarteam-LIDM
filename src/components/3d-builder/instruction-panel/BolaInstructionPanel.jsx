/**
 * BolaInstructionPanel - Interactive instructions and size customization for Sphere
 */

'use client';

import { useState, forwardRef } from 'react';

export const BolaInstructionPanel = forwardRef(({ 
  customSizes, 
  onSizeChange, 
  validationErrors,
  onConfirmSizes,
  shouldBlink,
  sizesConfirmed
}, ref) => {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSizeChange = (sphereType, dimension, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      onSizeChange(sphereType, dimension, numValue);
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
              {activeTab === 'instructions' ? 'Cara merakit gelang bola' : 'Atur ukuran untuk perhitungan'}
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
                  untuk mengatur jari-jari setiap bola, lalu klik tombol 
                  <strong className="text-green-700 bg-green-200 px-2 py-0.5 rounded mx-1">✅ Konfirmasi</strong>.
                </p>
                <p className="text-orange-800 text-xs mt-2 italic">
                  💡 Ukuran ini akan digunakan untuk perhitungan volume dan luas permukaan di hasil akhir.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500">
                <h3 className="font-semibold text-blue-900 text-sm mb-2">🧩 Langkah 2: Spawn Komponen</h3>
                <p className="text-blue-800 text-xs leading-relaxed">
                  Setelah konfirmasi ukuran, klik tombol bola (🔵) untuk menambahkan ke scene. 
                  Setiap bola hanya bisa di-spawn sekali.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                <h3 className="font-semibold text-purple-900 text-sm mb-2">🎨 Langkah 3: Drag & Drop</h3>
                <p className="text-purple-800 text-xs leading-relaxed">
                  Drag bola ke <strong>hotspot berwarna hijau</strong> yang sesuai dengan posisi di gelang. 
                  Bola akan berubah solid dan metallic saat terpasang!
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-500">
                <h3 className="font-semibold text-green-900 text-sm mb-2">✅ Langkah 4: Selesaikan</h3>
                <p className="text-green-800 text-xs leading-relaxed">
                  Pasang semua 9 bola untuk melengkapi gelang pelangi. 
                  Lihat hasil perhitungan volume dan luas permukaan di halaman hasil.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-2 text-center">
                <p className="text-yellow-800 text-xs font-medium">
                  💡 <strong>Tips:</strong> Susun sesuai urutan warna pelangi untuk gelang!
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
                  Atur jari-jari bola di bawah (semua bola ukuran sama), lalu klik <strong className="text-green-700 mx-1">Konfirmasi</strong>
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

              {/* Single Sphere Size - All same */}
              <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 rounded-lg p-4 border-2 border-blue-400 shadow-md">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex -space-x-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-orange-500 shadow-md border-2 border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-md border-2 border-white"></div>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md border-2 border-white"></div>
                  </div>
                  <h3 className="font-bold text-gray-900">🎨 Ukuran Semua Bola (Sama)</h3>
                </div>
                
                <div>
                  <label className="text-sm text-gray-700 font-medium flex items-center justify-between mb-2">
                    <span>Jari-jari (r)</span>
                    <span className="text-blue-700 font-bold text-lg bg-blue-100 px-3 py-1 rounded-lg">{customSizes.large.radius} mm</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="13"
                    step="1"
                    value={customSizes.large.radius}
                    onChange={(e) => handleSizeChange('large', 'radius', e.target.value)}
                    className="w-full h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5mm (Kecil)</span>
                    <span>9mm (Sedang)</span>
                    <span>13mm (Besar)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center italic">
                    Semua 9 bola akan menggunakan jari-jari yang sama
                  </p>
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
                  <strong>Info:</strong> Semua 9 bola menggunakan ukuran yang sama
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

BolaInstructionPanel.displayName = 'BolaInstructionPanel';
