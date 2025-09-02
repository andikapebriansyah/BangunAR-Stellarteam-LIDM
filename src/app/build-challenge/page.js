'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Suspense } from 'react';
import Link from 'next/link';

// Tentukan cetak biru (blueprint) untuk level
const levelBlueprint = {
  name: 'Bangun Rumah Sederhana',
  blueprint: [
    { type: 'cube', position: new THREE.Vector3(0, 0.6, 0), color: 0x6366F1 }, // Balok untuk badan rumah 
    { type: 'prism', position: new THREE.Vector3(0, 1.2, 0), color: 0xF59E0B }, // Prisma di atas kubus - perbaiki tinggi
  ],
  limits: { cube: 1, prism: 1 }
};

// Main App Component
export default function BuildChallenge() {
  const router = useRouter();
  
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih ukuran dan tambahkan objek!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [placedObjectCounts, setPlacedObjectCounts] = useState({ cube: 0, prism: 0 });
  const [selectedSize, setSelectedSize] = useState(1);
  const [selectedObjectInfo, setSelectedObjectInfo] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [fps, setFps] = useState(0);

  // 3D Scene Refs
  const mountRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
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
  const createMesh = (type, color, scale) => {
    let geometry;
    let height;
    const isMobile = window.innerWidth <= 768;
    
    if (type === 'cube') {
      // Create a rectangular block (balok) - proporsional untuk rumah
      geometry = new THREE.BoxGeometry(scale * 2, scale * 1.2, scale * 1.5);
      height = scale * 1.2;
    } else if (type === 'prism') {
      // Create a triangular prism for the roof - kembali ke ExtrudeGeometry
      const shape = new THREE.Shape();
      const width = 2.0 * scale; // Sama dengan lebar kubus
      const roofHeight = 1.0 * scale; // Tinggi atap yang proporsional
      
      // Create triangle shape for roof
      shape.moveTo(-width/2, 0);
      shape.lineTo(width/2, 0);
      shape.lineTo(0, roofHeight);
      shape.lineTo(-width/2, 0);
      
      const extrudeSettings = {
        depth: scale * 1.5, // Sama dengan kedalaman balok
        bevelEnabled: false,
        steps: 1
      };
      
      geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      
      // Hanya perbaiki center Z agar sama dengan kubus
      geometry.translate(0, 0, -scale * 1.5 / 2);
      
      height = roofHeight;
    }
    
    // Use better materials with nice colors
    const material = new THREE.MeshPhongMaterial({ 
      color,
      shininess: 30,
      transparent: false
    });
      
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.height = height;
    mesh.userData.scale = scale;
    
    if (!isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  };
  
  // Calculate volume and surface area
  const getObjectCalculations = useCallback((object) => {
    const scale = object.userData.scale;
    let volume, surfaceArea;
    if (object.userData.type === 'cube') {
      // Rectangular block calculations - dimensions updated
      const width = 2 * scale;
      const height = 1.2 * scale;
      const depth = 1.5 * scale;
      volume = width * height * depth;
      surfaceArea = 2 * (width * height + width * depth + height * depth);
    } else if (object.userData.type === 'prism') {
      // Triangular prism calculations - dimensions updated to match cube
      const baseWidth = 2.0 * scale; // Sama dengan lebar kubus
      const roofHeight = 1.0 * scale;
      const depth = 1.5 * scale;
      const baseArea = (baseWidth * roofHeight) / 2;
      const sideLength = Math.sqrt((baseWidth/2) * (baseWidth/2) + roofHeight * roofHeight);
      volume = baseArea * depth;
      surfaceArea = (2 * baseArea) + (baseWidth * depth) + (2 * sideLength * depth);
    }
    return {
      volume: volume.toFixed(2),
      surfaceArea: surfaceArea.toFixed(2),
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
      
      // Use simpler ghost material for better performance
      const ghostMaterial = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide // Ensure visibility from all angles
      });
      
      targetMesh.material.dispose(); // Clean up original material
      targetMesh.material = ghostMaterial;
      targetMesh.position.copy(item.position);
      targetMesh.position.multiplyScalar(selectedSize);
      targetMesh.userData.isGhost = true;
      
      // Disable shadows for ghost objects
      targetMesh.castShadow = false;
      targetMesh.receiveShadow = false;
      
      targetGroup.add(targetMesh);
    });

    sceneRef.current.add(targetGroup);
  }, [selectedSize]);

  // Scene setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Mobile performance optimizations
    const isMobile = window.innerWidth <= 768;
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2);
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialiasing on mobile
      alpha: true,
      powerPreference: "low-power" // Use integrated GPU if available
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    
    // Disable expensive features on mobile
    if (!isMobile) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      renderer.shadowMap.enabled = false; // Disable shadows on mobile
    }
    
    renderer.setClearColor(0xF1F5F9, 1); // Light gray background yang modern
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    const scene = sceneRef.current;
    scene.background = new THREE.Color(0xF1F5F9); // Light gray background yang modern

    const camera = cameraRef.current;
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    
    // Limit camera movement for better user experience - lebih ketat
    controls.maxDistance = 10; // Tidak bisa terlalu jauh agar objek tetap terlihat
    controls.minDistance = 4;  // Tidak bisa terlalu dekat
    controls.maxPolarAngle = Math.PI * 0.7; // Tidak bisa melihat dari bawah
    controls.minPolarAngle = Math.PI * 0.15;  // Tidak bisa terlalu dari atas
    
    // Batasi target kamera agar tidak keluar dari area
    const boundarySize = 12;
    controls.addEventListener('change', () => {
      // Batasi target kamera
      controls.target.x = Math.max(-boundarySize, Math.min(boundarySize, controls.target.x));
      controls.target.z = Math.max(-boundarySize, Math.min(boundarySize, controls.target.z));
      controls.target.y = Math.max(0, Math.min(8, controls.target.y));
      
      // Batasi posisi kamera
      if (camera.position.x > boundarySize) camera.position.x = boundarySize;
      if (camera.position.x < -boundarySize) camera.position.x = -boundarySize;
      if (camera.position.z > boundarySize) camera.position.z = boundarySize;
      if (camera.position.z < -boundarySize) camera.position.z = -boundarySize;
      if (camera.position.y < 1) camera.position.y = 1; // Tidak bisa masuk ke ground
    });
    
    // Limit controls for mobile
    if (isMobile) {
      controls.enableZoom = true;
      controls.enablePan = false; // Disable panning on mobile
      controls.maxDistance = 8;
      controls.minDistance = 5;
    }
    
    controlsRef.current = controls;

    // Simplified lighting for better performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7.5);
    
    if (!isMobile) {
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 512; // Reduced shadow quality
      directionalLight.shadow.mapSize.height = 512;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
    
    scene.add(directionalLight);

    // Create an attractive checkered ground for kids - diperbesar lagi
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 30, 30); // Diperbesar dari 16x16 ke 30x30
    
    // Create a canvas for modern checkered pattern
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // Draw modern checkered pattern dengan warna yang lebih bagus
    const squares = 8;
    const squareSize = canvas.width / squares;
    
    for (let i = 0; i < squares; i++) {
      for (let j = 0; j < squares; j++) {
        const isOdd = (i + j) % 2 === 1;
        context.fillStyle = isOdd ? '#E5E7EB' : '#F3F4F6'; // Modern gray shades
        context.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
      }
    }
    
    // Create texture from canvas
    const groundTexture = new THREE.CanvasTexture(canvas);
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(4, 4); // Repeat pattern untuk ground yang lebih besar
    
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

    // Tambahkan dinding pembatas dengan visual yang lebih jelas
    const wallHeight = 10;
    const wallThickness = 0.5;
    const groundSize = 15; // Setengah dari ground size (30/2)
    
    const wallMaterial = new THREE.MeshLambertMaterial({ 
      color: 0xE5E7EB, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    
    // Dinding kiri
    const leftWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSize * 2),
      wallMaterial
    );
    leftWall.position.set(-groundSize, wallHeight/2, 0);
    scene.add(leftWall);
    
    // Dinding kanan  
    const rightWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSize * 2),
      wallMaterial
    );
    rightWall.position.set(groundSize, wallHeight/2, 0);
    scene.add(rightWall);
    
    // Dinding depan
    const frontWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSize * 2, wallHeight, wallThickness),
      wallMaterial
    );
    frontWall.position.set(0, wallHeight/2, -groundSize);
    scene.add(frontWall);
    
    // Dinding belakang
    const backWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSize * 2, wallHeight, wallThickness),
      wallMaterial
    );
    backWall.position.set(0, wallHeight/2, groundSize);
    scene.add(backWall);

    const onWindowResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    // Optimized animation loop
    let animationId;
    let lastTime = 0;
    let frameCount = 0;
    let fpsTime = 0;
    const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
    const interval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationId = requestAnimationFrame(animate);
      
      // FPS monitoring
      frameCount++;
      if (currentTime - fpsTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTime = currentTime;
      }
      
      if (currentTime - lastTime >= interval) {
        controls.update();
        renderer.render(scene, camera);
        lastTime = currentTime;
      }
    };

    // Set loading to false after first render
    setTimeout(() => setIsLoading3D(false), 500);
    
    animate(0);
    renderTargetBlueprint();

    return () => {
      window.removeEventListener('resize', onWindowResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [renderTargetBlueprint]);

  // Drag and drop logic (optimized for mobile)
  useEffect(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const raycaster = raycasterRef.current;
    const controls = controlsRef.current;
    const pointer = pointerRef.current;
    const dragPlane = dragPlaneRef.current;
    const intersectionPoint = new THREE.Vector3();
    const offset = new THREE.Vector3();
    
    const isMobile = window.innerWidth <= 768;
    let isDragging = false;

    const onPointerDown = (event) => {
      // Prevent default to avoid context menus and unwanted behaviors
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
        // Object is clicked - start dragging
        isDragging = true;
        controls.enabled = false; // DISABLE camera controls when dragging object
        draggedObjectRef.current = intersects[0].object;
        
        console.log('Object clicked:', draggedObjectRef.current.userData.type); // Debug log
        
        // Add visual feedback - brighten the object
        draggedObjectRef.current.material.emissive.setHex(0x222222);
        
        // Show info of clicked object
        const info = getObjectCalculations(draggedObjectRef.current);
        setSelectedObjectInfo({
          type: draggedObjectRef.current.userData.type,
          ...info
        });
        
        // Set the drag plane perpendicular to camera view for 3D movement
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, draggedObjectRef.current.position);
        
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
          offset.copy(intersectionPoint).sub(draggedObjectRef.current.position);
        }
      } else {
        // No object clicked - allow camera movement
        setSelectedObjectInfo(null);
        controls.enabled = true;
        isDragging = false;
        draggedObjectRef.current = null;
      }
    };
    
    const onPointerMove = (event) => {
      if (!draggedObjectRef.current || !isDragging) return;

      // Prevent default to avoid unwanted behaviors
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
        
        // Batasi pergerakan dalam 3D space dengan collision detection
        const wallBoundary = 14; // Sedikit lebih kecil dari dinding (15)
        newPosition.x = Math.max(-wallBoundary, Math.min(wallBoundary, newPosition.x));
        newPosition.y = Math.max(0.3, Math.min(8, newPosition.y)); // Tidak bisa masuk ke ground, tidak terlalu tinggi
        newPosition.z = Math.max(-wallBoundary, Math.min(wallBoundary, newPosition.z));
        
        const snapTolerance = 1.0; // Increased tolerance for easier snapping
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
        // Remove visual feedback
        draggedObjectRef.current.material.emissive.setHex(0x000000);
        
        // Object was being dragged - stop dragging and re-enable controls
        isDragging = false;
        draggedObjectRef.current = null;
      }
      
      // Always re-enable controls after pointer up
      controls.enabled = true;
    };
    
    const domElement = renderer.domElement;
    
    // Mouse events for desktop
    domElement.addEventListener('mousedown', onPointerDown, false);
    domElement.addEventListener('mousemove', onPointerMove, false);
    domElement.addEventListener('mouseup', onPointerUp, false);
    
    // Add hover effect for better UX
    const onMouseHover = (event) => {
      if (isDragging) return;
      
      const rect = domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(draggableObjectsRef.current, false);
      
      if (intersects.length > 0) {
        domElement.style.cursor = 'pointer';
      } else {
        domElement.style.cursor = 'default';
      }
    };
    
    domElement.addEventListener('mousemove', onMouseHover, false);
    
    // Pointer events as backup
    domElement.addEventListener('pointerdown', onPointerDown, false);
    domElement.addEventListener('pointermove', onPointerMove, false);
    domElement.addEventListener('pointerup', onPointerUp, false);
    
    // Touch events for mobile
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
      // Mouse events
      domElement.removeEventListener('mousedown', onPointerDown);
      domElement.removeEventListener('mousemove', onPointerMove);
      domElement.removeEventListener('mouseup', onPointerUp);
      domElement.removeEventListener('mousemove', onMouseHover);
      
      // Pointer events
      domElement.removeEventListener('pointerdown', onPointerDown);
      domElement.removeEventListener('pointermove', onPointerMove);
      domElement.removeEventListener('pointerup', onPointerUp);
      
      // Touch events
      domElement.removeEventListener('touchstart', onTouchStart);
      domElement.removeEventListener('touchmove', onTouchMove);
      domElement.removeEventListener('touchend', onTouchEnd);
    };
  }, [getObjectCalculations]);

  // Helper function untuk generate random spawn point dekat ghost
  const getRandomSpawnPosition = useCallback((targetType) => {
    const blueprint = levelBlueprint.blueprint;
    const targetItem = blueprint.find(item => item.type === targetType);
    
    if (!targetItem) {
      // Fallback ke posisi default jika tidak ada target
      return targetType === 'cube' ? { x: 2, y: 0.6, z: 2 } : { x: -2, y: 1.8, z: 2 };
    }
    
    // Ghost position sebagai center point
    const ghostPos = {
      x: targetItem.position.x * selectedSize,
      y: targetItem.position.y * selectedSize,
      z: targetItem.position.z * selectedSize
    };
    
    // Random offset dalam radius 3-5 unit dari ghost
    const minDistance = 3;
    const maxDistance = 5;
    const angle = Math.random() * Math.PI * 2; // Random angle
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    const randomX = ghostPos.x + Math.cos(angle) * distance;
    const randomZ = ghostPos.z + Math.sin(angle) * distance;
    
    // Pastikan dalam batas area (wallBoundary = 14)
    const wallBoundary = 13;
    const clampedX = Math.max(-wallBoundary, Math.min(wallBoundary, randomX));
    const clampedZ = Math.max(-wallBoundary, Math.min(wallBoundary, randomZ));
    
    // Y position disesuaikan dengan type object
    const spawnY = targetType === 'cube' ? 0.6 : 1.8;
    
    return {
      x: clampedX,
      y: spawnY,
      z: clampedZ
    };
  }, [selectedSize]);

  // Add cube function
  const addCube = useCallback(() => {
    if (placedObjectCounts.cube < levelBlueprint.limits.cube) {
      const mesh = createMesh('cube', 0x6366F1, selectedSize); // Modern indigo color
      const spawnPos = getRandomSpawnPosition('cube');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, cube: prev.cube + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Kubus ditambahkan. Coba letakkan!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas kubus untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition]);

  // Add prism function
  const addPrism = useCallback(() => {
    if (placedObjectCounts.prism < levelBlueprint.limits.prism) {
      const mesh = createMesh('prism', 0xF59E0B, selectedSize); // Modern amber color
      const spawnPos = getRandomSpawnPosition('prism');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, prism: prev.prism + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Prisma ditambahkan. Coba letakkan!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas prisma untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition]);
  
  // Check if the level is completed
  const checkCompletion = useCallback(() => {
    const studentObjects = draggableObjectsRef.current;
    const blueprint = levelBlueprint.blueprint;
    
    if (studentObjects.length !== blueprint.length) {
      setCompletionMessage(`Belum selesai. Anda perlu ${blueprint.length} objek, tetapi baru ada ${studentObjects.length}.`);
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
          const scaleMatch = studentItem.scale.equals(ghostObject.scale);
          
          if (dist < tolerance && scaleMatch) {
              correctCount++;
          }
      }
    });

    if (correctCount === blueprint.length) {
      setCompletionMessage('🎉 Selamat! Bangunan Anda sudah benar!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = 'rumah-sederhana'; // ID untuk challenge ini
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result for Learn Result page
      const buildResult = {
        challengeId: challengeId,
        challengeName: 'Rumah Sederhana',
        completedAt: new Date().toISOString(),
        objects: studentObjects.map(obj => ({
          type: obj.userData.type,
          position: obj.position.toArray()
        }))
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Bangunan Anda belum sepenuhnya benar. ${correctCount} dari ${blueprint.length} objek sudah di posisi yang benar.`);
      setIsLevelComplete(false);
    }
  }, []);

  // Reset the current scene (with memory cleanup)
  const resetScene = useCallback(() => {
    // Clean up existing objects
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
    setPlacedObjectCounts({ cube: 0, prism: 0 });
    setCompletionMessage('Scene direset. Silakan mulai kembali.');
    setIsLevelComplete(false);
    setAnalysisResult(null);
    setSelectedObjectInfo(null);
    
    // Force garbage collection on mobile
    if (window.innerWidth <= 768 && window.gc) {
      setTimeout(() => window.gc(), 100);
    }
    
    renderTargetBlueprint();
  }, [renderTargetBlueprint]);

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
        surfaceArea: calculations.surfaceArea
      };
    });

    setAnalysisResult({ totalVolume: totalVolume.toFixed(2), totalSurfaceArea: totalSurfaceArea.toFixed(2), breakdown });
    setCompletionMessage("Analisis bangunan selesai.");
    setShowAnalysis(true);
  }, [getObjectCalculations]);

  // Navigate to Learn Result page
  const goToLearnResult = useCallback(() => {
    router.push('/learn-result');
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-purple-500 to-blue-500 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Link href="/build-challenge-selection">
            <button className="text-white text-lg hover:text-purple-200 transition-colors">← Kembali</button>
          </Link>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Build Challenge</h1>
          <p className="text-purple-100">Bentuk rumah sesuai contoh gambar</p>
        </div>

        {/* Target Example */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🎯</span>
            </div>
            <h2 className="font-semibold text-gray-800">Contoh yang Harus Dibuat</h2>
          </div>
          
          <div className="bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-xl p-6 min-h-[160px] flex items-center justify-center">
            <div className="text-center">
              {/* Rumah 2D Simple & Clean */}
              <div className="relative mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                {/* Balok untuk badan rumah */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 rounded-md border-2"
                  style={{
                    width: '60px',
                    height: '40px',
                    backgroundColor: '#6366F1',
                    borderColor: '#4F46E5',
                    boxShadow: '0 2px 4px rgba(99, 102, 241, 0.2)'
                  }}
                />
                
                {/* Atap segitiga */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '0px',
                    height: '0px',
                    borderLeft: '32px solid transparent',
                    borderRight: '32px solid transparent',
                    borderBottom: '35px solid #F59E0B',
                    filter: 'drop-shadow(0 2px 4px rgba(245, 158, 11, 0.2))'
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">Rumah Sederhana</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Susun <span className="font-medium text-indigo-600">balok biru</span> dan <span className="font-medium text-amber-600">prisma kuning</span> menjadi rumah
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Shapes */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🔧</span>
            </div>
            <h2 className="font-semibold text-gray-800">Bangun Ruang Tersedia</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6 max-w-xs mx-auto">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="ml-2">
                  <ShapeButton
                    type="cube"
                    label="Balok"
                    onClick={addCube}
                    disabled={placedObjectCounts.cube >= levelBlueprint.limits.cube}
                    bgColor="bg-indigo-500"
                    icon="⬜"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-tight">Badan Rumah</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="ml-2">
                  <ShapeButton
                    type="prism"
                    label="Prisma"
                    onClick={addPrism}
                    disabled={placedObjectCounts.prism >= levelBlueprint.limits.prism}
                    bgColor="bg-amber-500"
                    icon="🔺"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-tight">Atap Rumah</p>
            </div>
          </div>
          
          {/* Shapes yang tidak tersedia untuk level ini */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Bangun ruang lainnya (belum tersedia)</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <ShapeButton
                  type="pyramid"
                  label="Limas"
                  onClick={() => setCompletionMessage("Limas belum tersedia di level ini")}
                  disabled={true}
                  bgColor="bg-gray-400"
                  icon="🔻"
                />
                <p className="text-xs text-gray-500 mt-1 leading-tight">Limas</p>
              </div>

              <div className="text-center">
                <ShapeButton
                  type="sphere"
                  label="Bola"
                  onClick={() => setCompletionMessage("Bola belum tersedia di level ini")}
                  disabled={true}
                  bgColor="bg-gray-400"
                  icon="⚪"
                />
                <p className="text-xs text-gray-500 mt-1 leading-tight">Bola</p>
              </div>

              <div className="text-center">
                <ShapeButton
                  type="cone"
                  label="Kerucut"
                  onClick={() => setCompletionMessage("Kerucut belum tersedia di level ini")}
                  disabled={true}
                  bgColor="bg-gray-400"
                  icon="🔴"
                />
                <p className="text-xs text-gray-500 mt-1 leading-tight">Kerucut</p>
              </div>
              
              <div className="text-center">
                <ShapeButton
                  type="cylinder"
                  label="Tabung"
                  onClick={() => setCompletionMessage("Tabung belum tersedia di level ini")}
                  disabled={true}
                  bgColor="bg-gray-400"
                  icon="🟤"
                />
                <p className="text-xs text-gray-500 mt-1 leading-tight">Tabung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Construction Area */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏗️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Area Konstruksi</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <Suspense fallback={
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
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
            {window.innerWidth <= 768 && (
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
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors mb-1"
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
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
            }`}
        >
          {isLevelComplete ? '✅ Selesai' : '🔥 Selesai'}
        </button>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Analisis Bangunan</h3>
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
                <h4 className="font-medium mb-2">Detail Objek:</h4>
                {analysisResult.breakdown.map(item => (
                  <div key={item.id} className="bg-gray-50 p-2 rounded mb-2">
                    <p className="text-sm font-medium capitalize">{item.type} #{item.id}</p>
                    <p className="text-xs text-gray-600">Volume: {item.volume}, Luas Permukaan: {item.surfaceArea}</p>
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
