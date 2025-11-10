/**
 * ConeBuilder - Handles cone geometry creation for rocket system
 * Supports cone with circle base + sector (juring) side
 */

import * as THREE from 'three';
import { calculateCone } from '../config/shapeCalculations';

export class ConeBuilder {
  constructor(isMobile = false) {
    this.isMobile = isMobile;
  }

  /**
   * Create 2D component (circle or sector)
   * @param {string} componentType - Component identifier
   * @param {string} partType - 'circle' or 'sector'
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius/radiusBottom/radiusTop, height}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  create2DComponent(componentType, partType, color, params, scale = 1) {
    if (partType === 'circle') {
      // Detect which circle: bottom uses radiusBottom, top uses radiusTop
      const radius = componentType.includes('bottom') 
        ? (params.radiusBottom || params.radius)
        : componentType.includes('top')
          ? (params.radiusTop || params.radius)
          : params.radius;
      return this.createCircle(componentType, color, radius, scale);
    } else if (partType === 'sector') {
      return this.createSector(componentType, color, params, scale);
    } else if (partType === 'rectangle') {
      return this.createRectangle(componentType, color, params, scale);
    }
    
    console.error(`Unknown part type: ${partType}`);
    return null;
  }

  /**
   * Create circle component (alas/base)
   * @param {string} componentType - Component identifier
   * @param {number} color - Hex color
   * @param {number} radius - Circle radius
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createCircle(componentType, color, radius, scale = 1) {
    const scaledRadius = radius * scale;
    const geometry = new THREE.CircleGeometry(scaledRadius, 32);
    
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      metalness: 0.3,
      roughness: 0.6
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // Lie flat
    
    mesh.userData.componentType = componentType;
    mesh.userData.is2DComponent = true;
    mesh.userData.partType = 'circle';
    mesh.userData.radius = scaledRadius;
    mesh.userData.scale = scale;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  /**
   * Create sector component (selimut juring kerucut)
   * @param {string} componentType - Component identifier
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius/radiusBottom/radiusTop, height}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createSector(componentType, color, params, scale = 1) {
    // Support frustum (kerucut terpotong) with radiusBottom and radiusTop
    const radiusBottom = (params.radiusBottom || params.radius) * scale;
    const radiusTop = (params.radiusTop || 0) * scale; // 0 for perfect cone
    const height = params.height * scale;
    
    // For frustum, use average radius for sector calculation
    const radius = radiusTop > 0 ? (radiusBottom + radiusTop) / 2 : radiusBottom;
    
    // Calculate slant height (garis pelukis)
    const slantHeight = Math.sqrt(
      Math.pow(radiusBottom - radiusTop, 2) + Math.pow(height, 2)
    );
    
    // Calculate sector angle in radians
    // Keliling alas = panjang busur: 2πr = θl → θ = 2πr/l
    const theta = (2 * Math.PI * radius) / slantHeight;
    
    // Create sector as partial circle
    const geometry = new THREE.CircleGeometry(slantHeight, 64, 0, theta);
    
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      metalness: 0.3,
      roughness: 0.6
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2; // Lie flat
    
    mesh.userData.componentType = componentType;
    mesh.userData.is2DComponent = true;
    mesh.userData.partType = 'sector';
    mesh.userData.radiusBottom = radiusBottom;
    mesh.userData.radiusTop = radiusTop;
    mesh.userData.height = height;
    mesh.userData.slantHeight = slantHeight;
    mesh.userData.theta = theta;
    mesh.userData.scale = scale;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  /**
   * Create rectangle component (selimut tabung)
   * @param {string} componentType - Component identifier
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius, height}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createRectangle(componentType, color, params, scale = 1) {
    const radius = params.radius * scale;
    const height = params.height * scale;
    
    // Calculate rectangle dimensions
    const width = 2 * Math.PI * radius; // Keliling = panjang selimut
    
    const geometry = new THREE.PlaneGeometry(width, height);
    
    const material = new THREE.MeshStandardMaterial({
      color,
      side: THREE.DoubleSide,
      metalness: 0.3,
      roughness: 0.6
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Add border for visual clarity
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: 0x333333, 
      linewidth: 2 
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    mesh.add(edges);
    
    mesh.userData.componentType = componentType;
    mesh.userData.is2DComponent = true;
    mesh.userData.partType = 'rectangle';
    mesh.userData.width = width;
    mesh.userData.height = height;
    mesh.userData.radius = radius;
    mesh.userData.scale = scale;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    
    return mesh;
  }

  /**
   * Create mesh (cone, frustum, or cylinder)
   * @param {string} type - Type identifier (cone_base, cylinder_body, cone_nose)
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters {radius/radiusBottom/radiusTop, height}
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createMesh(type, color, params, scale = 1) {
    const height = params.height * scale;
    const radialSegments = this.isMobile ? 16 : 32;
    
    let geometry;
    let shapeType;
    
    // Detect if cylinder or cone
    if (type.includes('cylinder')) {
      const radius = params.radius * scale;
      geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
      shapeType = 'cylinder';
    } else {
      // Cone or Frustum
      const radiusTop = (params.radiusTop || 0) * scale;
      const radiusBottom = (params.radiusBottom || params.radius) * scale;
      
      // CylinderGeometry can create frustum: (radiusTop, radiusBottom, height)
      geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
      shapeType = radiusTop > 0 ? 'frustum' : 'cone';
    }
    
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.4,
      roughness: 0.5
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = height / 2; // Center at base
    
    mesh.userData.shapeType = shapeType;
    mesh.userData.type = type;
    mesh.userData.radiusBottom = params.radiusBottom || params.radius;
    mesh.userData.radiusTop = params.radiusTop || 0;
    mesh.userData.radius = params.radius; // Keep for backward compatibility
    mesh.userData.height = height;
    mesh.userData.scale = scale;
    
    if (!this.isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }

  /**
   * Create ghost mesh (transparent wireframe preview)
   * @param {string} type - Cone type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createGhostMesh(type, color, params, scale = 1) {
    const mesh = this.createMesh(type, color, params, scale);
    
    // Ghost material - transparent wireframe
    const ghostMaterial = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.4,
      wireframe: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    mesh.material.dispose();
    mesh.material = ghostMaterial;
    mesh.userData.isGhost = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    
    return mesh;
  }

  /**
   * Create solid mesh (final cone after assembly)
   * @param {string} type - Cone type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createSolidMesh(type, color, params, scale = 1) {
    const mesh = this.createMesh(type, color, params, scale);
    
    // Solid material - vibrant & glossy seperti tower
    const baseColor = new THREE.Color(color);
    const brightColor = baseColor.clone().multiplyScalar(1.5);
    
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: brightColor,
      metalness: 0.45,
      roughness: 0.2,
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.3
    });
    
    mesh.material.dispose();
    mesh.material = solidMaterial;
    mesh.userData.isSolid = true;
    mesh.castShadow = !this.isMobile;
    mesh.receiveShadow = !this.isMobile;
    
    return mesh;
  }

  /**
   * Create hotspot zone for snapping
   * CRITICAL: Position calculation must match how createMesh positions the mesh!
   * createMesh sets mesh.position.y = height/2, so item position is at CENTER of shape
   * 
   * @param {string} partId - Part identifier (bottom/side/top)
   * @param {string} partType - 'circle', 'sector', or 'rectangle'
   * @param {THREE.Vector3} position - Zone position (item CENTER position from blueprint)
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @param {string} acceptsType - Component type this zone accepts
   * @param {number} itemIndex - Item index
   * @param {boolean} isFilled - Whether zone is already filled
   * @returns {THREE.Mesh}
   */
  createHotspotZone(partId, partType, position, params, scale, acceptsType, itemIndex, isFilled) {
    let geometry, material, zone;
    const height = params.height * scale;
    const initialOpacity = isFilled ? 0.3 : 0.7;
    
    // Get appropriate radius based on part
    let radius;
    if (partType === 'circle') {
      if (partId === 'bottom') {
        radius = (params.radiusBottom || params.radius) * scale;
      } else if (partId === 'top') {
        radius = (params.radiusTop || params.radius) * scale;
      }
      
      // FULL CIRCLE (seperti CylinderBuilder)
      geometry = new THREE.CircleGeometry(radius * 1.05, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Hijau
        transparent: true,
        opacity: initialOpacity,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        polygonOffsetUnits: -1
      });
      
      zone = new THREE.Mesh(geometry, material);
      zone.rotation.x = -Math.PI / 2; // Flat horizontal
      zone.position.copy(position);
      
      // CRITICAL: Position relative to CENTER (like CylinderBuilder!)
      if (partId === 'bottom') {
        zone.position.y -= height / 2 + 0.05; // MINUS from center to bottom
      } else if (partId === 'top') {
        zone.position.y += height / 2 + 0.05; // PLUS from center to top
      }
      
    } else if (partType === 'sector') {
      // Sector hotspot - RING (torus) at middle
      radius = (params.radiusBottom || params.radius) * scale;
      const radiusTop = (params.radiusTop || 0) * scale;
      
      // For frustum (radiusTop > 0): ring at average radius
      // For cone (radiusTop = 0): ring at 0.5 * radius (smaller, at middle height)
      const midRadius = radiusTop > 0 
        ? (radius + radiusTop) / 2 
        : radius * 0.5;  // Cone: setengah radius
      
      const torusThickness = height * 0.03;
      
      geometry = new THREE.TorusGeometry(midRadius, torusThickness, 16, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Merah untuk selimut
        transparent: true,
        opacity: initialOpacity,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      
      zone = new THREE.Mesh(geometry, material);
      zone.rotation.x = Math.PI / 2;
      zone.position.copy(position);
      // NO OFFSET! Position is already at center
      
    } else if (partType === 'rectangle') {
      // Rectangle hotspot - RING at middle of cylinder
      radius = params.radius * scale;
      const torusThickness = height * 0.03;
      
      geometry = new THREE.TorusGeometry(radius * 1.05, torusThickness, 16, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Merah untuk selimut
        transparent: true,
        opacity: initialOpacity,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      
      zone = new THREE.Mesh(geometry, material);
      zone.rotation.x = Math.PI / 2;
      zone.position.copy(position);
      // NO OFFSET! Position is already at center
    }
    
    zone.userData.isHotspotZone = true;
    zone.userData.zoneType = partType;
    zone.userData.partId = partId;
    zone.userData.itemIndex = itemIndex;
    zone.userData.acceptsType = acceptsType;
    zone.userData.isValid = true;
    zone.userData.originalOpacity = material.opacity;
    
    // CRITICAL: Very high renderOrder
    zone.renderOrder = 999;
    zone.visible = !isFilled;
    
    return zone;
  }

  /**
   * Get spawn position for 2D component
   * @param {string} partType - 'circle', 'sector', or 'rectangle'
   * @param {object} spawnConfig - Spawn configuration from blueprint
   * @returns {THREE.Vector3}
   */
  getSpawnPosition(partType, spawnConfig) {
    const config = spawnConfig[partType] || spawnConfig.circle;
    
    const angle = Math.random() * Math.PI * 2;
    const distance = config.min + Math.random() * (config.max - config.min);
    
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;
    const y = spawnConfig.heightRange.min + 
              Math.random() * (spawnConfig.heightRange.max - spawnConfig.heightRange.min);
    
    return new THREE.Vector3(x, y, z);
  }

  /**
   * Validate if all parts of a component are completed
   * @param {object} parts - Parts status object
   * @returns {boolean}
   */
  validateCompletion(parts) {
    // Debug log
    console.log('🔍 [ConeBuilder.validateCompletion] Checking parts:', parts);
    
    // Check if all defined parts are filled
    const allParts = Object.keys(parts);
    const result = allParts.length > 0 && allParts.every(partId => parts[partId]?.filled === true);
    
    console.log('🔍 [ConeBuilder.validateCompletion] Result:', {
      allParts,
      filledStatus: allParts.map(id => `${id}: ${parts[id]?.filled}`),
      isComplete: result
    });
    
    return result;
  }

  /**
   * Calculate volume and surface area
   * @param {object} params - Shape parameters { radius/radiusBottom/radiusTop, height }
   * @returns {object} - Calculation results
   */
  calculate(params) {
    // Support both cone and cylinder
    if (params.radius && !params.radiusBottom) {
      // Standard cone or cylinder
      return calculateCone(params.radius, params.height);
    } else {
      // Frustum or other shape - use radiusBottom for now
      return calculateCone(params.radiusBottom || params.radius, params.height);
    }
  }

  /**
   * Get rotation for component snap animation
   * @param {string} zoneType - Zone type ('circle', 'sector', 'rectangle')
   * @returns {THREE.Euler}
   */
  getSnapRotation(zoneType) {
    if (zoneType === 'circle') {
      // Circles lie flat (horizontal)
      return new THREE.Euler(-Math.PI / 2, 0, 0);
    } else if (zoneType === 'sector') {
      // Sectors also lie flat
      return new THREE.Euler(-Math.PI / 2, 0, 0);
    } else if (zoneType === 'rectangle') {
      // Rectangles wrap around cylinder (vertical)
      return new THREE.Euler(0, 0, 0);
    }
    return new THREE.Euler(0, 0, 0);
  }
}
