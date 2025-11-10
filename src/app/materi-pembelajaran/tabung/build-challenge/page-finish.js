'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Suspense } from 'react';
import Link from 'next/link';

// Tentukan cetak biru (blueprint) untuk menara tabung dengan komponen parts
const levelBlueprint = {
  name: 'Miniatur Menara Tabung Bertingkat',
  blueprint: [
    { 
      type: 'cylinder_large', 
      position: new THREE.Vector3(0, 0.75, 0), 
      color: 0x8B4513, 
      radius: 0.5, 
      height: 1.5,
      parts: {
        bottom: { filled: false, type: 'circle_large_bottom' },
        side: { filled: false, type: 'rect_large' },
        top: { filled: false, type: 'circle_large_top' }
      }
    },
    { 
      type: 'cylinder_medium', 
      position: new THREE.Vector3(0, 2.1, 0), 
      color: 0x4169E1, 
      radius: 0.4, 
      height: 1.2,
      parts: {
        bottom: { filled: false, type: 'circle_medium_bottom' },
        side: { filled: false, type: 'rect_medium' },
        top: { filled: false, type: 'circle_medium_top' }
      }
    },
    { 
      type: 'cylinder_small', 
      position: new THREE.Vector3(0, 3.2, 0), 
      color: 0xFF6347, 
      radius: 0.25, 
      height: 1.0,
      parts: {
        bottom: { filled: false, type: 'circle_small_bottom' },
        side: { filled: false, type: 'rect_small' },
        top: { filled: false, type: 'circle_small_top' }
      }
    },
  ],
  limits: { cylinder_large: 1, cylinder_medium: 1, cylinder_small: 1 }
};

