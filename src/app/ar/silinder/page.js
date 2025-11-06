'use client';
import ARPageTemplate from '../../../components/ar/ARPageTemplate';

export default function ARSilinder() {
  const elementsData = [
    {
      id: 'alas-atas',
      position: '0 3.7m 0',
      normal: '0 1 0',
      label: 'Alas Atas',
      title: 'Alas Atas Tabung',
      description: 'Alas atas berbentuk lingkaran yang identik dengan alas bawah. Kedua alas ini sejajar dan kongruen (sama bentuk dan ukuran).',
      properties: [
        'Berbentuk lingkaran',
        'Sejajar dengan alas bawah',
        'Memiliki jari-jari yang sama (r)',
        'Luas = πr²'
      ],
      icon: '⭕',
      color: '#4A9EFF',
      audioUrl: '/audio/tabung-alas-atas.mp3'
    },
    {
      id: 'alas-bawah',
      position: '0 0.9m 0',
      normal: '0 -1 0',
      label: 'Alas Bawah',
      title: 'Alas Bawah Tabung',
      description: 'Alas bawah adalah bidang datar berbentuk lingkaran yang menjadi dasar tabung. Alas ini kongruen dengan alas atas.',
      properties: [
        'Berbentuk lingkaran',
        'Sejajar dengan alas atas',
        'Memiliki jari-jari yang sama (r)',
        'Luas = πr²'
      ],
      icon: '⭕',
      color: '#4A9EFF',
      audioUrl: '/audio/tabung-alas-bawah.mp3'
    },
    {
      id: 'selimut',
      position: '1m 2m 0',
      normal: '1 0 0',
      label: 'Selimut',
      title: 'Selimut Tabung',
      description: 'Selimut tabung adalah permukaan lengkung yang menghubungkan kedua alas. Jika dibentangkan, selimut berbentuk persegi panjang.',
      properties: [
        'Berbentuk lengkungan',
        'Menghubungkan kedua alas',
        'Jika dibentangkan: persegi panjang',
        'Luas = 2πrh (keliling × tinggi)'
      ],
      icon: '📜',
      color: '#FF6B6B',
      audioUrl: '/audio/tabung-selimut.mp3'
    },
    {
      id: 'tinggi',
      position: '-1.3m 2.2m 0',
      normal: '-1 0 0',
      label: 'Tinggi (h)',
      title: 'Tinggi Tabung',
      description: 'Tinggi adalah jarak tegak lurus antara alas atas dan alas bawah. Tinggi menentukan besar kecilnya volume tabung.',
      properties: [
        'Jarak antara kedua alas',
        'Tegak lurus terhadap alas',
        'Dilambangkan dengan huruf h',
        'Mempengaruhi volume dan luas selimut'
      ],
      icon: '📏',
      color: '#FFD93D',
      audioUrl: '/audio/tabung-tinggi.mp3'
    },
    {
      id: 'jari-jari',
      position: '-0.8m 1m 0m',
      normal: '1 0 1',
      label: 'Jari-jari (r)',
      title: 'Jari-jari Tabung',
      description: 'Jari-jari adalah jarak dari titik pusat lingkaran alas ke tepi lingkaran. Jari-jari menentukan luas alas dan keliling lingkaran.',
      properties: [
        'Jarak dari pusat ke tepi alas',
        'Dilambangkan dengan huruf r',
        'Sama untuk alas atas dan bawah',
        'Mempengaruhi luas alas dan volume'
      ],
      icon: '📐',
      color: '#6BCB77',
      audioUrl: '/audio/tabung-jari-jari.mp3'
    }
  ];

  return (
    <ARPageTemplate
      title="TABUNG (SILINDER)"
      subtitle="Eksplorasi Unsur-unsur Bangun Ruang"
      modelSrc="/models/Cylinder.glb"
      modelAlt="Model 3D Tabung"
      elementsData={elementsData}
    />
  );
}
