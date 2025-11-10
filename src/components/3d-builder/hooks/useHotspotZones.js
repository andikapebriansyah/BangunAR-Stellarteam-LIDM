/**
 * useHotspotZones Hook
 * Manages hotspot zone creation and updates
 */

import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';

export function useHotspotZones(sceneRef, blueprint, shapeBuilder, selectedSize, itemParts) {
  const hotspotZonesRef = useRef([]);
  const replacedItemsRef = useRef(new Set()); // Track completed items
  
  /**
   * Create hotspot zones for all items
   */
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
    
    if (!sceneRef.current) return;
    
    blueprint.items.forEach((item, itemIndex) => {
      // Skip hotspot creation for completed items
      if (replacedItemsRef.current.has(itemIndex)) {
        console.log(`⏭️ Skipping hotspot zones for item ${itemIndex} - already completed`);
        return;
      }
      
      const position = new THREE.Vector3().copy(item.position).multiplyScalar(selectedSize);
      
      item.parts.forEach(part => {
        const isFilled = itemParts[itemIndex]?.[part.id]?.filled || false;
        
        const zone = shapeBuilder.createHotspotZone(
          part.id,
          part.type,
          position,
          item.params,
          selectedSize,
          part.accepts,
          itemIndex,
          isFilled
        );
        
        sceneRef.current.add(zone);
        hotspotZonesRef.current.push(zone);
        
        console.log(`✅ Created ${part.id} hotspot [Item ${itemIndex}] at Y=${zone.position.y.toFixed(2)}, accepts: ${part.accepts}`);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneRef, blueprint, shapeBuilder, selectedSize]); // ✅ Intentionally exclude itemParts to prevent recreation
  
  /**
   * Update hotspot zone colors/opacity (without recreating)
   */
  useEffect(() => {
    if (hotspotZonesRef.current.length > 0) {
      hotspotZonesRef.current.forEach(zone => {
        if (!zone || !zone.userData || !zone.material) return;
        
        const itemIndex = zone.userData.itemIndex || zone.userData.cylinderIndex;
        const zoneType = zone.userData.zoneType;
        const item = blueprint.items[itemIndex];
        
        if (itemParts[itemIndex] && itemParts[itemIndex][zoneType]) {
          const isFilled = itemParts[itemIndex][zoneType].filled;
          
          try {
            // Keep hotspot color - JANGAN GANTI WARNA! Biarkan sesuai original color dari item
            // zone.material.color sudah di-set saat creation, JANGAN override!
            
            // Hanya update opacity
            zone.material.opacity = isFilled ? 0.3 : 0.7;
            zone.material.needsUpdate = true;
            
            // Ensure renderOrder stays high
            zone.renderOrder = 999;
          } catch (e) {
            console.warn('Material update error:', e.message);
          }
        }
      });
    }
  }, [itemParts, blueprint]);
  
  /**
   * Hide hotspots for completed item
   */
  const hideHotspotsForItem = useCallback((itemIndex) => {
    hotspotZonesRef.current.forEach(zone => {
      const zoneItemIndex = zone.userData.itemIndex || zone.userData.cylinderIndex;
      if (zoneItemIndex === itemIndex) {
        zone.visible = false;
        console.log(`🚫 Hidden hotspot for item ${itemIndex}, zone: ${zone.userData.zoneType}`);
      }
    });
  }, []);
  
  return {
    hotspotZonesRef,
    replacedItemsRef,
    createHotspotZones,
    hideHotspotsForItem
  };
}
