'use client';
import React, { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Modal from './Modal';

export default function ARShapeSelector({ isOpen, onClose }) {
  const router = useRouter();

  // Memoize shapes data to prevent recreation on each render
  const shapes = useMemo(() => [
    {
      id: 'silinder',
      name: 'Silinder',
      description: 'Bangun ruang sisi lengkung dengan alas dan tutup berbentuk lingkaran',
      emoji: '🥤',
      color: 'from-blue-500 to-purple-600',
      available: true,
      features: ['Volume: π × r² × h', 'Luas: 2πr(r + h)']
    },
    {
      id: 'kerucut',
      name: 'Kerucut',
      description: 'Bangun ruang dengan alas lingkaran dan puncak berbentuk titik',
      emoji: '🔺',
      color: 'from-green-500 to-blue-500',
      available: true,
      features: ['Volume: ⅓ × π × r² × t', 'Luas: πr(r + s)']
    },
    {
      id: 'bola',
      name: 'Bola',
      description: 'Bangun ruang berbentuk bulat sempurna',
      emoji: '⚽',
      color: 'from-red-500 to-pink-500',
      available: false,
      features: ['Volume: ⁴⁄₃ × π × r³', 'Luas: 4πr²']
    },
    {
      id: 'tabung',
      name: 'Tabung',
      description: 'Bangun ruang dengan alas dan tutup yang sama',
      emoji: '🗄️',
      color: 'from-yellow-500 to-orange-500',
      available: false,
      features: ['Volume: π × r² × h', 'Sisi: 2πrh']
    }
  ], []);

  const handleShapeSelect = useCallback((shapeId) => {
    const shape = shapes.find(s => s.id === shapeId);
    if (shape?.available) {
      onClose();
      // Add small delay to ensure modal closes before navigation
      setTimeout(() => {
        router.push(`/ar/${shapeId}`);
      }, 100);
    }
  }, [shapes, onClose, router]);

  // Don't render content if modal is not open (performance optimization)
  if (!isOpen) return <Modal isOpen={false} onClose={onClose} />;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Bangun Ruang AR">
      <div className="space-y-4">
        <p className="text-gray-600 text-sm mb-4">
          Pilih bangun ruang yang ingin kamu jelajahi dengan teknologi Augmented Reality
        </p>
        
        <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
          {shapes.map((shape) => (
            <ShapeCard 
              key={shape.id}
              shape={shape}
              onSelect={handleShapeSelect}
            />
          ))}
        </div>
        
        {/* Optimized Info Footer */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 mt-0.5 flex-shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">Tips AR</h4>
              <p className="text-xs text-blue-700">
                Pastikan kamera berfungsi dan gunakan permukaan datar untuk hasil AR terbaik
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Separate memoized component for shape cards
const ShapeCard = React.memo(({ shape, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(shape.id);
  }, [shape.id, onSelect]);

  return (
    <div 
      onClick={handleClick}
      className={`
        relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
        ${shape.available 
          ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm bg-white hover:bg-gray-50' 
          : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
        }
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`
          w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0
          bg-gradient-to-br ${shape.color} ${!shape.available ? 'grayscale' : ''}
        `}>
          {shape.emoji}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{shape.name}</h3>
            <span className={`
              px-2 py-0.5 text-xs rounded-full font-medium
              ${shape.available 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              {shape.available ? 'Tersedia' : 'Segera'}
            </span>
          </div>
          
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {shape.description}
          </p>
          
          <div className="space-y-0.5">
            {shape.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-center text-xs text-gray-500">
                <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0"></div>
                <span className="truncate">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {shape.available && (
          <div className="text-blue-500 flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
});

ShapeCard.displayName = 'ShapeCard';