// Main App Component
export default function TabungBuildChallenge() {
  const router = useRouter();
  
  // UI and game state
  const [completionMessage, setCompletionMessage] = useState('Pilih komponen 2D dan rangkai menjadi tabung!');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [placedObjectCounts, setPlacedObjectCounts] = useState({ cylinder_large: 0, cylinder_medium: 0, cylinder_small: 0 });
  const [cylinderParts, setCylinderParts] = useState(JSON.parse(JSON.stringify(levelBlueprint.blueprint.map(b => b.parts))));
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
  const [hoveredZone, setHoveredZone] = useState(null);
  
  // Track spawned components to prevent duplicates
  const [spawnedComponents, setSpawnedComponents] = useState({
    circle_large_bottom: false,
    rect_large: false,
    circle_large_top: false,
    circle_medium_bottom: false,
    rect_medium: false,
    circle_medium_top: false,
    circle_small_bottom: false,
    rect_small: false,
    circle_small_top: false
  });

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
  const hotspotZonesRef = useRef([]);
  const replacedCylindersRef = useRef(new Set()); // Track which cylinders have been replaced

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
  
  // Function to create 2D component (circle or rectangle)
  const create2DComponent = useCallback((componentType, color, scale) => {
    let geometry;
    let mesh;
    
    if (componentType.startsWith('circle_')) {
      // Lingkaran untuk tutup/alas
      const size = componentType.includes('large') ? 0.5 : componentType.includes('medium') ? 0.4 : 0.25;
      const radius = size * scale;
      geometry = new THREE.CircleGeometry(radius, 32);
      
      const material = new THREE.MeshBasicMaterial({ 
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: true,
        depthTest: true
      });
      
      mesh = new THREE.Mesh(geometry, material);
      mesh.userData.radius = radius;
      mesh.userData.componentType = componentType;
      
      // Add border ring
      const ringGeometry = new THREE.RingGeometry(radius * 0.95, radius, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      mesh.add(ring);
      
    } else if (componentType.startsWith('rect_')) {
      // Persegi panjang untuk selimut
      const size = componentType.includes('large') ? { radius: 0.5, height: 1.5 } 
                  : componentType.includes('medium') ? { radius: 0.4, height: 1.2 }
                  : { radius: 0.25, height: 1.0 };
      
      const width = 2 * Math.PI * size.radius * scale;
      const height = size.height * scale;
      
      geometry = new THREE.PlaneGeometry(width, height);
      
      const material = new THREE.MeshBasicMaterial({ 
        color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: true,
        depthTest: true
      });
      
      mesh = new THREE.Mesh(geometry, material);
      mesh.userData.width = width;
      mesh.userData.height = height;
      mesh.userData.radius = size.radius * scale;
      mesh.userData.componentType = componentType;
      
      // Add border
      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
      const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      mesh.add(edges);
    }
    
    mesh.userData.is2DComponent = true;
    mesh.userData.scale = scale;
    mesh.renderOrder = 2; // Render after hotspots
    return mesh;
  }, []);
  
  // Function to create hotspot zone indicators on ghost cylinders
  const createHotspotZones = useCallback(() => {
    // Clean up old zones safely
    hotspotZonesRef.current.forEach(zone => {
      if (zone && zone.parent) {
        zone.parent.remove(zone);
      }
      if (zone && zone.geometry) {
        try {
          zone.geometry.dispose();
        } catch (e) {
          console.warn('Geometry already disposed');
        }
      }
      if (zone && zone.material) {
        try {
          if (Array.isArray(zone.material)) {
            zone.material.forEach(mat => mat.dispose());
          } else {
            zone.material.dispose();
          }
        } catch (e) {
          console.warn('Material already disposed');
        }
      }
    });
    hotspotZonesRef.current = [];
    
    const blueprint = levelBlueprint.blueprint;
    
    blueprint.forEach((item, cylinderIndex) => {
      // ⚠️ Skip hotspot creation for completed cylinders
      if (replacedCylindersRef.current.has(cylinderIndex)) {
        console.log(`⏭️ Skipping hotspot zones for cylinder ${cylinderIndex} - already completed`);
        return;
      }
      
      const cylinderPos = new THREE.Vector3().copy(item.position).multiplyScalar(selectedSize);
      const radius = item.radius * selectedSize;
      const height = item.height * selectedSize;
      const color = item.color;
      
      // Get initial filled state from blueprint parts (not state)
      const initialBottomFilled = item.parts.bottom.filled || false;
      const initialTopFilled = item.parts.top.filled || false;
      const initialSideFilled = item.parts.side.filled || false;
      
      // Bottom zone (alas) - FULL CIRCLE hijau untuk petunjuk alas
      const bottomGeometry = new THREE.CircleGeometry(radius * 1.05, 64);
      const bottomMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Hijau untuk alas
        transparent: true,
        opacity: initialBottomFilled ? 0.15 : 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
      const bottomZone = new THREE.Mesh(bottomGeometry, bottomMaterial);
      bottomZone.rotation.x = -Math.PI / 2;
      bottomZone.position.copy(cylinderPos);
      
      // Increased offset for cylinder index > 0 to avoid overlap with top of previous cylinder
      const bottomOffset = cylinderIndex > 0 ? 0.15 : 0.05;
      bottomZone.position.y -= height / 2 + bottomOffset;
      
      bottomZone.userData.zoneType = 'bottom';
      bottomZone.userData.cylinderIndex = cylinderIndex;
      bottomZone.userData.acceptsType = item.parts.bottom.type;
      bottomZone.userData.originalOpacity = initialBottomFilled ? 0.15 : 0.4;
      bottomZone.renderOrder = 1;
      sceneRef.current.add(bottomZone);
      hotspotZonesRef.current.push(bottomZone);
      
      console.log(`✅ Created bottom hotspot [Cyl ${cylinderIndex}] at Y=${bottomZone.position.y.toFixed(2)}, accepts: ${item.parts.bottom.type}`);
      
      // Top zone (tutup) - FULL CIRCLE hijau untuk petunjuk tutup
      const topGeometry = new THREE.CircleGeometry(radius * 1.05, 64);
      const topMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Hijau untuk tutup
        transparent: true,
        opacity: initialTopFilled ? 0.15 : 0.4,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
      const topZone = new THREE.Mesh(topGeometry, topMaterial);
      topZone.rotation.x = -Math.PI / 2;
      topZone.position.copy(cylinderPos);
      topZone.position.y += height / 2 + 0.05; // Offset lebih besar untuk avoid overlap
      topZone.userData.zoneType = 'top';
      topZone.userData.cylinderIndex = cylinderIndex;
      topZone.userData.acceptsType = item.parts.top.type;
      topZone.userData.originalOpacity = initialTopFilled ? 0.15 : 0.4;
      topZone.renderOrder = 1;
      sceneRef.current.add(topZone);
      hotspotZonesRef.current.push(topZone);
      
      // Side zone (selimut) - RING/TORUS merah untuk petunjuk selimut
      const torusRadius = radius * 1.05;
      const torusThickness = height * 0.03;
      const sideGeometry = new THREE.TorusGeometry(torusRadius, torusThickness, 16, 64);
      const sideMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Merah untuk selimut
        transparent: true,
        opacity: initialSideFilled ? 0.2 : 0.5,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      const sideZone = new THREE.Mesh(sideGeometry, sideMaterial);
      sideZone.rotation.x = Math.PI / 2;
      sideZone.position.copy(cylinderPos);
      sideZone.userData.zoneType = 'side';
      sideZone.userData.cylinderIndex = cylinderIndex;
      sideZone.userData.acceptsType = item.parts.side.type;
      sideZone.userData.originalOpacity = initialSideFilled ? 0.2 : 0.5;
      sideZone.renderOrder = 1;
      sceneRef.current.add(sideZone);
      hotspotZonesRef.current.push(sideZone);
    });
  }, [selectedSize]); // ✅ No cylinderParts dependency!
  
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

  // Render the ghost models with hotspot zones
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

    blueprint.forEach((item, index) => {
      // ⚠️ CRITICAL: Check if cylinder already replaced with solid
      if (replacedCylindersRef.current.has(index)) {
        console.log(`⏭️ Skipping ghost creation for cylinder ${index} - already solid`);
        
        // Recreate solid cylinder instead of ghost
        const solidCylinder = createMesh(item.type, item.color, selectedSize);
        
        // FORCE solid material
        const newMaterial = new THREE.MeshPhongMaterial({
          color: item.color,
          shininess: 80,
          transparent: false,
          opacity: 1.0,
          emissive: new THREE.Color(item.color).multiplyScalar(0.05)
        });
        solidCylinder.material.dispose();
        solidCylinder.material = newMaterial;
        
        solidCylinder.position.copy(item.position);
        solidCylinder.position.multiplyScalar(selectedSize);
        solidCylinder.userData.isSolid = true;
        solidCylinder.userData.cylinderIndex = index;
        solidCylinder.castShadow = true;
        solidCylinder.receiveShadow = true;
        
        targetGroup.add(solidCylinder);
        return; // Skip ghost creation
      }
      
      const targetMesh = createMesh(item.type, item.color, selectedSize);
      
      // Ghost material untuk preview
      const ghostMaterial = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      
      targetMesh.material.dispose();
      targetMesh.material = ghostMaterial;
      targetMesh.position.copy(item.position);
      targetMesh.position.multiplyScalar(selectedSize);
      targetMesh.userData.isGhost = true;
      targetMesh.userData.cylinderIndex = index;
      
      targetMesh.castShadow = false;
      targetMesh.receiveShadow = false;
      
      targetGroup.add(targetMesh);
    });

    sceneRef.current.add(targetGroup);
    createHotspotZones();
  }, [selectedSize, createMesh, createHotspotZones]);

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
        
        // Safety check - ensure all objects exist and are valid
        if (controls && renderer && scene && camera && renderer.domElement) {
          try {
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
          } catch (error) {
            console.warn('Render error (safe to ignore):', error.message);
          }
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

  // Drag and drop logic for 2D components
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
    let currentHoveredZone = null;

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
      
      if (intersects.length > 0 && intersects[0].object.userData.is2DComponent) {
        isDragging = true;
        controls.enabled = false;
        draggedObjectRef.current = intersects[0].object;
        
        // Highlight dragged component & hide children (border rings/edges)
        if (draggedObjectRef.current.material.emissive) {
          draggedObjectRef.current.material.emissive = new THREE.Color(0x444444);
        }
        
        // Hide border rings/edges while dragging
        draggedObjectRef.current.children.forEach(child => {
          child.visible = false;
        });
        
        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        dragPlane.setFromNormalAndCoplanarPoint(cameraDirection, draggedObjectRef.current.position);
        
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
          offset.copy(intersectionPoint).sub(draggedObjectRef.current.position);
        }
      } else {
        controls.enabled = true;
        isDragging = false;
        draggedObjectRef.current = null;
      }
    };
    
    const onPointerMove = (event) => {
      if (!draggedObjectRef.current || !isDragging) {
        // Check hover on hotspot zones even when not dragging
        const clientX = event.clientX || (event.touches && event.touches[0]?.clientX);
        const clientY = event.clientY || (event.touches && event.touches[0]?.clientY);
        
        if (clientX !== undefined && clientY !== undefined) {
          const rect = renderer.domElement.getBoundingClientRect();
          pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
          pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
          raycaster.setFromCamera(pointer, camera);
          
          const zoneIntersects = raycaster.intersectObjects(hotspotZonesRef.current, false);
          if (zoneIntersects.length > 0) {
            renderer.domElement.style.cursor = 'pointer';
          } else {
            renderer.domElement.style.cursor = 'default';
          }
        }
        return;
      }

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
        
        draggedObjectRef.current.position.copy(newPosition);
        
        // Check if hovering over valid hotspot zone
        const zoneIntersects = raycaster.intersectObjects(hotspotZonesRef.current, false);
        
        // Reset previous hovered zone
        if (currentHoveredZone) {
          currentHoveredZone.material.opacity = currentHoveredZone.userData.originalOpacity || 0.4;
          currentHoveredZone.scale.set(1, 1, 1);
        }
        
        if (zoneIntersects.length > 0) {
          const zone = zoneIntersects[0].object;
          const draggedType = draggedObjectRef.current.userData.componentType;
          const acceptsType = zone.userData.acceptsType;
          
          // Calculate distance to zone center for better snap feedback
          const distanceToZone = draggedObjectRef.current.position.distanceTo(zone.position);
          const snapDistance = 2.5; // Increased tolerance for easier snapping
          
          console.log(`🎯 Zone Detection:`, {
            draggedType,
            acceptsType,
            distance: distanceToZone.toFixed(2),
            snapDistance,
            cylinderIndex: zone.userData.cylinderIndex,
            zoneType: zone.userData.zoneType,
            zonePosition: `(${zone.position.x.toFixed(1)}, ${zone.position.y.toFixed(1)}, ${zone.position.z.toFixed(1)})`,
            componentPosition: `(${draggedObjectRef.current.position.x.toFixed(1)}, ${draggedObjectRef.current.position.y.toFixed(1)}, ${draggedObjectRef.current.position.z.toFixed(1)})`
          });
          
          // Check if this is the correct component for this zone
          if (draggedType === acceptsType && distanceToZone < snapDistance) {
            currentHoveredZone = zone;
            zone.userData.originalOpacity = zone.material.opacity;
            zone.material.opacity = 0.9; // More visible when hovering
            zone.scale.set(1.15, 1.15, 1.15); // Bigger scale for feedback
            setHoveredZone(zone.userData);
            renderer.domElement.style.cursor = 'copy';
          } else if (draggedType === acceptsType) {
            // Right type but too far - show as potential target
            currentHoveredZone = zone;
            zone.userData.originalOpacity = zone.material.opacity;
            zone.material.opacity = 0.7;
            zone.scale.set(1.05, 1.05, 1.05);
            setHoveredZone(zone.userData);
            renderer.domElement.style.cursor = 'move';
          } else {
            currentHoveredZone = null;
            setHoveredZone(null);
            renderer.domElement.style.cursor = 'not-allowed';
          }
        } else {
          currentHoveredZone = null;
          setHoveredZone(null);
          renderer.domElement.style.cursor = 'move';
        }
      }
    };
    
    const animateComponentSnap = (component, targetZone, onComplete) => {
      const startPos = component.position.clone();
      const startRot = component.rotation.clone();
      const startScale = component.scale.clone();
      
      const targetPos = targetZone.position.clone();
      const cylinderIndex = targetZone.userData.cylinderIndex;
      const zoneType = targetZone.userData.zoneType;
      
      let targetRot, targetScale;
      
      if (zoneType === 'bottom' || zoneType === 'top') {
        // Circle components
        targetRot = new THREE.Euler(-Math.PI / 2, 0, 0);
        targetScale = new THREE.Vector3(1, 1, 1);
      } else {
        // Rectangle (selimut) - wrap around cylinder
        targetRot = new THREE.Euler(0, 0, 0);
        targetScale = new THREE.Vector3(1, 1, 1);
      }
      
      const duration = 500; // ms
      const startTime = Date.now();
      
      const animate = () => {
        if (!component || !component.position) {
          onComplete();
          return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        try {
          component.position.lerpVectors(startPos, targetPos, eased);
          component.rotation.x = startRot.x + (targetRot.x - startRot.x) * eased;
          component.rotation.y = startRot.y + (targetRot.y - startRot.y) * eased;
          component.rotation.z = startRot.z + (targetRot.z - startRot.z) * eased;
          component.scale.lerpVectors(startScale, targetScale, eased);
        } catch (e) {
          console.warn('Animation stopped:', e.message);
          onComplete();
          return;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      };
      
      animate();
    };
    
    const onPointerUp = (event) => {
      if (isDragging && draggedObjectRef.current) {
        const draggedType = draggedObjectRef.current.userData.componentType;
        
        // Check if dropped on valid zone
        if (currentHoveredZone && currentHoveredZone.userData.acceptsType === draggedType) {
          const cylinderIndex = currentHoveredZone.userData.cylinderIndex;
          const zoneType = currentHoveredZone.userData.zoneType;
          const componentToAnimate = draggedObjectRef.current;
          
          // Immediately disable controls and clear dragged ref
          isDragging = false;
          draggedObjectRef.current = null;
          
          // Animate component snapping to zone
          animateComponentSnap(componentToAnimate, currentHoveredZone, () => {
            // After animation completes, update state and cleanup
            try {
              // Mark component as no longer available for respawn
              const componentType = componentToAnimate.userData.componentType;
              if (componentType) {
                // Component stays marked as spawned (can't respawn)
                console.log(`✅ Component ${componentType} successfully placed and locked`);
              }
              
              // Remove 2D component from scene
              if (componentToAnimate && componentToAnimate.parent) {
                sceneRef.current.remove(componentToAnimate);
              }
              
              if (componentToAnimate && componentToAnimate.geometry) {
                componentToAnimate.geometry.dispose();
              }
              if (componentToAnimate && componentToAnimate.material) {
                if (Array.isArray(componentToAnimate.material)) {
                  componentToAnimate.material.forEach(mat => mat.dispose());
                } else {
                  componentToAnimate.material.dispose();
                }
              }
              
              // Remove from draggable array
              const index = draggableObjectsRef.current.indexOf(componentToAnimate);
              if (index > -1) {
                draggableObjectsRef.current.splice(index, 1);
              }
            } catch (e) {
              console.warn('Cleanup error:', e.message);
            }
            
            // Update state after cleanup
            setCylinderParts(prev => {
              const newParts = JSON.parse(JSON.stringify(prev));
              newParts[cylinderIndex][zoneType].filled = true;
              return newParts;
            });
            
            setCompletionMessage(`✅ ${zoneType === 'bottom' ? 'Alas' : zoneType === 'top' ? 'Tutup' : 'Selimut'} terpasang!`);
          });
          
        } else {
          // Reset component material if drop failed
          if (draggedObjectRef.current && draggedObjectRef.current.material && draggedObjectRef.current.material.emissive) {
            draggedObjectRef.current.material.emissive.setHex(0x000000);
          }
        }
        
        // Reset hover state
        if (currentHoveredZone) {
          try {
            if (currentHoveredZone.material) {
              currentHoveredZone.material.opacity = currentHoveredZone.userData.originalOpacity || 0.4;
            }
            currentHoveredZone.scale.set(1, 1, 1);
          } catch (e) {
            console.warn('Zone reset error:', e.message);
          }
          currentHoveredZone = null;
        }
        
        isDragging = false;
        draggedObjectRef.current = null;
        setHoveredZone(null);
        if (renderer && renderer.domElement) {
          renderer.domElement.style.cursor = 'default';
        }
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
  }, [rendererReady, selectedSize, createHotspotZones]);

  // Helper function untuk spawn 2D component at random position
  const getRandomSpawnFor2D = useCallback((componentType) => {
    const angle = Math.random() * Math.PI * 2;
    
    // Circle/alas lebih dekat, selimut lebih jauh
    const isCircle = componentType.startsWith('circle_');
    const distance = isCircle ? (2.5 + Math.random() * 1.5) : (4 + Math.random() * 3);
    
    return {
      x: Math.cos(angle) * distance,
      y: 2 + Math.random() * 1.5,
      z: Math.sin(angle) * distance
    };
  }, []);

  // Add 2D component functions
  const add2DComponent = useCallback((componentType, color) => {
    // Check if already spawned
    if (spawnedComponents[componentType]) {
      setCompletionMessage('⚠️ Komponen ini sudah di-spawn! Tidak bisa spawn lagi.');
      return;
    }
    
    const mesh = create2DComponent(componentType, color, selectedSize);
    const spawnPos = getRandomSpawnFor2D(componentType);
    mesh.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    
    // Orient component to face camera initially
    mesh.lookAt(cameraRef.current.position);
    
    sceneRef.current.add(mesh);
    draggableObjectsRef.current.push(mesh);
    
    // Mark as spawned
    setSpawnedComponents(prev => ({
      ...prev,
      [componentType]: true
    }));
    
    const typeName = componentType.startsWith('circle_') ? 'Lingkaran' : 'Selimut';
    const sizeName = componentType.includes('large') ? 'Besar' : componentType.includes('medium') ? 'Sedang' : 'Kecil';
    
    setCompletionMessage(`${typeName} ${sizeName} ditambahkan. Drag ke hotspot yang sesuai!`);
  }, [selectedSize, create2DComponent, getRandomSpawnFor2D, spawnedComponents]);
  
  // Check if all cylinder parts are completed
  const checkCompletion = useCallback(() => {
    const blueprint = levelBlueprint.blueprint;
    let totalParts = 0;
    let filledParts = 0;
    
    cylinderParts.forEach((parts, index) => {
      totalParts += 3; // bottom, side, top
      if (parts.bottom.filled) filledParts++;
      if (parts.side.filled) filledParts++;
      if (parts.top.filled) filledParts++;
    });
    
    if (filledParts === totalParts) {
      setCompletionMessage('� Selamat! Semua tabung berhasil dirakit dengan sempurna!');
      setIsLevelComplete(true);
      
      // Save completion to localStorage
      const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
      const challengeId = 'menara-tabung-2d';
      if (!completedChallenges.includes(challengeId)) {
        completedChallenges.push(challengeId);
        localStorage.setItem('completedChallenges', JSON.stringify(completedChallenges));
      }
      
      // Save build result
      const buildResult = {
        challengeId: challengeId,
        challengeName: 'Menara Tabung dari Komponen 2D',
        completedAt: new Date().toISOString(),
        totalParts: totalParts,
        method: '2D Assembly'
      };
      localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    } else {
      setCompletionMessage(`Progress: ${filledParts}/${totalParts} komponen terpasang. ${totalParts - filledParts} komponen tersisa.`);
      setIsLevelComplete(false);
    }
  }, [cylinderParts]);

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
    setCylinderParts(JSON.parse(JSON.stringify(levelBlueprint.blueprint.map(b => b.parts))));
    setCompletionMessage('Scene direset. Pilih komponen 2D dan mulai rakit!');
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

  // Analyze the completed cylinders
  const analyzeBuilding = useCallback(() => {
    const blueprint = levelBlueprint.blueprint;
    let totalVolume = 0;
    let totalSurfaceArea = 0;
    const breakdown = [];
    
    blueprint.forEach((item, index) => {
      if (cylinderParts[index].bottom.filled && cylinderParts[index].side.filled && cylinderParts[index].top.filled) {
        const radius = item.radius * selectedSize;
        const height = item.height * selectedSize;
        
        const volume = Math.PI * radius * radius * height;
        const surfaceArea = 2 * Math.PI * radius * (radius + height);
        
        totalVolume += volume;
        totalSurfaceArea += surfaceArea;
        
        breakdown.push({
          id: index + 1,
          type: item.type,
          volume: volume.toFixed(2),
          surfaceArea: surfaceArea.toFixed(2),
          radius: radius.toFixed(2),
          height: height.toFixed(2),
          name: item.type === 'cylinder_large' ? 'Tabung Besar' : item.type === 'cylinder_medium' ? 'Tabung Sedang' : 'Tabung Kecil'
        });
      }
    });

    if (breakdown.length === 0) {
      setCompletionMessage("Belum ada tabung yang selesai dirakit untuk dianalisis.");
      return;
    }

    setAnalysisResult({ 
      totalVolume: totalVolume.toFixed(2), 
      totalSurfaceArea: totalSurfaceArea.toFixed(2), 
      breakdown 
    });
    setCompletionMessage("Analisis menara tabung selesai.");
    setShowAnalysis(true);
  }, [cylinderParts, selectedSize]);

  // Navigate to Learn Result page
  const goToLearnResult = useCallback(() => {
    const buildResult = {
      challengeType: 'tower-cylinder-2d',
      completed: true,
      completedAt: new Date().toISOString(),
      method: '2D Assembly',
      cylinders: cylinderParts.map((parts, index) => ({
        index,
        bottom: parts.bottom.filled,
        side: parts.side.filled,
        top: parts.top.filled
      }))
    };
    localStorage.setItem('lastBuildResult', JSON.stringify(buildResult));
    router.push('/materi-pembelajaran/tabung/learn-result');
  }, [router, cylinderParts]);

  // Render ulang cetak biru HANYA saat selectedSize berubah (not on every render)
  useEffect(() => {
    if (sceneRef.current && !targetGroupRef.current) {
      // Only render on initial mount or size change
      renderTargetBlueprint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]); // ✅ Intentionally exclude renderTargetBlueprint to prevent infinite loop
  
  // Update hotspot zone colors when cylinderParts changes (without recreating)
  useEffect(() => {
    if (hotspotZonesRef.current.length > 0) {
      hotspotZonesRef.current.forEach(zone => {
        if (!zone || !zone.userData || !zone.material) return;
        
        const cylinderIndex = zone.userData.cylinderIndex;
        const zoneType = zone.userData.zoneType;
        const blueprint = levelBlueprint.blueprint[cylinderIndex];
        
        if (cylinderParts[cylinderIndex] && cylinderParts[cylinderIndex][zoneType]) {
          const isFilled = cylinderParts[cylinderIndex][zoneType].filled;
          
          try {
            zone.material.color.setHex(isFilled ? 0x00ff00 : blueprint.color);
            zone.material.opacity = isFilled ? 0.3 : zone.userData.originalOpacity || 0.4;
            zone.material.needsUpdate = true;
          } catch (e) {
            console.warn('Material update error:', e.message);
          }
        }
      });
    }
    
    // Check if any cylinder is complete and replace ghost with solid
    if (targetGroupRef.current) {
      cylinderParts.forEach((parts, index) => {
        const isComplete = parts.bottom.filled && parts.side.filled && parts.top.filled;
        
        // Skip if already replaced using ref (persistent across renders)
        if (replacedCylindersRef.current.has(index)) {
          return;
        }
        
        const currentMesh = targetGroupRef.current.children[index];
        
        // Only replace if complete and still a ghost
        if (currentMesh && isComplete && currentMesh.userData.isGhost) {
          console.log(`🔧 REPLACING cylinder ${index} with SOLID cylinder!`);
          
          // Replace transparent ghost with solid cylinder
          const blueprint = levelBlueprint.blueprint[index];
          const solidCylinder = createMesh(blueprint.type, blueprint.color, selectedSize);
          
          // FORCE solid material properties
          if (solidCylinder.material) {
            // Create NEW material to ensure no lingering transparency
            const newMaterial = new THREE.MeshPhongMaterial({
              color: blueprint.color,
              shininess: 80,
              transparent: false,
              opacity: 1.0,
              emissive: new THREE.Color(blueprint.color).multiplyScalar(0.05)
            });
            
            solidCylinder.material.dispose();
            solidCylinder.material = newMaterial;
          }
          
          solidCylinder.position.copy(currentMesh.position);
          solidCylinder.userData.cylinderIndex = index;
          solidCylinder.userData.isSolid = true;
          solidCylinder.castShadow = true;
          solidCylinder.receiveShadow = true;
          
          // Remove ghost from scene
          targetGroupRef.current.remove(currentMesh);
          if (currentMesh.geometry) currentMesh.geometry.dispose();
          if (currentMesh.material) currentMesh.material.dispose();
          
          // Add solid cylinder
          targetGroupRef.current.add(solidCylinder);
          
          // Mark as replaced in ref (PERSISTENT)
          replacedCylindersRef.current.add(index);
          
          // Hide hotspots for this completed cylinder
          hotspotZonesRef.current.forEach(zone => {
            if (zone.userData.cylinderIndex === index) {
              zone.visible = false;
              console.log(`🚫 Hidden hotspot for cylinder ${index}, zone: ${zone.userData.zoneType}`);
            }
          });
          
          console.log(`✅ Cylinder ${index} is now SOLID (material transparent=${solidCylinder.material.transparent}, opacity=${solidCylinder.material.opacity})`);
        }
      });
    }
  }, [cylinderParts, selectedSize, createMesh]);

  // UI Components
  const Component2DButton = ({ componentType, label, onClick, bgColor, icon, size }) => {
    const isDisabled = spawnedComponents[componentType];
    
    return (
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`relative w-full h-14 rounded-xl ${bgColor} hover:scale-102 active:scale-98 
          transition-all duration-200 shadow-md border-2 border-white/30 flex items-center justify-between px-3
          touch-manipulation select-none ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
      >
        <div className="flex items-center space-x-2">
          <div className="text-2xl">{icon}</div>
          <div className="text-left">
            <div className="text-xs font-semibold text-white">{label}</div>
            <div className="text-[10px] text-white/80">{size}</div>
          </div>
        </div>
        <div className="text-white text-xl">{isDisabled ? '✓' : '+'}</div>
      </button>
    );
  };

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
          <h1 className="text-2xl font-bold text-white mb-2">🧩 Build Challenge Tabung - Mode Kreatif</h1>
          <p className="text-blue-100">Rakit tabung dari komponen 2D (alas, selimut, tutup)</p>
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

        {/* 2D Components Panel */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🧩</span>
            </div>
            <h2 className="font-semibold text-gray-800">Komponen 2D Tersedia</h2>
          </div>
          
          <div className="space-y-2">
            {/* Tabung Besar Components */}
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
              <h3 className="text-xs font-semibold text-amber-800 mb-2">🟫 Tabung Besar (Coklat)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Component2DButton
                  componentType="circle_large_bottom"
                  label="Alas Bawah"
                  size="Lingkaran Besar"
                  onClick={() => add2DComponent('circle_large_bottom', 0x8B4513)}
                  bgColor="bg-amber-600"
                  icon="⭕"
                />
                <Component2DButton
                  componentType="rect_large"
                  label="Selimut"
                  size="Persegi Panjang"
                  onClick={() => add2DComponent('rect_large', 0x8B4513)}
                  bgColor="bg-amber-700"
                  icon="▭"
                />
                <Component2DButton
                  componentType="circle_large_top"
                  label="Tutup Atas"
                  size="Lingkaran Besar"
                  onClick={() => add2DComponent('circle_large_top', 0x8B4513)}
                  bgColor="bg-amber-600"
                  icon="⭕"
                />
              </div>
            </div>
            
            {/* Tabung Sedang Components */}
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <h3 className="text-xs font-semibold text-blue-800 mb-2">🟦 Tabung Sedang (Biru)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Component2DButton
                  componentType="circle_medium_bottom"
                  label="Alas Bawah"
                  size="Lingkaran Sedang"
                  onClick={() => add2DComponent('circle_medium_bottom', 0x4169E1)}
                  bgColor="bg-blue-600"
                  icon="⭕"
                />
                <Component2DButton
                  componentType="rect_medium"
                  label="Selimut"
                  size="Persegi Panjang"
                  onClick={() => add2DComponent('rect_medium', 0x4169E1)}
                  bgColor="bg-blue-700"
                  icon="▭"
                />
                <Component2DButton
                  componentType="circle_medium_top"
                  label="Tutup Atas"
                  size="Lingkaran Sedang"
                  onClick={() => add2DComponent('circle_medium_top', 0x4169E1)}
                  bgColor="bg-blue-600"
                  icon="⭕"
                />
              </div>
            </div>
            
            {/* Tabung Kecil Components */}
            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
              <h3 className="text-xs font-semibold text-red-800 mb-2">🟥 Tabung Kecil (Merah)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Component2DButton
                  componentType="circle_small_bottom"
                  label="Alas Bawah"
                  size="Lingkaran Kecil"
                  onClick={() => add2DComponent('circle_small_bottom', 0xFF6347)}
                  bgColor="bg-red-600"
                  icon="⭕"
                />
                <Component2DButton
                  componentType="rect_small"
                  label="Selimut"
                  size="Persegi Panjang"
                  onClick={() => add2DComponent('rect_small', 0xFF6347)}
                  bgColor="bg-red-700"
                  icon="▭"
                />
                <Component2DButton
                  componentType="circle_small_top"
                  label="Tutup Atas"
                  size="Lingkaran Kecil"
                  onClick={() => add2DComponent('circle_small_top', 0xFF6347)}
                  bgColor="bg-red-600"
                  icon="⭕"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-3 bg-blue-50 rounded-lg p-2">
            <p className="text-xs text-blue-800 text-center">
              💡 <span className="font-semibold">Tips:</span> Drag komponen 2D ke hotspot yang sesuai warnanya!
            </p>
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
              <div className="h-80 md:h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p>Memuat scene 3D...</p>
                </div>
              </div>
            }>
              <div ref={mountRef} className="w-full h-80 md:h-96" />
            </Suspense>
          </div>
          
          {/* Hovering Zone Info */}
          {hoveredZone && (
            <div className="mt-2 bg-green-50 border border-green-300 rounded-lg p-2 animate-pulse">
              <p className="text-xs text-green-800 text-center font-medium">
                ✨ Drop di sini untuk pasang {hoveredZone.zoneType === 'bottom' ? 'Alas' : hoveredZone.zoneType === 'top' ? 'Tutup' : 'Selimut'}!
              </p>
            </div>
          )}
          
          {/* Progress Indicator */}
          <div className="mt-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-purple-800">Progress Perakitan:</span>
              <span className="text-xs font-bold text-purple-900">
                {cylinderParts.reduce((acc, parts) => 
                  acc + (parts.bottom.filled ? 1 : 0) + (parts.side.filled ? 1 : 0) + (parts.top.filled ? 1 : 0), 0
                )}/9 komponen
              </span>
            </div>
            <div className="space-y-1">
              {levelBlueprint.blueprint.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    cylinderParts[index].bottom.filled && cylinderParts[index].side.filled && cylinderParts[index].top.filled 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="text-xs text-gray-700">
                    {item.type === 'cylinder_large' ? '🟫 Tabung Besar' : 
                     item.type === 'cylinder_medium' ? '🟦 Tabung Sedang' : '🟥 Tabung Kecil'}
                  </span>
                  <div className="flex space-x-1 ml-auto">
                    <span className={`text-xs ${cylinderParts[index].bottom.filled ? 'text-green-600' : 'text-gray-400'}`}>⭕</span>
                    <span className={`text-xs ${cylinderParts[index].side.filled ? 'text-green-600' : 'text-gray-400'}`}>▭</span>
                    <span className={`text-xs ${cylinderParts[index].top.filled ? 'text-green-600' : 'text-gray-400'}`}>⭕</span>
                  </div>
                </div>
              ))}
            </div>
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
          {isLevelComplete ? '✅ Lihat Hasil' : '🧩 Rakit Menara Tabung'}
        </button>
      </div>

      {/* Analysis Modal */}
      {showAnalysis && analysisResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">📊 Analisis Menara Tabung</h3>
              <button 
                onClick={() => setShowAnalysis(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-900">Total Volume: {analysisResult.totalVolume} satuan³</p>
                <p className="text-sm font-semibold text-blue-900">Total Luas Permukaan: {analysisResult.totalSurfaceArea} satuan²</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2 text-gray-800">Detail Tabung Terakit:</h4>
                {analysisResult.breakdown.map(item => (
                  <div key={item.id} className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg mb-2 border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-800">
                      {item.name} #{item.id}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <p className="text-xs text-gray-600">
                        📏 Jari-jari: {item.radius}
                      </p>
                      <p className="text-xs text-gray-600">
                        📐 Tinggi: {item.height}
                      </p>
                      <p className="text-xs text-gray-600">
                        🧊 Volume: {item.volume}
                      </p>
                      <p className="text-xs text-gray-600">
                        📦 L.Permukaan: {item.surfaceArea}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                <p className="text-xs text-green-800 text-center">
                  ✨ Semua komponen 2D berhasil dirakit menjadi tabung 3D!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
