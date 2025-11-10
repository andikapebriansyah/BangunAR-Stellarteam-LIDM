/**
 * AnimationController
 * Handles smooth snap animations for component placement
 */

import * as THREE from 'three';

/**
 * Animate component snapping to hotspot zone
 * @param {THREE.Mesh} component - The 2D component to animate
 * @param {THREE.Mesh} targetZone - The hotspot zone to snap to
 * @param {Function} shapeBuilder - Shape builder instance for rotation calculation
 * @param {Function} onComplete - Callback when animation completes
 * @param {number} duration - Animation duration in milliseconds (default 500)
 */
export function animateComponentSnap(component, targetZone, shapeBuilder, onComplete, duration = 500) {
  // Safety checks
  if (!component || !targetZone || !shapeBuilder) {
    console.warn('AnimationController: Missing required parameters');
    onComplete?.();
    return;
  }

  if (typeof shapeBuilder.getSnapRotation !== 'function') {
    console.error('AnimationController: shapeBuilder.getSnapRotation is not a function');
    onComplete?.();
    return;
  }

  const startPos = component.position.clone();
  const startRot = component.rotation.clone();
  const startScale = component.scale.clone();
  
  const targetPos = targetZone.position.clone();
  const zoneType = targetZone.userData.zoneType || 'circle';
  
  // Get rotation from shape builder with error handling
  let targetRot;
  try {
    targetRot = shapeBuilder.getSnapRotation(zoneType);
  } catch (e) {
    console.error('AnimationController: Error getting snap rotation:', e);
    targetRot = new THREE.Euler(0, 0, 0);
  }
  
  const targetScale = new THREE.Vector3(1, 1, 1);
  
  const startTime = Date.now();
  
  const animate = () => {
    if (!component || !component.position) {
      if (typeof onComplete === 'function') {
        onComplete();
      }
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
      if (typeof onComplete === 'function') {
        onComplete();
      }
      return;
    }
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      if (typeof onComplete === 'function') {
        onComplete();
      }
    }
  };
  
  animate();
}

/**
 * Cleanup component after animation
 * @param {THREE.Mesh} component - Component to cleanup
 * @param {THREE.Scene} scene - Scene reference
 * @param {Array} draggableArray - Array of draggable objects
 */
export function cleanupComponent(component, scene, draggableArray) {
  try {
    // Remove from scene
    if (component && component.parent) {
      scene.remove(component);
    }
    
    // Dispose geometry
    if (component && component.geometry) {
      component.geometry.dispose();
    }
    
    // Dispose materials
    if (component && component.material) {
      if (Array.isArray(component.material)) {
        component.material.forEach(mat => mat.dispose());
      } else {
        component.material.dispose();
      }
    }
    
    // Remove from draggable array
    const index = draggableArray.indexOf(component);
    if (index > -1) {
      draggableArray.splice(index, 1);
    }
  } catch (e) {
    console.warn('Cleanup error:', e.message);
  }
}
