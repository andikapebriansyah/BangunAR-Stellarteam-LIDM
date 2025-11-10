/**
 * ComponentPanel - UI for spawning 2D components
 * Desktop sidebar version with compact buttons
 */

'use client';

export function Component2DButton({ 
  componentType, 
  label, 
  onClick, 
  bgColor, 
  icon, 
  size, 
  isDisabled,
  compact = false
}) {
  if (compact) {
    // Compact button for desktop sidebar
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`relative w-full h-12 rounded-lg ${bgColor} 
          transition-all duration-200 shadow-sm border border-white/30 
          flex items-center justify-between px-2.5
          touch-manipulation select-none ${
            isDisabled 
              ? 'opacity-40 cursor-not-allowed' 
              : 'hover:scale-102 active:scale-98 hover:shadow-md'
          }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center space-x-1.5">
          <div className="text-xl">{icon}</div>
          <div className="text-left">
            <div className="text-[11px] font-semibold text-white leading-tight">{label}</div>
          </div>
        </div>
        <div className="text-white text-lg">{isDisabled ? '✓' : '+'}</div>
      </button>
    );
  }
  
  // Full button for mobile/tablet
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative w-full h-14 rounded-xl ${bgColor} hover:scale-102 active:scale-98 
        transition-all duration-200 shadow-md border-2 border-white/30 flex items-center justify-between px-3
        touch-manipulation select-none ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="flex items-center space-x-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-left">
          <div className="text-xs font-semibold text-white">{label}</div>
          <div className="text-[10px] text-white/80">{size}</div>
        </div>
      </div>
      <div className="text-white text-xl">{isDisabled ? '✓' : '+'}</div>
    </button>
  );
}

export function ComponentPanel({ blueprint, spawnedComponents, onSpawnComponent, compact = false }) {
  // Helper function to get color classes based on item color hex
  const getColorClasses = (hexColor, itemIndex) => {
    // If blueprint is SPHERE (bracelet/jewelry), use rainbow colors
    if (blueprint.shapeType === 'sphere') {
      const rainbowBg = [
        'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 
        'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
      ];
      const rainbowBorder = [
        'border-red-200', 'border-orange-200', 'border-yellow-200', 'border-green-200',
        'border-cyan-200', 'border-blue-200', 'border-indigo-200', 'border-purple-200', 'border-pink-200'
      ];
      const rainbowText = [
        'text-red-800', 'text-orange-800', 'text-yellow-800', 'text-green-800',
        'text-cyan-800', 'text-blue-800', 'text-indigo-800', 'text-purple-800', 'text-pink-800'
      ];
      const rainbowEmoji = ['🔴', '🟠', '🟡', '🟢', '🔵', '🔵', '🟣', '🟣', '🩷'];
      
      return {
        bg: 'bg-white',
        border: rainbowBorder[itemIndex] || 'border-gray-200',
        text: rainbowText[itemIndex] || 'text-gray-800',
        emoji: rainbowEmoji[itemIndex] || '⚪',
        buttonBg: rainbowBg[itemIndex] || 'bg-gray-500'
      };
    }
    
    // Default cylinder colors
    if (itemIndex === 0) return {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-800',
      emoji: '🟫',
      buttonBg: 'bg-amber-600',
      buttonBgAlt: 'bg-amber-700'
    };
    if (itemIndex === 1) return {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      emoji: '🟦',
      buttonBg: 'bg-blue-600',
      buttonBgAlt: 'bg-blue-700'
    };
    return {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      emoji: '🟥',
      buttonBg: 'bg-red-600',
      buttonBgAlt: 'bg-red-700'
    };
  };
  
  return (
    <div className={`bg-white ${compact ? 'rounded-xl p-3' : 'rounded-2xl p-4'} shadow-lg h-full overflow-y-auto`}>
      <div className={`flex items-center space-x-2 ${compact ? 'mb-3' : 'mb-4'}`}>
        <div className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} bg-purple-500 rounded-full flex items-center justify-center`}>
          <span className="text-white text-xs">🧩</span>
        </div>
        <h2 className={`font-semibold text-gray-800 ${compact ? 'text-sm' : 'text-base'}`}>
          {compact ? 'Komponen' : (blueprint.shapeType === 'sphere' ? 'Bola-Bola Tersedia' : 'Komponen 2D Tersedia')}
        </h2>
      </div>
      
      <div className={compact ? 'space-y-2' : 'space-y-2'}>
        {blueprint.items.map((item, itemIndex) => {
          const colors = getColorClasses(item.color, itemIndex);
          
          return (
            <div 
              key={item.id} 
              className={`rounded-lg ${compact ? 'p-2' : 'p-3'} border ${colors.bg} ${colors.border}`}
            >
              <h3 className={`${compact ? 'text-[10px]' : 'text-xs'} font-semibold ${compact ? 'mb-1.5' : 'mb-2'} ${colors.text}`}>
                {compact ? (
                  <>
                    {colors.emoji} {item.displayName.split(' ')[1] || item.displayName}
                  </>
                ) : (
                  <>{item.displayColor || item.displayName}</>
                )}
              </h3>
              <div className={`grid grid-cols-1 ${compact ? 'gap-1.5' : 'md:grid-cols-3 gap-2'}`}>
                {item.parts.map(part => {
                  // For sphere, use sphere-specific icon and label
                  const isSphere = part.type === 'sphere';
                  const icon = isSphere ? '🔵' : (part.type === 'circle' ? '⭕' : '▭');
                  const sizeLabel = isSphere 
                    ? `Bola ${itemIndex + 1}` 
                    : (part.type === 'circle' ? `Lingkaran ${item.displayName.split(' ')[1]}` : 'Persegi Panjang');
                  
                  return (
                    <Component2DButton
                      key={part.componentType}
                      componentType={part.componentType}
                      label={part.label}
                      size={sizeLabel}
                      onClick={() => onSpawnComponent(part.componentType, item.color, part.type, item.params)}
                      bgColor={isSphere ? colors.buttonBg : (part.type === 'circle' ? colors.buttonBg : (colors.buttonBgAlt || colors.buttonBg))}
                      icon={icon}
                      isDisabled={spawnedComponents[part.componentType]}
                      compact={compact}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
      {!compact && (
        <div className="mt-3 bg-blue-50 rounded-lg p-2">
          <p className="text-xs text-blue-800 text-center">
            💡 <span className="font-semibold">Tips:</span> {
              blueprint.shapeType === 'sphere'
                ? 'Drag bola ke posisi di gelang yang sesuai!' 
                : 'Drag komponen 2D ke hotspot yang sesuai warnanya!'
            }
          </p>
        </div>
      )}
    </div>
  );
}
