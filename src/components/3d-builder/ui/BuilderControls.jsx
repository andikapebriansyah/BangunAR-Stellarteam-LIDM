/**
 * BuilderControls - Action buttons for the builder
 */

'use client';

export function BuilderControls({ 
  onCheck, 
  onReset,
  isMobile,
  performanceMode,
  onTogglePerformance 
}) {
  return (
    <div className="mt-4 text-center">
      {/* Performance Toggle for Mobile */}
      {isMobile && (
        <div className="mb-3">
          <label className="flex items-center justify-center space-x-2 text-xs text-gray-600">
            <input
              type="checkbox"
              checked={performanceMode}
              onChange={(e) => onTogglePerformance(e.target.checked)}
              className="rounded"
            />
            <span>Mode Performa (kurangi kualitas visual)</span>
          </label>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-2 justify-center flex-wrap">
        <button
          onClick={onCheck}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors mb-1 shadow-md"
        >
          🔍 Periksa
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors mb-1 shadow-md"
        >
          🔄 Reset
        </button>
      </div>
    </div>
  );
}
