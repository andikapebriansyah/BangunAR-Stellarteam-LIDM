'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import MateriHeader from "../../../components/materi/MateriHeader";
import SectionContent from "../../../components/materi/SectionContent";
import { tabungMateriData } from "../../../components/materi/tabungData";

export default function MateriTabung() {
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Component */}
      <MateriHeader 
        materiData={tabungMateriData} 
        completedTopics={completedTopics} 
      />

      <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Enhanced Description - Responsive */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 sm:p-6 border border-cyan-200">
          <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-2xl sm:text-3xl">📖</div>
            <div className="flex-1">
              <h2 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">Tentang Pembelajaran Ini</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{tabungMateriData.description}</p>
              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                <span className="bg-cyan-100 text-cyan-700 px-2 sm:px-3 py-1 rounded-full text-xs">Kalkulator Interaktif</span>
                <span className="bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs">Studi Kasus</span>
                <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs">Rumus Volume</span>
                <span className="bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs">Luas Permukaan</span>
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
            <span className="mr-2">📚</span>
            Daftar Modul Pembelajaran
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
                            section.type === 'interactive' ? 'bg-cyan-100 text-cyan-700' :
                            section.type === 'visualization' ? 'bg-purple-100 text-purple-700' :
                            section.type === 'assessment' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {section.type === 'interactive' ? '🎮 Interaktif' :
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

        {/* Navigation to AR */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white text-center">
          <h2 className="font-bold text-lg sm:text-xl mb-2">Siap untuk Eksplorasi 3D?</h2>
          <p className="text-cyan-100 text-sm mb-4">Jelajahi tabung dalam Augmented Reality!</p>
          <Link href="/ar/silinder">
            <button className="bg-white text-cyan-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
              🥽 Mulai AR Experience
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
