'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { isDesktopDevice } from '@/utils/arDetector';

export default function PseudoARViewer({ 
  modelSrc, 
  elementsData, 
  onHotspotClick, 
  selectedElement,
  onCameraReady,
  onCameraError 
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const modelRef = useRef(null);
  const modelGroupRef = useRef(null); // Group for model positioning
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const hotspotRefs = useRef([]);
  const isDraggingRef = useRef(false);
  const previousTouchRef = useRef({ x: 0, y: 0 });
  const [instructionText, setInstructionText] = useState('');

  // Set instruction text based on device
  useEffect(() => {
    const isDesktop = isDesktopDevice();
    if (isDesktop) {
      setInstructionText('🖱️ Klik Kiri: Putar | Klik Kanan: Pindah | Scroll: Zoom');
    } else {
      setInstructionText('👆 1 Jari: Putar | 2 Jari: Pindah & Zoom');
    }
  }, []);

  useEffect(() => {
    console.log('[Pseudo-AR] Initializing Pseudo-AR Mode...');
    
    // 1. Setup Camera
    const startCamera = async () => {
      try {
        console.log('[Pseudo-AR] Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          console.log('[Pseudo-AR] ✅ Camera stream started successfully');
          if (onCameraReady) onCameraReady();
        }
      } catch (error) {
        console.error('[Pseudo-AR] ❌ Camera access error:', error);
        const errorMsg = error.name === 'NotAllowedError' 
          ? 'Izin kamera ditolak. Silakan aktifkan di pengaturan browser.' 
          : error.name === 'NotFoundError'
          ? 'Kamera tidak ditemukan di perangkat Anda.'
          : 'Tidak dapat mengakses kamera. Pastikan kamera tersedia.';
        
        setCameraError(errorMsg);
        if (onCameraError) onCameraError(errorMsg);
      }
    };

    // 2. Setup Three.js Scene
    const setupThreeJS = () => {
      console.log('[Pseudo-AR] Setting up Three.js scene...');
      
      if (!canvasRef.current || !containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // Scene
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 1.5, 4);
      cameraRef.current = camera;

      // Renderer with transparent background
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;
      rendererRef.current = renderer;

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 0.8);
      backLight.position.set(-5, 3, -5);
      scene.add(backLight);

      // Controls - Enable pan for dragging model
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enablePan = true; // Enable panning
      controls.screenSpacePanning = true; // Pan in screen space
      controls.minDistance = 2;
      controls.maxDistance = 8;
      controls.maxPolarAngle = Math.PI / 1.5;
      controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN
      };
      controls.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN
      };
      controlsRef.current = controls;

      console.log('[Pseudo-AR] ✅ Three.js scene setup complete');

      // Load Model
      loadModel(scene);

      // Animation Loop
      const animate = () => {
        requestAnimationFrame(animate);
        
        // Update controls
        controls.update();
        
        // Update hotspot positions BEFORE rendering
        // This ensures hotspots are synced with model position
        updateHotspotPositions();
        
        // Render scene
        renderer.render(scene, camera);
      };
      animate();

      // Handle Resize
      const handleResize = () => {
        if (!containerRef.current || !renderer || !camera) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        renderer.dispose();
        controls.dispose();
      };
    };

    // 3. Load 3D Model
    const loadModel = (scene) => {
      console.log('[Pseudo-AR] Loading 3D model:', modelSrc);
      
      const loader = new GLTFLoader();
      loader.load(
        modelSrc,
        (gltf) => {
          const model = gltf.scene;
          
          // Create a group to hold the model (for easier positioning)
          const modelGroup = new THREE.Group();
          modelGroupRef.current = modelGroup;
          
          // Scale and position model
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.multiplyScalar(scale);

          // Center model in the group
          const center = box.getCenter(new THREE.Vector3());
          model.position.sub(center.multiplyScalar(scale));

          modelGroup.add(model);
          scene.add(modelGroup);
          modelRef.current = model;
          
          console.log('[Pseudo-AR] ✅ 3D model loaded successfully');
          setIsLoading(false);
        },
        (progress) => {
          const percent = (progress.loaded / progress.total) * 100;
          console.log(`[Pseudo-AR] Loading model: ${percent.toFixed(1)}%`);
        },
        (error) => {
          console.error('[Pseudo-AR] ❌ Model loading error:', error);
          setIsLoading(false);
        }
      );
    };

    // 4. Update Hotspot Positions (with proper matrix transform)
    const updateHotspotPositions = () => {
      if (!cameraRef.current || !rendererRef.current || !modelRef.current) return;

      const camera = cameraRef.current;
      const canvas = rendererRef.current.domElement;

      // Force matrix update to get latest transform
      if (modelRef.current.parent) {
        modelRef.current.parent.updateMatrixWorld(true);
      }
      modelRef.current.updateMatrixWorld(true);

      elementsData.forEach((element, index) => {
        const hotspotElement = hotspotRefs.current[index];
        if (!hotspotElement) return;

        // Parse position from string "0 2m 0" -> [0, 2, 0]
        const pos = element.position.split(' ').map(p => parseFloat(p.replace('m', '')));
        
        // Create world position in model's local space
        const localPos = new THREE.Vector3(pos[0], pos[1], pos[2]);
        
        // Apply model's world matrix to get actual world position
        const worldPos = localPos.applyMatrix4(modelRef.current.matrixWorld);

        // Project to screen space
        const screenPos = worldPos.clone();
        screenPos.project(camera);
        
        // Convert normalized device coordinates to pixel coordinates
        const x = (screenPos.x * 0.5 + 0.5) * canvas.clientWidth;
        const y = (screenPos.y * -0.5 + 0.5) * canvas.clientHeight;

        // Check if behind camera (z > 1) or too far in front (z < -1)
        if (screenPos.z > 1 || screenPos.z < -1) {
          hotspotElement.style.display = 'none';
        } else {
          hotspotElement.style.display = 'flex';
          
          // Use transform for better performance (no layout reflow)
          hotspotElement.style.left = `${x}px`;
          hotspotElement.style.top = `${y}px`;
          
          // Scale hotspot based on distance (closer = bigger)
          const distance = camera.position.distanceTo(worldPos);
          const scale = Math.max(0.5, Math.min(1.5, 5 / distance));
          hotspotElement.style.transform = `translate(-50%, -50%) scale(${scale})`;
        }
      });
    };

    startCamera();
    const cleanup = setupThreeJS();

    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        console.log('[Pseudo-AR] Camera stream stopped');
      }
      if (cleanup) cleanup();
    };
  }, [modelSrc, elementsData]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-black"
    >
      {/* Camera Video Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Three.js Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'auto' }}
      />

      {/* Hotspots Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {elementsData.map((element, index) => (
          <button
            key={element.id}
            ref={(el) => (hotspotRefs.current[index] = el)}
            onClick={() => onHotspotClick(element)}
            className={`absolute pointer-events-auto hotspot-pseudo ${
              selectedElement?.id === element.id ? 'selected' : ''
            }`}
            style={{
              '--hotspot-color': element.color,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="annotation">{element.label}</div>
          </button>
        ))}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-medium">Loading 3D Model...</p>
          </div>
        </div>
      )}

      {/* Camera Error */}
      {cameraError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-50 p-6">
          <div className="bg-red-500/20 border-2 border-red-500 rounded-xl p-6 max-w-md text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-bold text-white mb-2">Camera Error</h3>
            <p className="text-red-200 text-sm">{cameraError}</p>
          </div>
        </div>
      )}

      {/* AR Instructions - Dynamic based on device */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-blue-500/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium pointer-events-none">
        {instructionText}
      </div>

      <style jsx>{`
        .hotspot-pseudo {
          background: var(--hotspot-color, rgba(74, 158, 255, 0.9));
          border: 2px solid var(--hotspot-color, #4A9EFF);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: absolute;
          box-shadow: 
            0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)),
            0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          transition: all 0.3s ease;
          animation: pulse-enhanced 3s infinite ease-in-out;
          transform-origin: center center;
        }

        .hotspot-pseudo:hover {
          box-shadow: 
            0 0 30px var(--hotspot-color, rgba(74, 158, 255, 0.8)),
            0 0 60px var(--hotspot-color, rgba(74, 158, 255, 0.5));
        }

        .hotspot-pseudo.selected {
          animation: pulse-selected 1.5s infinite ease-in-out;
          box-shadow: 
            0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)),
            0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          border-width: 3px;
        }

        .hotspot-pseudo::before {
          content: '';
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255,255,255,0.9);
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

        .hotspot-pseudo:hover .annotation {
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

        @keyframes pulse-enhanced {
          0% { 
            box-shadow: 0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)), 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          }
          50% { 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.8)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.5));
          }
          100% { 
            box-shadow: 0 0 20px var(--hotspot-color, rgba(74, 158, 255, 0.5)), 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 0.3));
          }
        }

        @keyframes pulse-selected {
          0% { 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          }
          50% { 
            box-shadow: 0 0 60px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 120px var(--hotspot-color, rgba(74, 158, 255, 0.8));
          }
          100% { 
            box-shadow: 0 0 40px var(--hotspot-color, rgba(74, 158, 255, 1)), 0 0 80px var(--hotspot-color, rgba(74, 158, 255, 0.7));
          }
        }
      `}</style>
    </div>
  );
}
