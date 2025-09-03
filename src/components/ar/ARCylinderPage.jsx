'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ARViewer from './ARViewer.jsx';
import ARControls from './ARControls.jsx';

export default function ARCylinderPage() {
  const router = useRouter();
  const [isARActive, setIsARActive] = useState(false);
  const [activeTab, setActiveTab] = useState('volume');
  const [showARStatus, setShowARStatus] = useState(false);

  const toggleAR = () => {
    setIsARActive(!isARActive);
    if (!isARActive) {
      setShowARStatus(true);
      setTimeout(() => setShowARStatus(false), 2000);
    }
  };

  const closeAR = () => {
    if (isARActive) {
      setIsARActive(false);
    } else {
      router.back();
    }
  };

  return (
    <div className={`min-h-screen text-white overflow-hidden transition-all duration-500 ${
      isARActive 
        ? 'bg-gradient-to-br from-black/80 via-blue-900/60 to-black/90' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
    }`}>
      
      {/* AR Background Effects */}
      {isARActive && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <div 
            className="absolute inset-0 opacity-100 transition-opacity duration-500"
            style={{
              backgroundImage: `
                linear-gradient(rgba(74, 158, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(74, 158, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              animation: 'gridMove 20s linear infinite'
            }}
          />
          <div className="ar-particles">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationName: 'float',
                  animationDuration: `${8 + Math.random() * 4}s`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-20 p-5 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md">
        <div className="text-blue-400 text-sm font-semibold mb-5">AR Mode</div>
        
        <button 
          onClick={closeAR}
          className="absolute top-5 left-5 w-8 h-8 bg-white/15 border border-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/25 hover:scale-110 transition-all duration-300"
        >
          ×
        </button>
        
        <button 
          onClick={toggleAR}
          className={`absolute top-5 right-5 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 backdrop-blur-md ${
            isARActive 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-green-500 hover:bg-green-600 hover:scale-105'
          }`}
        >
          {isARActive ? 'EXIT AR' : 'AR MODE'}
        </button>
      </div>

      {/* Info Panel */}
      <div className="relative z-20 mx-5 mb-5 bg-blue-900/95 backdrop-blur-md rounded-xl p-5 border border-blue-400/30 shadow-lg">
        <div className="text-blue-400 text-lg font-bold mb-1">SILINDER</div>
        <div className="text-blue-300 text-sm mb-4">Bangun Ruang 3D</div>
        
        <ul className="space-y-2">
          {[
            'Sentuh untuk mempelajari lebih',
            'Putar untuk memperview/menerjemahkan', 
            'Gunakan pinch gesture untuk melihat detail berbeda'
          ].map((text, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex items-center justify-center text-xs">
                ✓
              </div>
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* AR Viewer */}
      <div className="flex-1 relative z-10 mx-5">
        <ARViewer isARActive={isARActive} />
      </div>

      {/* Controls */}
      <ARControls activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* AR Status */}
      {showARStatus && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500/90 text-white px-8 py-4 rounded-full font-semibold backdrop-blur-md transition-opacity duration-500">
          AR Mode Activated
        </div>
      )}

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float {
          0% { 
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { 
            transform: translateY(-100px) translateX(50px);
            opacity: 0;
          }
        }
        
        .ar-particles div {
          animation-name: float;
        }
      `}</style>
    </div>
  );
}