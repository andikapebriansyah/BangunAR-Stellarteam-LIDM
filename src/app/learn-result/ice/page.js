'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export default function LearnResultIceCream() {
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
    const challengeId = 'ice-cream-challenge';
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
      id: 'volume-cone-waffle',
      question: 'Berdasarkan model es krim yang Anda bangun, jika waffle cone memiliki jari-jari 3cm dan tinggi 8cm. Hitunglah volume cone waffle tersebut!',
      type: 'input',
      correctAnswer: '75.4',
      unit: 'cm³',
      points: 25,
      formula: 'V = ⅓ × π × r² × t = ⅓ × 3.14 × 3² × 8 = 75.4 cm³'
    },
    {
      id: 'volume-sphere-large',
      question: 'Jika es krim layer besar berbentuk bola dengan jari-jari 4cm. Berapakah volume bola es krim besar tersebut?',
      type: 'input',
      correctAnswer: '268.1',
      unit: 'cm³',
      points: 25,
      formula: 'V = ⁴⁄₃ × π × r³ = ⁴⁄₃ × 3.14 × 4³ = 268.1 cm³'
    },
    {
      id: 'volume-sphere-small',
      question: 'Jika es krim layer kecil berbentuk bola dengan jari-jari 2.5cm. Berapakah volume bola es krim kecil tersebut?',
      type: 'input',
      correctAnswer: '65.4',
      unit: 'cm³',
      points: 25,
      formula: 'V = ⁴⁄₃ × π × r³ = ⁴⁄₃ × 3.14 × 2.5³ = 65.4 cm³'
    },
    {
      id: 'total-volume',
      question: 'Hitunglah total volume seluruh es krim (waffle cone + es krim besar + es krim kecil)!',
      type: 'input',
      correctAnswer: '408.9',
      unit: 'cm³',
      points: 25,
      formula: 'V total = 75.4 + 268.1 + 65.4 = 408.9 cm³'
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
      
      if (userAnswer && Math.abs(parseFloat(userAnswer) - parseFloat(question.correctAnswer)) < 1) {
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
    const challengeId = 'ice-cream-challenge';
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
    const challengeId = 'ice-cream-challenge';
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-2"></div>
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
        <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 px-6 py-6 text-white">
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
            <p className="text-pink-100 text-sm">Analisis jawaban Anda</p>
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
            const isCorrect = userAnswer && Math.abs(parseFloat(userAnswer) - parseFloat(question.correctAnswer)) < 1;
            
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
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <span className="font-medium">Rumus: </span>{question.formula}
                      </div>
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
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:from-pink-700 hover:to-purple-700 transition-all"
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
      <div className="bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 px-6 py-6 text-white">
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
          <p className="text-pink-100 text-sm">Analisis model es krim yang Anda bangun</p>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Model Result */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🍦</span>
            </div>
            <h2 className="font-bold text-gray-800">Model yang Berhasil Dibangun</h2>
          </div>

          {/* 3D Model Preview */}
          <div className="bg-gradient-to-b from-pink-50 to-purple-100 border-2 border-pink-200 rounded-xl p-8 mb-4 min-h-[260px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-700 mb-6">Model Es Krim 3D</div>
              
              {/* Es Krim 3D CSS - Berlayer */}
              <div className="relative mx-auto mb-6" style={{ width: '120px', height: '160px' }}>
                {/* Es krim layer kecil (atas) */}
                <div 
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 rounded-full border-2 shadow-lg"
                  style={{
                    width: '35px',
                    height: '35px',
                    backgroundColor: '#FF69B4',
                    borderColor: '#FF1493',
                    boxShadow: '0 2px 8px rgba(255, 105, 180, 0.4)',
                    background: 'radial-gradient(circle at 30% 30%, #FFB6C1, #FF69B4)'
                  }}
                />
                
                {/* Es krim layer besar (tengah) */}
                <div 
                  className="absolute left-1/2 transform -translate-x-1/2 rounded-full border-2 shadow-lg"
                  style={{
                    top: '25px',
                    width: '55px',
                    height: '55px',
                    backgroundColor: '#FFB6C1',
                    borderColor: '#FF91A4',
                    boxShadow: '0 3px 10px rgba(255, 182, 193, 0.4)',
                    background: 'radial-gradient(circle at 30% 30%, #FFC0CB, #FFB6C1)'
                  }}
                />
                
                {/* Waffle cone (bawah) */}
                <div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 shadow-lg"
                  style={{
                    width: '0px',
                    height: '0px',
                    borderLeft: '30px solid transparent',
                    borderRight: '30px solid transparent',
                    borderTop: '80px solid #D2691E',
                    filter: 'drop-shadow(0 3px 8px rgba(210, 105, 30, 0.3))',
                    background: 'linear-gradient(135deg, #DEB887 0%, #D2691E 50%, #A0522D 100%)'
                  }}
                />
                
                {/* Pattern waffle */}
                <div 
                  className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-30"
                  style={{
                    width: '40px',
                    height: '60px',
                    background: `repeating-linear-gradient(
                      45deg,
                      transparent,
                      transparent 3px,
                      rgba(139, 69, 19, 0.3) 3px,
                      rgba(139, 69, 19, 0.3) 6px
                    ), repeating-linear-gradient(
                      -45deg,
                      transparent,
                      transparent 3px,
                      rgba(139, 69, 19, 0.3) 3px,
                      rgba(139, 69, 19, 0.3) 6px
                    )`,
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)'
                  }}
                />
              </div>
              
              <div className="text-sm text-gray-600 font-medium">
                Es krim terdiri dari 3 bangun ruang utama
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600 text-lg">🎉</span>
              <h3 className="font-semibold text-green-800">Selamat! Anda berhasil membangun es krim berlayer!</h3>
            </div>
            <p className="text-green-700 text-sm leading-relaxed">
              Model es krim ini terdiri dari <strong>kerucut</strong> sebagai waffle cone, <strong>bola besar</strong> sebagai layer es krim utama, 
              dan <strong>bola kecil</strong> sebagai topping. Kombinasi ketiga bangun ruang ini menciptakan struktur es krim yang lezat dan menarik. 
              Mari pelajari rumus-rumus volume dan luas permukaan untuk masing-masing bangun ruang!
            </p>
          </div>
        </div>

        {/* Rincian Bangun Ruang */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">📐</span>
            </div>
            <h2 className="font-bold text-gray-800">Rincian Bangun Ruang</h2>
          </div>

          <div className="space-y-4">
            {/* Kerucut Waffle */}
            <div className="border-l-4 border-orange-400 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🧇</span>
                </div>
                <h3 className="font-semibold text-gray-800">Kerucut (Waffle Cone)</h3>
              </div>
              
             <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-orange-100 border border-orange-200 p-3 rounded-lg">
                  <div className="text-xs text-orange-700 mb-1 font-medium">LUAS PERMUKAAN</div>
                  <div className="font-bold text-orange-800 text-lg">πr(r + s)</div>
                  <div className="text-xs text-orange-600 mt-1">s = garis pelukis</div>
                </div>
                <div className="bg-orange-100 border border-orange-200 p-3 rounded-lg">
                  <div className="text-xs text-orange-700 mb-1 font-medium">VOLUME</div>
                  <div className="font-bold text-orange-800 text-lg">⅓ × π × r² × t</div>
                  <div className="text-xs text-orange-600 mt-1">sepertiga luas alas × tinggi</div>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-orange-800 mb-1">Contoh Dimensi Waffle Cone:</div>
                <div className="text-sm text-orange-700">
                  <div>Jari-jari = 3cm, Tinggi = 8cm</div>
                  <div>Garis pelukis = √(r² + t²) = √(9 + 64) = 8.5cm</div>
                  <div>Volume = ⅓ × π × 3² × 8 = ⅓ × 3.14 × 9 × 8 = 75.4 cm³</div>
                  <div>Luas Permukaan = π × 3 × (3 + 8.5) = 108.3 cm²</div>
                </div>
              </div>
            </div>

            {/* Bola Es Krim Besar */}
            <div className="border-l-4 border-pink-400 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🍦</span>
                </div>
                <h3 className="font-semibold text-gray-800">Bola (Es Krim Layer Besar)</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-pink-100 border border-pink-200 p-3 rounded-lg">
                  <div className="text-xs text-pink-700 mb-1 font-medium">LUAS PERMUKAAN</div>
                  <div className="font-bold text-pink-800 text-lg">4πr²</div>
                  <div className="text-xs text-pink-600 mt-1">4 × luas lingkaran</div>
                </div>
                <div className="bg-pink-100 border border-pink-200 p-3 rounded-lg">
                  <div className="text-xs text-pink-700 mb-1 font-medium">VOLUME</div>
                  <div className="font-bold text-pink-800 text-lg">⁴⁄₃ × π × r³</div>
                  <div className="text-xs text-pink-600 mt-1">empat per tiga × π × r kubik</div>
                </div>
              </div>

              <div className="bg-pink-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-pink-800 mb-1">Contoh Dimensi Es Krim Besar:</div>
                <div className="text-sm text-pink-700">
                  <div>Jari-jari = 4cm</div>
                  <div>Volume = ⁴⁄₃ × π × 4³ = ⁴⁄₃ × 3.14 × 64 = 268.1 cm³</div>
                  <div>Luas Permukaan = 4 × π × 4² = 4 × 3.14 × 16 = 201.1 cm²</div>
                </div>
              </div>
            </div>

            {/* Bola Es Krim Kecil */}
            <div className="border-l-4 border-purple-400 pl-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm">🧁</span>
                </div>
                <h3 className="font-semibold text-gray-800">Bola (Es Krim Layer Kecil)</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div className="bg-purple-100 border border-purple-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">LUAS PERMUKAAN</div>
                  <div className="font-bold text-purple-800 text-lg">4πr²</div>
                  <div className="text-xs text-purple-600 mt-1">4 × luas lingkaran</div>
                </div>
                <div className="bg-purple-100 border border-purple-200 p-3 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">VOLUME</div>
                  <div className="font-bold text-purple-800 text-lg">⁴⁄₃ × π × r³</div>
                  <div className="text-xs text-purple-600 mt-1">empat per tiga × π × r kubik</div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-purple-800 mb-1">Contoh Dimensi Es Krim Kecil:</div>
                <div className="text-sm text-purple-700">
                  <div>Jari-jari = 2.5cm</div>
                  <div>Volume = ⁴⁄₃ × π × 2.5³ = ⁴⁄₃ × 3.14 × 15.625 = 65.4 cm³</div>
                  <div>Luas Permukaan = 4 × π × 2.5² = 4 × 3.14 × 6.25 = 78.5 cm²</div>
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
                      step="0.1"
                      value={quizAnswers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 text-center font-medium"
                      placeholder="Masukkan hasil perhitungan..."
                    />
                    <span className="text-sm text-gray-600 min-w-0 flex-shrink-0">{question.unit}</span>
                  </div>
                  
                  {/* Hint formula display */}
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                    <span className="font-medium">Petunjuk: </span>
                    {question.id === 'volume-cone-waffle' && 'Gunakan rumus volume kerucut: V = ⅓ × π × r² × t'}
                    {question.id.includes('sphere') && 'Gunakan rumus volume bola: V = ⁴⁄₃ × π × r³'}
                    {question.id === 'total-volume' && 'Jumlahkan semua volume: V total = V cone + V bola besar + V bola kecil'}
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
              : 'bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700'
          }`}
        >
          ✓ Submit Jawaban
        </button>
      </div>
    </div>
  );
}
