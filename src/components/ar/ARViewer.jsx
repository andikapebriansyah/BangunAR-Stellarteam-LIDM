'use client';
import { useEffect, useRef, useState } from 'react';

export default function ARViewer({ isARActive, modelSrc, modelAlt, elementsData, onHotspotClick, selectedElement }) {
  const modelViewerRef = useRef();
  const [viewMode, setViewMode] = useState('default'); // default, top, front, side

  const viewModes = {
    default: { orbit: '45deg 75deg 3.5m', fov: '35deg', label: 'Default' },
    top: { orbit: '0deg 90deg 3.5m', fov: '35deg', label: 'Top View' },
    front: { orbit: '0deg 75deg 3.5m', fov: '35deg', label: 'Front View' },
    side: { orbit: '90deg 75deg 3.5m', fov: '35deg', label: 'Side View' },
    close: { orbit: '45deg 75deg 2.5m', fov: '45deg', label: 'Close Up' }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    if (modelViewerRef.current) {
      const viewer = modelViewerRef.current;
      const mode = viewModes[viewMode];
      viewer.cameraOrbit = mode.orbit;
      viewer.fieldOfView = mode.fov;
    }
  }, [viewMode]);

  const handleHotspotClick = (element) => {
    onHotspotClick(element);
  };

  const cycleViewMode = () => {
    const modes = Object.keys(viewModes);
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };



  // Handle AR button click
  const handleARButtonClick = () => {
    const arButton = document.getElementById('ar-button-trigger');
    if (arButton) {
      arButton.click();
    }
  };

  return (
    <div className={`relative w-full h-full transition-all duration-500 ${
      isARActive ? 'transform scale-105 drop-shadow-2xl' : ''
    }`}>
      {/* View Mode Toggle Button - positioned to avoid header */}
      {!isARActive && (
        <button
          onClick={cycleViewMode}
          className="absolute bottom-4 right-4 z-20 bg-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 shadow-lg"
        >
          <span className="text-sm">👁️</span>
          <span className="text-xs font-medium">{viewModes[viewMode].label}</span>
        </button>
      )}

      {/* AR Launch Button - positioned at bottom */}
      {isARActive && (
        <div className="absolute bottom-20 left-0 right-0 flex justify-center z-30 pointer-events-none">
          <button
            onClick={handleARButtonClick}
            className="pointer-events-auto bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-4 px-8 rounded-full shadow-2xl flex items-center gap-3 animate-bounce"
          >
            <span className="text-2xl">📱</span>
            <span>Launch AR</span>
          </button>
        </div>
      )}

      <model-viewer
        ref={modelViewerRef}
        src={modelSrc}
        alt={modelAlt}
        camera-controls
        touch-action="none"
        auto-rotate
        auto-rotate-delay="3000"
        rotation-per-second="15deg"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-orbit="45deg 75deg 3.5m"
        field-of-view="35deg"
        min-camera-orbit="auto auto 2m"
        max-camera-orbit="auto auto 8m"
        shadow-intensity="0"
        environment-image="neutral"
        skybox-image=""
        exposure="2
        "
        shadow-softness="0"
        interaction-prompt="none"
        className="w-full h-full bg-transparent"
        style={{
          '--poster-color': 'transparent',
          filter: 'saturate(1.3) brightness(1.1)'
        }}
        
      >
        {/* Custom AR Button (hidden, triggered programmatically) */}
        <button
          slot="ar-button"
          id="ar-button-trigger"
          style={{ display: 'none' }}
        >
          Launch AR
        </button>

        {elementsData?.map((element) => (
          <button
            key={element.id}
            slot={`hotspot-${element.id}`}
            className={`hotspot ${isARActive ? 'ar-active' : ''} ${selectedElement?.id === element.id ? 'selected' : ''}`}
            data-position={element.position}
            data-normal={element.normal}
            data-visibility-attribute="visible"
            onClick={() => handleHotspotClick(element)}
            style={{
              '--hotspot-color': element.color
            }}
          >
            <div className="annotation">{element.label}</div>
          </button>
        ))}
      </model-viewer>

      <style jsx>{`
        .hotspot {
          background: var(--hotspot-color, rgba(74, 158, 255, 0.9));
          border: 2px solid var(--hotspot-color, #4A9EFF);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          box-shadow: 
            0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)),
            0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          transition: all 0.3s ease;
          animation: pulse-enhanced 3s infinite ease-in-out;
        }

        .hotspot:hover {
          transform: scale(1.3);
          box-shadow: 
            0 0 30px var(--hotspot-color, rgba(74, 158, 255, 0.8)),
            0 0 60px var(--hotspot-color, rgba(74, 158, 255, 0.5));
        }

        .hotspot.selected {
          transform: scale(1.4);
          animation: pulse-selected 1.5s infinite ease-in-out;
          box-shadow: 
            0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)),
            0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          border-width: 3px;
        }

        .hotspot::before {
          content: '';
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.9);
        }

        .hotspot.ar-active {
          animation: pulse-enhanced 2s infinite ease-in-out;
          box-shadow: 
            0 0 30px var(--hotspot-color, rgba(74, 158, 255, 0.8)),
            0 0 60px var(--hotspot-color, rgba(74, 158, 255, 0.6)),
            0 0 90px var(--hotspot-color, rgba(74, 158, 255, 0.4));
        }

        .annotation {
          position: absolute;
          background: rgba(20, 30, 50, 0.98);
          backdrop-filter: blur(10px);
          border: 1px solid #4A9EFF;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          color: white;
          white-space: nowrap;
          pointer-events: none;
          top: -55px;
          left: 50%;
          transform: translateX(-50%);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          z-index: 1000;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .hotspot:hover .annotation {
          opacity: 1;
        }

        .annotation::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-top-color: #4A9EFF;
        }

        .hotspot.ar-active .annotation {
          background: rgba(20, 30, 50, 0.98);
          border: 2px solid #4A9EFF;
          box-shadow: 0 0 40px rgba(74, 158, 255, 0.6);
        }

        @keyframes pulse-enhanced {
          0% { 
            transform: scale(1); 
            box-shadow: 0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)), 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.8)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.5));
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)), 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          }
        }

        @keyframes pulse-selected {
          0% { 
            transform: scale(1.4); 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          }
          50% { 
            transform: scale(1.5); 
            box-shadow: 0 0 60px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 120px var(--hotspot-color, rgba(74, 158, 255, 0.8));
          }
          100% { 
            transform: scale(1.4); 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          }
        }

        @media (max-width: 768px) {
          .hotspot {
            width: 24px;
            height: 24px;
          }
          
          .annotation {
            font-size: 12px;
            padding: 8px 12px;
          }
        }
      `}</style>
    </div>
  );
}
