'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

export default function DetailMateri() {
  const params = useParams();
  const { id } = params;
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const completed = localStorage.getItem('completedTopics');
    if (completed) {
      setCompletedTopics(new Set(JSON.parse(completed)));
    }
  }, []);

  const materiData = {
    'pengantar-bangun-ruang': {
      title: 'Pengantar Bangun Ruang',
      subtitle: 'Rangkuman Dasar Bangun Datar & Bangun Ruang Sisi Datar',
      description: 'Memahami konsep dasar bangun datar dan bangun ruang sisi datar sebagai fondasi mempelajari bangun ruang sisi lengkung',
      color: 'from-gray-400 to-slate-400',
      icon: '📐',
      sections: [
        {
          id: 'bangun-datar',
          title: 'Bangun Datar',
          type: 'theory',
          duration: 5,
          status: 'available',
          content: {
            definition: 'Bangun datar adalah bangun geometri yang memiliki dua dimensi (panjang dan lebar) dan terletak pada bidang datar.',
            examples: ['Persegi', 'Persegi Panjang', 'Segitiga', 'Lingkaran']
          }
        },
        {
          id: 'bangun-ruang-sisi-datar',
          title: 'Bangun Ruang Sisi Datar',
          type: 'theory',
          duration: 8,
          status: 'available',
          content: {
            definition: 'Bangun ruang sisi datar adalah bangun ruang yang memiliki sisi berupa bidang datar.',
            examples: ['Kubus', 'Balok', 'Prisma', 'Limas']
          }
        }
      ]
    },
    'bola': {
      title: 'Bola',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Mempelajari sifat-sifat, rumus, dan aplikasi bola dalam kehidupan sehari-hari',
      color: 'from-red-400 to-pink-400',
      icon: '⚽',
      sections: [
        {
          id: 'pengertian-bola',
          title: 'Pengertian dan Sifat-sifat Bola',
          type: 'theory',
          duration: 8,
          status: 'available',
          content: {
            definition: 'Bola adalah bangun ruang yang dibatasi oleh satu bidang lengkung.',
            characteristics: [
              'Semua titik pada permukaan bola berjarak sama dari pusat',
              'Memiliki satu bidang lengkung',
              'Tidak memiliki rusuk dan titik sudut'
            ]
          }
        }
      ]
    },
    'tabung': {
      title: 'Tabung (Silinder)',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Mempelajari sifat-sifat, unsur-unsur, rumus luas permukaan dan volume tabung',
      color: 'from-blue-400 to-cyan-400',
      icon: '🥫',
      sections: [
        {
          id: 'pengertian-tabung',
          title: 'Pengertian dan Sifat-sifat Tabung',
          type: 'theory',
          duration: 8,
          status: 'available',
          content: {
            definition: 'Tabung adalah bangun ruang yang dibatasi oleh dua buah lingkaran yang sejajar dan kongruen, serta sebuah bidang lengkung.',
            characteristics: [
              'Memiliki 2 sisi datar berbentuk lingkaran',
              'Memiliki 1 sisi lengkung (selimut tabung)',
              'Alas dan tutup berbentuk lingkaran yang kongruen'
            ]
          }
        }
      ]
    },
    'kerucut': {
      title: 'Kerucut',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Mempelajari sifat-sifat, unsur-unsur, rumus luas permukaan dan volume kerucut',
      color: 'from-orange-400 to-red-400',
      icon: '🍦',
      sections: [
        {
          id: 'pengertian-kerucut',
          title: 'Pengertian dan Sifat-sifat Kerucut',
          type: 'theory',
          duration: 8,
          status: 'available',
          content: {
            definition: 'Kerucut adalah bangun ruang yang memiliki alas berbentuk lingkaran dan selimut yang berbentuk juring lingkaran.',
            characteristics: [
              'Memiliki 1 sisi datar berbentuk lingkaran (alas)',
              'Memiliki 1 sisi lengkung (selimut kerucut)',
              'Memiliki 1 titik puncak'
            ]
          }
        }
      ]
    },
    'bangun-gabungan': {
      title: 'Bangun Ruang Gabungan',
      subtitle: 'Kombinasi Bangun Ruang Sisi Lengkung',
      description: 'Mempelajari cara menghitung volume dan luas permukaan bangun ruang gabungan',
      color: 'from-purple-400 to-indigo-400',
      icon: '🔗',
      sections: [
        {
          id: 'konsep-gabungan',
          title: 'Konsep Bangun Ruang Gabungan',
          type: 'theory',
          duration: 10,
          status: 'available',
          content: {
            definition: 'Bangun ruang gabungan adalah kombinasi dari dua atau lebih bangun ruang yang digabungkan.',
            examples: ['Tabung + Kerucut', 'Tabung + Setengah Bola', 'Kerucut + Setengah Bola']
          }
        }
      ]
    }
  };

  const currentMateri = materiData[id];

  if (!currentMateri) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Materi Tidak Ditemukan</h2>
          <Link href="/materi-pembelajaran">
            <button className="text-blue-600 underline">Kembali ke Daftar Materi</button>
          </Link>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'theory': return '📖';
      case 'formula': return '🧮';
      case 'practice': return '✏️';
      case 'comparison': return '⚖️';
      case 'application': return '🔧';
      default: return '📄';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-700';
      case 'formula': return 'bg-green-100 text-green-700';
      case 'practice': return 'bg-orange-100 text-orange-700';
      case 'comparison': return 'bg-purple-100 text-purple-700';
      case 'application': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const markAsCompleted = (sectionId) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(sectionId);
    setCompletedTopics(newCompleted);
    localStorage.setItem('completedTopics', JSON.stringify([...newCompleted]));
  };

  const renderSectionContent = (section) => {
    if (section.content) {
      return (
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {section.content.definition && (
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Definisi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{section.content.definition}</p>
            </div>
          )}

          {section.content.characteristics && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Karakteristik:</h3>
              <div className="space-y-2">
                {section.content.characteristics.map((char, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">{char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section.content.examples && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Contoh:</h3>
              <div className="grid grid-cols-2 gap-2">
                {section.content.examples.map((example, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-3 text-center">
                    <span className="text-sm text-gray-700">{example}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={() => markAsCompleted(section.id)}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium"
          >
            ✓ Tandai Selesai
          </button>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="font-bold text-gray-800 mb-2">{section.title}</h3>
          <p className="text-gray-600 text-sm mb-4">Konten pembelajaran untuk topik ini sedang dalam pengembangan.</p>
          <button 
            onClick={() => markAsCompleted(section.id)}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium"
          >
            ✓ Tandai Selesai
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className={`bg-gradient-to-br ${currentMateri.color} px-6 py-6 text-white`}>
        <div className="flex items-center justify-between mb-4">
          <Link href="/materi-pembelajaran">
            <button className="flex items-center space-x-2 text-white">
              <span>←</span>
              <span>Kembali</span>
            </button>
          </Link>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            {currentMateri.sections.length} Topik
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl mb-2">{currentMateri.icon}</div>
          <h1 className="text-xl font-bold mb-1">{currentMateri.title}</h1>
          <p className="text-white text-opacity-80 text-sm">{currentMateri.subtitle}</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4">
        {/* Description */}
        <div className="bg-white rounded-2xl p-4">
          <p className="text-gray-600 text-sm leading-relaxed">{currentMateri.description}</p>
        </div>

        {/* Progress */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-4 text-white">
          <h2 className="font-bold mb-2">Progress Pembelajaran</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">0 menit</span>
            <span className="text-sm">0% Selesai</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>

        {/* Daftar Topik */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Daftar Topik</h2>
          {currentMateri.sections.map((section, index) => {
            const isCompleted = completedTopics.has(section.id);
            const isAvailable = section.status === 'available' || isCompleted;
            const isActive = activeSection === section.id;

            return (
              <div key={section.id} className="mb-4">
                <div 
                  className={`bg-white rounded-2xl p-4 shadow-sm cursor-pointer transition-all ${
                    isActive ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => isAvailable && setActiveSection(isActive ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isAvailable ? getTypeColor(section.type) : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : getTypeIcon(section.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{section.title}</h3>
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span>⏱ {section.duration} menit</span>
                          <span className={`px-2 py-1 rounded-full ${getTypeColor(section.type)}`}>
                            {section.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!isAvailable && (
                        <span className="text-gray-400 text-sm">🔒</span>
                      )}
                      <span className="text-gray-400">{isActive ? '▼' : '▶'}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {isActive && isAvailable && (
                  <div className="mt-4">
                    {renderSectionContent(section)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
