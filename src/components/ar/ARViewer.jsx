'use client';
import { useEffect, useRef } from 'react';

export default function ARViewer({ isARActive }) {
  const modelViewerRef = useRef();
  const hotspots = [
  {
    id: 'height',
    position: '-1 2m 0m',   // sisi kanan, sepanjang tinggi
    normal: '0 0 1',
    label: 'h = tinggi silinder'
  },
  {
    id: 'radius',
    position: '0 1m 0',      // arah horizontal dari pusat alas
    normal: '1 0 0',
    label: 'r = jari-jari alas'
  },
  {
    id: 'volume',
    position: '0 2m 0',      // tengah silinder
    normal: '0 1 0',
    label: 'V = π × r² × h'
  },
  {
    id: 'surface',
    position: '0 1m -1m',  // sisi kiri tengah
    normal: '-1 0 0',
    label: 'L = 2πr(r + h)'
  }
];


  useEffect(() => {
    // Load model-viewer dynamically
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

  const handleHotspotClick = (hotspotId, index) => {
    console.log(`Hotspot ${hotspotId} clicked`);
  };

  return (
    <div className={`relative h-96 transition-all duration-500 ${
      isARActive ? 'transform scale-110 drop-shadow-2xl' : ''
    }`}>
      <model-viewer
        ref={modelViewerRef}
        src="/models/Cylinder.glb"
        alt="Silinder 3D"
        camera-controls
        auto-rotate
        auto-rotate-delay="3000"
        rotation-per-second="15deg"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-orbit="45deg 75deg 4m"
        field-of-view="30deg"
        min-camera-orbit="auto auto 2m"
        max-camera-orbit="auto auto 10m"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        shadow-softness="0.5"
        className="w-full h-full bg-transparent"
        style={{
          '--poster-color': 'transparent'
        }}
      >
        {hotspots.map((hotspot, index) => (
          <button
            key={hotspot.id}
            slot={`hotspot-${hotspot.id}`}
            className={`hotspot ${isARActive ? 'ar-active' : ''}`}
            data-position={hotspot.position}
            data-normal={hotspot.normal}
            data-visibility-attribute="visible"
            onClick={() => handleHotspotClick(hotspot.id, index)}
          >
            <div className="annotation">{hotspot.label}</div>
          </button>
        ))}
      </model-viewer>

      <style jsx>{`
        .hotspot {
          background: rgba(74, 158, 255, 0.9);
          border: 2px solid #4A9EFF;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          box-shadow: 
            0 0 20px rgba(74, 158, 255, 0.5),
            0 0 40px rgba(74, 158, 255, 0.3);
          transition: all 0.3s ease;
          animation: pulse-enhanced 3s infinite ease-in-out;
        }

        .hotspot:hover {
          transform: scale(1.2);
          box-shadow: 
            0 0 30px rgba(74, 158, 255, 0.8),
            0 0 60px rgba(74, 158, 255, 0.5);
        }

        .hotspot::before {
          content: '';
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.8);
        }

        .hotspot.ar-active {
          animation: pulse-enhanced 2s infinite ease-in-out;
          box-shadow: 
            0 0 30px rgba(74, 158, 255, 0.8),
            0 0 60px rgba(74, 158, 255, 0.6),
            0 0 90px rgba(74, 158, 255, 0.4);
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
            box-shadow: 0 0 20px rgba(74, 158, 255, 0.5), 0 0 40px rgba(74, 158, 255, 0.3);
          }
          50% { 
            transform: scale(1.15); 
            box-shadow: 0 0 40px rgba(74, 158, 255, 0.8), 0 0 80px rgba(74, 158, 255, 0.5);
          }
          100% { 
            transform: scale(1); 
            box-shadow: 0 0 20px rgba(74, 158, 255, 0.5), 0 0 40px rgba(74, 158, 255, 0.3);
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