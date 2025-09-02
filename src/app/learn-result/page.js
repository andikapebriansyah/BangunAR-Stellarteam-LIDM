'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function LearnResult() {
  const router = useRouter();
  const [buildResult, setBuildResult] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load build result from localStorage
  useEffect(() => {
    const result = localStorage.getItem('lastBuildResult');
    if (result) {
      const parsedResult = JSON.parse(result);
      setBuildResult(parsedResult);
    }
    
    // Check if quiz already completed for this challenge
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    const challengeId = 'rumah-sederhana';
    if (quizResults[challengeId]) {
      setQuizCompleted(true);
      setQuizScore(quizResults[challengeId].score);
      setQuizAnswers(quizResults[challengeId].answers);
      setShowFeedback(true);
    }
  }, []);

  // Quiz questions based on the build result
  const quizQuestions = [
    {
      id: 'volume-balok',
      question: 'Berdasarkan model rumah yang Anda bangun, jika balok memiliki dimensi panjang 10m, lebar 8m, dan tinggi 5m. Hitunglah volume balok tersebut!',
      type: 'input',
      correctAnswer: '400',
      unit: 'm³',
      points: 25
    },
    {
      id: 'volume-prisma',
      question: 'Jika prisma segiempat memiliki alas segiempat dengan panjang 8m dan lebar 4m, serta tinggi prisma 10m. Berapakah volume prisma tersebut?',
      type: 'input',
      correctAnswer: '320',
      unit: 'm³',
      points: 25
    }
  ];

  const handleAnswerChange = (questionId, value) => {
    if (quizCompleted) return; // Prevent changes after completion
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    let totalPoints = 0;

    quizQuestions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = quizAnswers[question.id];
      
      if (userAnswer && userAnswer.toString().trim() === question.correctAnswer) {
        score += question.points;
      }
    });

    return { score, totalPoints };
  };

  const handleSubmit = () => {
    if (quizCompleted) return; // Prevent multiple submissions
    
    const { score } = calculateQuizScore();
    setQuizScore(score);
    
    // Save quiz results to localStorage
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    const challengeId = 'rumah-sederhana';
    quizResults[challengeId] = {
      score: score,
      answers: quizAnswers,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // Update completed challenges and scores
    const scores = JSON.parse(localStorage.getItem('challengeScores') || '{}');
    scores[challengeId] = Math.max(scores[challengeId] || 0, score);
    localStorage.setItem('challengeScores', JSON.stringify(scores));
    
    setQuizCompleted(true);
    setShowFeedback(true);
  };

  const goBackToList = () => {
    // Clear the build result
    localStorage.removeItem('lastBuildResult');
    router.push('/build-challenge-selection');
  };

  const resetQuiz = () => {
    // Clear quiz data for this challenge
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    const challengeId = 'rumah-sederhana';
    delete quizResults[challengeId];
    localStorage.setItem('quizResults', JSON.stringify(quizResults));
    
    // Reset state
    setQuizCompleted(false);
    setQuizAnswers({});
    setShowFeedback(false);
    setQuizScore(0);
  };

  if (!buildResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Memuat hasil...</p>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    const { score: qScore, totalPoints } = calculateQuizScore();
    
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-6 py-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-sm">🎉</span>
              </div>
              <span className="font-medium">Hasil Kuis</span>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              Skor Kuis: {quizScore}
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-xl font-bold mb-1">Feedback Hasil</h1>
            <p className="text-purple-100 text-sm">Analisis jawaban Anda</p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-4">
          {/* Overall Score */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-2">
                {qScore}/{totalPoints} Poin
              </div>
              <div className="text-sm text-gray-600 mb-3">
                Skor Kuis Anda
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                qScore >= totalPoints * 0.8 ? 'bg-green-100 text-green-700' :
                qScore >= totalPoints * 0.6 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {qScore >= totalPoints * 0.8 ? 'Excellent!' : 
                 qScore >= totalPoints * 0.6 ? 'Good Job!' : 'Keep Learning!'}
              </div>
            </div>
          </div>

          {/* Question Feedback */}
          {quizQuestions.map((question, index) => {
            const userAnswer = quizAnswers[question.id];
            const isCorrect = userAnswer && userAnswer.toString().trim() === question.correctAnswer;
            
            return (
              <div key={question.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className={`flex items-start space-x-3 p-3 rounded-xl ${
                  isCorrect ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm ${
                    isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    {isCorrect ? '✓' : '✗'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 mb-2">Soal {index + 1}</h3>
                    <p className="text-sm text-gray-600 mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Jawaban Anda: </span>
                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {userAnswer || 'Tidak dijawab'} {question.unit}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-sm">
                          <span className="font-medium">Jawaban Benar: </span>
                          <span className="text-green-600">{question.correctAnswer} {question.unit}</span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Poin: {isCorrect ? question.points : 0}/{question.points}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={goBackToList}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              Kembali ke Daftar Build
            </button>
            
            <button 
              onClick={resetQuiz}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-lg hover:from-orange-600 hover:to-red-600 transition-all"
            >
              🔄 Ulangi Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 px-6 py-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <Link href="/build-challenge-selection">
            <button className="flex items-center space-x-2 text-white">
              <span>←</span>
              <span>Kembali</span>
            </button>
          </Link>
          <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
            Skor Kuis: {quizScore}
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-xl font-bold mb-1">Learn Result</h1>
          <p className="text-purple-100 text-sm">Analisis model yang Anda bangun</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Model Result */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🏠</span>
            </div>
            <h2 className="font-bold text-gray-800">Model yang Berhasil Dibangun</h2>
          </div>

          {/* 3D Model Preview */}
          <div className="bg-gradient-to-b from-blue-50 to-purple-100 border-2 border-purple-200 rounded-xl p-8 mb-4 min-h-[260px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700 mb-6">Model Rumah 3D</div>
              
              {/* Rumah 3D CSS - Menyatu */}
              <div className="relative mx-auto mb-6" style={{ width: '160px', height: '140px' }}>
                {/* Atap prisma segitiga */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '0px',
                    height: '0px',
                    borderLeft: '50px solid transparent',
                    borderRight: '50px solid transparent',
                    borderBottom: '45px solid #F59E0B',
                    filter: 'drop-shadow(0 4px 8px rgba(245, 158, 11, 0.3))'
                  }}
                />
                
                {/* Balok untuk badan rumah - menyatu dengan atap */}
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 rounded-lg border-2 shadow-lg"
                  style={{
                    top: '40px',
                    width: '90px',
                    height: '70px',
                    backgroundColor: '#3B82F6',
                    borderColor: '#2563EB',
                    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.4)',
                    background: 'linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%)'
                  }}
                />
                
                {/* Pintu rumah */}
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 rounded-b-lg"
                  style={{
                    top: '70px',
                    width: '16px',
                    height: '25px',
                    backgroundColor: '#8B4513',
                    borderColor: '#654321',
                    border: '1px solid #654321'
                  }}
                />
                
                {/* Jendela kiri */}
                <div 
                  className="absolute rounded"
                  style={{
                    top: '55px',
                    left: '50px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#FFD700',
                    border: '1px solid #FFA500'
                  }}
                />
                
                {/* Jendela kanan */}
                <div 
                  className="absolute rounded"
                  style={{
                    top: '55px',
                    right: '50px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#FFD700',
                    border: '1px solid #FFA500'
                  }}
                />
              </div>
              
              <div className="text-sm text-gray-600 font-medium">
                Rumah terdiri dari 2 bangun ruang utama
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600 text-lg">🎉</span>
              <h3 className="font-semibold text-green-800">Selamat! Anda berhasil membangun rumah!</h3>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              Model rumah ini terdiri dari <strong>balok</strong> sebagai badan rumah dan <strong>prisma segitiga</strong> sebagai atap. 
              Kombinasi kedua bangun ruang ini menciptakan struktur rumah yang solid dan indah. Mari pelajari 
              rumus-rumus volume dan luas permukaan untuk masing-masing bangun ruang!
            </p>
          </div>
        </div>

        {/* Rincian Bangun Ruang */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📐</span>
            </div>
            <h2 className="font-bold text-gray-800">Rincian Bangun Ruang</h2>
          </div>

          <div className="space-y-4">
            {/* Balok */}
            <div className="border-l-4 border-teal-400 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">📦</span>
                </div>
                <h3 className="font-semibold text-gray-800">Balok (Badan Rumah)</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">LUAS PERMUKAAN</div>
                  <div className="font-semibold">2(pl + pt + lt)</div>
                  <div className="text-xs text-teal-600 mt-1">persegi panjang</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">VOLUME</div>
                  <div className="font-semibold">p × l × t</div>
                  <div className="text-xs text-teal-600 mt-1">kubik</div>
                </div>
              </div>

              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-teal-800 mb-1">Contoh Dimensi:</div>
                <div className="text-sm text-teal-700">
                  <div>Panjang = 8m, Lebar = 6m, Tinggi = 4m</div>
                  <div>Luas Permukaan = 2(8×6 + 8×4 + 6×4) = 208 m²</div>
                  <div>Volume = 8 × 6 × 4 = 192 m³</div>
                </div>
              </div>
            </div>

            {/* Prisma */}
            <div className="border-l-4 border-amber-400 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🔺</span>
                </div>
                <h3 className="font-semibold text-gray-800">Prisma Segitiga (Atap Rumah)</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">LUAS PERMUKAAN</div>
                  <div className="font-semibold">2×La + K×t</div>
                  <div className="text-xs text-amber-600 mt-1">La = luas alas segitiga</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">VOLUME</div>
                  <div className="font-semibold">La × t</div>
                  <div className="text-xs text-amber-600 mt-1">t = tinggi prisma</div>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-amber-800 mb-1">Contoh Dimensi Atap:</div>
                <div className="text-sm text-amber-700">
                  <div>Alas segitiga = 8m, Tinggi segitiga = 3m</div>
                  <div>Panjang prisma = 6m</div>
                  <div>Luas Alas = ½ × 8 × 3 = 12 m²</div>
                  <div>Volume = 12 × 6 = 72 m³</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Soal Perhitungan */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">❓</span>
            </div>
            <h2 className="font-bold text-gray-800">Soal Perhitungan</h2>
          </div>

          <div className="space-y-4">
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-3">{question.question}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span>Volume =</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={quizAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center font-medium"
                      placeholder="Masukkan hasil perhitungan..."
                    />
                    <span className="text-sm text-gray-600 min-w-0 flex-shrink-0">{question.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
            Object.keys(quizAnswers).length < quizQuestions.length
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
          }`}
        >
          ✓ Submit Jawaban
        </button>
      </div>
    </div>
  );
}
