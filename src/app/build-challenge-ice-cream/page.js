'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Suspense } from 'react';
import Link from 'next/link';

// Tentukan cetak biru (blueprint) untuk level es krim
const levelBlueprint = {
  name: 'Bangun Es Krim Berlayer',
  blueprint: [
    { type: 'cone_waffle', position: new THREE.Vector3(0, 0.6, 0), color: 0x8B4513 }, // Cone terbalik untuk waffle (coklat tua)
    { type: 'sphere_cream_large', position: new THREE.Vector3(0, 1.4, 0), color: 0xE6F3FF }, // Sphere es krim besar vanilla
    { type: 'sphere_cream_small', position: new THREE.Vector3(0, 2.1, 0), color: 0xFFCCE5 }, // Sphere es krim kecil strawberry
  ],
  limits: { cone_waffle: 1, sphere_cream_large: 1, sphere_cream_small: 1 }
};

// Main App Component
export default function BuildChallengeIceCream() {
  const router = useRouter();
  
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih ukuran dan tambahkan objek!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [placedObjectCounts, setPlacedObjectCounts] = useState({ cone_waffle: 0, sphere_cream_large: 0, sphere_cream_small: 0 });
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
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000)); // Use default aspect ratio
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
    
    if (type === 'cone_waffle') {
      // Create inverted cone for waffle (terbalik ke bawah)
      const radius = 0.5 * scale;
      const coneHeight = 1.2 * scale;
      geometry = new THREE.ConeGeometry(radius, coneHeight, 12);
      // Flip the cone upside down (terbalik)
      geometry.rotateX(Math.PI); // Rotate 180 degrees around X axis
      height = coneHeight;
    } else if (type === 'sphere_cream_large') {
      // Create large sphere for ice cream (layer bawah) - lebih realistic
      const radius = 0.6 * scale;
      geometry = new THREE.SphereGeometry(radius, 16, 12);
      height = radius * 2;
    } else if (type === 'sphere_cream_small') {
      // Create small sphere for ice cream (layer atas) - lebih realistic
      const radius = 0.45 * scale;
      geometry = new THREE.SphereGeometry(radius, 16, 12);
      height = radius * 2;
    }
    
    // Use better materials with modern ice cream colors
    let material;
    if (type === 'cone_waffle') {
      // Waffle cone texture dengan pola
      material = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 10,
        transparent: false,
        bumpScale: 0.2
      });
    } else {
      // Ice cream dengan efek glossy modern
      material = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 100,
        transparent: false,
        emissive: new THREE.Color(color).multiplyScalar(0.1) // Subtle glow
      });
    }
      
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.height = height;
    mesh.userData.scale = scale;
    
    if (!isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }, [isMobile]); // Add dependency for isMobile
  
  // Calculate volume and surface area
  const getObjectCalculations = useCallback((object) => {
    const scale = object.userData.scale;
    let volume, surfaceArea;
    if (object.userData.type === 'cone_waffle') {
      // Cone calculations for waffle
      const radius = 0.5 * scale;
      const height = 1.2 * scale;
      const slantHeight = Math.sqrt(radius * radius + height * height);
      volume = (1/3) * Math.PI * radius * radius * height;
      surfaceArea = Math.PI * radius * radius + Math.PI * radius * slantHeight;
    } else if (object.userData.type === 'sphere_cream_large') {
      // Sphere calculations for large cream
      const radius = 0.6 * scale;
      volume = (4/3) * Math.PI * radius * radius * radius;
      surfaceArea = 4 * Math.PI * radius * radius;
    } else if (object.userData.type === 'sphere_cream_small') {
      // Sphere calculations for small cream
      const radius = 0.45 * scale;
      volume = (4/3) * Math.PI * radius * radius * radius;
      surfaceArea = 4 * Math.PI * radius * radius;
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
      
      // Use simpler ghost material for better performance tapi masih terlihat
      const ghostMaterial = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.4,
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
    // Wait for client-side mount
    if (!isMounted) return;
    
    const mount = mountRef.current;
    if (!mount) return;

    // Define variables in main scope for cleanup access
    let resizeObserver;
    let intersectionObserver;
    let animationId;

    // Define resize function in main scope for cleanup access
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

    // Wait for next frame to ensure DOM is fully rendered
    const initTimeout = setTimeout(() => {
      // Double check mount is still available
      if (!mount || !mountRef.current) return;
      
      // Mobile performance optimizations - use state instead of direct window access
      const pixelRatio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2) : 1;
      
      const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile, // Disable antialiasing on mobile
        alpha: true,
        powerPreference: "low-power" // Use integrated GPU if available
      });
      renderer.setPixelRatio(pixelRatio);
      
      // Force proper sizing calculation
      const rect = mount.getBoundingClientRect();
      const width = rect.width || mount.clientWidth || mount.offsetWidth;
      const height = rect.height || mount.clientHeight || mount.offsetHeight;
      
      renderer.setSize(width, height);
    
    // Disable expensive features on mobile
    if (!isMobile) {
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    } else {
      renderer.shadowMap.enabled = false; // Disable shadows on mobile
    }
    
    // Use transparent background untuk better blending dengan gradient
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    // Ensure mount is still available before appending
    if (mount && mountRef.current) {
      mount.appendChild(renderer.domElement);
      
      // Set renderer ready state only after successfully added to DOM
      setRendererReady(true);
    }

    const scene = sceneRef.current;
    // Create animated background scene
    const createAnimatedBackground = () => {
      // Gradient sky background dengan starfield effect
      const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
      const skyTexture = createGradientTexture();
      const skyMaterial = new THREE.MeshBasicMaterial({ 
        map: skyTexture, 
        side: THREE.BackSide 
      });
      const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
      scene.add(skyMesh);
      
      // Add floating geometric wireframes untuk atmosphere matematika
      const createFloatingGeometries = () => {
        const geometryCount = isMobile ? 8 : 15;
        const floatingGeometries = new THREE.Group();
        
        for (let i = 0; i < geometryCount; i++) {
          let geometry;
          const rand = Math.random();
          
          // Pilih berbagai geometry jaring-jaring
          if (rand < 0.3) {
            // Wireframe cube/balok
            geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
          } else if (rand < 0.6) {
            // Wireframe sphere/bola
            geometry = new THREE.SphereGeometry(0.5, 8, 6);
          } else if (rand < 0.8) {
            // Wireframe cone/kerucut
            geometry = new THREE.ConeGeometry(0.4, 1, 8);
          } else {
            // Wireframe cylinder/tabung
            geometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
          }
          
          // Material wireframe dengan warna yang lembut
          const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.3, 0.7),
            wireframe: true,
            transparent: true,
            opacity: 0.2 + Math.random() * 0.2
          });
          
          const mesh = new THREE.Mesh(geometry, material);
          
          // Posisi random dalam ruang 3D
          mesh.position.set(
            (Math.random() - 0.5) * 35,
            Math.random() * 25 + 5,
            (Math.random() - 0.5) * 35
          );
          
          // Rotasi random
          mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
          );
          
          // Scale random
          const scale = 0.5 + Math.random() * 1.5;
          mesh.scale.set(scale, scale, scale);
          
          // Store initial values untuk animasi
          mesh.userData.initialY = mesh.position.y;
          mesh.userData.floatSpeed = 0.5 + Math.random() * 1;
          mesh.userData.rotateSpeed = 0.001 + Math.random() * 0.002;
          
          floatingGeometries.add(mesh);
        }
        
        scene.add(floatingGeometries);
        return floatingGeometries;
      };
      
      const floatingGeometries = createFloatingGeometries();
      
      // Store reference for animation
      scene.userData.floatingGeometries = floatingGeometries;
      scene.userData.skyMesh = skyMesh;
    };
    
    // Helper function to create gradient texture
    const createGradientTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext('2d');
      
      // Create beautiful gradient similar to AR background
      const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, '#1e1b4b');    // Deep purple center
      gradient.addColorStop(0.3, '#1e3a8a');  // Blue
      gradient.addColorStop(0.7, '#374151');  // Gray
      gradient.addColorStop(1, '#111827');    // Dark edge
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
      
      // Add some stars
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
    // Fix camera aspect ratio based on actual dimensions
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    
    // Limit camera movement for better user experience
    controls.maxDistance = 10;
    controls.minDistance = 4;
    controls.maxPolarAngle = Math.PI * 0.7;
    controls.minPolarAngle = Math.PI * 0.15;
    
    // Batasi target kamera agar tidak keluar dari area
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

    // Enhanced lighting untuk background yang gelap
    const ambientLight = new THREE.AmbientLight(0x4080ff, 0.4); // Soft blue ambient
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
    
    // Add rim light untuk better shape definition
    const rimLight = new THREE.DirectionalLight(0x80c0ff, 0.3);
    rimLight.position.set(-5, 5, -5);
    scene.add(rimLight);

    // Create ground dengan warna plain seperti kode awal
    const groundGeometry = new THREE.PlaneGeometry(30, 30, 30, 30);
    
    // Create checkered pattern seperti sebelumnya
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

    // Add very subtle boundary indicators
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
    boundaryRing.position.y = 0.005; // Barely above ground
    scene.add(boundaryRing);

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onWindowResize);
    }
    
    // Also trigger resize after a short delay to fix initial load issues
    setTimeout(onWindowResize, 200);
    setTimeout(onWindowResize, 500); // Additional resize check
    setTimeout(onWindowResize, 1000); // Final resize check
    
    // Add ResizeObserver to watch container size changes
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
    
    // Add IntersectionObserver to handle visibility changes (scroll fix)
    if (typeof window !== 'undefined' && window.IntersectionObserver) {
      intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.target === mount) {
            // When element becomes visible, trigger a resize
            setTimeout(onWindowResize, 50);
          }
        });
      }, { threshold: 0.1 });
      intersectionObserver.observe(mount);
    }

    // Animation loop dengan background effects
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
          // Animate floating geometric wireframes
          if (scene.userData.floatingGeometries) {
            const geometries = scene.userData.floatingGeometries;
            
            geometries.children.forEach((mesh, index) => {
              // Gentle floating animation
              const time = currentTime * 0.001;
              mesh.position.y = mesh.userData.initialY + Math.sin(time * mesh.userData.floatSpeed + index) * 2;
              
              // Slow rotation animation
              mesh.rotation.x += mesh.userData.rotateSpeed;
              mesh.rotation.y += mesh.userData.rotateSpeed * 0.7;
              mesh.rotation.z += mesh.userData.rotateSpeed * 0.5;
              
              // Reset geometries yang terlalu tinggi
              if (mesh.position.y > 30) {
                mesh.position.y = -5;
                mesh.position.x = (Math.random() - 0.5) * 35;
                mesh.position.z = (Math.random() - 0.5) * 35;
              }
            });
          }
          
          // Slow sky rotation for dynamic effect
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
    
    // Additional safety render after initialization
    setTimeout(() => {
      const renderer = rendererRef.current;
      const scene = sceneRef.current;
      const camera = cameraRef.current;
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    }, 600);
    }, 300); // Increase timeout to ensure proper DOM ready

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
      
      // Reset renderer ready state
      setRendererReady(false);
    };
  }, [renderTargetBlueprint, isMobile, isMounted]); // Add dependencies

  // Separate useEffect for drag and drop logic (after renderer is ready)
  useEffect(() => {
    // Wait for renderer to be initialized
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
    
    // Check if renderer exists before accessing domElement
    if (!renderer || !renderer.domElement) return;
    
    const domElement = renderer.domElement;
    
    // Mouse events
    domElement.addEventListener('mousedown', onPointerDown, false);
    domElement.addEventListener('mousemove', onPointerMove, false);
    domElement.addEventListener('mouseup', onPointerUp, false);
    
    // Touch events
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
      // Safe cleanup - check if domElement still exists
      if (domElement && domElement.removeEventListener) {
        domElement.removeEventListener('mousedown', onPointerDown);
        domElement.removeEventListener('mousemove', onPointerMove);
        domElement.removeEventListener('mouseup', onPointerUp);
        domElement.removeEventListener('touchstart', onTouchStart);
        domElement.removeEventListener('touchmove', onTouchMove);
        domElement.removeEventListener('touchend', onTouchEnd);
      }
    };
  }, [getObjectCalculations, rendererReady]); // Wait for renderer to be ready

  // Helper function untuk generate random spawn point dekat ghost
  const getRandomSpawnPosition = useCallback((targetType) => {
    const blueprint = levelBlueprint.blueprint;
    const targetItem = blueprint.find(item => item.type === targetType);
    
    if (!targetItem) {
      // Fallback ke posisi default jika tidak ada target
      return targetType === 'cone_waffle' ? { x: 2, y: 0.6, z: 2 } 
           : targetType === 'cone_cream_large' ? { x: -2, y: 1.2, z: 2 }
           : { x: 0, y: 1.8, z: 2 };
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
    const spawnY = targetType === 'cone_waffle' ? 0.6 
                  : targetType === 'cone_cream_large' ? 1.2 
                  : 1.8;
    
    return {
      x: clampedX,
      y: spawnY,
      z: clampedZ
    };
  }, [selectedSize]);

  // Add waffle cone function
  const addConeWaffle = useCallback(() => {
    if (placedObjectCounts.cone_waffle < levelBlueprint.limits.cone_waffle) {
      const mesh = createMesh('cone_waffle', 0x8B4513, selectedSize); // Dark brown color for waffle cone
      const spawnPos = getRandomSpawnPosition('cone_waffle');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, cone_waffle: prev.cone_waffle + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Waffle cone ditambahkan. Coba letakkan!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas waffle cone untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]); // Add createMesh dependency

  // Add large ice cream sphere function
  const addSphereLarge = useCallback(() => {
    if (placedObjectCounts.sphere_cream_large < levelBlueprint.limits.sphere_cream_large) {
      const mesh = createMesh('sphere_cream_large', 0xE6F3FF, selectedSize); // Vanilla ice cream color
      const spawnPos = getRandomSpawnPosition('sphere_cream_large');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, sphere_cream_large: prev.sphere_cream_large + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Es krim vanilla besar ditambahkan. Coba letakkan!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas es krim vanilla besar untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]);

  // Add small ice cream sphere function
  const addSphereSmall = useCallback(() => {
    if (placedObjectCounts.sphere_cream_small < levelBlueprint.limits.sphere_cream_small) {
      const mesh = createMesh('sphere_cream_small', 0xFFCCE5, selectedSize); // Strawberry ice cream color
      const spawnPos = getRandomSpawnPosition('sphere_cream_small');
      mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
      sceneRef.current.add(mesh);
      draggableObjectsRef.current.push(mesh);
      setPlacedObjectCounts(prev => ({ ...prev, sphere_cream_small: prev.sphere_cream_small + 1 }));
      setAnalysisResult(null);
      setCompletionMessage("Es krim strawberry kecil ditambahkan. Coba letakkan!");
    } else {
      setCompletionMessage("Anda sudah mencapai batas es krim strawberry kecil untuk level ini.");
    }
  }, [selectedSize, placedObjectCounts, getRandomSpawnPosition, createMesh]);
  
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
          const scaleMatch = studentItem.userData.scale === ghostObject.userData.scale;
          
          if (dist < tolerance && scaleMatch) {
              correctCount++;
          }
      }
    });

    if (correctCount === blueprint.length) {
      setCompletionMessage('🎉 Selamat! Es krim Anda sudah benar!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = 'es-krim-sederhana'; // ID untuk challenge es krim
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result for Learn Result page
      const buildResult = {
        challengeId: challengeId,
        challengeName: 'Es Krim Sederhana',
        completedAt: new Date().toISOString(),
        objects: studentObjects.map(obj => ({
          type: obj.userData.type,
          position: obj.position.toArray()
        }))
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Es krim Anda belum sepenuhnya benar. ${correctCount} dari ${blueprint.length} objek sudah di posisi yang benar.`);
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
    setPlacedObjectCounts({ cone_waffle: 0, sphere_cream_large: 0, sphere_cream_small: 0 });
    setCompletionMessage('Scene direset. Silakan mulai kembali.');
    setIsLevelComplete(false);
    setAnalysisResult(null);
    setSelectedObjectInfo(null);
    
    // Force garbage collection on mobile
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
        surfaceArea: calculations.surfaceArea
      };
    });

    setAnalysisResult({ totalVolume: totalVolume.toFixed(2), totalSurfaceArea: totalSurfaceArea.toFixed(2), breakdown });
    setCompletionMessage("Analisis es krim selesai.");
    setShowAnalysis(true);
  }, [getObjectCalculations]);

  // Navigate to Learn Result page
  const goToLearnResult = useCallback(() => {
    // Save build result to localStorage for learn result page
    const buildResult = {
      challengeType: 'ice-cream',
      completed: true,
      completedAt: new Date().toISOString(),
      objects: [
        { type: 'cone_waffle', count: placedObjectCounts.cone_waffle },
        { type: 'sphere_cream_large', count: placedObjectCounts.cone_cream_large },
        { type: 'sphere_cream_small', count: placedObjectCounts.cone_cream_small }
      ]
    };
    localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    router.push('/learn-result/ice');
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
          <p className="text-purple-100">Bentuk es krim berlayer sesuai contoh gambar</p>
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
              {/* Es Krim Modern dengan Sphere 2D */}
              <div className="relative mx-auto mb-4" style={{ width: '80px', height: '120px' }}>
                {/* Strawberry ice cream sphere (atas) */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full"
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#FFE4E1',
                    border: '2px solid #FFB6C1',
                    boxShadow: '0 4px 8px rgba(255, 182, 193, 0.4), inset -4px -4px 8px rgba(255, 182, 193, 0.3)'
                  }}
                />
                
                {/* Vanilla ice cream sphere (tengah) */}
                <div 
                  className="absolute top-8 left-1/2 transform -translate-x-1/2 rounded-full"
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#F0F8FF',
                    border: '2px solid #E6F3FF',
                    boxShadow: '0 4px 8px rgba(230, 243, 255, 0.4), inset -4px -4px 8px rgba(230, 243, 255, 0.3)'
                  }}
                />
                
                {/* Waffle cone (bawah, terbalik) */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '0px',
                    height: '0px',
                    borderLeft: '25px solid transparent',
                    borderRight: '25px solid transparent',
                    borderTop: '45px solid #8B4513',
                    filter: 'drop-shadow(0 3px 6px rgba(139, 69, 19, 0.4))'
                  }}
                />
                
                {/* Decorative elements */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                  <div className="text-xs">🍓</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">Es Krim Modern</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Susun <span className="font-medium text-amber-700">waffle cone</span>, <span className="font-medium text-blue-500">vanilla sphere</span>, dan <span className="font-medium text-pink-500">strawberry sphere</span> menjadi es krim berlayer
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
          
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="ml-2">
                  <ShapeButton
                    type="cone_waffle"
                    label="Waffle"
                    onClick={addConeWaffle}
                    disabled={placedObjectCounts.cone_waffle >= levelBlueprint.limits.cone_waffle}
                    bgColor="bg-orange-600"
                    icon="🧇"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-tight">Cone Waffle</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="ml-2">
                  <ShapeButton
                    type="sphere_cream_large"
                    label="Vanilla"
                    onClick={addSphereLarge}
                    disabled={placedObjectCounts.sphere_cream_large >= levelBlueprint.limits.sphere_cream_large}
                    bgColor="bg-blue-200"
                    icon="�"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-tight">Es Krim Vanilla</p>
            </div>
            
            <div className="text-center">
              <div className="flex justify-center">
                <div className="ml-2">
                  <ShapeButton
                    type="sphere_cream_small"
                    label="Strawberry"
                    onClick={addSphereSmall}
                    disabled={placedObjectCounts.sphere_cream_small >= levelBlueprint.limits.sphere_cream_small}
                    bgColor="bg-pink-300"
                    icon="🍓"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-tight">Es Krim Strawberry</p>
            </div>
          </div>
          
          {/* Shapes yang tidak tersedia untuk level ini */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Bangun ruang lainnya (belum tersedia)</p>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <ShapeButton
                  type="cube"
                  label="Balok"
                  onClick={() => setCompletionMessage("Balok belum tersedia di level ini")}
                  disabled={true}
                  bgColor="bg-gray-400"
                  icon="⬜"
                />
                <p className="text-xs text-gray-500 mt-1 leading-tight">Balok</p>
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
            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏗️</span>
            </div>
            <h2 className="font-semibold text-gray-800">Area Konstruksi</h2>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <Suspense fallback={
              <div className="h-64 md:h-80 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
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
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition-colors mb-1"
              >
                Periksa
              </button>
              <button
                onClick={analyzeBuilding}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs hover:bg-purple-700 transition-colors mb-1"
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
              : 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-700 hover:to-purple-700'
            }`}
        >
          {isLevelComplete ? '✅ Selesai' : '🍦 Selesai'}
        </button>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Analisis Es Krim</h3>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Total Volume: {analysisResult.totalVolume}</p>
                <p className="text-sm font-medium text-gray-700">Total Luas Permukaan: {analysisResult.totalSurfaceArea}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Detail Objek:</h4>
                {analysisResult.breakdown.map(item => (
                  <div key={item.id} className="bg-gray-50 p-2 rounded mb-2">
                    <p className="text-sm font-medium capitalize">
                      {item.type === 'cone_waffle' ? 'Waffle Cone' 
                       : item.type === 'sphere_cream_large' ? 'Es Krim Vanilla (Besar)' 
                       : 'Es Krim Strawberry (Kecil)'} #{item.id}
                    </p>
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
