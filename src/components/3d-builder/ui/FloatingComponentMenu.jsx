/**
 * FloatingComponentMenu - Mobile-optimized component selector
 * Compact dropdown at bottom of 3D scene
 */

'use client';

import { useState } from 'react';

export function FloatingComponentMenu({ 
  blueprint, 
  spawnedComponents, 
  onSpawnComponent 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to get colors based on blueprint type
  const getItemColors = (itemIndex, partType) => {
    if (blueprint.id === 'sphereBracelet') {
      const rainbowColors = [
        { bg: 'bg-red-500', border: 'border-red-400', text: 'text-red-700', emoji: '🔴' },
        { bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-700', emoji: '🟠' },
        { bg: 'bg-yellow-500', border: 'border-yellow-400', text: 'text-yellow-700', emoji: '🟡' },
        { bg: 'bg-green-500', border: 'border-green-400', text: 'text-green-700', emoji: '🟢' },
        { bg: 'bg-cyan-500', border: 'border-cyan-400', text: 'text-cyan-700', emoji: '🔵' },
        { bg: 'bg-blue-500', border: 'border-blue-400', text: 'text-blue-700', emoji: '🔵' },
        { bg: 'bg-indigo-500', border: 'border-indigo-400', text: 'text-indigo-700', emoji: '🟣' },
        { bg: 'bg-purple-500', border: 'border-purple-400', text: 'text-purple-700', emoji: '🟣' },
        { bg: 'bg-pink-500', border: 'border-pink-400', text: 'text-pink-700', emoji: '🩷' }
      ];
      return rainbowColors[itemIndex] || rainbowColors[0];
    }
    
    // Default cylinder colors
    if (itemIndex === 0) {
      return {
        bg: partType === 'circle' ? 'bg-amber-500' : 'bg-amber-600',
        border: partType === 'circle' ? 'border-amber-400' : 'border-amber-500',
        text: 'text-amber-700',
        emoji: '🟫'
      };
    }
    if (itemIndex === 1) {
      return {
        bg: partType === 'circle' ? 'bg-blue-500' : 'bg-blue-600',
        border: partType === 'circle' ? 'border-blue-400' : 'border-blue-500',
        text: 'text-blue-700',
        emoji: '🟦'
      };
    }
    return {
      bg: partType === 'circle' ? 'bg-red-500' : 'bg-red-600',
      border: partType === 'circle' ? 'border-red-400' : 'border-red-500',
      text: 'text-red-700',
      emoji: '🟥'
    };
  };

  return (
    <div className="bg-gradient-to-t from-black/60 to-transparent backdrop-blur-sm">
      {/* Collapsed: Show button to expand */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full py-3 px-4 flex items-center justify-between text-white"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">🧩</span>
            <span className="font-semibold text-sm">Tambah Komponen</span>
          </div>
          <span className="text-xl">▲</span>
        </button>
      )}
      
      {/* Expanded: Show component selector */}
      {isExpanded && (
        <div 
          className="bg-white/95 backdrop-blur-md rounded-t-2xl shadow-2xl max-h-[50vh] overflow-y-auto"
          style={{
            animation: 'slideUp 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🧩</span>
              <h3 className="font-bold text-gray-800 text-sm">
                {blueprint.id === 'sphereBracelet' ? 'Pilih Bola' : 'Pilih Komponen'}
              </h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700 text-xl leading-none p-1"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              ▼
            </button>
          </div>
          
          {/* Component List */}
          <div className="px-3 py-3 space-y-2">
            {blueprint.items.map((item, itemIndex) => {
              const itemColor = getItemColors(itemIndex, item.parts[0]?.type);
              
              return (
                <div key={item.id}>
                  <div className={`text-[10px] font-bold mb-1 px-1 ${itemColor.text}`}>
                    {itemColor.emoji} {item.displayName}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {item.parts.map(part => {
                      const isDisabled = spawnedComponents[part.componentType];
                      const colors = getItemColors(itemIndex, part.type);
                      const icon = part.type === 'sphere' ? '🔵' : (part.type === 'circle' ? '⭕' : '▭');
                      
                      return (
                        <button
                          key={part.componentType}
                          onClick={() => {
                            if (!isDisabled) {
                              onSpawnComponent(part.componentType, item.color, part.type, item.params);
                              setIsExpanded(false);
                            }
                          }}
                          disabled={isDisabled}
                          className={`relative py-2 px-2 rounded-lg text-center
                            transition-all duration-200 shadow-sm border
                            touch-manipulation select-none ${colors.bg} ${colors.border} ${
                              isDisabled 
                                ? 'opacity-40 cursor-not-allowed' 
                                : 'active:scale-95'
                            }`}
                          style={{ WebkitTapHighlightColor: 'transparent' }}
                        >
                          <div className="text-xl mb-0.5">
                            {icon}
                          </div>
                          <div className="text-[9px] font-semibold text-white leading-tight">
                            {part.label}
                          </div>
                          {isDisabled && (
                            <div className="absolute top-0.5 right-0.5 text-white text-xs">✓</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Tips */}
          <div className="px-3 pb-3">
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
              <p className="text-[9px] text-blue-800 text-center leading-relaxed">
                💡 {blueprint.id === 'sphereBracelet' ? 'Pilih lalu drag ke posisi di gelang!' : 'Pilih lalu drag ke hotspot yang sesuai!'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}} />
    </div>
  );
}