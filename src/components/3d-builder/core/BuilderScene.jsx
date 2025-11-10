/**
 * BuilderScene - Main 3D Builder Component
 * Reusable component that can work with any shape type
 */

'use client';

import { useRef, useEffect, useState, useCallback, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { addAnimatedBackground, animateBackground } from './SceneBackground';
import { animateComponentSnap, cleanupComponent } from './AnimationController';

export function BuilderScene({ 
  blueprint, 
  shapeBuilder,
  sceneRef, // ✅ Receive sceneRef from parent
  draggableObjectsRef,
  targetGroupRef,
  hotspotZonesRef,
  replacedItemsRef,
  createHotspotZones,
  selectedSize,
  itemParts,
  onPartFilled,
  setHoveredZone,
  resetTrigger = 0 // ✅ Trigger untuk force re-render saat reset
}) {
  const mountRef = useRef(null);
  // ❌ Don't create new scene - use the one from props!
  // const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  
  // Initialize raycaster with increased threshold for easier selection
  const raycaster = new THREE.Raycaster();
  raycaster.params.Points = { threshold: 1.0 };
  raycaster.params.Line = { threshold: 1.0 };
  const raycasterRef = useRef(raycaster);
  
  const pointerRef = useRef(new THREE.Vector2());
  const draggedObjectRef = useRef(null);
  const dragPlaneRef = useRef(new THREE.Plane());
  
  // Fire effect refs (ONLY for rocket)
  const fireEffectRef = useRef(null);
  const fireParticlesRef = useRef(null);
  const fireCreatedRef = useRef(false);
  
  const [rendererReady, setRendererReady] = useState(false);
  const [isLoading3D, setIsLoading3D] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [fps, setFps] = useState(0);
  const [sceneInitialized, setSceneInitialized] = useState(false);
  const blueprintRenderedRef = useRef(false);
  
  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.innerWidth <= 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  /**
   * Render target blueprint (ghost or solid meshes)
   */
  const renderTargetBlueprint = useCallback(() => {
    console.log('🎨 [renderTargetBlueprint] CALLED', { 
      blueprintItems: blueprint?.items?.length,
      hasShapeBuilder: !!shapeBuilder,
      selectedSize,
      sceneInitialized,
      rendererReady
    });
    
    // Wait for scene to be fully initialized
    if (!sceneInitialized || !rendererReady) {
      console.log('⏳ [renderTargetBlueprint] Scene not ready yet, skipping...');
      return;
    }
    
    if (!blueprint || !blueprint.items) {
      console.error('❌ [renderTargetBlueprint] Invalid blueprint!');
      return;
    }
    
    if (!sceneRef.current) {
      console.error('❌ [renderTargetBlueprint] Scene ref not available!');
      return;
    }
    
    // CRITICAL: Clean up old targetGroup completely
    if (targetGroupRef.current) {
      console.log('🧹 Removing old targetGroup');
      sceneRef.current.remove(targetGroupRef.current);
      
      // Dispose all children properly
      while(targetGroupRef.current.children.length > 0) {
        const child = targetGroupRef.current.children[0];
        targetGroupRef.current.remove(child);
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => mat.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
      targetGroupRef.current = null;
    }

    const targetGroup = new THREE.Group();
    targetGroupRef.current = targetGroup;

    blueprint.items.forEach((item, index) => {
      // Check if item already replaced with solid
      if (replacedItemsRef.current.has(index)) {
        console.log(`⏭️ [renderTargetBlueprint] Item ${index} already solid, skipping`);
        
        // Recreate solid mesh instead of ghost
        const solidMesh = shapeBuilder.createSolidMesh(
          item.type,
          item.color,
          item.params,
          selectedSize
        );
        
        solidMesh.position.copy(item.position);
        solidMesh.position.multiplyScalar(selectedSize);
        solidMesh.userData.isSolid = true;
        solidMesh.userData.itemIndex = index;
        
        // Set render order
        solidMesh.renderOrder = index;
        
        targetGroup.add(solidMesh);
        return;
      }
      
      // Create ghost mesh
      console.log(`👻 [renderTargetBlueprint] Creating ghost for item ${index}: ${item.type}`, {
        originalPos: item.position,
        params: item.params,
        scale: selectedSize
      });
      
      const ghostMesh = shapeBuilder.createGhostMesh(
        item.type,
        item.color,
        item.params,
        selectedSize
      );
      
      if (!ghostMesh) {
        console.error(`❌ [renderTargetBlueprint] createGhostMesh returned null for item ${index}`);
        return;
      }
      
      ghostMesh.position.copy(item.position);
      ghostMesh.position.multiplyScalar(selectedSize);
      ghostMesh.userData.itemIndex = index;
      
      // DON'T override renderOrder - keep it at -1 from createGhostMesh!
      // ghostMesh.renderOrder = index; ← INI YANG BIKIN GLOW OVERLAP!!
      
      targetGroup.add(ghostMesh);
      console.log(`✅ [renderTargetBlueprint] Ghost added:`, {
        index,
        type: item.type,
        position: { 
          x: ghostMesh.position.x.toFixed(2), 
          y: ghostMesh.position.y.toFixed(2), 
          z: ghostMesh.position.z.toFixed(2) 
        },
        height: item.params.height * selectedSize,
        radius: item.params.radius * selectedSize,
        bottom_y: (ghostMesh.position.y - (item.params.height * selectedSize / 2)).toFixed(2),
        top_y: (ghostMesh.position.y + (item.params.height * selectedSize / 2)).toFixed(2)
      });
    });

    console.log(`📦 [renderTargetBlueprint] Adding targetGroup with ${targetGroup.children.length} children to scene`);
    sceneRef.current.add(targetGroup);
    
    console.log('🎯 [renderTargetBlueprint] Calling createHotspotZones()');
    createHotspotZones();
    
    blueprintRenderedRef.current = true;
    
    // Force immediate render to ensure visibility
    if (rendererRef.current && cameraRef.current) {
      setTimeout(() => {
        console.log('🎬 Force render after blueprint creation');
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }, 50);
    }
    
    console.log('✅ [renderTargetBlueprint] COMPLETE');
  }, [blueprint, shapeBuilder, selectedSize, targetGroupRef, replacedItemsRef, createHotspotZones, sceneInitialized, rendererReady]);
  
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
        renderer.toneMapping = THREE.NoToneMapping; // ⭐ NO TONE MAPPING = NO GLOW BOOST!
        renderer.toneMappingExposure = 1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      } else {
        renderer.shadowMap.enabled = false;
      }
      
      // CRITICAL: Enable proper sorting for transparent objects
      renderer.sortObjects = true;
      
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      
      if (mount && mountRef.current) {
        mount.appendChild(renderer.domElement);
        setRendererReady(true);
      }

      const scene = sceneRef.current;
      
      // Add animated background
      addAnimatedBackground(scene, isMobile);

      const camera = cameraRef.current;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      // Adjust camera position based on shape type
      if (blueprint.shapeType === 'rocket') {
        // Rocket is taller, position camera higher
        camera.position.set(6, 9, 5);
      } else {
        camera.position.set(5, 5, 5);
      }
      
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

      // Lighting - Enhanced untuk tower yang lebih cerah & menarik!
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Lebih terang dari 0.4!
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); // Lebih terang dari 0.8!
      directionalLight.position.set(5, 10, 7.5);
      
      if (!isMobile) {
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
      }
      
      scene.add(directionalLight);
      
      // Rim light untuk highlight edges
      const rimLight = new THREE.DirectionalLight(0xb0d0ff, 0.5); // Lebih terang dari 0.3!
      rimLight.position.set(-5, 5, -5);
      scene.add(rimLight);
      
      // Fill light BARU - kurangi shadow gelap!
      const fillLight = new THREE.DirectionalLight(0xffd0a0, 0.4);
      fillLight.position.set(3, 3, -5);
      scene.add(fillLight);

      // Ground with checkerboard pattern
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
          
          if (controls && renderer && scene && camera && renderer.domElement) {
            try {
              animateBackground(scene, currentTime, isMobile);
              
              // 🔥 ANIMATE FIRE PARTICLES (ONLY for rocket)
              if (fireParticlesRef.current && blueprint.shapeType === 'rocket') {
                const { particles, positions, velocities, lifetimes, maxHeight } = fireParticlesRef.current;
                const positionAttribute = particles.geometry.attributes.position;
                
                for (let i = 0; i < positions.length / 3; i++) {
                  const i3 = i * 3;
                  
                  // Update position
                  positions[i3] += velocities[i3] * 0.016; // X
                  positions[i3 + 1] += velocities[i3 + 1] * 0.016; // Y (upward)
                  positions[i3 + 2] += velocities[i3 + 2] * 0.016; // Z
                  
                  // Update lifetime
                  lifetimes[i] += 0.01;
                  
                  // Reset particle when it goes too high or fades out
                  if (positions[i3 + 1] > maxHeight || lifetimes[i] > 1) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.8;
                    
                    positions[i3] = Math.cos(angle) * radius * selectedSize;
                    positions[i3 + 1] = Math.random() * 0.3 * selectedSize;
                    positions[i3 + 2] = Math.sin(angle) * radius * selectedSize;
                    
                    lifetimes[i] = 0;
                  }
                }
                
                positionAttribute.needsUpdate = true;
                
                // Update material color (gradient orange → yellow → red)
                const hue = 0.05 + Math.sin(currentTime * 0.002) * 0.05; // 0.0-0.1 (red-orange-yellow)
                particles.material.color.setHSL(hue, 1.0, 0.5);
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

      // Mark scene as fully initialized after a short delay
      setTimeout(() => {
        setIsLoading3D(false);
        setSceneInitialized(true);
        console.log('✅ Scene fully initialized, ready to render blueprint');
      }, 800);
      
      animate(0);
      
      // Render blueprint after scene is ready
      setTimeout(() => {
        if (sceneRef.current && rendererRef.current && cameraRef.current) {
          console.log('🎬 Initial render after scene setup');
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }, 1000);
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
      setSceneInitialized(false);
      blueprintRenderedRef.current = false;
    };
  }, [isMounted, isMobile]);
  
  // Render blueprint AFTER scene is fully initialized
  useEffect(() => {
    if (sceneInitialized && rendererReady && !blueprintRenderedRef.current) {
      console.log('🎬 Triggering initial blueprint render');
      // Small delay to ensure everything is stable
      const timer = setTimeout(() => {
        renderTargetBlueprint();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sceneInitialized, rendererReady, renderTargetBlueprint]);
  
  // Re-render blueprint on size change (only if already initialized)
  useEffect(() => {
    if (sceneInitialized && rendererReady && blueprintRenderedRef.current) {
      console.log('🔄 Re-rendering blueprint due to size change');
      blueprintRenderedRef.current = false; // Reset flag
      renderTargetBlueprint();
    }
  }, [selectedSize, sceneInitialized, rendererReady, renderTargetBlueprint]);
  
  // Re-render blueprint on reset trigger
  useEffect(() => {
    if (resetTrigger > 0 && sceneInitialized && rendererReady) {
      console.log('🔄 Re-rendering blueprint due to RESET');
      blueprintRenderedRef.current = false; // Reset flag
      renderTargetBlueprint();
    }
  }, [resetTrigger, sceneInitialized, rendererReady, renderTargetBlueprint]);

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

      // Use recursive intersect to handle Groups containing meshes
      const intersects = raycaster.intersectObjects(draggableObjectsRef.current, true);
      
      // Find the first draggable object (could be group or child mesh)
      let targetObject = null;
      for (let i = 0; i < intersects.length; i++) {
        const intersected = intersects[i].object;
        // Check if object itself is draggable
        if (intersected.userData.is2DComponent) {
          targetObject = intersected;
          break;
        }
        // Check if parent is draggable
        if (intersected.parent && intersected.parent.userData.is2DComponent) {
          targetObject = intersected.parent;
          break;
        }
      }
      
      if (targetObject) {
        isDragging = true;
        controls.enabled = false;
        draggedObjectRef.current = targetObject;
        
        // Hide children ONLY for cylinder (border rings), NOT for spheres
        // Spheres need their children (mesh + wireframe + edges) to stay visible
        const isSphereComponent = targetObject.userData.componentType && 
          targetObject.userData.componentType.includes('sphere_component');
        
        if (!isSphereComponent) {
          // Hide children for cylinder (border rings/edges) while dragging
          draggedObjectRef.current.children.forEach(child => {
            child.visible = false;
          });
        }
        
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
          
          const distanceToZone = draggedObjectRef.current.position.distanceTo(zone.position);
          // Very generous snap distance for easy snapping
          const snapDistance = blueprint.snapTolerance || 8.0;
          
          if (draggedType === acceptsType && distanceToZone < snapDistance) {
            currentHoveredZone = zone;
            zone.userData.originalOpacity = zone.material.opacity;
            zone.material.opacity = 0.9;
            zone.scale.set(1.15, 1.15, 1.15);
            setHoveredZone(zone.userData);
            renderer.domElement.style.cursor = 'copy';
          } else if (draggedType === acceptsType) {
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
    
    const onPointerUp = (event) => {
      if (isDragging && draggedObjectRef.current) {
        const draggedType = draggedObjectRef.current.userData.componentType;
        
        // Check if dropped on valid zone
        if (currentHoveredZone && currentHoveredZone.userData.acceptsType === draggedType) {
          // CRITICAL FIX: Get itemIndex with multiple fallbacks
          let itemIndex = currentHoveredZone.userData.itemIndex;
          
          // Fallback to cylinderIndex for backwards compatibility
          if (itemIndex === undefined || itemIndex === null) {
            itemIndex = currentHoveredZone.userData.cylinderIndex;
          }
          
          // Last resort: try to extract from acceptsType (e.g., "sphere_component_5" -> 5)
          if (itemIndex === undefined || itemIndex === null) {
            const match = currentHoveredZone.userData.acceptsType?.match(/_(\d+)$/);
            if (match) {
              itemIndex = parseInt(match[1], 10);
              console.warn('⚠️ itemIndex extracted from acceptsType:', itemIndex);
            }
          }
          
          const zoneType = currentHoveredZone.userData.zoneType;
          
          // CRITICAL: Get partId with fallback to zoneType for backward compatibility
          // ConeBuilder sets partId explicitly (bottom/side/top)
          // CylinderBuilder/SphereBuilder use zoneType as partId (bottom/side/top)
          const partId = currentHoveredZone.userData.partId || zoneType;
          
          // Debug logging
          console.log('Snap detected:', { 
            itemIndex, 
            zoneType,
            partId,
            hasPartId: currentHoveredZone.userData.partId !== undefined,
            fullUserData: currentHoveredZone.userData,
            hasItemIndex: currentHoveredZone.userData.itemIndex !== undefined,
            hasCylinderIndex: currentHoveredZone.userData.cylinderIndex !== undefined
          });
          
          const componentToAnimate = draggedObjectRef.current;
          
          isDragging = false;
          draggedObjectRef.current = null;
          
          // Animate component snapping to zone
          animateComponentSnap(componentToAnimate, currentHoveredZone, shapeBuilder, () => {
            // After animation completes
            cleanupComponent(componentToAnimate, sceneRef.current, draggableObjectsRef.current);
            
            // Update state - USE PARTID (with fallback to zoneType)
            onPartFilled(itemIndex, partId);
          }, blueprint.animationDuration || 500);
          
        } else {
          // Reset component if drop failed (only for cylinder, spheres stay visible)
          if (draggedObjectRef.current && draggedObjectRef.current.children) {
            const isSphereComponent = draggedObjectRef.current.userData.componentType && 
              draggedObjectRef.current.userData.componentType.includes('sphere_component');
            
            if (!isSphereComponent) {
              draggedObjectRef.current.children.forEach(child => {
                child.visible = true;
              });
            }
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
  }, [rendererReady, blueprint, shapeBuilder, hotspotZonesRef, draggableObjectsRef, onPartFilled, setHoveredZone]);

  // Create fire effect for rocket (ONLY after all parts complete)
  const createFireEffect = useCallback(() => {
    if (fireCreatedRef.current || blueprint.shapeType !== 'rocket') {
      return; // Only for rocket, and only once
    }
    
    console.log('🔥 Creating fire effect for rocket!');
    
    // Particle count (optimized for mobile)
    const particleCount = isMobile ? 80 : 120;
    
    // Create particle positions
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const lifetimes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Start position: random circle at base
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.8; // Within frustum base
      
      positions[i3] = Math.cos(angle) * radius * selectedSize;
      positions[i3 + 1] = Math.random() * 0.3 * selectedSize; // Start height
      positions[i3 + 2] = Math.sin(angle) * radius * selectedSize;
      
      // Velocity: upward with slight outward
      velocities[i3] = (Math.random() - 0.5) * 0.3;
      velocities[i3 + 1] = 0.5 + Math.random() * 0.5; // Upward speed
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.3;
      
      // Particle size
      sizes[i] = 0.1 + Math.random() * 0.15;
      
      // Lifetime (for fading)
      lifetimes[i] = Math.random();
    }
    
    // Create geometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create material with gradient colors
    const material = new THREE.PointsMaterial({
      size: 0.2 * selectedSize,
      color: 0xff6600, // Orange
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    
    // Create particle system
    const particles = new THREE.Points(geometry, material);
    particles.position.y = 0.5 * selectedSize; // Just above ground
    
    // Store refs for animation
    fireParticlesRef.current = {
      particles,
      positions,
      velocities,
      sizes,
      lifetimes,
      maxHeight: 1.5 * selectedSize
    };
    
    sceneRef.current.add(particles);
    fireEffectRef.current = particles;
    fireCreatedRef.current = true;
    
    console.log('✅ Fire effect created!');
  }, [blueprint.shapeType, isMobile, selectedSize, sceneRef]);

  // Render replacement effect (ghost to solid)
  useEffect(() => {
    if (!targetGroupRef.current || !targetGroupRef.current.children) {
      return;
    }
    
    itemParts.forEach((parts, index) => {
      const isComplete = shapeBuilder.validateCompletion(parts);
      
      console.log(`🔍 [BuilderScene] Item ${index} completion check:`, {
        parts,
        isComplete,
        alreadyReplaced: replacedItemsRef.current.has(index)
      });
      
      // Skip if already replaced
      if (replacedItemsRef.current.has(index)) {
        return;
      }
      
      // Find the mesh with matching itemIndex (not by array position!)
      const currentMesh = targetGroupRef.current.children.find(
        child => child.userData.itemIndex === index
      );
      
      // Only replace if complete and still a ghost
      if (currentMesh && isComplete && currentMesh.userData.isGhost) {
        console.log(`🔧 REPLACING item ${index} with SOLID mesh!`, {
          currentPosition: currentMesh.position,
          isGhost: currentMesh.userData.isGhost
        });
        
        const item = blueprint.items[index];
        const solidMesh = shapeBuilder.createSolidMesh(
          item.type,
          item.color,
          item.params,
          selectedSize
        );
        
        // Copy exact position and properties
        solidMesh.position.copy(currentMesh.position);
        solidMesh.rotation.copy(currentMesh.rotation);
        solidMesh.scale.copy(currentMesh.scale);
        solidMesh.userData.itemIndex = index;
        solidMesh.userData.cylinderIndex = index;
        solidMesh.userData.isSolid = true;
        solidMesh.renderOrder = index;
        
        // Remove ghost from scene (properly dispose Group with children)
        targetGroupRef.current.remove(currentMesh);
        
        // Dispose geometry and materials for Group with children
        if (currentMesh.children && currentMesh.children.length > 0) {
          // Ghost mesh is a Group with children (sphere + wireframe + edges)
          currentMesh.children.forEach(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          });
        }
        
        // Dispose parent geometry/material if exists
        if (currentMesh.geometry) currentMesh.geometry.dispose();
        if (currentMesh.material) {
          if (Array.isArray(currentMesh.material)) {
            currentMesh.material.forEach(mat => mat.dispose());
          } else {
            currentMesh.material.dispose();
          }
        }
        
        // Add solid mesh at same position in hierarchy
        targetGroupRef.current.add(solidMesh);
        
        // Mark as replaced (PERSISTENT)
        replacedItemsRef.current.add(index);
        
        console.log(`🗑️ [BuilderScene] Removing hotspots for item ${index}`);
        console.log(`   Total hotspots before: ${hotspotZonesRef.current.length}`);
        console.log(`   Item details:`, {
          itemId: blueprint.items[index].id,
          itemType: blueprint.items[index].type,
          totalParts: blueprint.items[index].parts.length
        });
        
        // REMOVE (not just hide) hotspots for this completed item
        let removedCount = 0;
        const hotspotsToRemove = [];
        
        hotspotZonesRef.current.forEach((zone, zoneIdx) => {
          const zoneItemIndex = zone.userData.itemIndex;
          const zoneCylinderIndex = zone.userData.cylinderIndex;
          
          console.log(`   [${zoneIdx}] Zone check:`, {
            zoneItemIndex,
            zoneCylinderIndex,
            targetIndex: index,
            zoneType: zone.userData.zoneType,
            partId: zone.userData.partId,
            acceptsType: zone.userData.acceptsType,
            hasParent: !!zone.parent,
            parentName: zone.parent?.type || 'unknown',
            shouldRemove: zoneItemIndex === index || zoneCylinderIndex === index
          });
          
          // Match by itemIndex OR cylinderIndex
          if (zoneItemIndex === index || zoneCylinderIndex === index) {
            hotspotsToRemove.push(zone);
            
            // Remove from scene completely
            if (zone.parent) {
              zone.parent.remove(zone);
              removedCount++;
              console.log(`   ✅ REMOVED from parent: ${zone.userData.partId} (${zone.userData.zoneType})`);
            } else {
              console.warn(`   ⚠️ Zone has NO PARENT: ${zone.userData.partId}`);
            }
            
            // Dispose geometry and material
            if (zone.geometry) {
              zone.geometry.dispose();
            }
            if (zone.material) {
              zone.material.dispose();
            }
          }
        });
        
        // Clean up hotspotZonesRef array
        const beforeLength = hotspotZonesRef.current.length;
        hotspotZonesRef.current = hotspotZonesRef.current.filter(zone => {
          const zoneItemIndex = zone.userData.itemIndex || zone.userData.cylinderIndex;
          return zoneItemIndex !== index;
        });
        const afterLength = hotspotZonesRef.current.length;
        
        console.log(`   📊 Hotspot removal summary:`, {
          removedFromScene: removedCount,
          removedFromArray: beforeLength - afterLength,
          hotspotsRemaining: afterLength,
          itemsRemaining: hotspotsToRemove.map(z => `${z.userData.partId}(${z.userData.zoneType})`)
        });
        
        // Force re-render
        if (rendererRef.current && cameraRef.current && sceneRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
        
        console.log(`✅ Item ${index} is now SOLID`);
      }
    });
    
    // 🔥 CHECK: Create fire effect when ALL rocket parts complete
    if (blueprint.shapeType === 'rocket' && 
        replacedItemsRef.current.size === 3 && 
        !fireCreatedRef.current) {
      console.log('🚀 All rocket parts complete! Triggering fire effect...');
      createFireEffect();
    }
    
  }, [itemParts, blueprint, shapeBuilder, selectedSize, targetGroupRef, replacedItemsRef, hotspotZonesRef, createFireEffect]);

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50 h-full relative">
      {/* Loading Overlay */}
      {(isLoading3D || !sceneInitialized) && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600 font-medium">Memuat Scene 3D...</p>
            <p className="text-xs text-gray-400 mt-1">
              {!rendererReady ? 'Inisialisasi renderer...' : 'Menyiapkan blueprint...'}
            </p>
          </div>
        </div>
      )}
      
      <Suspense fallback={
        <div className="h-full flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p>Memuat scene 3D...</p>
          </div>
        </div>
      }>
        <div ref={mountRef} className="w-full h-full" />
      </Suspense>
    </div>
  );
}
