/**
 * AnalysisModal - Shows analysis results
 */

'use client';

export function AnalysisModal({ analysisResult, onClose }) {
  if (!analysisResult) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">📊 Analisis Menara Tabung</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-3">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900">Total Volume: {analysisResult.totalVolume} satuan³</p>
            <p className="text-sm font-semibold text-blue-900">Total Luas Permukaan: {analysisResult.totalSurfaceArea} satuan²</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-2 text-gray-800">Detail Tabung Terakit:</h4>
            {analysisResult.breakdown.map(item => (
              <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg mb-2 border-l-4 border-blue-500">
                <p className="text-sm font-semibold text-gray-800">
                  {item.name} #{item.id}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <p className="text-xs text-gray-600">
                    📏 Jari-jari: {item.radius}
                  </p>
                  <p className="text-xs text-gray-600">
                    📐 Tinggi: {item.height}
                  </p>
                  <p className="text-xs text-gray-600">
                    🧊 Volume: {item.volume}
                  </p>
                  <p className="text-xs text-gray-600">
                    📦 L.Permukaan: {item.surfaceArea}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-green-50 p-2 rounded-lg border border-green-200">
            <p className="text-xs text-green-800 text-center">
              ✨ Semua komponen 2D berhasil dirakit menjadi tabung 3D!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
