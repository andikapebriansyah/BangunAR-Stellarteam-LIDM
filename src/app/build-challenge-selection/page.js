'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function BuildChallengeSelection() {
  const [completedChallenges, setCompletedChallenges] = useState(new Set());
  const [challengeScores, setChallengeScores] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [selectedFilter, setSelectedFilter] = useState('Semua');

  // Load completed challenges and scores from localStorage
  useEffect(() => {
    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
      setCompletedChallenges(new Set(JSON.parse(completed)));
    }
    
    const scores = localStorage.getItem('challengeScores');
    if (scores) {
      setChallengeScores(JSON.parse(scores));
    }

    const quizData = localStorage.getItem('quizResults');
    if (quizData) {
      setQuizResults(JSON.parse(quizData));
    }
  }, []);

  const challenges = [
    {
      id: 'es-krim-sederhana',
      title: 'Es Krim Cone',
      subtitle: '5 menit • 2 bentuk',
      difficulty: 'MUDAH',
      description: 'Buat es krim dengan tabung sebagai cone dan kerucut di atasnya sebagai es krim.',
      shapes: ['Tabung', 'Kerucut'],
      image: '🍦',
      color: 'from-pink-400 to-yellow-400',
      score: null,
      estimatedTime: '5 menit',
      route: '/build-challenge-ice-cream'
    },
    {
      id: 'rumah-sederhana',
      title: 'Rumah Sederhana',
      subtitle: '5 menit • 2 bentuk',
      difficulty: 'MUDAH',
      description: 'Bangun rumah sederhana menggunakan balok untuk badan dan prisma segitiga untuk atap',
      shapes: ['Balok', 'Prisma'],
      image: '🏠',
      color: 'from-red-400 to-pink-400',
      score: 100,
      estimatedTime: '5 menit',
      route: '/build-challenge'
    },
    {
      id: 'manusia-salju',
      title: 'Manusia Salju',
      subtitle: '7 menit • 3 bentuk',
      difficulty: 'MUDAH',
      description: 'Susun tiga bola bertumpuk (besar, sedang, kecil) untuk membangun manusia salju.',
      shapes: ['Bola', 'Bola', 'Bola'],
      image: '⛄',
      color: 'from-blue-300 to-white',
      score: null,
      estimatedTime: '7 menit',
      route: '#'
    },
    {
      id: 'kastil-megah',
      title: 'Kastil Megah',
      subtitle: '10 menit • 4 bentuk',
      difficulty: 'SEDANG',
      description: 'Bangun kastil dengan menara-menara menggunakan berbagai bangun ruang',
      shapes: ['Kubus', 'Balok', 'Limas'],
      image: '🏰',
      color: 'from-purple-400 to-blue-400',
      score: null,
      estimatedTime: '10 menit',
      route: '#'
    },
    {
      id: 'roket-sederhana',
      title: 'Roket Sederhana',
      subtitle: '10 menit • 3 bentuk',
      difficulty: 'SEDANG',
      description: 'Bangun roket sederhana dengan tabung sebagai badan, kerucut di bagian atas, dan bola di bawah.',
      shapes: ['Tabung', 'Kerucut', 'Bola'],
      image: '🚀',
      color: 'from-orange-400 to-red-400',
      score: null,
      estimatedTime: '10 menit',
      route: '#'
    },
    {
      id: 'menara-sirkus',
      title: 'Menara Sirkus',
      subtitle: '12 menit • 3 bentuk',
      difficulty: 'SEDANG',
      description: 'Rancang menara sirkus dengan tabung sebagai badan, kerucut di bagian atas, dan prisma sebagai hiasan.',
      shapes: ['Tabung', 'Kerucut', 'Prisma'],
      image: '🎪',
      color: 'from-purple-400 to-pink-400',
      score: null,
      estimatedTime: '12 menit',
      route: '#'
    },
    {
      id: 'gedung-modern',
      title: 'Gedung Modern',
      subtitle: '15 menit • 3 bentuk',
      difficulty: 'SULIT',
      description: 'Bangun gedung modern dengan kubus sebagai dasar, tabung sebagai menara, dan limas sebagai atap.',
      shapes: ['Kubus', 'Tabung', 'Limas'],
      image: '🏢',
      color: 'from-gray-400 to-blue-400',
      score: null,
      estimatedTime: '15 menit',
      route: '#'
    },
    {
      id: 'kota-fantasi',
      title: 'Kota Fantasi',
      subtitle: '20 menit • 5 bentuk',
      difficulty: 'TERHEBAT',
      description: 'Gabungkan berbagai bangun ruang untuk membuat kota fantasi mini yang penuh variasi.',
      shapes: ['Tabung', 'Bola', 'Kubus', 'Prisma', 'Limas'],
      image: '🏙️',
      color: 'from-blue-400 to-purple-400',
      score: null,
      estimatedTime: '20 menit',
      route: '#'
    }
  ];

  const filterOptions = ['Semua', 'Mudah', 'Sedang', 'Sulit', 'Terhebat'];

  const filteredChallenges = challenges.filter(challenge => {
    if (selectedFilter === 'Semua') return true;
    return challenge.difficulty.toLowerCase() === selectedFilter.toLowerCase();
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'MUDAH': return 'bg-green-500';
      case 'SEDANG': return 'bg-blue-500';
      case 'SULIT': return 'bg-orange-500';
      case 'TERHEBAT': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getShapeColor = (shape) => {
    switch (shape) {
      case 'Balok': return 'bg-indigo-100 text-indigo-700';
      case 'Kubus': return 'bg-green-100 text-green-700';
      case 'Prisma': return 'bg-amber-100 text-amber-700';
      case 'Limas': return 'bg-red-100 text-red-700';
      case 'Kerucut': return 'bg-pink-100 text-pink-700';
      case 'Tabung': return 'bg-orange-100 text-orange-700';
      case 'Bola': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLearnResultRoute = (challengeId) => {
    switch (challengeId) {
      case 'es-krim-sederhana': return '/learn-result/ice';
      case 'rumah-sederhana': return '/learn-result';
      default: return '/learn-result';
    }
  };

  const isCompleted = (challengeId) => completedChallenges.has(challengeId);

  const isAvailable = (challengeId) => {
    // Es krim dan rumah sederhana selalu tersedia sebagai challenge mudah
    if (challengeId === 'es-krim-sederhana' || challengeId === 'rumah-sederhana') {
      return true;
    }
    // Challenge lain tersedia setelah menyelesaikan minimal 1 challenge
    return completedChallenges.size > 0;
  };

  const ChallengeCard = ({ challenge }) => {
    const completed = isCompleted(challenge.id);
    const available = isAvailable(challenge.id);
    const quizResult = quizResults[challenge.id];
    const quizScore = quizResult ? quizResult.score : 0;

    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${challenge.color} rounded-2xl flex items-center justify-center text-2xl`}>
              {challenge.image}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-gray-800">{challenge.title}</h3>
                {completed && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-500 text-xs mb-2">{challenge.subtitle}</p>
              <div className="flex items-center space-x-2">
                <span className={`${getDifficultyColor(challenge.difficulty)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {challenge.difficulty}
                </span>
                {completed && quizResult && (
                  <span className="text-blue-600 text-xs font-medium">
                    Skor Kuis: {quizScore}/50
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            {completed ? (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
            ) : available ? (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">▶</span>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">🔒</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <div className="text-xs text-gray-600 mb-2">{challenge.description}</div>
          <div className="flex flex-wrap gap-1">
            {challenge.shapes.map((shape, index) => (
              <span key={index} className={`${getShapeColor(shape)} text-xs px-2 py-1 rounded-full font-medium`}>
                {shape}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {available && (
              <Link href={challenge.route || '#'}>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  {completed ? 'Main Lagi' : 'Mulai'}
                </button>
              </Link>
            )}
            {completed && (
              <Link href={getLearnResultRoute(challenge.id)}>
                <button className="text-green-600 text-sm font-medium hover:text-green-700">
                  {quizResult ? `Kuis (${quizResult.score}/50)` : 'Ambil Kuis'}
                </button>
              </Link>
            )}
            {!available && (
              <span className="text-gray-400 text-sm">Belum tersedia</span>
            )}
          </div>
          <span className="text-gray-500 text-xs">{challenge.estimatedTime}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-4 py-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <button className="flex items-center space-x-2 text-white">
              <span>←</span>
              <span>Kembali</span>
            </button>
          </Link>
          <button className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            Skor Selesai
          </button>
        </div>
        
        <div className="text-center">
          <h1 className="text-xl font-bold mb-1">Build Challenge</h1>
          <p className="text-purple-100 text-sm">Pilih tantangan yang ingin kamu selesaikan</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Challenge List */}
      <div className="px-4 pb-6">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}
