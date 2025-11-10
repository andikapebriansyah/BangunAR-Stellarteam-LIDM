# 🏗️ 3D Builder System - Modular Architecture

Sistem modular untuk membuat 3D builder yang dapat digunakan ulang untuk berbagai bentuk geometri (cylinder, cone, sphere, dll).

## 📁 Struktur Folder

```
src/components/3d-builder/
├── core/                          # Komponen inti yang reusable
│   ├── BuilderScene.jsx          # Scene 3D utama dengan drag-drop
│   ├── SceneBackground.js        # Background animasi
│   └── AnimationController.js    # Kontrol animasi snap
│
├── shape-builders/               # Builder spesifik per bentuk
│   ├── CylinderBuilder.js       # Builder untuk cylinder
│   ├── ConeBuilder.js           # (TODO) Builder untuk cone
│   └── SphereBuilder.js         # (TODO) Builder untuk sphere
│
├── ui/                           # Komponen UI reusable
│   ├── ComponentPanel.jsx       # Panel spawn komponen 2D
│   ├── ProgressTracker.jsx      # Tracker progress
│   ├── AnalysisModal.jsx        # Modal analisis
│   └── BuilderControls.jsx      # Tombol kontrol
│
├── hooks/                        # Custom hooks
│   ├── useBuilderState.js       # State management
│   ├── useHotspotZones.js       # Manajemen hotspot zones
│   └── useCompletionCheck.js    # Validasi completion
│
└── config/                       # Konfigurasi dan data
    ├── shapeBlueprints.js       # Blueprint definisi shapes
    └── shapeCalculations.js     # Formula kalkulasi volume/luas
```

## 🎯 Cara Penggunaan

### 1. **Untuk Cylinder (Sudah Ada)**

```javascript
import { cylinderBlueprint } from '@/components/3d-builder/config/shapeBlueprints';
import { CylinderBuilder } from '@/components/3d-builder/shape-builders/CylinderBuilder';
import { BuilderScene } from '@/components/3d-builder/core/BuilderScene';

export default function MyCylinderPage() {
  const shapeBuilder = useMemo(() => new CylinderBuilder(false), []);
  
  return (
    <BuilderScene
      blueprint={cylinderBlueprint}
      shapeBuilder={shapeBuilder}
      // ... other props
    />
  );
}
```

### 2. **Untuk Cone (Contoh Future Implementation)**

**Step 1:** Buat `coneBlueprint` di `config/shapeBlueprints.js`:

```javascript
export const coneBlueprint = {
  shapeType: 'cone',
  name: 'Menara Kerucut',
  items: [
    {
      id: 'cone_large',
      type: 'cone_large',
      position: new THREE.Vector3(0, 0.5, 0),
      color: 0xFF6347,
      params: { radius: 0.5, height: 1.0 },
      parts: [
        { id: 'bottom', type: 'circle', accepts: 'circle_cone_bottom' },
        { id: 'side', type: 'triangle', accepts: 'triangle_cone' }
      ]
    }
  ]
};
```

**Step 2:** Buat `ConeBuilder.js`:

```javascript
export class ConeBuilder {
  createMesh(type, color, params, scale) {
    const geometry = new THREE.ConeGeometry(
      params.radius * scale, 
      params.height * scale, 
      16
    );
    // ... sama seperti CylinderBuilder
  }
  
  create2DComponent(componentType, partType, color, params, scale) {
    if (partType === 'circle') {
      // Alas lingkaran
    } else if (partType === 'triangle') {
      // Selimut kerucut (bentuk kipas/sector)
    }
  }
  
  createHotspotZone(partId, partType, position, params, scale, ...) {
    if (partId === 'bottom') {
      // Circle hotspot
    } else if (partId === 'side') {
      // Cone surface hotspot
    }
  }
}
```

**Step 3:** Gunakan di page:

