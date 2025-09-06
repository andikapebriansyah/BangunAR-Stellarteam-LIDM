'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

export default function EvaluasiPage() {
  const [completedMaterials, setCompletedMaterials] = useState(new Set());
  const [completedEvaluations, setCompletedEvaluations] = useState(new Set());
  const [progressData, setProgressData] = useState({});

  // Load progress from localStorage
  useEffect(() => {
    // Check completed materials
    const materials = new Set();
    
    // Check tabung completion
    const tabungProgress = localStorage.getItem('tabungProgress');
    if (tabungProgress) {
      const tabungData = JSON.parse(tabungProgress);
      if (tabungData.completed) {
        materials.add('tabung');
      }
    }
    
    // Check other materials (bola, kerucut) - placeholder for future
    const bolaCompleted = localStorage.getItem('bolaProgress');
    if (bolaCompleted && JSON.parse(bolaCompleted).completed) {
      materials.add('bola');
    }
    
    const kerucutCompleted = localStorage.getItem('kerucutProgress');
    if (kerucutCompleted && JSON.parse(kerucutCompleted).completed) {
      materials.add('kerucut');
    }
    
    setCompletedMaterials(materials);
    
    // Load completed evaluations
    const savedEvaluations = localStorage.getItem('completedEvaluations');
    if (savedEvaluations) {
      setCompletedEvaluations(new Set(JSON.parse(savedEvaluations)));
    }
    
    // Load evaluation progress
    const evalProgress = localStorage.getItem('evaluationProgress');
    if (evalProgress) {
      setProgressData(JSON.parse(evalProgress));
    }
  }, []);

  const evaluasiList = [
    {
      id: 'tabung',
      title: 'Evaluasi Tabung',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Uji pemahaman kamu tentang sifat, unsur, luas permukaan, dan volume tabung.',
      icon: '🥫',
      color: 'from-blue-500 to-cyan-500',
      questionCount: 10,
      estimatedTime: 20,
      requiredMaterial: 'tabung',
      difficulty: 'Sedang'
    },
    {
      id: 'bola',
      title: 'Evaluasi Bola',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Uji pemahaman kamu tentang sifat, unsur, luas permukaan, dan volume bola.',
      icon: '⚽',
      color: 'from-green-500 to-emerald-500',
      questionCount: 10,
      estimatedTime: 20,
      requiredMaterial: 'bola',
      difficulty: 'Sedang'
    },
    {
      id: 'kerucut',
      title: 'Evaluasi Kerucut',
      subtitle: 'Bangun Ruang Sisi Lengkung',
      description: 'Uji pemahaman kamu tentang sifat, unsur, luas permukaan, dan volume kerucut.',
      icon: '🍦',
      color: 'from-orange-500 to-red-500',
      questionCount: 10,
      estimatedTime: 20,
      requiredMaterial: 'kerucut',
      difficulty: 'Sedang'
    },
    {
      id: 'sumatif',
      title: 'Evaluasi Akhir',
      subtitle: 'Evaluasi Sumatif Komprehensif',
      description: 'Evaluasi menyeluruh semua materi bangun ruang sisi lengkung yang telah dipelajari.',
      icon: '🏆',
      color: 'from-purple-500 to-pink-500',
      questionCount: 20,
      estimatedTime: 40,
      requiredMaterial: 'all', // Requires all materials completed
      difficulty: 'Sulit'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Mudah': return 'bg-green-500';
      case 'Sedang': return 'bg-yellow-500';
      case 'Sulit': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isEvaluationUnlocked = (evaluasi) => {
    if (evaluasi.requiredMaterial === 'all') {
      // Final evaluation requires all individual materials completed
      return completedMaterials.has('tabung') && completedMaterials.has('bola') && completedMaterials.has('kerucut');
    }
    return completedMaterials.has(evaluasi.requiredMaterial);
  };

  const getCompletionPercentage = () => {
    const totalEvaluations = evaluasiList.length;
    return Math.round((completedEvaluations.size / totalEvaluations) * 100);
  };

  const handleLockedClick = (evaluasiName, requirement) => {
    let message;
    if (requirement === 'all') {
      message = "Selesaikan semua materi pembelajaran (Tabung, Bola, dan Kerucut) untuk membuka evaluasi akhir.";
    } else {
      message = `Selesaikan materi ${requirement} terlebih dahulu untuk membuka evaluasi ini.`;
    }
    alert(`🔒 ${evaluasiName} Terkunci\n\n${message}`);
  };

  const EvaluasiCard = ({ evaluasi }) => {
    const isCompleted = completedEvaluations.has(evaluasi.id);
    const isUnlocked = isEvaluationUnlocked(evaluasi);
    const progress = progressData[evaluasi.id] || 0;

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 transition-all duration-200 hover:shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-br ${evaluasi.color} rounded-2xl flex items-center justify-center text-3xl ${!isUnlocked ? 'opacity-50' : ''}`}>
              {evaluasi.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className={`text-xl font-bold ${isUnlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                  {evaluasi.title}
                </h3>
                {isCompleted && (
                  <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
                {!isUnlocked && (
                  <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 text-sm">🔒</span>
                  </div>
                )}
              </div>
              <p className={`text-sm mb-2 ${isUnlocked ? 'text-gray-500' : 'text-gray-400'}`}>
                {evaluasi.subtitle}
              </p>
              <div className="flex items-center space-x-3 mb-3">
                <span className={`${getDifficultyColor(evaluasi.difficulty)} text-white text-xs px-3 py-1 rounded-full font-medium ${!isUnlocked ? 'opacity-50' : ''}`}>
                  {evaluasi.difficulty}
                </span>
                {isCompleted && (
                  <span className="text-green-600 text-sm font-medium">
                    ✅ Selesai
                  </span>
                )}
                {!isCompleted && progress > 0 && isUnlocked && (
                  <span className="text-blue-600 text-sm font-medium">
                    {progress}% Progress
                  </span>
                )}
                {!isUnlocked && (
                  <span className="text-gray-400 text-sm">
                    Terkunci
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-4 mb-4 ${isUnlocked ? 'bg-gray-50' : 'bg-gray-100'}`}>
          <p className={`text-sm leading-relaxed ${isUnlocked ? 'text-gray-700' : 'text-gray-500'}`}>
            {evaluasi.description}
          </p>
          <div className="flex items-center justify-between mt-3 text-sm">
            <div className="flex items-center space-x-4">
              <span className={`${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                📝 {evaluasi.questionCount} Soal
              </span>
              <span className={`${isUnlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                ⏱ {evaluasi.estimatedTime} menit
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {isUnlocked ? (
            <Link href={`/evaluasi/${evaluasi.id}`}>
              <button className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isCompleted 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gradient-to-r ' + evaluasi.color + ' text-white hover:shadow-lg transform hover:scale-105'
              }`}>
                {isCompleted ? '📊 Lihat Hasil' : progress > 0 ? '📝 Lanjutkan' : '🚀 Mulai Evaluasi'}
              </button>
            </Link>
          ) : (
            <button 
              onClick={() => handleLockedClick(evaluasi.title, evaluasi.requiredMaterial)}
              className="px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-medium cursor-not-allowed"
            >
              🔒 Terkunci
            </button>
          )}
          
          {isCompleted && (
            <div className="flex items-center space-x-2 text-green-600 text-sm">
              <span>⭐</span>
              <span>Excellent!</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <button className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
              <span className="text-lg">←</span>
              <span>Kembali</span>
            </button>
          </Link>
          <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
            {getCompletionPercentage()}% Selesai
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">📊 Evaluasi Pembelajaran</h1>
          <p className="text-purple-100">Uji pemahaman kamu tentang bangun ruang sisi lengkung</p>
        </div>

        {/* Overall Progress */}
        <div className="mt-6 bg-white/10 rounded-2xl p-4">
          <h2 className="font-bold mb-3">Progress Evaluasi</h2>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">📝 {completedEvaluations.size}/{evaluasiList.length} Evaluasi</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mb-2">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-300" 
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <p className="text-purple-100 text-sm">
            Kamu telah menyelesaikan {getCompletionPercentage()}% dari seluruh evaluasi
          </p>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎯 Pilih Evaluasi
          </h2>
          
          {evaluasiList.map((evaluasi) => (
            <EvaluasiCard key={evaluasi.id} evaluasi={evaluasi} />
          ))}

          {/* Achievement Section */}
          {completedEvaluations.size > 0 && (
            <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <div className="text-center">
                <div className="text-4xl mb-3">🏆</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Pencapaian Kamu</h3>
                <p className="text-gray-600 mb-4">
                  Selamat! Kamu telah menyelesaikan {completedEvaluations.size} evaluasi.
                </p>
                <div className="flex justify-center space-x-2">
                  {[...completedEvaluations].map(evalId => {
                    const evaluasi = evaluasiList.find(e => e.id === evalId);
                    return evaluasi ? (
                      <div key={evalId} className="text-2xl" title={evaluasi.title}>
                        {evaluasi.icon}
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
