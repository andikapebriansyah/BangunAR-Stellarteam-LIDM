/**
 * Shape Blueprint Configuration
 * Defines the structure and properties for different 3D shapes
 */

import * as THREE from 'three';

/**
 * Cylinder Blueprint - Menara Tabung Bertingkat
 */
export const cylinderBlueprint = {
  shapeType: 'cylinder',
  name: 'Miniatur Menara Tabung Bertingkat',
  description: 'Rakit tabung dari komponen 2D (alas, selimut, tutup)',
  challengeId: 'menara-tabung-2d',
  
  items: [
    {
      id: 'cylinder_large',
      type: 'cylinder_large',
      position: new THREE.Vector3(0, 0.75, 0),
      color: 0x8B4513,
      params: { radius: 0.5, height: 1.5 },
      displayName: 'Tabung Besar',
      displayColor: '🟫 Coklat',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_large_bottom',
          label: 'Alas Bawah',
          componentType: 'circle_large_bottom'
        },
        { 
          id: 'side', 
          type: 'rectangle', 
          accepts: 'rect_large',
          label: 'Selimut',
          componentType: 'rect_large'
        },
        { 
          id: 'top', 
          type: 'circle', 
          accepts: 'circle_large_top',
          label: 'Tutup Atas',
          componentType: 'circle_large_top'
        }
      ]
    },
    {
      id: 'cylinder_medium',
      type: 'cylinder_medium',
      position: new THREE.Vector3(0, 2.1, 0),
      color: 0x4169E1,
      params: { radius: 0.4, height: 1.2 },
      displayName: 'Tabung Sedang',
      displayColor: '🟦 Biru',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_medium_bottom',
          label: 'Alas Bawah',
          componentType: 'circle_medium_bottom'
        },
        { 
          id: 'side', 
          type: 'rectangle', 
          accepts: 'rect_medium',
          label: 'Selimut',
          componentType: 'rect_medium'
        },
        { 
          id: 'top', 
          type: 'circle', 
          accepts: 'circle_medium_top',
          label: 'Tutup Atas',
          componentType: 'circle_medium_top'
        }
      ]
    },
    {
      id: 'cylinder_small',
      type: 'cylinder_small',
      position: new THREE.Vector3(0, 3.2, 0),
      color: 0xFF6347,
      params: { radius: 0.25, height: 1.0 },
      displayName: 'Tabung Kecil',
      displayColor: '🟥 Merah',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_small_bottom',
          label: 'Alas Bawah',
          componentType: 'circle_small_bottom'
        },
        { 
          id: 'side', 
          type: 'rectangle', 
          accepts: 'rect_small',
          label: 'Selimut',
          componentType: 'rect_small'
        },
        { 
          id: 'top', 
          type: 'circle', 
          accepts: 'circle_small_top',
          label: 'Tutup Atas',
          componentType: 'circle_small_top'
        }
      ]
    }
  ],
  
  limits: { 
    cylinder_large: 1, 
    cylinder_medium: 1, 
    cylinder_small: 1 
  },
  
  // Spawn distance configuration
  spawnConfig: {
    circle: { min: 2.5, max: 4.0 },
    rectangle: { min: 4.0, max: 7.0 },
    heightRange: { min: 2.0, max: 3.5 }
  },
  
  // Snap tolerance for drag-drop (very generous for easy snapping)
  snapTolerance: 8.0,
  
  // Animation duration
  animationDuration: 500
};

/**
 * Helper function to get all component types from blueprint
 */
export function getAllComponentTypes(blueprint) {
  const componentTypes = {};
  
  blueprint.items.forEach(item => {
    item.parts.forEach(part => {
      componentTypes[part.componentType] = false;
    });
  });
  
  return componentTypes;
}

/**
 * Helper function to initialize parts state from blueprint
 */
export function initializePartsState(blueprint) {
  return blueprint.items.map(item => {
    const parts = {};
    item.parts.forEach(part => {
      parts[part.id] = { filled: false, type: part.accepts };
    });
    return parts;
  });
}

/**
 * Helper function to count total parts
 */
export function getTotalParts(blueprint) {
  return blueprint.items.reduce((total, item) => total + item.parts.length, 0);
}

/**
 * Sphere Bracelet Blueprint - Gelang dari Bola-Bola
 * 9 spheres arranged in a circle formation
 */
