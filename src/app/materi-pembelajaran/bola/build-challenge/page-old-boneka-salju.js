'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Suspense } from 'react';
import Link from 'next/link';

// Tentukan cetak biru (blueprint) untuk boneka salju
const levelBlueprint = {
  name: 'Boneka Salju dari Tiga Bola',
  blueprint: [
    { type: 'sphere_large', position: new THREE.Vector3(0, 0.5, 0), color: 0xF0F8FF, radius: 1.0 }, // Bola besar (dasar)
    { type: 'sphere_medium', position: new THREE.Vector3(0, 1.8, 0), color: 0xE6E6FA, radius: 0.7 }, // Bola sedang (badan)
    { type: 'sphere_small', position: new THREE.Vector3(0, 2.8, 0), color: 0xFFFAF0, radius: 0.5 }, // Bola kecil (kepala)
  ],
  limits: { sphere_large: 1, sphere_medium: 1, sphere_small: 1 }
};

// Main App Component
export default function BolaBuildChallenge() {
  const router = useRouter();
  
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih bola dan susun menjadi boneka salju!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [placedObjectCounts, setPlacedObjectCounts] = useState({ sphere_large: 0, sphere_medium: 0, sphere_small: 0 });
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedObjectInfo, setSelectedObjectInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [rendererReady, setRendererReady] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fps, setFps] = useState(0);

  // 3D Scene Refs
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerRef = useRef(new THREE.Vector2());
  const draggableObjectsRef = useRef([]);
  const groundPlaneRef = useRef(null);
  const targetGroupRef = useRef(null);
  const draggedObjectRef = useRef(null);
  const dragPlaneRef = useRef(new THREE.Plane());

  // Function to create a mesh based on type and scale
  const createMesh = useCallback((type, color, scale) => {
    let geometry;
    let radius;
    
    if (type === 'sphere_large') {
      radius = 1.0 * scale;
      geometry = new THREE.SphereGeometry(radius, 32, 16);
    } else if (type === 'sphere_medium') {
      radius = 0.7 * scale;
      geometry = new THREE.SphereGeometry(radius, 32, 16);
    } else if (type === 'sphere_small') {
      radius = 0.5 * scale;
      geometry = new THREE.SphereGeometry(radius, 32, 16);
    }
    
    // Material dengan efek winter untuk boneka salju
    const material = new THREE.MeshPhongMaterial({ 
      color,
      shininess: 30,
      transparent: false,
      emissive: new THREE.Color(color).multiplyScalar(0.05)
    });
      
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.radius = radius;
    mesh.userData.scale = scale;
    
    if (!isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }, [isMobile]);
  
  // Calculate volume and surface area
  const getObjectCalculations = useCallback((object) => {
    const scale = object.userData.scale;
    let volume, surfaceArea;
    
    const radius = object.userData.radius;
    
    // Sphere calculations
    volume = (4/3) * Math.PI * Math.pow(radius, 3);
    surfaceArea = 4 * Math.PI * Math.pow(radius, 2);
    
    return {
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
      radius: radius.toFixed(2),
      diameter: (radius * 2).toFixed(2)
    };
  }, []);

  // Handle client-side mounting and mobile detection
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scene setup
  useEffect(() => {
    if (!isMounted) return;
    
    const mount = mountRef.current;
    if (!mount) return;

    let resizeObserver;
    let intersectionObserver;
    let animationId;

    const onWindowResize = () => {
      const renderer = rendererRef.current;
      const camera = cameraRef.current;
      if (!mount || !camera || !renderer) return;
      
      const rect = mount.getBoundingClientRect();
      const width = rect.width || mount.clientWidth || mount.offsetWidth;
      const height = rect.height || mount.clientHeight || mount.offsetHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const initTimeout = setTimeout(() => {
      if (!mount || !mountRef.current) return;
      
      const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2) : 1;
      
      const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile,
        alpha: true,
        powerPreference: "low-power"
      });
      renderer.setPixelRatio(pixelRatio);
      
      const rect = mount.getBoundingClientRect();
      const width = rect.width || mount.clientWidth || mount.offsetWidth;
      const height = rect.height || mount.clientHeight || mount.offsetHeight;
      
      renderer.setSize(width, height);
    
    if (!isMobile) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      renderer.shadowMap.enabled = false;
    }
    
    renderer.setClearColor(0x87CEEB, 1); // Sky blue winter background
    rendererRef.current = renderer;
    
    if (mount && mountRef.current) {
      mount.appendChild(renderer.domElement);
      setRendererReady(true);
    }

    const scene = sceneRef.current;
    
    // Create winter background
    const createWinterBackground = () => {
      const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
      const skyMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x87CEEB, 
        side: THREE.BackSide 
      });
      const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(skyMesh);
    };

    createWinterBackground();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    if (!isMobile) {
      directionalLight.castShadow = true;
      directionalLight.shadow.camera.near = 0.1;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -10;
      directionalLight.shadow.camera.right = 10;
      directionalLight.shadow.camera.top = 10;
      directionalLight.shadow.camera.bottom = -10;
    }
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    if (!isMobile) ground.receiveShadow = true;
    scene.add(ground);
    groundPlaneRef.current = ground;

    // Camera setup
    const camera = cameraRef.current;
    camera.aspect = width / height;
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;
    controls.autoRotate = false;
    controls.target.set(0, 0, 0);
    
    controls.addEventListener('change', () => {
      // No-op, just to keep the same structure as tabung
    });
    
    controlsRef.current = controls;

    // Target blueprint rendering
    const renderTargetBlueprint = () => {
      if (targetGroupRef.current) {
        scene.remove(targetGroupRef.current);
      }

      const targetGroup = new THREE.Group();
      const blueprint = levelBlueprint.blueprint;

      blueprint.forEach(item => {
        const geometry = new THREE.SphereGeometry(item.radius, 32, 16);
        const material = new THREE.MeshBasicMaterial({
          color: item.color,
          transparent: true,
          opacity: 0.3,
          wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(item.position);
        mesh.userData = {
          type: item.type,
          radius: item.radius,
          isTarget: true
        };

        targetGroup.add(mesh);
      });

      scene.add(targetGroup);
      targetGroupRef.current = targetGroup;
    };

    renderTargetBlueprint();

    // Animation loop
    let lastTime = 0;
    const fpsInterval = 1000; // Update FPS every second
    let fpsLastTime = 0;
    let fpsFrameCount = 0;

    const animate = (time) => {
      animationId = requestAnimationFrame(animate);
      
      // FPS calculation
      fpsFrameCount++;
      if (time - fpsLastTime >= fpsInterval) {
        const currentFps = Math.round((fpsFrameCount * 1000) / (time - fpsLastTime));
        setFps(currentFps);
        fpsFrameCount = 0;
        fpsLastTime = time;
      }
      
      if (controls) controls.update();
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };
    
    animate(0);
    setIsLoading3D(false);

    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer && mount && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
    };
  }, [isMounted, isMobile]);

  // Mouse and touch interactions
  useEffect(() => {
    if (!rendererReady || !sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const raycaster = raycasterRef.current;
    const pointer = pointerRef.current;
    const dragPlane = dragPlaneRef.current;

    const intersectionPoint = new THREE.Vector3();
    const offset = new THREE.Vector3();
    
    let isDragging = false;

    const onPointerDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      
      const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
      const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
      
      if (!clientX && clientX !== 0 || !clientY && clientY !== 0) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObjects(draggableObjectsRef.current, false);
      
      if (intersects.length > 0) {
        isDragging = true;
        controls.enabled = false;
        draggedObjectRef.current = intersects[0].object;
        
        draggedObjectRef.current.material.emissive.setHex(0x222222);
        
        const info = getObjectCalculations(draggedObjectRef.current);
        setSelectedObjectInfo({
          type: draggedObjectRef.current.userData.type,
          ...info
        });
        
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, draggedObjectRef.current.position);
        
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
          offset.copy(intersectionPoint).sub(draggedObjectRef.current.position);
        }
      } else {
        setSelectedObjectInfo(null);
        controls.enabled = true;
        isDragging = false;
        draggedObjectRef.current = null;
      }
    };

    const onPointerMove = (event) => {
      if (!draggedObjectRef.current || !isDragging) return;

      event.preventDefault();
      event.stopPropagation();
      
      const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
      const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
      
      if (!clientX && clientX !== 0 || !clientY && clientY !== 0) return;

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      
      const newPosition = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(dragPlane, newPosition)) {
        newPosition.sub(offset);
        
        const wallBoundary = 14;
        newPosition.x = Math.max(-wallBoundary, Math.min(wallBoundary, newPosition.x));
        newPosition.y = Math.max(0.3, Math.min(8, newPosition.y));
        newPosition.z = Math.max(-wallBoundary, Math.min(wallBoundary, newPosition.z));
        
        const snapTolerance = 1.0;
        const blueprint = levelBlueprint.blueprint;
        
        let snapped = false;
        blueprint.forEach((blueprintItem, index) => {
          if (targetGroupRef.current?.children[index]) {
            const ghostObject = targetGroupRef.current.children[index];
            const dist = newPosition.distanceTo(ghostObject.position);
            
            if (dist < snapTolerance && draggedObjectRef.current.userData.type === blueprintItem.type) {
              draggedObjectRef.current.position.copy(ghostObject.position);
              snapped = true;
            }
          }
        });
        
        if (!snapped) {
          draggedObjectRef.current.position.copy(newPosition);
        }
      }
    };

    const onPointerUp = (event) => {
      if (isDragging && draggedObjectRef.current) {
        draggedObjectRef.current.material.emissive.setHex(0x000000);
        isDragging = false;
        draggedObjectRef.current = null;
      }
      
      controls.enabled = true;
    };
    
    if (!renderer || !renderer.domElement) return;
    
    const domElement = renderer.domElement;
    
    domElement.addEventListener('mousedown', onPointerDown, false);
    domElement.addEventListener('mousemove', onPointerMove, false);
    domElement.addEventListener('mouseup', onPointerUp, false);
    
    const onTouchStart = (event) => {
      if (event.touches.length > 1) { 
        controls.enabled = true; 
        return; 
      }
      const touch = event.touches[0];
      onPointerDown({ 
        clientX: touch.clientX, 
        clientY: touch.clientY,
        preventDefault: () => event.preventDefault(),
        stopPropagation: () => event.stopPropagation()
      });
    };
    
    const onTouchMove = (event) => {
      if (!draggedObjectRef.current) return;
      event.preventDefault();
      const touch = event.touches[0];
      onPointerMove({ 
        clientX: touch.clientX, 
        clientY: touch.clientY,
        preventDefault: () => event.preventDefault(),
        stopPropagation: () => event.stopPropagation()
      });
    };
    
    const onTouchEnd = () => {
      onPointerUp();
    };
    
    domElement.addEventListener('touchstart', onTouchStart, { passive: false });
    domElement.addEventListener('touchmove', onTouchMove, { passive: false });
    domElement.addEventListener('touchend', onTouchEnd, false);

    return () => {
      if (domElement) {
        domElement.removeEventListener('mousedown', onPointerDown);
        domElement.removeEventListener('mousemove', onPointerMove);
        domElement.removeEventListener('mouseup', onPointerUp);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove', onTouchMove);
        domElement.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [rendererReady, getObjectCalculations]);

  // Helper function untuk generate random spawn position
  const getRandomSpawnPosition = useCallback((targetType) => {
    const blueprint = levelBlueprint.blueprint;
    const targetItem = blueprint.find(item => item.type === targetType);
    
    if (!targetItem) {
      return targetType === 'sphere_large' ? { x: 2, y: 0.75, z: 2 } 
           : targetType === 'sphere_medium' ? { x: -2, y: 2.1, z: 2 }
           : { x: 0, y: 3.2, z: 2 };
    }
    
    const ghostPos = {
      x: targetItem.position.x * selectedSize,
      y: targetItem.position.y * selectedSize,
      z: targetItem.position.z * selectedSize
    };
    
    const minDistance = 3;
    const maxDistance = 5;
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const randomX = ghostPos.x + Math.cos(angle) * distance;
    const randomZ = ghostPos.z + Math.sin(angle) * distance;
    
    const wallBoundary = 13;
    const clampedX = Math.max(-wallBoundary, Math.min(wallBoundary, randomX));
    const clampedZ = Math.max(-wallBoundary, Math.min(wallBoundary, randomZ));
    
    const spawnY = targetType === 'sphere_large' ? 0.75 
                  : targetType === 'sphere_medium' ? 2.1 
                  : 3.2;
    
    return {
      x: clampedX,
      y: spawnY,
      z: clampedZ
    };
  }, [selectedSize]);

  // Add sphere functions

  const addSphereLarge = useCallback(() => {
    if (placedObjectCounts.sphere_large < levelBlueprint.limits.sphere_large) {
      const mesh = createMesh('sphere_large', 0xF0F8FF, selectedSize);
      const spawnPos = getRandomSpawnPosition('sphere_large');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, sphere_large: prev.sphere_large + 1 }));
      setCompletionMessage('Bola Besar ditambahkan! Susun menjadi boneka salju.');
    }
  }, [createMesh, selectedSize, getRandomSpawnPosition, placedObjectCounts.sphere_large]);

  const addSphereMedium = useCallback(() => {
    if (placedObjectCounts.sphere_medium < levelBlueprint.limits.sphere_medium) {
      const mesh = createMesh('sphere_medium', 0xE6E6FA, selectedSize);
      const spawnPos = getRandomSpawnPosition('sphere_medium');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, sphere_medium: prev.sphere_medium + 1 }));
      setCompletionMessage('Bola Sedang ditambahkan! Susun menjadi boneka salju.');
    }
  }, [createMesh, selectedSize, getRandomSpawnPosition, placedObjectCounts.sphere_medium]);

  const addSphereSmall = useCallback(() => {
    if (placedObjectCounts.sphere_small < levelBlueprint.limits.sphere_small) {
      const mesh = createMesh('sphere_small', 0xFFFAF0, selectedSize);
      const spawnPos = getRandomSpawnPosition('sphere_small');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, sphere_small: prev.sphere_small + 1 }));
      setCompletionMessage('Bola Kecil ditambahkan! Susun menjadi boneka salju.');
    }
  }, [createMesh, selectedSize, getRandomSpawnPosition, placedObjectCounts.sphere_small]);

  // Check level completion
  const checkLevelCompletion = useCallback(() => {
    if (!targetGroupRef.current) return;
    
    const studentObjects = draggableObjectsRef.current;
    const blueprint = levelBlueprint.blueprint;
    let correctCount = 0;
    const tolerance = 0.5;
    
    blueprint.forEach((blueprintItem, index) => {
      const ghostObject = targetGroupRef.current.children[index];
      const studentItem = studentObjects.find(obj => obj.userData.type === blueprintItem.type);

      if (studentItem && ghostObject) {
          const dist = studentItem.position.distanceTo(ghostObject.position);
          
          if (dist < tolerance) {
              correctCount++;
          }
      }
    });

    if (correctCount === blueprint.length) {
      setCompletionMessage('☃️ Selamat! Boneka salju Anda sudah sempurna!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = 'boneka-salju-bola';
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result for Learn Result page
      const buildResult = {
        challengeId: challengeId,
        challengeName: 'Boneka Salju dari Tiga Bola',
        completedAt: new Date().toISOString(),
        objects: studentObjects.map(obj => ({
          type: obj.userData.type,
          position: obj.position.toArray(),
          radius: obj.userData.radius
        }))
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Boneka salju Anda belum sepenuhnya benar. ${correctCount} dari ${blueprint.length} bola sudah di posisi yang benar.`);
      setIsLevelComplete(false);
    }
  }, []);

  // Reset the current scene
  const resetScene = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    
    draggableObjectsRef.current.forEach(obj => {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    draggableObjectsRef.current = [];
    setPlacedObjectCounts({ sphere_large: 0, sphere_medium: 0, sphere_small: 0 });
    setCompletionMessage('Scene direset. Mulai bangun boneka salju baru!');
    setIsLevelComplete(false);
    setShowAnalysis(false);
    setAnalysisResult(null);
    setSelectedObjectInfo(null);
  }, []);

  // Check completion wrapper
  const checkCompletion = useCallback(() => {
    checkLevelCompletion();
  }, [checkLevelCompletion]);

  // Analyze building
  const analyzeBuilding = useCallback(() => {
    const objects = draggableObjectsRef.current;
    const calculations = [];
    let totalVolume = 0;
    let totalSurfaceArea = 0;

    objects.forEach((obj, index) => {
      const info = getObjectCalculations(obj);
      const calculation = {
        id: index + 1,
        type: obj.userData.type,
        radius: info.radius,
        diameter: info.diameter,
        volume: info.volume + ' unit³',
        surfaceArea: info.surfaceArea + ' unit²'
      };

      calculations.push(calculation);
      totalVolume += parseFloat(info.volume);
      totalSurfaceArea += parseFloat(info.surfaceArea);
    });

    setAnalysisResult({
      breakdown: calculations,
      totalVolume: totalVolume.toFixed(2) + ' unit³',
      totalSurfaceArea: totalSurfaceArea.toFixed(2) + ' unit²'
    });
    setCompletionMessage("Analisis boneka salju selesai.");
    setShowAnalysis(true);
  }, [getObjectCalculations]);

  // Navigate to Learn Result page
  const goToLearnResult = useCallback(() => {
    router.push('/materi-pembelajaran/bola/learn-result');
  }, [router]);

  // UI Components
  const ShapeButton = ({ type, label, onClick, disabled, bgColor, icon }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl ${bgColor} ${disabled ? 'opacity-50' : 'hover:scale-105 active:scale-95'} 
        transition-all duration-200 shadow-lg border-2 border-white flex flex-col items-center justify-center
        touch-manipulation select-none`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div className="text-lg md:text-xl mb-0.5 flex items-center justify-center h-6">{icon}</div>
      <span className="text-[10px] md:text-xs font-medium text-white leading-tight text-center">{label}</span>
    </button>
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Mempersiapkan lingkungan 3D...</p>
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-400 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/materi-pembelajaran/bola">
            <button className="text-white text-lg hover:text-blue-100 transition-colors">← Kembali</button>
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Build Challenge Bola</h1>
          <p className="text-blue-100">Susun tiga bola menjadi boneka salju</p>
        </div>

        {/* Target Example */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">☃️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Contoh Boneka Salju yang Harus Dibuat</h2>
          </div>
          
          <div className="bg-gradient-to-b from-cyan-50 to-blue-100 border-2 border-dashed border-cyan-300 rounded-xl p-6 min-h-[160px] flex items-center justify-center">
            <div className="text-center">
              {/* Boneka Salju 2D */}
              <div className="relative mx-auto mb-4" style={{ width: '60px', height: '120px' }}>
                {/* Bola kecil (kepala) */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full"
                  style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#FFFAF0',
                    border: '2px solid #E0E0E0',
                    boxShadow: '0 2px 4px rgba(255, 250, 240, 0.6)'
                  }}
                />
                
                {/* Bola sedang (badan) */}
                <div 
                  className="absolute top-6 left-1/2 transform -translate-x-1/2 rounded-full"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#E6E6FA',
                    border: '2px solid #D0D0D0',
                    boxShadow: '0 2px 4px rgba(230, 230, 250, 0.6)'
                  }}
                />
                
                {/* Bola besar (dasar) */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-full"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#F0F8FF',
                    border: '2px solid #C0C0C0',
                    boxShadow: '0 3px 6px rgba(240, 248, 255, 0.6)'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">Boneka Salju dari Tiga Bola</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Susun <span className="font-medium text-blue-600">bola besar</span>, <span className="font-medium text-purple-500">bola sedang</span>, dan <span className="font-medium text-orange-500">bola kecil</span> dari bawah ke atas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Shapes */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏗️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Bola Tersedia</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <ShapeButton
                type="sphere_large"
                label="Besar"
                onClick={addSphereLarge}
                disabled={placedObjectCounts.sphere_large >= levelBlueprint.limits.sphere_large}
                bgColor="bg-blue-500"
                icon="⚪"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Bola Besar</p>
            </div>
            
            <div className="text-center">
              <ShapeButton
                type="sphere_medium"
                label="Sedang"
                onClick={addSphereMedium}
                disabled={placedObjectCounts.sphere_medium >= levelBlueprint.limits.sphere_medium}
                bgColor="bg-purple-500"
                icon="🔵"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Bola Sedang</p>
            </div>
            
            <div className="text-center">
              <ShapeButton
                type="sphere_small"
                label="Kecil"
                onClick={addSphereSmall}
                disabled={placedObjectCounts.sphere_small >= levelBlueprint.limits.sphere_small}
                bgColor="bg-orange-500"
                icon="🟠"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Bola Kecil</p>
            </div>
          </div>
        </div>

        {/* Construction Area */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">☃️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Area Konstruksi Boneka Salju</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <Suspense fallback={
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600 mx-auto mb-2"></div>
                  <p>Memuat scene 3D...</p>
                </div>
              </div>
            }>
              <div ref={mountRef} className="w-full h-64 md:h-80" />
            </Suspense>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{completionMessage}</p>
            
            {/* Action Buttons */}
            <div className="flex space-x-2 justify-center flex-wrap">
              <button
                onClick={checkCompletion}
                className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-xs hover:bg-cyan-700 transition-colors mb-1"
              >
                Periksa
              </button>
              <button
                onClick={analyzeBuilding}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors mb-1"
              >
                Analisis
              </button>
              <button
                onClick={resetScene}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors mb-1"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Completion Button */}
        <button 
          onClick={isLevelComplete ? goToLearnResult : checkCompletion}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all
            ${isLevelComplete 
              ? 'bg-gradient-to-r from-green-400 to-green-600 text-white' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700'
            }`}
        >
          {isLevelComplete ? '✅ Lihat Hasil' : '☃️ Bangun Boneka Salju'}
        </button>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Analisis Boneka Salju</h3>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-cyan-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Total Volume: {analysisResult.totalVolume}</p>
                <p className="text-sm font-medium text-gray-700">Total Luas Permukaan: {analysisResult.totalSurfaceArea}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Detail Bola:</h4>
                {analysisResult.breakdown.map(item => (
                  <div key={item.id} className="bg-gray-50 p-2 rounded mb-2">
                    <p className="text-sm font-medium capitalize">{item.type}</p>
                    <p className="text-xs text-gray-600">
                      r: {item.radius}, d: {item.diameter}
                    </p>
                    <p className="text-xs text-gray-600">
                      Volume: {item.volume}, Luas Permukaan: {item.surfaceArea}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}