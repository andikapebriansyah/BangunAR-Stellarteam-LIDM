/**
 * SphereBuilder - Shape builder for spheres (bracelet formation)
 * Creates wireframe spheres that snap into glossy metallic jewelry
 */

import * as THREE from 'three';

export class SphereBuilder {
  constructor(isMobile = false) {
    this.isMobile = isMobile;
  }

  /**
   * Create basic sphere mesh
   * @param {string} type - Sphere type (sphere_1, sphere_2, etc)
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createMesh(type, color, params, scale = 1) {
    const radius = params.radius * scale;
    
    // Higher segments for smoother sphere
    const widthSegments = this.isMobile ? 16 : 32;
    const heightSegments = this.isMobile ? 12 : 24;
    
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
    const material = new THREE.MeshPhongMaterial({
      color,
      shininess: 80,
      transparent: false,
      opacity: 1.0,
      emissive: new THREE.Color(color).multiplyScalar(0.05)
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.radius = radius;
    mesh.userData.scale = scale;
    
    if (!this.isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }

  /**
   * Create sphere component (spawned object - LANGSUNG SOLID)
   * @param {string} componentType - Component identifier
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Group}
   */
  createSphereComponent(componentType, color, params, scale = 1) {
    const radius = params.radius * scale;
    const widthSegments = this.isMobile ? 24 : 32;
    const heightSegments = this.isMobile ? 18 : 24;
    
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
    // Solid material - langsung glossy seperti jewelry (NO EMISSIVE = NO GLOW!)
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.6,
      roughness: 0.25,
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.0
    });
    
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    // Create group
    const group = new THREE.Group();
    group.add(sphere);
    
    group.userData.componentType = componentType;
    group.userData.is2DComponent = true;
    group.userData.radius = radius;
    group.userData.scale = scale;
    
    return group;
  }

  /**
   * Alias for createSphereComponent to maintain consistency with CylinderBuilder API
   * Called by ComponentPanel through handleSpawnComponent
   */
  create2DComponent(componentType, partType, color, params, scale = 1) {
    // For sphere, partType is always 'sphere', but we ignore it
    // and use the unified createSphereComponent method
    return this.createSphereComponent(componentType, color, params, scale);
  }

  /**
   * Create hotspot zone (spherical collision area)
   * @param {string} partId - Part identifier (not used for sphere, but kept for interface consistency)
   * @param {string} partType - Part type (not used for sphere)
   * @param {THREE.Vector3} position - Hotspot position
   * @param {object} params - Shape parameters {radius}
   * @param {number} scale - Scale multiplier
   * @param {string} acceptsType - Component type this zone accepts
   * @param {number} itemIndex - Index of the sphere in bracelet
   * @param {boolean} isFilled - Whether this position is already filled
   * @returns {THREE.Mesh}
   */
  createHotspotZone(partId, partType, position, params, scale, acceptsType, itemIndex, isFilled = false) {
    console.log('🎯 SphereBuilder.createHotspotZone called with ALL ARGS:', arguments);
    console.log('🎯 Parsed params:', { 
      partId, 
      partType, 
      position: position?.toArray?.(), 
      params, 
      scale, 
      acceptsType, 
      itemIndex: itemIndex,
      itemIndexType: typeof itemIndex,
      isFilled 
    });
    
    const radius = params.radius * scale;
    
    // Larger sphere for easier snapping
    const zoneRadius = radius * 1.3;
    const geometry = new THREE.SphereGeometry(zoneRadius, 16, 12);
    
    // Get color from acceptsType to match sphere color
    const sphereColorMap = {
      'sphere_component_0': 0xFF0000, // Red
      'sphere_component_1': 0xFF7F00, // Orange
      'sphere_component_2': 0xFFFF00, // Yellow
      'sphere_component_3': 0x00FF00, // Green
      'sphere_component_4': 0x00FFFF, // Cyan
      'sphere_component_5': 0x0000FF, // Blue
      'sphere_component_6': 0x4B0082, // Indigo
      'sphere_component_7': 0x8B00FF, // Violet
      'sphere_component_8': 0xFF1493, // Pink
    };
    
    const zoneColor = sphereColorMap[acceptsType] || 0x00ff00;
    
    // Color-coded hotspot - LEBIH HALUS (sama warna dengan sphere tapi lebih transparan)
    const material = new THREE.MeshBasicMaterial({
      color: zoneColor,
      transparent: true,
      opacity: isFilled ? 0.05 : 0.15, // SANGAT HALUS - tidak terlalu jelas
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    
    const zone = new THREE.Mesh(geometry, material);
    zone.position.copy(position);
    
    // CRITICAL FIX: Ensure itemIndex is ALWAYS set and valid
    const validItemIndex = (itemIndex !== undefined && itemIndex !== null) ? itemIndex : 0;
    
    zone.userData.zoneType = 'sphere'; // All spheres use same type
    zone.userData.itemIndex = validItemIndex; // GUARANTEED to be a number
    zone.userData.acceptsType = acceptsType;
    zone.userData.originalOpacity = material.opacity;
    
    console.log('✅ Zone created with userData:', { 
      zoneType: zone.userData.zoneType, 
      itemIndex: zone.userData.itemIndex, 
      acceptsType: zone.userData.acceptsType,
      isValid: zone.userData.itemIndex !== undefined
    });
    
    // VERIFICATION: Throw error if still undefined (should never happen)
    if (zone.userData.itemIndex === undefined) {
      console.error('❌ CRITICAL: itemIndex is STILL undefined after assignment!');
      console.error('Arguments received:', { partId, partType, position, params, scale, acceptsType, itemIndex, isFilled });
    }
    
    // Very high renderOrder to ensure always visible
    zone.renderOrder = 999;
    
    return zone;
  }

  /**
   * Create ghost (transparent preview) mesh with wireframe
   * @param {string} type - Sphere type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createGhostMesh(type, color, params, scale = 1) {
    const radius = params.radius * scale;
    const widthSegments = 12;
    const heightSegments = 8;
    
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
    // 🔍 DEBUG: Log setiap ghost yang dibuat
    console.log('🎯 CREATING GHOST SPHERE:', {
      type,
      color: `#${color.toString(16).padStart(6, '0')}`,
      radius,
      segments: `${widthSegments}x${heightSegments}`
    });
    
    // Ghost material - BASIC material dengan linewidth control
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
      depthWrite: false,
      depthTest: true,
      wireframe: true,
      fog: false
    });
    
    const mesh = new THREE.Mesh(geometry, ghostMaterial);
    mesh.userData.isGhost = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.renderOrder = -1;
    
    // 🔍 DEBUG: Confirm mesh created
    console.log('✅ Ghost mesh created:', mesh.uuid);
    
    return mesh;
  }

  /**
   * Create solid mesh (beautiful jewelry/pearl effect)
   * @param {string} type - Sphere type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createSolidMesh(type, color, params, scale = 1) {
    const radius = params.radius * scale;
    const widthSegments = this.isMobile ? 24 : 32;
    const heightSegments = this.isMobile ? 18 : 24;
    
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    
    // Beautiful metallic/pearl material for jewelry effect
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.6,          // Metallic like jewelry
      roughness: 0.25,         // Shiny/glossy
      emissive: new THREE.Color(color).multiplyScalar(0.05), // REDUCED: subtle glow only
      emissiveIntensity: 0.15, // REDUCED: prevent excessive blur
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.2     // Reflective
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.isSolid = true;
    mesh.userData.radius = radius;
    mesh.userData.scale = scale;
    
    if (!this.isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }

  /**
   * Validate if sphere is placed (simplified - single item, not parts)
   * @param {object} itemState - State object with structure {sphere: {filled: boolean, type: string}}
   * @returns {boolean}
   */
  validateCompletion(itemState) {
    // For sphere bracelet, itemState structure is: {sphere: {filled: true/false, type: '...'}}
    if (itemState.sphere) {
      return itemState.sphere.filled === true;
    }
    
    // Fallback for direct structure: {filled: true/false}
    return itemState.filled === true;
  }

  /**
   * Calculate sphere properties
   * @param {object} params - Shape parameters {radius}
   * @returns {object} - Volume and surface area
   */
  calculate(params) {
    const r = params.radius;
    const volume = (4/3) * Math.PI * Math.pow(r, 3);
    const surfaceArea = 4 * Math.PI * Math.pow(r, 2);
    
    return {
      volume: volume.toFixed(3),
      surfaceArea: surfaceArea.toFixed(3),
      radius: r.toFixed(3),
      diameter: (r * 2).toFixed(3)
    };
  }

  /**
   * Get spawn position for sphere component
   * @param {string} partType - Not used for sphere (kept for interface)
   * @param {object} spawnConfig - Spawn configuration
   * @returns {THREE.Vector3}
   */
  getSpawnPosition(partType, spawnConfig) {
    // Random position around the bracelet circle
    const minDistance = spawnConfig.sphere?.min || 3.5;
    const maxDistance = spawnConfig.sphere?.max || 6.0;
    const angle = Math.random() * Math.PI * 2;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    
    return new THREE.Vector3(
      Math.cos(angle) * distance,
      spawnConfig.heightRange?.min || 0.5,
      Math.sin(angle) * distance
    );
  }

  /**
   * Get rotation for snapped sphere (no rotation needed for sphere)
   * @param {string} partId - Part identifier
   * @returns {THREE.Euler}
   */
  getSnapRotation(partId) {
    return new THREE.Euler(0, 0, 0);
  }
}
