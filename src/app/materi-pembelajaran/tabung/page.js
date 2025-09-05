'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import MateriHeader from "../../../components/materi/MateriHeader";
import SectionContent from "../../../components/materi/SectionContent";
import { tabungMateriData } from "../../../components/materi/tabungData";

export default function MateriTabung() {
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    const completed = new Set();
    setCompletedTopics(completed);
  }, []);

  const markAsCompleted = (sectionId) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(sectionId);
    setCompletedTopics(newCompleted);
    
    // Auto-open next section
    const sections = tabungMateriData.sections;
    const currentIndex = sections.findIndex(s => s.id === sectionId);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1].id);
    }
  };

  const isAllCompleted = completedTopics.size === tabungMateriData.sections.length;

  const handleEvaluationClick = () => {
    setShowCompletionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Component */}
      <MateriHeader 
        materiData={tabungMateriData} 
        completedTopics={completedTopics} 
      />

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Enhanced Description - Responsive */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 sm:p-6 border border-yellow-200">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-2xl sm:text-3xl">�</div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Petualangan Menakjubkan Menunggu!</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{tabungMateriData.description}</p>
              <div className="bg-white rounded-lg p-3 border-l-4 border-orange-500 mb-3">
                <p className="text-orange-700 font-medium text-sm">🎯 Tantangan: Bisakah kamu membangun menara dari tabung?</p>
              </div>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <span className="bg-cyan-100 text-cyan-700 px-2 sm:px-3 py-1 rounded-full text-xs">🔬 Eksplorasi AR</span>
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs">📋 LKPD Interaktif</span>
                <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs">⚗️ Eksperimen</span>
                <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs">🏗️ Builder 3D</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator - Responsive */}
        <div className="bg-white rounded-2xl p-4 sm:p-6">
          <h2 className="font-bold text-gray-800 mb-4 text-base sm:text-lg">Progress Pembelajaran</h2>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300"
              style={{ width: `${(completedTopics.size / tabungMateriData.sections.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {completedTopics.size} dari {tabungMateriData.sections.length} modul selesai
          </div>
        </div>

        {/* Daftar Topik - Responsive */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">�️</span>
            Peta Perjalanan Pembelajaran
          </h2>
          {tabungMateriData.sections.map((section, index) => {
            const isCompleted = completedTopics.has(section.id);
            const isAvailable = section.status === 'available' || isCompleted || (index > 0 && completedTopics.has(tabungMateriData.sections[index - 1].id));
            const isActive = activeSection === section.id;

            return (
              <div key={section.id} className="mb-4 sm:mb-6">
                <div 
                  className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm cursor-pointer transition-all duration-200 ${
                    isActive ? 'ring-2 ring-cyan-500 shadow-lg' : 'hover:shadow-md'
                  }`}
                  onClick={() => isAvailable && setActiveSection(isActive ? null : section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-10 sm:w-12 h-10 sm:h-12 rounded-xl flex items-center justify-center font-bold text-sm sm:text-base ${
                        isCompleted ? 'bg-green-500 text-white' : 
                        isAvailable ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{section.title}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center">
                            <span className="mr-1">⏱</span>
                            {section.duration} menit
                          </span>
                          <span className={`px-2 sm:px-3 py-1 rounded-full w-fit ${
                            section.type === 'case-study' ? 'bg-yellow-100 text-yellow-700' :
                            section.type === 'ar-exploration' ? 'bg-purple-100 text-purple-700' :
                            section.type === 'experiment' ? 'bg-orange-100 text-orange-700' :
                            section.type === 'investigation' ? 'bg-pink-100 text-pink-700' :
                            section.type === '3d-builder' ? 'bg-green-100 text-green-700' :
                            section.type === 'interactive' ? 'bg-cyan-100 text-cyan-700' :
                            section.type === 'visualization' ? 'bg-purple-100 text-purple-700' :
                            section.type === 'assessment' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {section.type === 'case-study' ? '🌟 Studi Kasus' :
                             section.type === 'ar-exploration' ? '🔍 AR Eksplorasi' :
                             section.type === 'experiment' ? '⚗️ Eksperimen' :
                             section.type === 'investigation' ? '🎨 Investigasi' :
                             section.type === '3d-builder' ? '🏗️ Builder 3D' :
                             section.type === 'interactive' ? '🎮 Interaktif' :
                             section.type === 'visualization' ? '👁️ Visual' :
                             section.type === 'assessment' ? '📊 Evaluasi' : section.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      {!isAvailable && <span className="text-gray-400 text-base sm:text-lg">🔒</span>}
                      {isCompleted && <span className="text-green-500 text-base sm:text-lg">✅</span>}
                      <span className="text-gray-400 text-sm sm:text-base">{isActive ? '▼' : '▶'}</span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                {isActive && isAvailable && (
                  <div className="mt-4">
                    <SectionContent 
                      section={section} 
                      markAsCompleted={markAsCompleted} 
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Conditional Navigation */}
        {!isAllCompleted ? (
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white text-center">
            <h2 className="font-bold text-lg sm:text-xl mb-2">☕ Istirahat Sejenak</h2>
            <p className="text-blue-100 text-sm mb-4">Selesaikan semua materi pembelajaran untuk melanjutkan!</p>
            <Link href="/materi-pembelajaran">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                🏠 Kembali ke Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white text-center">
            <h2 className="font-bold text-lg sm:text-xl mb-2">� Selamat! Pembelajaran Selesai</h2>
            <p className="text-green-100 text-sm mb-4">Kamu telah menyelesaikan semua materi tabung. Siap untuk evaluasi?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button 
                onClick={handleEvaluationClick}
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
              >
                📊 Lanjut ke Evaluasi
              </button>
              <Link href="/materi-pembelajaran">
                <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
                  ⏱️ Tunggu Sebentar (Kembali ke Menu)
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Completion Confirmation Modal */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Yakin Siap Evaluasi?</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Kamu akan mengerjakan kuis evaluasi untuk menguji pemahaman tentang materi tabung. 
                  Pastikan kamu sudah siap!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/evaluasi" className="flex-1">
                    <button className="w-full bg-green-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-600 transition-colors">
                      ✅ Ya, Saya Siap!
                    </button>
                  </Link>
                  <button 
                    onClick={() => setShowCompletionModal(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                  >
                    ❌ Belum, Nanti Dulu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
