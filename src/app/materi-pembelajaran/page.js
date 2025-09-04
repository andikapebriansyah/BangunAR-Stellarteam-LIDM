'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MateriPembelajaran() {
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [progressData, setProgressData] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    const completed = localStorage.getItem('completedTopics');
    if (completed) {
      setCompletedTopics(new Set(JSON.parse(completed)));
    }
    
    const progress = localStorage.getItem('topicProgress');
    if (progress) {
      setProgressData(JSON.parse(progress));
    }
  }, []);

  const materiList = [
    {
      id: 'pengantar',
      title: 'Pengantar Bangun Ruang',
      subtitle: 'Dasar Bangun Datar & Bangun Ruang',
      description: 'Dasar-dasar bentuk bangun datar, bangun ruang sisi datar, dan perkenalan ke bangun ruang sisi lengkung.',
      icon: '📐',
      color: 'from-gray-400 to-slate-400',
      topicCount: 4, // sesuai jumlah topik di bawah
      estimatedTime: 20,
      status: 'available',
      difficulty: 'Dasar'
    },
    {
      id: 'tabung',
      title: 'Tabung (Silinder)',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Pelajari sifat, unsur, jaring-jaring, luas permukaan, dan volume tabung secara interaktif.',
      icon: '🥫',
      color: 'from-blue-400 to-cyan-400',
      topicCount: 5,
      estimatedTime: 40,
      status: 'available',
      difficulty: 'Sedang'
    },
    {
      id: 'bola',
      title: 'Bola',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Pelajari sifat-sifat, jari-jari, diameter, luas permukaan dan volume bola dengan visualisasi AR yang menarik',
      icon: '⚽',
      color: 'from-red-400 to-pink-400',
      topicCount: 6,
      estimatedTime: 45,
      status: 'locked',
      difficulty: 'Sedang'
    },
    {
      id: 'kerucut',
      title: 'Kerucut',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Pelajari berbagai jenis kerucut, sifat-sifat, dan cara menghitung luas serta volume dengan visualisasi 3D',
      icon: '🍦',
      color: 'from-orange-400 to-yellow-400',
      topicCount: 6,
      estimatedTime: 40,
      status: 'locked',
      difficulty: 'Sedang'
    },
    {
      id: 'gabungan-bangun-ruang',
      title: 'Gabungan Bangun Ruang Sisi Lengkung',
      subtitle: 'Kombinasi & Aplikasi',
      description: 'Pelajari cara menghitung luas dan volume gabungan dari berbagai bangun ruang sisi lengkung',
      icon: '🎪',
      color: 'from-purple-400 to-indigo-400',
      topicCount: 5,
      estimatedTime: 60,
      status: 'locked',
      difficulty: 'Sulit'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'available': return 'bg-blue-500';
      case 'locked': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Dasar': return 'bg-gray-500';
      case 'Mudah': return 'bg-green-500';
      case 'Sedang': return 'bg-blue-500';
      case 'Sulit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCompletionPercentage = () => {
    const totalTopics = materiList.reduce((sum, materi) => sum + materi.topicCount, 0);
    return Math.round((completedTopics.size / totalTopics) * 100);
  };

  const MateriCard = ({ materi }) => {
    const isCompleted = completedTopics.has(materi.id);
    const isAvailable = materi.status === 'available' || isCompleted;
    const progress = progressData[materi.id] || 0;

    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${materi.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {materi.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-gray-800">{materi.title}</h3>
                {isCompleted && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-xs mb-2">{materi.subtitle}</p>
              <div className="flex items-center space-x-2">
                <span className={`${getDifficultyColor(materi.difficulty)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {materi.difficulty}
                </span>
                {isCompleted && (
                  <span className="text-green-600 text-xs font-medium">
                    100% Selesai
                  </span>
                )}
                {!isCompleted && progress > 0 && (
                  <span className="text-blue-600 text-xs font-medium">
                    {progress}% Selesai
                  </span>
                )}
              </div>
            </div>
            {!isAvailable && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">🔒</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <div className="text-xs text-gray-600 mb-2">{materi.description}</div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>📚 {materi.topicCount} Topik</span>
            <span>⏱ {materi.estimatedTime} menit</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isAvailable ? (
            <Link href={`/materi-pembelajaran/${materi.id}`}>
              <button className={`${!isCompleted ? 'text-blue-600' : 'text-green-600'} text-sm font-medium`}>
                {isCompleted ? 'Ulangi Materi' : progress > 0 ? 'Lanjutkan Belajar' : 'Mulai Belajar'}
              </button>
            </Link>
          ) : (
            <span className="text-gray-400 text-sm">Selesaikan materi sebelumnya</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-6 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <button className="flex items-center space-x-2 text-white">
              <span>←</span>
              <span>Kembali</span>
            </button>
          </Link>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {getCompletionPercentage()}% Selesai
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-xl font-bold mb-1">Materi Pembelajaran</h1>
          <p className="text-purple-100 text-sm">Bangun Ruang Sisi Lengkung</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Card */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 text-white">
          <h2 className="font-bold mb-2">Progress Pembelajaran</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">📖 {completedTopics.size}/{materiList.reduce((sum, m) => sum + m.topicCount, 0)} Topik</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mb-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <p className="text-purple-100 text-xs">
            Kamu sudah menyelesaikan {getCompletionPercentage()}% dari seluruh materi
          </p>
        </div>

        {/* Daftar Materi */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Materi</h2>
          {materiList.map((materi) => (
            <MateriCard key={materi.id} materi={materi} />
          ))}
        </div>
      </div>
    </div>
  );
}