```javascript
import { coneBlueprint } from '@/components/3d-builder/config/shapeBlueprints';
import { ConeBuilder } from '@/components/3d-builder/shape-builders/ConeBuilder';

export default function ConeChallengePage() {
  const shapeBuilder = useMemo(() => new ConeBuilder(false), []);
  
  return (
    <BuilderScene
      blueprint={coneBlueprint}
      shapeBuilder={shapeBuilder}
      // ... sama seperti cylinder
    />
  );
}
```

## 🔧 Shape Builder Interface

Setiap shape builder **HARUS** mengimplementasikan method berikut:

```javascript
class ShapeBuilder {
  // Buat mesh 3D solid
  createMesh(type, color, params, scale) { }
  
  // Buat komponen 2D
  create2DComponent(componentType, partType, color, params, scale) { }
  
  // Buat hotspot zone
  createHotspotZone(partId, partType, position, params, scale, acceptsType, itemIndex, isFilled) { }
  
  // Buat ghost mesh (transparent)
  createGhostMesh(type, color, params, scale) { }
  
  // Buat solid mesh (replacement)
  createSolidMesh(type, color, params, scale) { }
  
  // Validasi completion
  validateCompletion(parts) { }
  
  // Hitung volume & surface area
  calculate(params) { }
  
  // Posisi spawn komponen
  getSpawnPosition(partType, spawnConfig) { }
  
  // Rotasi saat snap
  getSnapRotation(partId) { }
}
```

## 📊 Blueprint Structure

```javascript
{
  shapeType: 'cylinder',
  name: 'Nama Challenge',
  description: 'Deskripsi',
  challengeId: 'unique-id',
  
  items: [
    {
      id: 'item-id',
      type: 'item-type',
      position: new THREE.Vector3(x, y, z),
      color: 0xHEXCOLOR,
      params: { radius: 0.5, height: 1.0 },
      displayName: 'Nama Display',
      displayColor: '🟦 Warna',
      parts: [
        {
          id: 'bottom',
          type: 'circle',
          accepts: 'circle_large_bottom',
          label: 'Alas Bawah',
          componentType: 'circle_large_bottom'
        }
      ]
    }
  ],
  
  spawnConfig: {
    circle: { min: 2.5, max: 4.0 },
    rectangle: { min: 4.0, max: 7.0 },
    heightRange: { min: 2.0, max: 3.5 }
  },
  
  snapTolerance: 2.5,
  animationDuration: 500
}
```

## 🎨 Kustomisasi

### Ubah Warna/Ukuran
Edit `config/shapeBlueprints.js`

### Ubah Animasi
Edit `core/AnimationController.js`

### Ubah Background
Edit `core/SceneBackground.js`

### Tambah Bentuk Baru
1. Buat blueprint di `config/shapeBlueprints.js`
2. Buat builder class di `shape-builders/`
3. Gunakan di page dengan `BuilderScene`

## ✅ Keuntungan Sistem Modular

1. **Reusability**: Core components dapat digunakan untuk shape apapun
2. **Maintainability**: Setiap komponen punya tanggung jawab spesifik
3. **Scalability**: Mudah menambah shape baru tanpa mengubah core
4. **Testability**: Setiap komponen dapat di-test secara independen
5. **Separation of Concerns**: Logic terpisah dari UI

## 🚀 Performa

- ✅ Persistent ref tracking (tidak recreate ghost cylinder)
- ✅ Optimized useEffect dependencies
- ✅ Separate hotspot update (tanpa recreate)
- ✅ Memory management dengan proper disposal
- ✅ Mobile-optimized rendering

## 📝 Contoh Penggunaan Lengkap

Lihat:
- `src/app/materi-pembelajaran/tabung/build-challenge/page-refactored.js` - Contoh full implementation

## 🔮 Future Enhancements

- [ ] Add ConeBuilder
- [ ] Add SphereBuilder
- [ ] Add PrismBuilder
- [ ] Add validation rules per shape
- [ ] Add difficulty levels
- [ ] Add hints system
- [ ] Add undo/redo functionality
