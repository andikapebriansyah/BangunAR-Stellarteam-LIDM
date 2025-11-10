/**
 * SceneBackground Component
 * Creates animated background with gradient sky and floating geometries
 */

import * as THREE from 'three';

/**
 * Create gradient texture for sky sphere
 */
function createGradientTexture() {
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
  
  // Add stars
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
}

/**
 * Create floating geometries (wireframe shapes)
 */
function createFloatingGeometries(isMobile = false) {
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
  
  return floatingGeometries;
}

/**
 * Add animated background to scene
 * @param {THREE.Scene} scene - Three.js scene
 * @param {boolean} isMobile - Mobile device flag
 */
export function addAnimatedBackground(scene, isMobile = false) {
  // Create sky sphere
  const skyGeometry = new THREE.SphereGeometry(100, 32, 32);
  const skyTexture = createGradientTexture();
  const skyMaterial = new THREE.MeshBasicMaterial({ 
    map: skyTexture, 
    side: THREE.BackSide 
  });
  const skyMesh = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(skyMesh);
  
  // Create floating geometries
  const floatingGeometries = createFloatingGeometries(isMobile);
  scene.add(floatingGeometries);
  
  // Store references for animation
  scene.userData.skyMesh = skyMesh;
  scene.userData.floatingGeometries = floatingGeometries;
}

/**
 * Animate background elements
 * @param {THREE.Scene} scene - Three.js scene
 * @param {number} currentTime - Current time in milliseconds
 * @param {boolean} isMobile - Mobile device flag
 */
export function animateBackground(scene, currentTime, isMobile = false) {
  if (scene.userData.floatingGeometries) {
    const geometries = scene.userData.floatingGeometries;
    const time = currentTime * 0.001;
    
    geometries.children.forEach((mesh, index) => {
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
}
