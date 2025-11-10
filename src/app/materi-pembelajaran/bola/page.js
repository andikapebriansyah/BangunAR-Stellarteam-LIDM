'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import MateriHeader from "../../../components/materi/MateriHeader";
import SectionContent from "../../../components/materi/SectionContent";
import { bolaMateriData } from "../../../components/materi/bolaData";

export default function MateriBola() {
  const [completedTopics, setCompletedTopics] = useState(new Set());
  const [activeSection, setActiveSection] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('📊 Loading bola progress for user:', session.user.id);
          
          try {
            const response = await fetch(`/api/progress/save?userId=${session.user.id}`);
            const result = await response.json();
            
            if (result.success && result.data) {
              const userProgress = result.data;
              
              // Use bola-specific completed topics
              const bolaCompletedTopics = new Set(userProgress.completed_topics_bola || []);
              setCompletedTopics(bolaCompletedTopics);
              
              console.log('✅ Bola progress loaded:', {
                bolaTopics: bolaCompletedTopics.size,
                topicsList: [...bolaCompletedTopics]
              });
            } else {
              console.log('⚠️ No progress data found');
              setCompletedTopics(new Set());
            }
          } catch (error) {
            console.error('❌ Failed to load bola progress:', error);
            setCompletedTopics(new Set());
          }
        }
      } catch (error) {
        console.error('Error initializing bola progress:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProgress();
  }, []);

  const markAsCompleted = async (sectionId) => {
    const newCompleted = new Set(completedTopics);
    newCompleted.add(sectionId);
    setCompletedTopics(newCompleted);
    
    console.log(`🎯 Marking bola section completed: ${sectionId}`);
    
    // Save to database using the progress API
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const userId = session.user.id;
        
        // Save section completion via API
        const response = await fetch('/api/progress/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            materialId: 'bola',
            sectionId,
            actionType: 'section_completed'
          }),
        });
        
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ Bola section progress saved to database:', sectionId);
          
          // Check if all sections are completed
          if (newCompleted.size === bolaMateriData.sections.length) {
            console.log('🎉 All bola sections completed!');
            setShowCompletionModal(true);
          }
        } else {
          console.error('❌ Failed to save bola progress:', result.error);
        }
      }
    } catch (error) {
      console.error('❌ Error saving bola progress:', error);
    }
  };

  // Helper functions
  const isCompleted = (sectionId) => completedTopics.has(sectionId);
  
  const getSectionStatus = (index) => {
    if (index === 0) return 'available';
    const prevSectionId = bolaMateriData.sections[index - 1].id;
    return isCompleted(prevSectionId) ? 'available' : 'locked';
  };

  // Calculate progress - only count bola sections
  const totalSections = bolaMateriData.sections.length;
  const completedCount = completedTopics.size; // Since completedTopics now only contains bola topics
  const progressPercent = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;
  
  // Check if all bola sections are completed
  const isAllCompleted = completedCount === totalSections;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat progress bola...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <MateriHeader 
        materiData={bolaMateriData} 
        completedTopics={completedTopics} 
      />

      {/* Progress Overview */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Progress Pembelajaran</h3>
            <span className="text-sm text-gray-500">{completedCount}/{totalSections} selesai</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{progressPercent}% materi bola telah diselesaikan</p>
        </div>
      </div>

      {/* Sections */}
      <div className="px-6 pb-8 space-y-4">
        {bolaMateriData.sections.map((section, index) => {
          const status = getSectionStatus(index);
          const completed = isCompleted(section.id);
          
          return (
            <div key={section.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div 
                className="p-4 cursor-pointer"
                onClick={() => {
                  if (status === 'available') {
                    setActiveSection(activeSection === section.id ? null : section.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                      completed ? 'bg-green-500 text-white' :
                      status === 'available' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {completed ? '✓' : 
                       status === 'available' ? '⚽' : '🔒'}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-bold ${
                        status === 'available' ? 'text-gray-800' : 'text-gray-400'
                      }`}>{section.title}</h3>
                      <p className={`text-sm ${
                        status === 'available' ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {section.duration} menit • {section.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {completed && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Selesai
                      </span>
                    )}
                    {status === 'locked' && (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                        Terkunci
                      </span>
                    )}
                    {status === 'available' && (
                      <span className="text-gray-400">
                        {activeSection === section.id ? '▲' : '▼'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section Content */}
              {activeSection === section.id && status === 'available' && (
                <div className="border-t border-gray-100">
                  <SectionContent 
                    section={section}
                    markAsCompleted={markAsCompleted}
                    isCompleted={completed}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Conditional Navigation */}
      <div className="px-4 sm:px-6 pb-20">
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
            <h2 className="font-bold text-lg sm:text-xl mb-2">🎉 Selamat! Pembelajaran Selesai</h2>
            <p className="text-green-100 text-sm mb-4">Kamu telah menyelesaikan semua materi bola. Siap untuk evaluasi?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/evaluasi/bola">
                <button 
                  className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                >
                  📊 Lanjut ke Evaluasi
                </button>
              </Link>
              <Link href="/materi-pembelajaran">
                <button className="bg-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/30 transition-colors">
                  ⏱️ Tunggu Sebentar (Kembali ke Menu)
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Fixed Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <Link href="/materi-pembelajaran">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
              <span>←</span>
              <span>Kembali</span>
            </button>
          </Link>
          
          <div className="text-sm text-gray-500">
            {completedCount}/{totalSections} bagian selesai
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Selamat!
            </h3>
            <p className="text-gray-600 mb-6">
              Anda telah menyelesaikan semua materi bola!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setShowCompletionModal(false)}
                className="w-full px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
              >
                Lanjutkan
              </button>
              <Link href="/materi-pembelajaran" className="block">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                  Kembali ke Materi
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}