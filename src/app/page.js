'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ARShapeSelector from "../components/ui/ARShapeSelector";

export default function Home() {
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [completedQuizzes, setCompletedQuizzes] = useState(0);
  const [completedMaterials, setCompletedMaterials] = useState(0);
  const [showARSelector, setShowARSelector] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
      const challengeSet = new Set(JSON.parse(completed));
      setCompletedChallenges(challengeSet.size);
    }

    const quizResults = localStorage.getItem('quizResults');
    if (quizResults) {
      const quizData = JSON.parse(quizResults);
      setCompletedQuizzes(Object.keys(quizData).length);
    }

    const materials = localStorage.getItem('completedMaterials');
    if (materials) {
      const materialSet = new Set(JSON.parse(materials));
      setCompletedMaterials(materialSet.size);
    }
  }, []);

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data progress?')) {
      localStorage.removeItem('quizResults');
      localStorage.removeItem('completedChallenges');
      localStorage.removeItem('completedMaterials');
      localStorage.removeItem('completedTopics');
      localStorage.removeItem('challengeScores');
      localStorage.removeItem('lastBuildResult');
      
      // Reset state
      setCompletedChallenges(0);
      setCompletedQuizzes(0);
      setCompletedMaterials(0);
      
      alert('Semua data telah dihapus!');
    }
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Header Profile Section */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-400 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl">👤</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Fadli Ahmad</h1>
              <p className="text-purple-100 text-sm">Kelas 8A</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Quick AR Access */}
            <button 
              onClick={() => setShowARSelector(true)}
              className="bg-white bg-opacity-15 p-2 rounded-xl hover:bg-opacity-25 transition-all"
              title="Quick AR Access"
            >
              <span className="text-xl">🥽</span>
            </button>
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-full flex items-center space-x-2">
              <span className="text-yellow-300">⭐</span>
              <span className="font-semibold">1,250</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Selamat datang di BangunAR!</h2>
          <p className="text-purple-100">Mari jelajahi dunia bangun ruang</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-teal-500 rounded-2xl mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-sm">📚</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{completedMaterials}</div>
            <p className="text-gray-500 text-xs">Materi Selesai</p>
          </div>
          
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-sm">🏆</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{completedChallenges}</div>
            <p className="text-gray-500 text-xs">Build Selesai</p>
          </div>

          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="w-10 h-10 bg-purple-500 rounded-2xl mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-sm">🧠</span>
            </div>
            <div className="text-lg font-bold text-gray-800">{completedQuizzes}</div>
            <p className="text-gray-500 text-xs">Kuis Selesai</p>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Materi Pembelajaran */}
          <Link href="/materi-pembelajaran">
            <div className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-400 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-white text-lg">📖</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Materi Pembelajaran</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                Pelajari bangun ruang sisi lengkung dengan visualisasi 3D
              </p>
              <span className="text-red-500 text-xs font-medium">Mulai Belajar →</span>
            </div>
          </Link>

          {/* Build Challenge */}
          <Link href="/build-challenge-selection">
            <div className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-400 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-white text-lg">🎮</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Daftar Build</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                Pilih tantangan build yang ingin diselesaikan
              </p>
              <span className="text-teal-500 text-xs font-medium">Lihat Daftar →</span>
            </div>
          </Link>
        </div>

        {/* AR Mode Card */}
        <div 
          onClick={() => setShowARSelector(true)}
          className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl">🥽</span>
            </div>
            <h3 className="text-xl font-bold mb-2">AR Experience</h3>
            <p className="text-purple-100 text-sm mb-4 leading-relaxed">
              Jelajahi berbagai bangun ruang dengan Augmented Reality dan rasakan pengalaman belajar yang menakjubkan
            </p>
            <button className="bg-white bg-opacity-20 px-6 py-2 rounded-full text-sm font-medium hover:bg-opacity-30 transition-colors">
              Mulai AR Experience →
            </button>
          </div>
        </div>

        {/* Gabung Kelas */}
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-lg">👥</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Gabung Kelas</h3>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Masuk ke kelas dengan kode dari guru dan belajar bersama teman
          </p>
          <button className="text-orange-500 text-xs font-medium">Masuk Kelas →</button>
        </div>

        {/* Aktivitas Terbaru */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Aktivitas Terbaru</h3>
          
          <div className="space-y-3">
            {/* Activity Item 1 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-red-500 text-sm">📖</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium">Menyelesaikan materi &quot;Volume Kubus&quot;</p>
                <p className="text-gray-500 text-xs">2 jam yang lalu</p>
              </div>
            </div>

            {/* Activity Item 2 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-teal-500 text-sm">🎮</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium">Build Challenge &quot;Rumah&quot; - Skor 85</p>
                <p className="text-gray-500 text-xs">1 hari yang lalu</p>
              </div>
            </div>

            {/* Activity Item 3 */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-purple-500 text-sm">🥽</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-sm font-medium">Eksplorasi AR Prisma Segitiga</p>
                <p className="text-gray-500 text-xs">2 hari yang lalu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Debug Button - Development Only */}
        <div className="mt-6">
          <button 
            onClick={clearAllData}
            className="w-full py-2 bg-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-300 transition-all"
          >
            🗑️ Clear All Data (Debug)
          </button>
        </div>
      </div>

      {/* AR Shape Selector Modal */}
      <ARShapeSelector 
        isOpen={showARSelector} 
        onClose={() => setShowARSelector(false)} 
      />
    </div>
  );
}
  