'use client';
import ARPageTemplate from '../../../components/ar/ARPageTemplate';

export default function ARKerucut() {
  const elementsData = [
    {
      id: 'puncak',
      position: '0 2.5m 0',
      normal: '0 1 0',
      label: 'Puncak',
      title: 'Puncak Kerucut',
      description: 'Puncak adalah titik tertinggi kerucut yang merupakan pertemuan dari semua garis pelukis. Puncak berada tepat di atas pusat alas.',
      properties: [
        'Titik tertinggi kerucut',
        'Pertemuan semua garis pelukis',
        'Tepat di atas pusat alas',
        'Menentukan tinggi kerucut'
      ],
      icon: '🔺',
      color: '#FF6B6B',
      audioUrl: '/audio/kerucut/kerucut-puncak.mp3'
    },
    {
      id: 'alas',
      position: '0 0.4m 0',
      normal: '0 -1 0',
      label: 'Alas',
      title: 'Alas Kerucut',
      description: 'Alas kerucut berbentuk lingkaran yang menjadi dasar kerucut. Luas alas menentukan volume kerucut.',
      properties: [
        'Berbentuk lingkaran',
        'Merupakan dasar kerucut',
        'Memiliki jari-jari r',
        'Luas = πr²'
      ],
      icon: '⭕',
      color: '#4A9EFF',
      audioUrl: '/audio/kerucut/kerucut-alas.mp3'
    },
    {
      id: 'selimut',
      position: '0m 1.65m -1.03',
      normal: '1 0 0',
      label: 'Selimut',
      title: 'Selimut Kerucut',
      description: 'Selimut kerucut adalah permukaan lengkung yang menghubungkan alas dengan puncak. Jika dibentangkan berbentuk juring lingkaran.',
      properties: [
        'Permukaan lengkung kerucut',
        'Menghubungkan alas dan puncak',
        'Jika dibentangkan: juring lingkaran',
        'Luas = πrs (r = jari-jari, s = garis pelukis)'
      ],
      icon: '🎪',
      color: '#FFD93D',
      audioUrl: '/audio/kerucut/kerucut-selimut.mp3'
    },
    {
      id: 'tinggi',
      position: '0m 1.2m -0.1',
      normal: '-1 0 0',
      label: 'Tinggi (t)',
      title: 'Tinggi Kerucut',
      description: 'Tinggi adalah jarak tegak lurus dari puncak ke pusat alas. Tinggi menentukan volume kerucut.',
      properties: [
        'Jarak puncak ke pusat alas',
        'Tegak lurus terhadap alas',
        'Dilambangkan dengan huruf t',
        'Volume = ⅓ × πr²t'
      ],
      icon: '📏',
      color: '#6BCB77',
      audioUrl: '/audio/kerucut/kerucut-tinggi.mp3'
    },
    {
      id: 'jari-jari',
      position: '-0.1m 0.4m 0.5m',
      normal: '1 0 1',
      label: 'Jari-jari (r)',
      title: 'Jari-jari Kerucut',
      description: 'Jari-jari adalah jarak dari pusat alas ke tepi alas. Jari-jari menentukan luas alas dan volume kerucut.',
      properties: [
        'Jarak pusat ke tepi alas',
        'Dilambangkan dengan huruf r',
        'Menentukan luas alas',
        'Mempengaruhi volume kerucut'
      ],
      icon: '📐',
      color: '#A78BFA',
      audioUrl: '/audio/kerucut/kerucut-jari-jari.mp3'
    },
    {
      id: 'garis-pelukis',
      position: '0m 1.6m 0.5m',
      normal: '1 1 0',
      label: 'Garis Pelukis (s)',
      title: 'Garis Pelukis Kerucut',
      description: 'Garis pelukis adalah garis miring dari puncak ke tepi alas. Panjang garis pelukis dapat dihitung dengan teorema Pythagoras: s = √(r² + t²)',
      properties: [
        'Garis dari puncak ke tepi alas',
        'Membentuk selimut kerucut',
        'Dilambangkan dengan huruf s',
        's = √(r² + t²)'
      ],
      icon: '📐',
      color: '#F97316',
      audioUrl: '/audio/kerucut/kerucut-garis-pelukis.mp3'
    }
  ];

  return (
    <ARPageTemplate
      title="KERUCUT"
      subtitle="Eksplorasi Unsur-unsur Bangun Ruang"
      modelSrc="/models/cone1.glb"
      modelAlt="Model 3D Kerucut"
      elementsData={elementsData}
    />
  );
}
