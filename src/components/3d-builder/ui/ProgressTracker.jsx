/**
 * ProgressTracker - Shows build progress
 */

'use client';

export function ProgressTracker({ blueprint, itemParts }) {
  const totalParts = blueprint.items.reduce((acc, item) => acc + item.parts.length, 0);
  const filledParts = itemParts.reduce((acc, parts) => {
    return acc + Object.values(parts).filter(p => p.filled).length;
  }, 0);
  
  return (
    <div className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-purple-800">Progress Perakitan:</span>
        <span className="text-xs font-bold text-purple-900">
          {filledParts}/{totalParts} komponen
        </span>
      </div>
      <div className="space-y-1">
        {blueprint.items.map((item, index) => {
          const parts = itemParts[index];
          const allFilled = item.parts.every(part => parts[part.id]?.filled);
          
          return (
            <div key={item.id} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                allFilled ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className="text-xs text-gray-700">
                {item.displayColor} {item.displayName}
              </span>
              <div className="flex items-center space-x-1 ml-auto">
                {item.parts.map(part => {
                  const isFilled = parts[part.id]?.filled;
                  // Sphere dan circle pakai lingkaran, rectangle pakai persegi panjang
                  const isCircleType = part.type === 'circle' || part.type === 'sphere';
                  
                  return (
                    <span 
                      key={part.id}
                      className="inline-flex items-center justify-center"
                      title={`${part.label} - ${isFilled ? 'Terpasang ✓' : 'Belum terpasang'}`}
                    >
                      {isCircleType ? (
                        // Lingkaran untuk sphere dan circle
                        <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                          isFilled 
                            ? 'bg-green-500 border-green-600' 
                            : 'bg-gray-100 border-gray-400'
                        }`}></div>
                      ) : (
                        // Persegi panjang untuk rectangle
                        <span className={`text-xs transition-colors ${
                          isFilled ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          ▭
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
