/**
 * CylinderBuilder Class
 * Handles cylinder-specific mesh creation, hotspot zones, and validation
 */

import * as THREE from 'three';
import { calculateCylinder } from '../config/shapeCalculations';

export class CylinderBuilder {
  constructor(isMobile = false) {
    this.isMobile = isMobile;
    this.shapeType = 'cylinder';
  }

  /**
   * Create a 3D cylinder mesh
   * @param {string} type - Cylinder type ('cylinder_large', 'cylinder_medium', 'cylinder_small')
   * @param {number} color - Hex color
   * @param {object} params - { radius, height }
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createMesh(type, color, params, scale = 1) {
    const radius = params.radius * scale;
    const height = params.height * scale;
    
    // Increased segments for smoother rendering
    const radialSegments = this.isMobile ? 16 : 32;
    const heightSegments = this.isMobile ? 1 : 2;
    
    const geometry = new THREE.CylinderGeometry(
      radius, 
      radius, 
      height, 
      radialSegments,
      heightSegments
    );
    
    // Material dengan efek metalik untuk menara
    const material = new THREE.MeshPhongMaterial({ 
      color,
      shininess: 80,
      transparent: false,
      emissive: new THREE.Color(color).multiplyScalar(0.05),
      flatShading: false // Smooth shading
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.type = type;
    mesh.userData.height = height;
    mesh.userData.radius = radius;
    mesh.userData.scale = scale;
    
    if (!this.isMobile) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
    
    return mesh;
  }

  /**
   * Create a 2D component (circle or rectangle)
   * @param {string} componentType - Component identifier
   * @param {string} partType - 'circle' or 'rectangle'
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  create2DComponent(componentType, partType, color, params, scale = 1) {
    let geometry;
    let mesh;
    
    if (partType === 'circle') {
      // Lingkaran untuk tutup/alas
      const radius = params.radius * scale;
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
      
    } else if (partType === 'rectangle') {
      // Persegi panjang untuk selimut
      const radius = params.radius * scale;
      const height = params.height * scale;
      const width = 2 * Math.PI * radius;
      
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
      mesh.userData.radius = radius;
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
  }

  /**
   * Create hotspot zone for a cylinder part
   * @param {string} partId - Part identifier ('bottom', 'side', 'top')
   * @param {string} partType - Part geometry type
   * @param {THREE.Vector3} position - Hotspot position
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @param {string} acceptsType - Component type this zone accepts
   * @param {number} itemIndex - Index of the item
   * @param {boolean} isFilled - Whether this part is already filled
   * @returns {THREE.Mesh}
   */
  createHotspotZone(partId, partType, position, params, scale, acceptsType, itemIndex, isFilled = false) {
    const radius = params.radius * scale;
    const height = params.height * scale;
    
    let geometry, material, zone;
    // Increased opacity for much better visibility
    const initialOpacity = isFilled ? 0.3 : 0.7;
    
    if (partId === 'bottom') {
      // Bottom zone - FULL CIRCLE hijau untuk petunjuk alas
      geometry = new THREE.CircleGeometry(radius * 1.05, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Hijau untuk alas
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
      zone.rotation.x = -Math.PI / 2;
      zone.position.copy(position);
      
      // Consistent small offset untuk semua bottom zones
      zone.position.y -= height / 2 + 0.05;
      
    } else if (partId === 'top') {
      // Top zone - FULL CIRCLE hijau untuk petunjuk tutup
      geometry = new THREE.CircleGeometry(radius * 1.05, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0x00ff00, // Hijau untuk tutup
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
      zone.rotation.x = -Math.PI / 2;
      zone.position.copy(position);
      zone.position.y += height / 2 + 0.05;
      
    } else if (partId === 'side') {
      // Side zone - RING/TORUS merah untuk petunjuk selimut
      const torusRadius = radius * 1.05;
      const torusThickness = height * 0.03;
      geometry = new THREE.TorusGeometry(torusRadius, torusThickness, 16, 64);
      material = new THREE.MeshBasicMaterial({
        color: 0xff0000, // Merah untuk selimut
        transparent: true,
        opacity: isFilled ? 0.3 : 0.7,
        depthWrite: false,
        depthTest: false,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      
      zone = new THREE.Mesh(geometry, material);
      zone.rotation.x = Math.PI / 2;
      zone.position.copy(position);
    }
    
    zone.userData.zoneType = partId;
    zone.userData.partId = partId; // Explicit partId for consistency
    zone.userData.itemIndex = itemIndex;
    zone.userData.cylinderIndex = itemIndex; // For backward compatibility
    zone.userData.acceptsType = acceptsType;
    zone.userData.originalOpacity = material.opacity;
    
    // CRITICAL: Very high renderOrder to ensure hotspots always render on top
    zone.renderOrder = 999;
    
    return zone;
  }

  /**
   * Create ghost (transparent) mesh for preview
   * @param {string} type - Cylinder type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createGhostMesh(type, color, params, scale = 1) {
    const mesh = this.createMesh(type, color, params, scale);
    
    // Ghost material untuk preview - improved to prevent z-fighting
    const ghostMaterial = new THREE.MeshPhongMaterial({
      color,
      transparent: true,
      opacity: 0.35, // Slightly more visible
      side: THREE.FrontSide,
      depthWrite: true,
      depthTest: true,
      shininess: 30,
      emissive: new THREE.Color(color).multiplyScalar(0.1)
    });
    
    mesh.material.dispose();
    mesh.material = ghostMaterial;
    mesh.userData.isGhost = true;
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    
    return mesh;
  }

  /**
   * Create solid mesh (replaces ghost)
   * @param {string} type - Cylinder type
   * @param {number} color - Hex color
   * @param {object} params - Shape parameters
   * @param {number} scale - Scale multiplier
   * @returns {THREE.Mesh}
   */
  createSolidMesh(type, color, params, scale = 1) {
    const mesh = this.createMesh(type, color, params, scale);
    
    // Solid material - Vibrant & bright untuk tower yang eye-catching!
    const baseColor = new THREE.Color(color);
    
    // Cerahkan warna 50% untuk tower yang lebih "pop"!
    const brightColor = baseColor.clone().multiplyScalar(1.5);
    
    const solidMaterial = new THREE.MeshStandardMaterial({
      color: brightColor,
      metalness: 0.45,        // Sedikit kurangi metalness agar warna lebih keluar
      roughness: 0.2,         // Lebih glossy lagi!
      transparent: false,
      opacity: 1.0,
      envMapIntensity: 1.3    // Refleksi lebih kuat
    });
    
    mesh.material.dispose();
    mesh.material = solidMaterial;
    mesh.userData.isSolid = true;
    mesh.castShadow = !this.isMobile;
    mesh.receiveShadow = !this.isMobile;
    
    return mesh;
  }

  /**
   * Validate if all parts of an item are completed
   * @param {object} parts - Parts status object
   * @returns {boolean}
   */
  validateCompletion(parts) {
    return parts.bottom?.filled && parts.side?.filled && parts.top?.filled;
  }

  /**
   * Calculate volume and surface area
   * @param {object} params - Shape parameters { radius, height }
   * @returns {object} - Calculation results
   */
  calculate(params) {
    return calculateCylinder(params.radius, params.height);
  }

  /**
   * Get spawn position for 2D component
   * @param {string} partType - 'circle' or 'rectangle'
   * @param {object} spawnConfig - Spawn configuration from blueprint
   * @returns {THREE.Vector3}
   */
  getSpawnPosition(partType, spawnConfig) {
    const angle = Math.random() * Math.PI * 2;
    
    const config = partType === 'circle' ? spawnConfig.circle : spawnConfig.rectangle;
    const distance = config.min + Math.random() * (config.max - config.min);
    
    return new THREE.Vector3(
      Math.cos(angle) * distance,
      spawnConfig.heightRange.min + Math.random() * (spawnConfig.heightRange.max - spawnConfig.heightRange.min),
      Math.sin(angle) * distance
    );
  }

  /**
   * Get rotation for component snap animation
   * @param {string} partId - Part identifier
   * @returns {THREE.Euler}
   */
  getSnapRotation(partId) {
    if (partId === 'bottom' || partId === 'top') {
      return new THREE.Euler(-Math.PI / 2, 0, 0);
    } else {
      return new THREE.Euler(0, 0, 0);
    }
  }
}
