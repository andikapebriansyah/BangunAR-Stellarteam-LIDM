'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ARShapeSelector from "../components/ui/ARShapeSelector";

export default function Home() {
  const [completedChallenges, setCompletedChallenges] = useState(0);
  const [completedMaterials, setCompletedMaterials] = useState(0);
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(false);
  const [tabungCompleted, setTabungCompleted] = useState(false);
  const [showARSelector, setShowARSelector] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const completed = localStorage.getItem('completedChallenges');
    if (completed) {
      const challengeSet = new Set(JSON.parse(completed));
      setCompletedChallenges(challengeSet.size);
    }

    const materials = localStorage.getItem('completedMaterials');
    if (materials) {
      const materialSet = new Set(JSON.parse(materials));
      setCompletedMaterials(materialSet.size);
    }

    const diagnostic = localStorage.getItem('diagnosticTest');
    if (diagnostic) {
      const diagnosticData = JSON.parse(diagnostic);
      setDiagnosticCompleted(diagnosticData.completed === true);
    }

    // Check if tabung material is completed (all 5 sections)
    const tabungProgress = localStorage.getItem('tabungProgress');
    if (tabungProgress) {
      const progress = JSON.parse(tabungProgress);
      setTabungCompleted(progress.completed === true);
    }
  }, []);

  // Derived state - check if tabung material has been completed (not just any material)
  // Build Challenge and Evaluasi require tabung completion specifically
  const hasCompletedTabung = tabungCompleted;

  const clearAllData = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data progress?')) {
      localStorage.removeItem('quizResults');
      localStorage.removeItem('completedChallenges');
      localStorage.removeItem('completedMaterials');
      localStorage.removeItem('completedTopics');
      localStorage.removeItem('challengeScores');
      localStorage.removeItem('lastBuildResult');
      localStorage.removeItem('diagnosticTest');
      localStorage.removeItem('diagnosticProgress');
      localStorage.removeItem('tabungProgress');
      
      // Clear all LKPD and AR completion states
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('ar-completed-') || key.startsWith('lkpd-completed-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset state
      setCompletedChallenges(0);
      setCompletedMaterials(0);
      setDiagnosticCompleted(false);
      setTabungCompleted(false);
      
      alert('Semua data telah dihapus!');
    }
  };

  // Function to handle locked menu clicks
  const handleLockedClick = (menuName, requirement) => {
    alert(`🔒 ${menuName} Terkunci\n\n${requirement}`);
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
          
          {/* AR Button - Fixed with better visibility */}
          {tabungCompleted ? (
            <button 
              onClick={() => setShowARSelector(true)}
              className="bg-white bg-opacity-20 border-2 border-white px-3 py-2 rounded-xl hover:bg-opacity-30 transition-all"
              title="Quick AR Access"
            >
              <div className="text-center text-white">
                <div className="text-lg">🥽</div>
                <div className="text-xs font-medium">AR</div>
              </div>
            </button>
          ) : (
            <button 
              onClick={() => handleLockedClick("Menu AR", "Selesaikan materi tabung terlebih dahulu untuk membuka menu AR.")}
              className="bg-white bg-opacity-10 border-2 border-white border-opacity-50 px-3 py-2 rounded-xl cursor-not-allowed opacity-60"
              title="AR Terkunci - Selesaikan materi tabung"
            >
              <div className="text-center text-white text-opacity-60">
                <div className="text-lg">🥽</div>
                <div className="text-xs font-medium">AR 🔒</div>
              </div>
            </button>
          )}
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-2">Selamat datang di BangunAR!</h2>
          <p className="text-purple-100">Mari jelajahi dunia bangun ruang</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-4">
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
        </div>

        {/* Tes Diagnostik - Fixed button visibility */}
        <Link href="/diagnostik-tes">
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Tes Diagnostik</h3>
              <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                {diagnosticCompleted ? 
                  'Tes diagnostik telah selesai. Anda siap melanjutkan pembelajaran!' :
                  'Mulai dengan tes diagnostik untuk mengetahui tingkat pemahaman Anda'
                }
              </p>
              {/* Fixed button with better contrast */}
              <div className="bg-white text-purple-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
                {diagnosticCompleted ? 'Lihat Hasil →' : 'Mulai Tes →'}
              </div>
            </div>
          </div>
        </Link>

        {/* Materi dan Build Challenge - Grid 2 kolom */}
        <div className="grid grid-cols-2 gap-4">
          {/* Materi Pembelajaran */}
          {diagnosticCompleted ? (
            <Link href="/materi-pembelajaran">
              <div className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-red-400 rounded-2xl mb-3 flex items-center justify-center">
                  <span className="text-white text-lg">📖</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Materi Pembelajaran</h3>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                  Pelajari bangun ruang dengan visualisasi 3D
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-red-500">
                    Mulai Belajar →
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div 
              className="bg-white rounded-2xl p-4 shadow-sm cursor-not-allowed h-full opacity-60"
              onClick={() => handleLockedClick("Materi Pembelajaran", "Selesaikan tes diagnostik terlebih dahulu untuk membuka materi pembelajaran.")}
            >
              <div className="w-12 h-12 bg-red-400 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-white text-lg">📖</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Materi Pembelajaran</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                Pelajari bangun ruang dengan visualisasi 3D
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-gray-400">
                  Selesaikan tes dulu
                </div>
                <span className="text-gray-400 text-xs">🔒</span>
              </div>
            </div>
          )}

          {/* Build Challenge */}
          {hasCompletedTabung ? (
            <Link href="/build-challenge-selection">
              <div className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow h-full">
                <div className="w-12 h-12 bg-teal-400 rounded-2xl mb-3 flex items-center justify-center">
                  <span className="text-white text-lg">🎮</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">Build Challenge</h3>
                <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                  Game edukatif drag & drop bangun ruang
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-teal-500">
                    Mulai Build →
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div 
              className="bg-white rounded-2xl p-4 shadow-sm cursor-not-allowed h-full opacity-60"
              onClick={() => handleLockedClick("Build Challenge", "Selesaikan materi tabung terlebih dahulu untuk membuka build challenge.")}
            >
              <div className="w-12 h-12 bg-teal-400 rounded-2xl mb-3 flex items-center justify-center">
                <span className="text-white text-lg">🎮</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Build Challenge</h3>
              <p className="text-gray-500 text-xs mb-3 leading-relaxed">
                Game edukatif drag & drop bangun ruang
              </p>
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-gray-400">
                  Selesaikan tabung dulu
                </div>
                <span className="text-gray-400 text-xs">🔒</span>
              </div>
            </div>
          )}
        </div>

        {/* Evaluasi Card - Fixed button visibility */}
        {hasCompletedTabung ? (
          <Link href="/evaluasi">
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">📊</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Evaluasi</h3>
                <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                  Lihat progress pembelajaran dan hasil evaluasi untuk memahami perkembangan Anda
                </p>
                {/* Fixed button with better contrast */}
                <div className="bg-white text-orange-600 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
                  Mulai Evaluasi →
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div 
            className="bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 rounded-2xl p-6 text-white cursor-not-allowed opacity-60"
            onClick={() => handleLockedClick("Evaluasi", "Selesaikan materi tabung terlebih dahulu untuk membuka evaluasi.")}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Evaluasi 🔒</h3>
              <p className="text-orange-100 text-sm mb-4 leading-relaxed">
                Lihat progress pembelajaran dan hasil evaluasi untuk memahami perkembangan Anda
              </p>
              {/* Locked button */}
              <div className="bg-white bg-opacity-50 text-orange-200 px-6 py-3 rounded-full text-sm font-medium">
                Selesaikan tabung dulu
              </div>
            </div>
          </div>
        )}

        {/* Gabung Kelas */}
        <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-white text-lg">👥</span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2">Gabung Kelas</h3>
          <p className="text-gray-500 text-xs mb-3 leading-relaxed">
            Masuk ke kelas dengan kode dari guru dan belajar bersama teman
          </p>
          <button className="text-orange-500 text-xs font-medium hover:text-orange-600 transition-colors">
            Masuk Kelas →
          </button>
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
      {tabungCompleted && (
        <ARShapeSelector 
          isOpen={showARSelector} 
          onClose={() => setShowARSelector(false)} 
        />
      )}
    </div>
  );
}