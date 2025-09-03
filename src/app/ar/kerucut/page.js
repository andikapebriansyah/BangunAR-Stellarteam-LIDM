'use client';
import SimpleAR from '../../../components/ar/SimpleAR';

export default function ARKerucut() {
  const shapeData = {
    title: "KERUCUT",
    subtitle: "Bangun Ruang 3D",
    alt: "Kerucut 3D",
    modelSrc: "/Cylinder.glb", // Sementara pakai cylinder, nanti diganti dengan model kerucut
    features: [
      "Sentuh untuk mempelajari struktur kerucut",
      "Putar untuk melihat dari berbagai sudut",
      "Pelajari hubungan antara alas dan tinggi"
    ],
    hotspots: [
      {
        slot: "hotspot-height",
        position: "0 1.5m 0",
        normal: "0 1 0",
        annotation: "t = tinggi kerucut"
      },
      {
        slot: "hotspot-radius",
        position: "0.8m 0 0",
        normal: "1 0 0",
        annotation: "r = jari-jari alas"
      },
      {
        slot: "hotspot-volume",
        position: "0 0.8m 0.8m",
        normal: "0 0 1",
        annotation: "Volume = ⅓ × π × r² × t"
      },
      {
        slot: "hotspot-surface",
        position: "-0.8m 0.3m 0",
        normal: "-1 0 0",
        annotation: "L = πr(r + s)"
      }
    ],
    tabs: [
      {
        id: 'volume',
        label: 'Volume',
        content: {
          title: 'Volume Kerucut',
          formula: 'V = ⅓ × π × r² × t',
          calculation: 'Contoh: π = 3,14, radius r = 4 cm, tinggi t = 9 cm',
          result: 'V = ⅓ × 3,14 × 4² × 9 = 150,72 cm³'
        }
      },
      {
        id: 'surface',
        label: 'Luas Permukaan',
        content: {
          title: 'Luas Permukaan Kerucut',
          formula: 'L = πr(r + s)',
          calculation: 'Contoh: π = 3,14, r = 4 cm, s = 10 cm (garis pelukis)',
          result: 'L = 3,14 × 4 × (4 + 10) = 175,84 cm²'
        }
      }
    ]
  };

  return <SimpleAR shapeData={shapeData} />;
}
