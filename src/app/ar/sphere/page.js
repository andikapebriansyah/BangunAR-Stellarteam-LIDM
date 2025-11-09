'use client';
import ARPageTemplate from '../../../components/ar/ARPageTemplate';

export default function ARSphere() {
  const elementsData = [
    {
      id: 'pusat',
      position: '0 1.2m 0',
      normal: '0 0 1',
      label: 'Pusat Bola',
      title: 'Pusat Bola',
      description: 'Pusat bola adalah titik yang berada tepat di tengah-tengah bola. Semua titik pada permukaan bola memiliki jarak yang sama ke pusat.',
      properties: [
        'Titik di tengah-tengah bola',
        'Jarak ke permukaan selalu sama (r)',
        'Menentukan posisi bola',
        'Dilambangkan dengan titik O'
      ],
      icon: '🎯',
      color: '#EF4444',
      audioUrl: '/audio/bola/bola-pusat.mp3'
    },
    {
      id: 'jari-jari',
      position: '0m 1.7m 0',
      normal: '1 0 0',
      label: 'Jari-jari (r)',
      title: 'Jari-jari Bola',
      description: 'Jari-jari adalah jarak dari pusat bola ke permukaan bola. Semua jari-jari memiliki panjang yang sama.',
      properties: [
        'Jarak pusat ke permukaan',
        'Dilambangkan dengan huruf r',
        'Semua jari-jari sama panjang',
        'Menentukan ukuran bola'
      ],
      icon: '📏',
      color: '#3B82F6',
      audioUrl: '/audio/bola/bola-jari-jari.mp3'
    },
    {
      id: 'diameter',
      position: '0 0.m 0m',
      normal: '0 0 1',
      label: 'Diameter (d)',
      title: 'Diameter Bola',
      description: 'Diameter adalah garis lurus yang melalui pusat bola dan menghubungkan dua titik pada permukaan bola. Diameter = 2 × jari-jari.',
      properties: [
        'Garis melalui pusat bola',
        'Menghubungkan 2 titik di permukaan',
        'd = 2r',
        'Garis terpanjang dalam bola'
      ],
      icon: '↔️',
      color: '#10B981',
      audioUrl: '/audio/bola/bola-diameter.mp3'
    },
    {
      id: 'permukaan',
      position: '-1.1m 1.5m 0',
      normal: '-1 0 0',
      label: 'Permukaan',
      title: 'Permukaan Bola',
      description: 'Permukaan bola adalah bidang lengkung yang membentuk bola. Luas permukaan bola = 4πr².',
      properties: [
        'Bidang lengkung sempurna',
        'Semua titik berjarak r dari pusat',
        'Luas = 4πr²',
        'Tidak memiliki sudut atau rusuk'
      ],
      icon: '🌐',
      color: '#F59E0B',
      audioUrl: '/audio/bola/bola-permukaan.mp3'
    },
    
    
  ];

  return (
    <ARPageTemplate
      title="BOLA (SPHERE)"
      subtitle="Eksplorasi Unsur-unsur Bangun Ruang"
      modelSrc="/models/sphere.glb"
      modelAlt="Model 3D Bola"
      elementsData={elementsData}
    />
  );
}
