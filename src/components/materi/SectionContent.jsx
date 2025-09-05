import { 
  DefinitionSection, 
  CharacteristicsSection, 
  RealLifeExamplesSection, 
  ElementsSection 
} from './ContentSections';
import { 
  FormulaSection, 
  ExamplesSection, 
  ApplicationsSection, 
  RealWorldProblemSection 
} from './FormulaExamples';
import CylinderCalculator from './CylinderCalculator';
import QuizSection from './QuizSection';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SectionContent({ section, markAsCompleted }) {
  const content = section.content;

  const renderCaseStudyContent = () => {
    return (
      <div className="space-y-6">
        {/* Main Challenge */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🏗️</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Tantangan Utama</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">{content.mainQuestion}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-gray-600 text-sm">{content.scenario}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Observation Section */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👀</span>
            Mari Mengamati!
          </h3>
          <div className="space-y-3 mb-4">
            {content.observationPrompts.map((prompt, i) => (
              <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 text-sm">{prompt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Real Life Examples */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">🔍 Temukan Tabung di Sekitarmu</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {content.realLifeExamples.map((example, i) => (
              <div key={i} className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                <div className="mb-3">
                  <div className="w-full h-32 sm:h-36 lg:h-32 bg-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={`/materi/tabung_examples/${example.name.toLowerCase().replace(/\s+/g, '_')}.jpg`}
                      alt={example.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-dashed border-cyan-300 rounded-lg flex items-center justify-center" style={{ display: 'none' }}>
                      <div className="text-center p-2">
                        <div className="text-xl sm:text-2xl mb-1">🥤</div>
                        <div className="text-xs text-gray-600 font-medium break-words">{example.name}</div>
                        <div className="text-xs text-gray-500 mt-1">Image placeholder</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">{example.name}</h4>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 leading-relaxed">{example.description}</p>
                <div className="bg-white rounded p-3 border-l-4 border-orange-500">
                  <p className="text-orange-700 text-xs sm:text-sm font-medium break-words">🤔 {example.question}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenge Question */}
        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">💭</span>
            Renungkan!
          </h3>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
            <p className="text-gray-700">{content.challengeQuestion}</p>
          </div>
          {content.nextStepHint && (
            <div className="mt-4 text-center">
              <p className="text-green-600 font-medium text-sm">{content.nextStepHint}</p>
            </div>
          )}
        </div>

        <button 
          onClick={() => markAsCompleted(section.id)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium text-lg flex items-center justify-center space-x-2"
        >
          <span>✓</span>
          <span>Lanjutkan Eksplorasi</span>
        </button>
      </div>
    );
  };

  const renderARExplorationContent = () => {
    const [arCompleted, setArCompleted] = useState(false);
    const [lkpdCompleted, setLkpdCompleted] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    // Check localStorage for completion status
    useEffect(() => {
      const arStatus = localStorage.getItem(`ar-completed-${section.id}`);
      const lkpdStatus = localStorage.getItem(`lkpd-completed-${section.id}`);
      if (arStatus === 'true') setArCompleted(true);
      if (lkpdStatus === 'true') setLkpdCompleted(true);
    }, [section.id]);

    const handleArCompletion = () => {
      setArCompleted(true);
      localStorage.setItem(`ar-completed-${section.id}`, 'true');
    };

    const handleLkpdCompletion = () => {
      setLkpdCompleted(true);
      localStorage.setItem(`lkpd-completed-${section.id}`, 'true');
    };

    const handleSectionCompletion = () => {
      if (!arCompleted || !lkpdCompleted) {
        setShowIncompleteModal(true);
        return;
      }
      markAsCompleted(section.id);
    };

    return (
      <div className="space-y-6">
        {/* AR Introduction */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🥽</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Eksplorasi dengan AR</h3>
              <p className="text-gray-700 mb-4">{content.introduction}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-purple-700 font-medium">{content.arChallenge}</p>
              </div>
            </div>
          </div>
        </div>

        {/* AR Tasks */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Misi Eksplorasi AR
          </h3>
          <div className="space-y-3">
            {content.explorationTasks.map((task, i) => (
              <div key={i} className={`rounded-lg p-4 flex items-center ${
                arCompleted ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${
                  arCompleted ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {arCompleted ? '✓' : i + 1}
                </div>
                <p className="text-gray-700 text-sm">{task}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AR Button */}
        <div className={`rounded-2xl p-6 text-white text-center transition-all ${
          arCompleted ? 'bg-gradient-to-r from-green-500 to-teal-600' : 'bg-gradient-to-r from-purple-500 to-blue-600'
        }`}>
          <h3 className="font-bold text-lg mb-2">
            {arCompleted ? '✅ AR Eksplorasi Selesai!' : 'Mulai Eksplorasi AR'}
          </h3>
          <p className={`text-sm mb-4 ${arCompleted ? 'text-green-100' : 'text-purple-100'}`}>
            {arCompleted ? 'Bagus! Kamu sudah menyelesaikan eksplorasi AR.' : 'Jelajahi tabung dalam dunia virtual!'}
          </p>
          
          {!arCompleted ? (
            <Link href="/ar/silinder">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors">
                🥽 Buka AR Experience
              </button>
            </Link>
          ) : (
            <button 
              onClick={handleArCompletion}
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium"
              disabled
            >
              ✅ AR Selesai - Lanjut ke LKPD
            </button>
          )}
        </div>

        {/* LKPD Section - Only shows after AR completion */}
        {arCompleted && (
          <div className="bg-green-50 rounded-2xl p-6 animate-fade-in">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">🎉</span>
              <h3 className="font-bold text-gray-800">Hebat! Saatnya LKPD</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Setelah menyelesaikan eksplorasi AR, sekarang lengkapi LKPD untuk memperdalam pemahamanmu tentang unsur-unsur tabung!
            </p>
            
            <div className={`rounded-lg p-4 mb-4 ${lkpdCompleted ? 'bg-green-100 border border-green-300' : 'bg-white border border-green-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">📋 Lembar Kerja Peserta Didik</h4>
                  <p className="text-sm text-gray-600">
                    {lkpdCompleted ? 'LKPD telah diselesaikan!' : 'Klik untuk mengerjakan LKPD'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a href={content.lkpdLink} target="_blank" rel="noopener noreferrer">
                    <button 
                      onClick={handleLkpdCompletion}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        lkpdCompleted ? 'bg-green-200 text-green-800' : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {lkpdCompleted ? '✅ Sudah Selesai' : '📝 Buka LKPD'}
                    </button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Elements Summary - Only shows after LKPD completion */}
        {arCompleted && lkpdCompleted && content.summaryContent && (
          <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200 animate-fade-in">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🎊</span>
              <h3 className="font-bold text-gray-800">{content.summaryContent.title}</h3>
            </div>
            <p className="text-gray-700 mb-4">{content.summaryContent.definition}</p>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Poin Penting dari Temuanmu:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {content.summaryContent.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
            
            {/* Detailed Elements - Now as findings */}
            <div className="mt-4">
              <h4 className="font-semibold text-gray-800 mb-3">📝 Catatan Temuan Lengkap</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.elements.map((element, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">{element.symbol}</span>
                      <h5 className="font-semibold text-gray-800">{element.name}</h5>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{element.description}</p>
                    <ul className="list-disc list-inside text-xs text-gray-500 space-y-1">
                      {element.properties.map((prop, j) => (
                        <li key={j}>{prop}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Completion Button */}
        <button 
          onClick={handleSectionCompletion}
          className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-colors ${
            arCompleted && lkpdCompleted 
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600' 
              : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 cursor-pointer'
          }`}
        >
          <span>{arCompleted && lkpdCompleted ? '✓' : '⚠️'}</span>
          <span>
            {arCompleted && lkpdCompleted 
              ? 'Selesaikan Eksplorasi' 
              : 'Selesaikan Eksplorasi (Cek Persyaratan)'
            }
          </span>
        </button>

        {/* Incomplete Requirements Modal */}
        {showIncompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Dapat Menyelesaikan!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kamu harus menyelesaikan semua aktivitas terlebih dahulu sebelum dapat melanjutkan ke materi berikutnya.
                </p>
                
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Yang masih perlu diselesaikan:</h4>
                  <div className="space-y-2 text-left">
                    {!arCompleted && (
                      <div className="flex items-center text-orange-700 text-sm">
                        <span className="mr-2">🥽</span>
                        <span>Eksplorasi AR - Klik tombol "Buka AR Experience"</span>
                      </div>
                    )}
                    {!lkpdCompleted && (
                      <div className="flex items-center text-orange-700 text-sm">
                        <span className="mr-2">📋</span>
                        <span>LKPD - Kerjakan dan tandai selesai</span>
                      </div>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => setShowIncompleteModal(false)}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  ✅ Mengerti, Akan Saya Selesaikan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderExperimentContent = () => {
    const [lkpdCompleted, setLkpdCompleted] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    // Check localStorage for completion status
    useEffect(() => {
      const lkpdStatus = localStorage.getItem(`lkpd-completed-${section.id}`);
      if (lkpdStatus === 'true') setLkpdCompleted(true);
    }, [section.id]);

    const handleLkpdCompletion = () => {
      setLkpdCompleted(true);
      localStorage.setItem(`lkpd-completed-${section.id}`, 'true');
    };

    const handleSectionCompletion = () => {
      if (!lkpdCompleted) {
        setShowIncompleteModal(true);
        return;
      }
      markAsCompleted(section.id);
    };
    return (
      <div className="space-y-6">
        {/* Experiment Introduction */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">⚗️</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Eksperimen Volume</h3>
              <p className="text-gray-700 mb-4">{content.question}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-orange-700 font-medium">💡 {content.hypothesis}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Experiment Steps */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🔬</span>
            Langkah Eksperimen
          </h3>
          <div className="space-y-3 mb-4">
            {content.discovery.map((step, i) => (
              <div key={i} className="bg-orange-50 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm">{content.experimentPrompt}</p>
        </div>

        {/* LKPD Section */}
        <div className="bg-blue-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📋</span>
            LKPD: Eksperimen Volume
          </h3>
          <p className="text-gray-600 text-sm mb-4">Lakukan eksperimen virtual dan catat temuanmu!</p>
          
          <div className={`rounded-lg p-4 mb-4 ${lkpdCompleted ? 'bg-green-100 border border-green-300' : 'bg-white border border-blue-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">🧪 Lembar Kerja Eksperimen</h4>
                <p className="text-sm text-gray-600">
                  {lkpdCompleted ? 'LKPD eksperimen telah diselesaikan!' : 'Klik untuk mengerjakan LKPD eksperimen'}
                </p>
              </div>
              <div className="flex space-x-2">
                <a href={content.lkpdLink} target="_blank" rel="noopener noreferrer">
                  <button 
                    onClick={handleLkpdCompletion}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      lkpdCompleted ? 'bg-green-200 text-green-800' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {lkpdCompleted ? '✅ Sudah Selesai' : '📝 Mulai Eksperimen'}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Discovery */}
        <div className="bg-green-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧮</span>
            Rumus yang Ditemukan
          </h3>
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">{content.formula.discovery}</p>
              <div className="text-2xl font-bold text-green-600 mb-2">{content.formula.main}</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(content.formula.components).map(([symbol, meaning], i) => (
                <div key={i} className="bg-gray-50 rounded p-3 text-center">
                  <div className="font-bold text-gray-800">{symbol}</div>
                  <div className="text-xs text-gray-600">{meaning}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary - Only shows after LKPD completion */}
        {lkpdCompleted && content.summaryContent && (
          <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200 animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📚</span>
              {content.summaryContent.title}
            </h3>
            <p className="text-gray-700 mb-3">{content.summaryContent.definition}</p>
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="text-center text-lg font-bold text-blue-600 mb-2">{content.summaryContent.formula}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Insight Penting:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {content.summaryContent.keyInsights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button 
          onClick={handleSectionCompletion}
          className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-colors ${
            lkpdCompleted 
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600' 
              : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 cursor-pointer'
          }`}
        >
          <span>{lkpdCompleted ? '✓' : '⚠️'}</span>
          <span>
            {lkpdCompleted 
              ? 'Selesaikan Eksperimen' 
              : 'Selesaikan Eksperimen (Cek Persyaratan)'
            }
          </span>
        </button>

        {/* Incomplete Requirements Modal */}
        {showIncompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Dapat Menyelesaikan!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kamu harus menyelesaikan LKPD eksperimen terlebih dahulu sebelum dapat melanjutkan ke materi berikutnya.
                </p>
                
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Yang masih perlu diselesaikan:</h4>
                  <div className="flex items-center text-orange-700 text-sm">
                    <span className="mr-2">📋</span>
                    <span>LKPD Eksperimen - Kerjakan dan tandai selesai</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowIncompleteModal(false)}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  ✅ Mengerti, Akan Saya Selesaikan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInvestigationContent = () => {
    const [lkpdCompleted, setLkpdCompleted] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    // Check localStorage for completion status
    useEffect(() => {
      const lkpdStatus = localStorage.getItem(`lkpd-completed-${section.id}`);
      if (lkpdStatus === 'true') setLkpdCompleted(true);
    }, [section.id]);

    const handleLkpdCompletion = () => {
      setLkpdCompleted(true);
      localStorage.setItem(`lkpd-completed-${section.id}`, 'true');
    };

    const handleSectionCompletion = () => {
      if (!lkpdCompleted) {
        setShowIncompleteModal(true);
        return;
      }
      markAsCompleted(section.id);
    };
    return (
      <div className="space-y-6">
        {/* Investigation Introduction */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🎨</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Investigasi Luas Permukaan</h3>
              <p className="text-gray-700 mb-3">{content.scenario}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-pink-500">
                <p className="text-gray-700 text-sm">{content.problem}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Investigation Steps */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🕵️</span>
            Langkah Investigasi
          </h3>
          <div className="space-y-3">
            {content.investigationSteps.map((step, i) => (
              <div key={i} className="bg-pink-50 rounded-lg p-4 flex items-center">
                <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm mr-3">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LKPD Section */}
        <div className="bg-purple-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">📋</span>
            LKPD: Investigasi Luas Permukaan
          </h3>
          <p className="text-gray-600 text-sm mb-4">Selidiki dan hitung luas permukaan tabung!</p>
          
          <div className={`rounded-lg p-4 mb-4 ${lkpdCompleted ? 'bg-green-100 border border-green-300' : 'bg-white border border-purple-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">🕵️ Lembar Kerja Investigasi</h4>
                <p className="text-sm text-gray-600">
                  {lkpdCompleted ? 'LKPD investigasi telah diselesaikan!' : 'Klik untuk mengerjakan LKPD investigasi'}
                </p>
              </div>
              <div className="flex space-x-2">
                <a href={content.lkpdLink} target="_blank" rel="noopener noreferrer">
                  <button 
                    onClick={handleLkpdCompletion}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      lkpdCompleted ? 'bg-green-200 text-green-800' : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                  >
                    {lkpdCompleted ? '✅ Sudah Selesai' : '📝 Mulai Investigasi'}
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Breakdown */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧮</span>
            Rumus Luas Permukaan
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Komponen Luas Permukaan:</h4>
              <div className="space-y-2">
                {content.formula.breakdown.map((component, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded p-2">
                    <span className="text-gray-700 text-sm">{component.split('=')[0]}</span>
                    <span className="font-mono text-blue-600">{component.split('=')[1]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{content.formula.main}</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(content.formula.components).map(([symbol, meaning], i) => (
                  <div key={i} className="bg-gray-50 rounded p-3 text-center">
                    <div className="font-bold text-gray-800">{symbol}</div>
                    <div className="text-xs text-gray-600">{meaning}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Summary - Only shows after LKPD completion */}
        {lkpdCompleted && content.summaryContent && (
          <div className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200 animate-fade-in">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center">
              <span className="mr-2">📚</span>
              {content.summaryContent.title}
            </h3>
            <p className="text-gray-700 mb-3">{content.summaryContent.definition}</p>
            <div className="bg-white rounded-lg p-4 mb-3">
              <div className="text-center text-lg font-bold text-purple-600 mb-2">{content.summaryContent.formula}</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Insight Penting:</h4>
              <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                {content.summaryContent.keyInsights.map((insight, i) => (
                  <li key={i}>{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <button 
          onClick={handleSectionCompletion}
          className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center space-x-2 transition-colors ${
            lkpdCompleted 
              ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:from-green-600 hover:to-teal-600' 
              : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 cursor-pointer'
          }`}
        >
          <span>{lkpdCompleted ? '✓' : '⚠️'}</span>
          <span>
            {lkpdCompleted 
              ? 'Selesaikan Investigasi' 
              : 'Selesaikan Investigasi (Cek Persyaratan)'
            }
          </span>
        </button>

        {/* Incomplete Requirements Modal */}
        {showIncompleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
              <div className="text-center">
                <div className="text-4xl mb-4">⚠️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Dapat Menyelesaikan!</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Kamu harus menyelesaikan LKPD investigasi terlebih dahulu sebelum dapat melanjutkan ke materi berikutnya.
                </p>
                
                <div className="bg-orange-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Yang masih perlu diselesaikan:</h4>
                  <div className="flex items-center text-orange-700 text-sm">
                    <span className="mr-2">📋</span>
                    <span>LKPD Investigasi - Kerjakan dan tandai selesai</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowIncompleteModal(false)}
                  className="w-full bg-blue-500 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
                >
                  ✅ Mengerti, Akan Saya Selesaikan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const render3DBuilderContent = () => {
    return (
      <div className="space-y-6">
        {/* Back to Challenge */}
        <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="text-4xl">🎯</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">Kembali ke Tantangan Awal</h3>
              <p className="text-gray-700 mb-4">{content.backToChallenge}</p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                <p className="text-green-700 font-medium">{content.challenge}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            Persyaratan Menara
          </h3>
          <div className="space-y-3">
            {content.requirements.map((req, i) => (
              <div key={i} className="bg-blue-50 rounded-lg p-4 flex items-start">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs mr-3 mt-1">
                  ✓
                </div>
                <p className="text-gray-700 text-sm">{req}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Applied */}
        <div className="bg-yellow-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🧠</span>
            Keterampilan yang Diterapkan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {content.skills.map((skill, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border-l-4 border-yellow-500">
                <p className="text-gray-700 text-sm">{skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3D Builder */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-2xl p-6 text-white text-center">
          <h3 className="font-bold text-xl mb-2">🏗️ Bangun Menara 3D</h3>
          <p className="text-teal-100 text-sm mb-4">Wujudkan menara tabung impianmu!</p>
          <Link href={content.builderLink}>
            <button className="bg-white text-teal-600 px-8 py-4 rounded-xl font-medium text-lg hover:bg-gray-100 transition-colors">
              🎮 Mulai Membangun
            </button>
          </Link>
        </div>

        {/* Reflection */}
        <div className="bg-purple-50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💭</span>
            Refleksi Pembelajaran
          </h3>
          <div className="space-y-3">
            {content.reflection.map((question, i) => (
              <div key={i} className="bg-white rounded-lg p-4">
                <p className="text-gray-700 text-sm font-medium">{question}</p>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={() => markAsCompleted(section.id)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium text-lg flex items-center justify-center space-x-2"
        >
          <span>🎉</span>
          <span>Selesaikan Pembelajaran</span>
        </button>
      </div>
    );
  };

  const renderInteractiveContent = () => {
    return (
      <div className="space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {content.definition && (
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Definisi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{content.definition}</p>
            </div>
          )}

          {content.characteristics && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Karakteristik:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {content.characteristics.map((char, i) => (
                  <li key={i}>{char}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Examples with Grid */}
          {content.examples && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Contoh Visual:</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {content.examples.map((example, i) => (
                  <div key={i} className="bg-cyan-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="w-full h-24 sm:h-28 md:h-32 mb-3 relative">
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-dashed border-cyan-300 rounded-lg flex items-center justify-center w-full h-full">
                        <div className="text-center p-2">
                          <div className="text-xl sm:text-2xl mb-1">🥤</div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium">{example.name}</div>
                          <div className="text-xs text-gray-500 mt-1 hidden sm:block">Placeholder Image</div>
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{example.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calculator Widget */}
        {content.calculator && (
          <CylinderCalculator />
        )}

        {/* Quiz Section */}
        {content.quiz && (
          <QuizSection questions={content.quiz.questions} sectionId={section.id} />
        )}

        {/* Study Case */}
        {content.studyCase && (
          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              {content.studyCase.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{content.studyCase.scenario}</p>
            
            <div className="space-y-3">
              {content.studyCase.tasks?.map((task, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="font-medium text-gray-800">{task.building || task.product}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-green-600">{task.shape}</span> - {task.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => markAsCompleted(section.id)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium text-lg flex items-center justify-center space-x-2"
        >
          <span>✓</span>
          <span>Selesaikan Pembelajaran</span>
        </button>
      </div>
    );
  };

  return (
    <div className="mt-4">
      {section.type === 'case-study' && renderCaseStudyContent()}
      {section.type === 'ar-exploration' && renderARExplorationContent()}
      {section.type === 'experiment' && renderExperimentContent()}
      {section.type === 'investigation' && renderInvestigationContent()}
      {section.type === '3d-builder' && render3DBuilderContent()}
      {(section.type === 'interactive' || section.type === 'visual' || section.type === 'calculator' || section.type === 'formula') && renderInteractiveContent()}
    </div>
  );
}
