'use client';
import ARPageTemplate from '../../../components/ar/ARPageTemplate';

export default function ARSilinder() {
  return (
    <ARPageTemplate
      title="SILINDER"
      subtitle="Bangun Ruang 3D"
      modelSrc="/models/Cylinder.glb"
      modelAlt="Silinder 3D"
      hotspots={[
        { id: 'height', position: '-1 2m 0m', normal: '0 0 1', label: 'h = tinggi silinder' },
        { id: 'radius', position: '0 1m 0', normal: '1 0 0', label: 'r = jari-jari alas' },
        { id: 'volume', position: '0 2m 0', normal: '0 1 0', label: 'V = π × r² × h' },
        { id: 'surface', position: '0 1m -1m', normal: '-1 0 0', label: 'L = 2πr(r + h)' }
      ]}
      controls={[
        {
          id: 'volume',
          label: 'Sifat',
          content: {
            title: 'Volume Silinder',
            formula: 'V = π × r² × h',
            example: 'Contoh: π = 3,14, r = 5 cm, h = 12 cm',
            result: 'V = 942 cm³'
          }
        },
        {
          id: 'formula',
          label: 'Gambar',
          content: {
            title: 'Luas Permukaan',
            formula: 'L = 2πr(r + h)',
            example: 'Contoh: π = 3,14, r = 5 cm, h = 12 cm',
            result: 'L = 534 cm²'
          }
        }
      ]}
    />
  );
}
