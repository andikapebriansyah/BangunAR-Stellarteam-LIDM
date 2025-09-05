'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Suspense } from 'react';
import Link from 'next/link';

// Tentukan cetak biru (blueprint) untuk menara tabung
const levelBlueprint = {
  name: 'Miniatur Menara Tabung Bertingkat',
  blueprint: [
    { type: 'cylinder_large', position: new THREE.Vector3(0, 0.75, 0), color: 0x8B4513, radius: 0.5, height: 1.5 }, // Tabung besar (coklat)
    { type: 'cylinder_medium', position: new THREE.Vector3(0, 2.1, 0), color: 0x4169E1, radius: 0.4, height: 1.2 }, // Tabung sedang (biru)
    { type: 'cylinder_small', position: new THREE.Vector3(0, 3.2, 0), color: 0xFF6347, radius: 0.25, height: 1.0 }, // Tabung kecil (merah)
  ],
  limits: { cylinder_large: 1, cylinder_medium: 1, cylinder_small: 1 }
};

// Main App Component
export default function TabungBuildChallenge() {
  const router = useRouter();
  
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih tabung dan susun menjadi menara!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [placedObjectCounts, setPlacedObjectCounts] = useState({ cylinder_large: 0, cylinder_medium: 0, cylinder_small: 0 });
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
    let height;
    let radius;
    
    if (type === 'cylinder_large') {
      radius = 0.5 * scale;
      height = 1.5 * scale;
      geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    } else if (type === 'cylinder_medium') {
      radius = 0.4 * scale;
      height = 1.2 * scale;
      geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    } else if (type === 'cylinder_small') {
      radius = 0.25 * scale;
      height = 1.0 * scale;
      geometry = new THREE.CylinderGeometry(radius, radius, height, 16);
    }
    
    // Material dengan efek metalik untuk menara
    const material = new THREE.MeshPhongMaterial({ 
      color,
      shininess: 80,
      transparent: false,
      emissive: new THREE.Color(color).multiplyScalar(0.05)
    });
      
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.height = height;
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
    const height = object.userData.height;
    
    // Volume tabung = π × r² × t
    volume = Math.PI * radius * radius * height;
    // Luas permukaan tabung = 2πr(r + t)
    surfaceArea = 2 * Math.PI * radius * (radius + height);
    
    return {
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
      radius: radius.toFixed(2),
      height: height.toFixed(2)
    };
  }, []);

  // Render the ghost models
  const renderTargetBlueprint = useCallback(() => {
    if (targetGroupRef.current) {
      sceneRef.current.remove(targetGroupRef.current);
      targetGroupRef.current.children.forEach(child => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      targetGroupRef.current.children = [];
    }

    const targetGroup = new THREE.Group();
    targetGroupRef.current = targetGroup;
    const blueprint = levelBlueprint.blueprint;

    blueprint.forEach(item => {
      const targetMesh = createMesh(item.type, item.color, selectedSize);
      
      // Ghost material untuk preview
      const ghostMaterial = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      targetMesh.material.dispose();
      targetMesh.material = ghostMaterial;
      targetMesh.position.copy(item.position);
      targetMesh.position.multiplyScalar(selectedSize);
      targetMesh.userData.isGhost = true;
      
      targetMesh.castShadow = false;
      targetMesh.receiveShadow = false;
      
      targetGroup.add(targetMesh);
    });

    sceneRef.current.add(targetGroup);
  }, [selectedSize, createMesh]);

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
    
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    if (mount && mountRef.current) {
      mount.appendChild(renderer.domElement);
      setRendererReady(true);
    }

    const scene = sceneRef.current;
    
    // Create animated background
    const createAnimatedBackground = () => {
      const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
      const skyTexture = createGradientTexture();
      const skyMaterial = new THREE.MeshBasicMaterial({ 
        map: skyTexture, 
        side: THREE.BackSide 
      });
      const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(skyMesh);
      
      const createFloatingGeometries = () => {
        const geometryCount = isMobile ? 8 : 15;
        const floatingGeometries = new THREE.Group();
        
        for (let i = 0; i < geometryCount; i++) {
          let geometry;
          const rand = Math.random();
          
          if (rand < 0.5) {
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
          } else if (rand < 0.8) {
            geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
          } else {
            geometry = new THREE.SphereGeometry(0.5, 8, 6);
          }
          
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.2 + Math.random() * 0.3, 0.4, 0.6),
            wireframe: true,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.2
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          mesh.position.set(
            (Math.random() - 0.5) * 35,
            Math.random() * 25 + 5,
            (Math.random() - 0.5) * 35
          );
          
          mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          );
          
          const scale = 0.5 + Math.random() * 1.5;
          mesh.scale.set(scale, scale, scale);
          
          mesh.userData.initialY = mesh.position.y;
          mesh.userData.floatSpeed = 0.5 + Math.random() * 1;
          mesh.userData.rotateSpeed = 0.001 + Math.random() * 0.002;
          
          floatingGeometries.add(mesh);
        }
        
        scene.add(floatingGeometries);
        return floatingGeometries;
      };
      
      const floatingGeometries = createFloatingGeometries();
      scene.userData.floatingGeometries = floatingGeometries;
      scene.userData.skyMesh = skyMesh;
    };
    
    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, '#2D1B69');
      gradient.addColorStop(0.3, '#1E3A8A');
      gradient.addColorStop(0.7, '#374151');
      gradient.addColorStop(1, '#111827');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
      
      context.fillStyle = 'rgba(255,255,255,0.8)';
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const size = Math.random() * 2;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fill();
      }
      
      return new THREE.CanvasTexture(canvas);
    };
    
    createAnimatedBackground();

    const camera = cameraRef.current;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.maxDistance = 10;
    controls.minDistance = 4;
    controls.maxPolarAngle = Math.PI * 0.7;
    controls.minPolarAngle = Math.PI * 0.15;
    
    const boundarySize = 12;
    controls.addEventListener('change', () => {
      controls.target.x = Math.max(-boundarySize, Math.min(boundarySize, controls.target.x));
      controls.target.z = Math.max(-boundarySize, Math.min(boundarySize, controls.target.z));
      controls.target.y = Math.max(0, Math.min(8, controls.target.y));
      
      if (camera.position.x > boundarySize) camera.position.x = boundarySize;
      if (camera.position.x < -boundarySize) camera.position.x = -boundarySize;
      if (camera.position.z > boundarySize) camera.position.z = boundarySize;
      if (camera.position.z < -boundarySize) camera.position.z = -boundarySize;
      if (camera.position.y < 1) camera.position.y = 1;
    });
    
    if (isMobile) {
      controls.enableZoom = true;
      controls.enablePan = false;
      controls.maxDistance = 8;
      controls.minDistance = 5;
    }
    
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x4080ff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    
    if (!isMobile) {
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 1024;
      directionalLight.shadow.mapSize.height = 1024;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
    
    scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0x80c0ff, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 30, 30);
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    const squares = 8;
    const squareSize = canvas.width / squares;
    
    for (let i = 0; i < squares; i++) {
      for (let j = 0; j < squares; j++) {
        const isOdd = (i + j) % 2 === 1;
        context.fillStyle = isOdd ? '#E5E7EB' : '#F3F4F6';
        context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }
    
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 4);
    
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      map: groundTexture,
      side: THREE.DoubleSide
    });
    
    const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
    groundPlane.rotation.x = -Math.PI / 2;
    if (!isMobile) {
      groundPlane.receiveShadow = true;
    }
    scene.add(groundPlane);
    groundPlaneRef.current = groundPlane;

    // Boundary ring
    const boundaryRadius = 15;
    const boundaryGeometry = new THREE.RingGeometry(boundaryRadius - 0.2, boundaryRadius, 64);
    const boundaryMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x2563eb, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    
    const boundaryRing = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundaryRing.rotation.x = -Math.PI / 2;
    boundaryRing.position.y = 0.005;
    scene.add(boundaryRing);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onWindowResize);
    }
    
    setTimeout(onWindowResize, 200);
    setTimeout(onWindowResize, 500);
    setTimeout(onWindowResize, 1000);
    
    if (typeof window !== 'undefined' && window.ResizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          if (entry.target === mount) {
            onWindowResize();
          }
        }
      });
      resizeObserver.observe(mount);
    }
    
    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target === mount) {
            setTimeout(onWindowResize, 50);
          }
        });
      }, { threshold: 0.1 });
      intersectionObserver.observe(mount);
    }

    // Animation loop
    let lastTime = 0;
    let frameCount = 0;
    let fpsTime = 0;
    const targetFPS = isMobile ? 30 : 60;
    const interval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);
      
      frameCount++;
      if (currentTime - fpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTime = currentTime;
      }
      
      if (currentTime - lastTime >= interval) {
        const controls = controlsRef.current;
        const renderer = rendererRef.current;
        const scene = sceneRef.current;
        const camera = cameraRef.current;
        
        if (controls && renderer && scene && camera) {
          if (scene.userData.floatingGeometries) {
            const geometries = scene.userData.floatingGeometries;
            
            geometries.children.forEach((mesh, index) => {
              const time = currentTime * 0.001;
              mesh.position.y = mesh.userData.initialY + Math.sin(time * mesh.userData.floatSpeed + index) * 2;
              
              mesh.rotation.x += mesh.userData.rotateSpeed;
              mesh.rotation.y += mesh.userData.rotateSpeed * 0.7;
              mesh.rotation.z += mesh.userData.rotateSpeed * 0.5;
              
              if (mesh.position.y > 30) {
                mesh.position.y = -5;
                mesh.position.x = (Math.random() - 0.5) * 35;
                mesh.position.z = (Math.random() - 0.5) * 35;
              }
            });
          }
          
          if (scene.userData.skyMesh && !isMobile) {
            scene.userData.skyMesh.rotation.y += 0.0002;
          }
          
          controls.update();
          renderer.render(scene, camera);
        }
        lastTime = currentTime;
      }
    };

    setTimeout(() => setIsLoading3D(false), 500);
    animate(0);
    renderTargetBlueprint();
    
    setTimeout(() => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }, 600);
    }, 300);

    return () => {
      clearTimeout(initTimeout);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onWindowResize);
      }
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
      
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      
      const renderer = rendererRef.current;
      if (mount && renderer && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      setRendererReady(false);
    };
  }, [renderTargetBlueprint, isMobile, isMounted]);

  // Drag and drop logic
  useEffect(() => {
    if (!rendererRef.current || !rendererRef.current.domElement) {
      return;
    }
    
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const raycaster = raycasterRef.current;
    const controls = controlsRef.current;
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
      if (domElement && domElement.removeEventListener) {
        domElement.removeEventListener('mousedown', onPointerDown);
        domElement.removeEventListener('mousemove', onPointerMove);
        domElement.removeEventListener('mouseup', onPointerUp);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove', onTouchMove);
        domElement.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [getObjectCalculations, rendererReady]);

  // Helper function untuk generate random spawn position
  const getRandomSpawnPosition = useCallback((targetType) => {
    const blueprint = levelBlueprint.blueprint;
    const targetItem = blueprint.find(item => item.type === targetType);
    
    if (!targetItem) {
      return targetType === 'cylinder_large' ? { x: 2, y: 0.5, z: 2 } 
           : targetType === 'cylinder_medium' ? { x: -2, y: 1.75, z: 2 }
           : { x: 0, y: 2.8, z: 2 };
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
    
    const spawnY = targetType === 'cylinder_large' ? 0.75 
                  : targetType === 'cylinder_medium' ? 2.1 
                  : 3.2;
    
    return {
      x: clampedX,
      y: spawnY,
      z: clampedZ
    };
  }, [selectedSize]);

  // Add cylinder functions
  const addCylinderLarge = useCallback(() => {
    if (placedObjectCounts.cylinder_large < levelBlueprint.limits.cylinder_large) {
      const mesh = createMesh('cylinder_large', 0x8B4513, selectedSize); // Coklat
      const spawnPos = getRandomSpawnPosition('cylinder_large');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, cylinder_large: prev.cylinder_large + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Tabung besar ditambahkan. Letakkan di dasar menara!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas tabung besar untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]);

  const addCylinderMedium = useCallback(() => {
    if (placedObjectCounts.cylinder_medium < levelBlueprint.limits.cylinder_medium) {
      const mesh = createMesh('cylinder_medium', 0x4169E1, selectedSize); // Biru
      const spawnPos = getRandomSpawnPosition('cylinder_medium');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, cylinder_medium: prev.cylinder_medium + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Tabung sedang ditambahkan. Letakkan di tengah menara!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas tabung sedang untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]);

  const addCylinderSmall = useCallback(() => {
    if (placedObjectCounts.cylinder_small < levelBlueprint.limits.cylinder_small) {
      const mesh = createMesh('cylinder_small', 0xFF6347, selectedSize); // Merah
      const spawnPos = getRandomSpawnPosition('cylinder_small');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, cylinder_small: prev.cylinder_small + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Tabung kecil ditambahkan. Letakkan di puncak menara!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas tabung kecil untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]);
  
  // Check if the level is completed
  const checkCompletion = useCallback(() => {
    const studentObjects = draggableObjectsRef.current;
    const blueprint = levelBlueprint.blueprint;
    
    if (studentObjects.length !== blueprint.length) {
      setCompletionMessage(`Belum selesai. Anda perlu ${blueprint.length} tabung, tetapi baru ada ${studentObjects.length}.`);
      setIsLevelComplete(false);
      return;
    }
    
    let correctCount = 0;
    const tolerance = 0.5;
    
    blueprint.forEach((blueprintItem, index) => {
      const ghostObject = targetGroupRef.current.children[index];
      const studentItem = studentObjects.find(obj => obj.userData.type === blueprintItem.type);

      if (studentItem) {
          const dist = studentItem.position.distanceTo(ghostObject.position);
          const scaleMatch = studentItem.userData.scale === ghostObject.userData.scale;
          
          if (dist < tolerance && scaleMatch) {
              correctCount++;
          }
      }
    });

    if (correctCount === blueprint.length) {
      setCompletionMessage('🏗️ Selamat! Menara tabung Anda sudah benar!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = 'menara-tabung';
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result for Learn Result page
      const buildResult = {
        challengeId: challengeId,
        challengeName: 'Menara Tabung Bertingkat',
        completedAt: new Date().toISOString(),
        objects: studentObjects.map(obj => ({
          type: obj.userData.type,
          position: obj.position.toArray(),
          radius: obj.userData.radius,
          height: obj.userData.height
        }))
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Menara Anda belum sepenuhnya benar. ${correctCount} dari ${blueprint.length} tabung sudah di posisi yang benar.`);
      setIsLevelComplete(false);
    }
  }, []);

  // Reset the current scene
  const resetScene = useCallback(() => {
    draggableObjectsRef.current.forEach(obj => {
      sceneRef.current.remove(obj);
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
    setPlacedObjectCounts({ cylinder_large: 0, cylinder_medium: 0, cylinder_small: 0 });
    setCompletionMessage('Scene direset. Silakan mulai kembali.');
    setIsLevelComplete(false);
    setAnalysisResult(null);
    setSelectedObjectInfo(null);
    
    if (isMobile && typeof window !== 'undefined' && window.gc) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.gc) {
          window.gc();
        }
      }, 100);
    }
    
    renderTargetBlueprint();
  }, [renderTargetBlueprint, isMobile]);

  // Analyze the total building
  const analyzeBuilding = useCallback(() => {
    const studentObjects = draggableObjectsRef.current;
    if (studentObjects.length === 0) {
      setAnalysisResult({ totalVolume: 0, totalSurfaceArea: 0, breakdown: [] });
      setCompletionMessage("Tidak ada objek untuk dianalisis.");
      return;
    }

    let totalVolume = 0;
    let totalSurfaceArea = 0;
    const breakdown = studentObjects.map((obj, index) => {
      const calculations = getObjectCalculations(obj);
      totalVolume += parseFloat(calculations.volume);
      totalSurfaceArea += parseFloat(calculations.surfaceArea);
      return {
        id: index + 1,
        type: obj.userData.type,
        volume: calculations.volume,
        surfaceArea: calculations.surfaceArea,
        radius: calculations.radius,
        height: calculations.height
      };
    });

    setAnalysisResult({ totalVolume: totalVolume.toFixed(2), totalSurfaceArea: totalSurfaceArea.toFixed(2), breakdown });
    setCompletionMessage("Analisis menara tabung selesai.");
    setShowAnalysis(true);
  }, [getObjectCalculations]);

  // Navigate to Learn Result page
  const goToLearnResult = useCallback(() => {
    const buildResult = {
      challengeType: 'tower-cylinder',
      completed: true,
      completedAt: new Date().toISOString(),
      objects: [
        { type: 'cylinder_large', count: placedObjectCounts.cylinder_large },
        { type: 'cylinder_medium', count: placedObjectCounts.cylinder_medium },
        { type: 'cylinder_small', count: placedObjectCounts.cylinder_small }
      ]
    };
    localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    router.push('/materi-pembelajaran/tabung/learn-result');
  }, [router, placedObjectCounts]);

  // Render ulang cetak biru saat level atau skala berubah
  useEffect(() => {
    renderTargetBlueprint();
  }, [selectedSize, renderTargetBlueprint]);

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

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/materi-pembelajaran/tabung">
            <button className="text-white text-lg hover:text-blue-200 transition-colors">← Kembali</button>
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Build Challenge Tabung</h1>
          <p className="text-blue-100">Susun tiga tabung menjadi menara bertingkat</p>
        </div>

        {/* Target Example */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🎯</span>
            </div>
            <h2 className="font-semibold text-gray-800">Contoh Menara yang Harus Dibuat</h2>
          </div>
          
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-6 min-h-[160px] flex items-center justify-center">
            <div className="text-center">
              {/* Menara Tabung 2D */}
              <div className="relative mx-auto mb-4" style={{ width: '60px', height: '120px' }}>
                {/* Tabung kecil (atas) */}
                <div 
                  className="absolute bottom-20 left-1/2 transform -translate-x-1/2 rounded-lg"
                  style={{
                    width: '24px',
                    height: '30px',
                    backgroundColor: '#FF6347',
                    border: '2px solid #FF4500',
                    boxShadow: '0 2px 4px rgba(255, 99, 71, 0.4)'
                  }}
                />
                
                {/* Tabung sedang (tengah) */}
                <div 
                  className="absolute bottom-12 left-1/2 transform -translate-x-1/2 rounded-lg"
                  style={{
                    width: '36px',
                    height: '28px',
                    backgroundColor: '#4169E1',
                    border: '2px solid #0000CD',
                    boxShadow: '0 2px 4px rgba(65, 105, 225, 0.4)'
                  }}
                />
                
                {/* Tabung besar (bawah) */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-lg"
                  style={{
                    width: '48px',
                    height: '46px',
                    backgroundColor: '#8B4513',
                    border: '2px solid #A0522D',
                    boxShadow: '0 3px 6px rgba(139, 69, 19, 0.4)'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">Menara Tabung Bertingkat</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Susun <span className="font-medium text-amber-700">tabung besar</span>, <span className="font-medium text-blue-500">tabung sedang</span>, dan <span className="font-medium text-red-500">tabung kecil</span> dari bawah ke atas
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Shapes */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏗️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Tabung Tersedia</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <ShapeButton
                type="cylinder_large"
                label="Besar"
                onClick={addCylinderLarge}
                disabled={placedObjectCounts.cylinder_large >= levelBlueprint.limits.cylinder_large}
                bgColor="bg-amber-600"
                icon="🟫"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Tabung Besar</p>
            </div>
            
            <div className="text-center">
              <ShapeButton
                type="cylinder_medium"
                label="Sedang"
                onClick={addCylinderMedium}
                disabled={placedObjectCounts.cylinder_medium >= levelBlueprint.limits.cylinder_medium}
                bgColor="bg-blue-600"
                icon="🟦"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Tabung Sedang</p>
            </div>
            
            <div className="text-center">
              <ShapeButton
                type="cylinder_small"
                label="Kecil"
                onClick={addCylinderSmall}
                disabled={placedObjectCounts.cylinder_small >= levelBlueprint.limits.cylinder_small}
                bgColor="bg-red-600"
                icon="🟧"
              />
              <p className="text-xs text-gray-600 mt-2 leading-tight">Tabung Kecil</p>
            </div>
          </div>
        </div>

        {/* Construction Area */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏗️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Area Konstruksi Menara</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <Suspense fallback={
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>Memuat scene 3D...</p>
                </div>
              </div>
            }>
              <div ref={mountRef} className="w-full h-64 md:h-80" />
            </Suspense>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">{completionMessage}</p>
            
            {/* Performance Toggle for Mobile */}
            {isMounted && isMobile && (
              <div className="mb-3">
                <label className="flex items-center justify-center space-x-2 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={performanceMode}
                    onChange={(e) => setPerformanceMode(e.target.checked)}
                    className="rounded"
                  />
                  <span>Mode Performa (kurangi kualitas visual)</span>
                </label>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex space-x-2 justify-center flex-wrap">
              <button
                onClick={checkCompletion}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-colors mb-1"
              >
                Periksa
              </button>
              <button
                onClick={analyzeBuilding}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors mb-1"
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
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
            }`}
        >
          {isLevelComplete ? '✅ Lihat Hasil' : '🏗️ Bangun Menara'}
        </button>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Analisis Menara Tabung</h3>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Total Volume: {analysisResult.totalVolume}</p>
                <p className="text-sm font-medium text-gray-700">Total Luas Permukaan: {analysisResult.totalSurfaceArea}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Detail Tabung:</h4>
                {analysisResult.breakdown.map(item => (
                  <div key={item.id} className="bg-gray-50 p-2 rounded mb-2">
                    <p className="text-sm font-medium capitalize">
                      {item.type === 'cylinder_large' ? 'Tabung Besar' 
                       : item.type === 'cylinder_medium' ? 'Tabung Sedang' 
                       : 'Tabung Kecil'} #{item.id}
                    </p>
                    <p className="text-xs text-gray-600">
                      r: {item.radius}, t: {item.height}
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
