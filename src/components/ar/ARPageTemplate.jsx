'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ARViewer from './ARViewer';
import PseudoARViewer from './PseudoARViewer';
import { hasCameraSupport } from '@/utils/arDetector';

export default function ARPageTemplate({ title, subtitle, modelSrc, modelAlt, elementsData }) {
  const router = useRouter();
  const [isARActive, setIsARActive] = useState(true); // Default AR view enabled
  const [selectedElement, setSelectedElement] = useState(null);
  const [showARStatus, setShowARStatus] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  // AR Mode States
  const [arMode, setArMode] = useState('model-viewer'); // 'model-viewer', 'pseudo', 'failed'
  const [isLaunchingAR, setIsLaunchingAR] = useState(false); // Track if AR is being launched
  const [notification, setNotification] = useState(null);
  const [arFailureHandled, setArFailureHandled] = useState(false);

  // Launch AR directly (replace toggleAR)
  const launchAR = () => {
    console.log(`[ARPageTemplate] 🚀 Launch AR clicked - Current mode: ${arMode}`);
    
    if (isLaunchingAR) {
      console.log('[ARPageTemplate] AR already launching, ignoring...');
      return;
    }
    
    setIsLaunchingAR(true);
    setArMode('model-viewer'); // Start with model-viewer attempt
    setArFailureHandled(false);
    
    console.log('[ARPageTemplate] Triggering AR launch via ARViewer...');
    
    // Trigger will be handled by ARViewer's handleARButtonClick
  };

  // Handle AR Status from Model-Viewer
  const handleARStatus = (status) => {
    console.log(`[ARPageTemplate] Model-Viewer AR Status: "${status}"`);
    
    // If AR fails and we haven't handled it yet, fallback to Pseudo-AR
    if ((status === 'not-presenting' || status === 'failed') && !arFailureHandled) {
      console.log('[ARPageTemplate] ⚠️ Model-Viewer AR FAILED - Checking Pseudo-AR fallback...');
      setArFailureHandled(true);
      
      // Check if camera is available
      if (hasCameraSupport()) {
        console.log('[ARPageTemplate] ✅ Camera available - Switching to Pseudo-AR');
        setArMode('pseudo');
        setNotification({
          type: 'warning',
          message: '⚠️ Meluncurkan AR dengan kamera perangkat Anda...'
        });
        setTimeout(() => setNotification(null), 4000);
      } else {
        console.log('[ARPageTemplate] ❌ No camera available - AR completely failed');
        setArMode('failed');
        setIsLaunchingAR(false);
        setNotification({
          type: 'error',
          message: '❌ AR tidak tersedia. Perangkat tidak mendukung AR atau akses kamera.'
        });
        setTimeout(() => setNotification(null), 5000);
      }
    } else if (status === 'session-started') {
      console.log('[ARPageTemplate] ✅ AR Native session started successfully');
      setNotification({
        type: 'success',
        message: '✅ AR berhasil diluncurkan!'
      });
      setTimeout(() => setNotification(null), 3000);
      // Note: User will be in external AR app, will auto return to this state
    }
  };

  const closeAR = () => {
    if (isLaunchingAR && arMode === 'pseudo') {
      // Exit from Pseudo-AR back to default AR view
      setIsLaunchingAR(false);
      setArMode('model-viewer');
      setArFailureHandled(false);
      console.log('[ARPageTemplate] Exited Pseudo-AR, back to default AR view');
    } else {
      // Go back to previous page
      router.back();
    }
  };

  // Stop audio when panel is closed
  const handleClosePanel = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlaying(false);
    setSelectedElement(null);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div className={`h-screen text-white overflow-hidden transition-all duration-500 flex flex-col ${
      isARActive 
        ? 'bg-gradient-to-br from-black/80 via-blue-900/60 to-black/90' 
        : 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900'
    }`}>
      
      {/* AR Background Effects - Always active since default is AR view */}
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

      {/* Header - Floating di atas AR Viewer */}
      <div className="absolute top-0 left-0 right-0 z-20 p-5">
        <button 
          onClick={closeAR}
          className="absolute top-5 left-5 w-10 h-10 bg-white/15 border border-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-md hover:bg-white/25 hover:scale-110 transition-all duration-300 text-xl"
        >
          ×
        </button>
        
        {/* Show different buttons based on AR state */}
        {isLaunchingAR && arMode === 'pseudo' ? (
          <button 
            onClick={() => {
              console.log('[ARPageTemplate] Exit AR clicked');
              setIsLaunchingAR(false);
              setArMode('model-viewer');
              setArFailureHandled(false);
            }}
            className="absolute top-5 right-5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 backdrop-blur-md bg-red-500 hover:bg-red-600 animate-pulse"
          >
            ❌ EXIT AR
          </button>
        ) : (
          <button 
            onClick={launchAR}
            disabled={isLaunchingAR}
            className={`absolute top-5 right-5 px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 backdrop-blur-md ${
              isLaunchingAR
                ? 'bg-gray-500 cursor-wait' 
                : 'bg-green-500 hover:bg-green-600 hover:scale-105 animate-pulse'
            }`}
          >
            {isLaunchingAR ? '⏳ LAUNCHING...' : '🚀 LAUNCH AR'}
          </button>
        )}
      </div>

      {/* AR Viewer - Full Screen dengan transisi smooth saat panel muncul */}
      <div 
        className="relative z-10 w-full flex-1 transition-all duration-500 ease-out"
        style={{
          marginBottom: selectedElement ? '400px' : '0'
        }}
      >
        {!isLaunchingAR || arMode === 'model-viewer' ? (
          <ARViewer 
            isARActive={isARActive} 
            modelSrc={modelSrc} 
            modelAlt={modelAlt} 
            elementsData={elementsData}
            onHotspotClick={(element) => {
              console.log('[ARPageTemplate] Hotspot clicked:', element.label);
              setSelectedElement(element);
            }}
            selectedElement={selectedElement}
            onARStatusChange={handleARStatus}
            shouldLaunchAR={isLaunchingAR && arMode === 'model-viewer'}
          />
        ) : arMode === 'pseudo' ? (
          <PseudoARViewer
            modelSrc={modelSrc}
            elementsData={elementsData}
            onHotspotClick={(element) => {
              console.log('[ARPageTemplate] Pseudo-AR Hotspot clicked:', element.label);
              setSelectedElement(element);
            }}
            selectedElement={selectedElement}
            onCameraReady={() => {
              console.log('[ARPageTemplate] ✅ Pseudo-AR camera ready');
              setNotification({
                type: 'success',
                message: '✅ AR Mode aktif! Gunakan gesture untuk berinteraksi.'
              });
              setTimeout(() => setNotification(null), 3000);
            }}
            onCameraError={(error) => {
              console.error('[ARPageTemplate] ❌ Pseudo-AR camera error:', error);
              setArMode('failed');
              setIsLaunchingAR(false);
              setNotification({
                type: 'error',
                message: `❌ ${error}`
              });
            }}
          />
        ) : arMode === 'failed' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center bg-red-500/20 border-2 border-red-500 rounded-xl p-8 max-w-md mx-4">
              <span className="text-5xl mb-4 block">❌</span>
              <h3 className="text-xl font-bold mb-2">AR Tidak Tersedia</h3>
              <p className="text-sm text-gray-300 mb-4">
                Perangkat Anda tidak mendukung:
              </p>
              <ul className="text-left text-sm text-gray-400 space-y-2 mb-6">
                <li>• AR (WebXR/ARKit/ARCore/Scene Viewer)</li>
                <li>• Akses kamera perangkat</li>
              </ul>
              <button
                onClick={() => {
                  setIsLaunchingAR(false);
                  setArMode('model-viewer');
                  setArFailureHandled(false);
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
              >
                Kembali
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Element Info Panel - Muncul dengan animasi saat hotspot diklik */}
      {selectedElement && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-30 border-t-2 border-blue-400/50 shadow-2xl animate-slide-up ${
            arMode === 'pseudo' 
              ? 'bg-gradient-to-t from-blue-900/70 via-blue-800/60 to-transparent backdrop-blur-lg' 
              : 'bg-gradient-to-t from-blue-900/98 via-blue-800/95 to-transparent backdrop-blur-xl'
          }`}
          style={{
            animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}
        >
          <div className="relative max-w-4xl mx-auto p-6 pb-8">
            {/* Close Button */}
            <button
              onClick={handleClosePanel}
              className="absolute top-4 right-4 w-8 h-8 bg-white/10 border border-white/30 rounded-full flex items-center justify-center hover:bg-white/20 transition-all"
            >
              ×
            </button>

            {/* Icon & Title */}
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                style={{ backgroundColor: selectedElement.color + '30', border: `2px solid ${selectedElement.color}` }}
              >
                {selectedElement.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedElement.title}</h3>
                <div className="text-blue-300 text-sm">{selectedElement.label}</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-blue-100 text-sm leading-relaxed mb-4">
              {selectedElement.description}
            </p>

            {/* Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {selectedElement.properties.map((prop, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 bg-white/5 rounded-lg p-3 border border-white/10"
                >
                  <span className="text-green-400 text-sm">✓</span>
                  <span className="text-blue-200 text-sm">{prop}</span>
                </div>
              ))}
            </div>

            {/* Audio Player */}
            {selectedElement.audioUrl && (
              <button
                onClick={() => {
                  // Stop previous audio if exists
                  if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                  }
                  
                  // Create and play new audio
                  const audio = new Audio(selectedElement.audioUrl);
                  audioRef.current = audio;
                  audio.play();
                  setIsPlaying(true);
                  
                  audio.onended = () => {
                    setIsPlaying(false);
                    audioRef.current = null;
                  };
                }}
                className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isPlaying 
                    ? 'bg-red-500/80 hover:bg-red-600/80' 
                    : 'bg-blue-500/80 hover:bg-blue-600/80'
                }`}
              >
                <span className="text-xl">{isPlaying ? '⏸️' : '🔊'}</span>
                <span>{isPlaying ? 'Mendengarkan...' : 'Putar Penjelasan Audio'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* AR Status */}
      {showARStatus && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-green-500/90 text-white px-8 py-4 rounded-full font-semibold backdrop-blur-md transition-opacity duration-500">
          AR Mode Activated
        </div>
      )}

      {/* AR Detection Notification */}
      {notification && (
        <div className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-xl font-medium backdrop-blur-md shadow-2xl border-2 transition-all duration-500 max-w-md text-center ${
          notification.type === 'success' 
            ? 'bg-green-500/90 border-green-300 text-white' 
            : notification.type === 'warning'
            ? 'bg-yellow-500/90 border-yellow-300 text-white'
            : 'bg-red-500/90 border-red-300 text-white'
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : '❌'}
            </span>
            <p className="text-sm leading-relaxed">{notification.message}</p>
          </div>
        </div>
      )}

      {/* AR Mode Indicator (Only show when AR is active) */}
      {isLaunchingAR && arMode === 'pseudo' && (
        <div className="fixed bottom-4 right-4 z-40 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-xs font-medium border border-white/20">
          <span className="inline-block w-2 h-2 rounded-full mr-2 bg-green-400 animate-pulse"></span>
          AR Mode Active
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
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(100%);
            opacity: 0;
          }
        }
        
        .ar-particles div {
          animation-name: float;
        }

        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