export const sphereBraceletBlueprint = {
  shapeType: 'sphere',
  name: 'Gelang dari Bola-Bola',
  description: 'Susun 9 bola membentuk gelang melingkar',
  challengeId: 'bracelet-sphere-3d',
  
  items: (() => {
    const count = 9;
    const sphereRadius = 0.5; // DIPERBESAR: radius tiap bola (was 0.3)
    const sphereDiameter = sphereRadius * 2;
    
    // Calculate bracelet radius so spheres touch each other
    // Arc length between centers = sphere diameter
    // circumference = 2πr, arc = circumference/count
    // We want: arc ≈ diameter (for touching spheres)
    // So: 2πr/count ≈ 2*radius → r ≈ (count * radius) / π
    const braceletRadius = (count * sphereRadius) / Math.PI; // ~1.43 for touching spheres
    
    const yPosition = 0.5; // Ground level
    
    // Rainbow colors for beautiful bracelet
    const colors = [
      0xFF0000, // Red
      0xFF7F00, // Orange
      0xFFFF00, // Yellow
      0x00FF00, // Green
      0x00FFFF, // Cyan
      0x0000FF, // Blue
      0x4B0082, // Indigo
      0x8B00FF, // Violet
      0xFF1493, // Pink
    ];
    
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      
      return {
        id: `sphere_${i}`,
        type: `sphere_${i}`,
        position: new THREE.Vector3(
          Math.cos(angle) * braceletRadius,
          yPosition,
          Math.sin(angle) * braceletRadius
        ),
        color: colors[i],
        params: { radius: sphereRadius },
        displayName: `Bola ${i + 1}`,
        displayColor: `🔴 Bola #${i + 1}`,
        // NO parts - sphere is the component itself
        parts: [
          {
            id: 'sphere',
            type: 'sphere',
            accepts: `sphere_component_${i}`,
            label: `Bola #${i + 1}`,
            componentType: `sphere_component_${i}`
          }
        ]
      };
    });
  })(),
  
  limits: {}, // Dynamic limits based on items
  
  // Spawn distance configuration
  spawnConfig: {
    sphere: { min: 3.5, max: 6.0 },
    heightRange: { min: 0.5, max: 1.5 }
  },
  
  // Snap tolerance for drag-drop
  snapTolerance: 8.0,
  
  // Animation duration
  animationDuration: 500
};

// Generate dynamic limits for sphereBraceletBlueprint
sphereBraceletBlueprint.limits = sphereBraceletBlueprint.items.reduce((acc, item) => {
  acc[item.type] = 1;
  return acc;
}, {});

/**
 * Rocket Base Blueprint - Mini Rocket Launch System (Cone + Cylinder + Cone)
 * Combines cone base (stabilizer), cylinder body (rocket), and nose cone (aerodynamic tip)
 */
export const rocketBaseBlueprint = {
  shapeType: 'rocket',
  name: 'Peluncur Roket Mini',
  description: 'Rakit roket dari kerucut dasar, badan tabung, dan kerucut hidung',
  challengeId: 'rocket-base-system',
  
  items: [
    {
      id: 'cone_base',
      type: 'cone_base',
      position: new THREE.Vector3(0, 0.5, 0), // y = height/2 = 1.0/2 = 0.5
      color: 0xFFA500, // Orange (flame color)
      params: { 
        radiusBottom: 1.2,  // Radius alas bawah
        radiusTop: 0.5,     // Radius alas atas (sama dengan radius tabung!)
        height: 1.0 
      },
      displayName: 'Kerucut Terpotong Dasar',
      displayColor: '🟧 Orange',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_base_bottom',
          label: 'Alas Bawah',
          componentType: 'circle_base_bottom'
        },
        { 
          id: 'side', 
          type: 'sector', 
          accepts: 'sector_base',
          label: 'Selimut Juring',
          componentType: 'sector_base'
        },
        { 
          id: 'top', 
          type: 'circle', 
          accepts: 'circle_base_top',
          label: 'Alas Atas',
          componentType: 'circle_base_top'
        }
      ]
    },
    {
      id: 'cylinder_body',
      type: 'cylinder_body',
      position: new THREE.Vector3(0, 2.25, 0), // y = 1.0 (frustum height) + 2.5/2 (cylinder height/2) = 2.25
      color: 0xE8E8E8, // Silver/White (rocket body)
      params: { radius: 0.5, height: 2.5 },
      displayName: 'Badan Roket',
      displayColor: '⬜ Silver',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_body_bottom',
          label: 'Alas Badan',
          componentType: 'circle_body_bottom'
        },
        { 
          id: 'side', 
          type: 'rectangle', 
          accepts: 'rect_body',
          label: 'Selimut Badan',
          componentType: 'rect_body'
        },
        { 
          id: 'top', 
          type: 'circle', 
          accepts: 'circle_body_top',
          label: 'Tutup Badan',
          componentType: 'circle_body_top'
        }
      ]
    },
    {
      id: 'cone_nose',
      type: 'cone_nose',
      position: new THREE.Vector3(0, 4.1, 0), // y = 1.0 + 2.5 + 1.2/2 = 4.1
      color: 0xFF4444, // Red (nose cone)
      params: { radius: 0.5, height: 1.2 },
      displayName: 'Kerucut Hidung',
      displayColor: '🟥 Merah',
      parts: [
        { 
          id: 'bottom', 
          type: 'circle', 
          accepts: 'circle_nose_bottom',
          label: 'Alas Hidung',
          componentType: 'circle_nose_bottom'
        },
        { 
          id: 'side', 
          type: 'sector', 
          accepts: 'sector_nose',
          label: 'Selimut Juring Hidung',
          componentType: 'sector_nose'
        }
      ]
    }
  ],
  
  limits: { 
    cone_base: 1, 
    cylinder_body: 1, 
    cone_nose: 1 
  },
  
  // Spawn distance configuration
  spawnConfig: {
    circle: { min: 3.0, max: 5.0 },
    sector: { min: 4.0, max: 6.5 }, // Juring spawn lebih jauh
    rectangle: { min: 4.0, max: 6.0 },
    heightRange: { min: 1.5, max: 3.0 }
  },
  
  // Snap tolerance for drag-drop
  snapTolerance: 8.0,
  
  // Animation duration
  animationDuration: 500
};
