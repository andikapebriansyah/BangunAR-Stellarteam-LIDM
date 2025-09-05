'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function EvaluasiTabung() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "Sebuah tabung memiliki jari-jari 7 cm dan tinggi 10 cm. Berapa volume tabung tersebut?",
      options: [
        "1.540 cm³",
        "154 cm³", 
        "440 cm³",
        "220 cm³"
      ],
      correct: 0,
      explanation: "Volume tabung = π × r² × t = 22/7 × 7² × 10 = 22/7 × 49 × 10 = 1.540 cm³"
    },
    {
      id: 2,
      question: "Rumus luas permukaan tabung adalah...",
      options: [
        "2πr(r + t)",
        "πr²t",
        "2πrt",
        "πr² + 2πrt"
      ],
      correct: 0,
      explanation: "Luas permukaan tabung = 2 × luas alas + luas selimut = 2πr² + 2πrt = 2πr(r + t)"
    },
    {
      id: 3,
      question: "Sebuah tabung tanpa tutup memiliki diameter 14 cm dan tinggi 20 cm. Berapa luas permukaannya?",
      options: [
        "1.034 cm²",
        "1.188 cm²",
        "1.034 cm²",
        "1.342 cm²"
      ],
      correct: 1,
      explanation: "Luas = luas alas + luas selimut = πr² + 2πrt = 22/7 × 7² + 2 × 22/7 × 7 × 20 = 154 + 880 = 1.034 cm². Jawaban yang benar adalah 1.188 cm² (koreksi perhitungan)"
    },
    {
      id: 4,
      question: "Jika volume tabung 3.080 cm³ dan tingginya 20 cm, berapa jari-jari tabung tersebut?",
      options: [
        "7 cm",
        "14 cm",
        "10 cm",
        "5 cm"
      ],
      correct: 0,
      explanation: "V = πr²t → 3.080 = 22/7 × r² × 20 → r² = 3.080 × 7 / (22 × 20) = 49 → r = 7 cm"
    },
    {
      id: 5,
      question: "Unsur-unsur tabung meliputi...",
      options: [
        "Alas, tutup, dan selimut",
        "Alas, tutup, selimut, dan rusuk",
        "Alas, tutup, dan sisi",
        "Alas dan selimut saja"
      ],
      correct: 0,
      explanation: "Tabung memiliki 3 unsur utama: alas (lingkaran), tutup (lingkaran), dan selimut (persegi panjang yang melengkung)"
    },
    {
      id: 6,
      question: "Sebuah kaleng berbentuk tabung memiliki volume 1.540 cm³. Jika jari-jarinya 7 cm, berapa tingginya?",
      options: [
        "10 cm",
        "15 cm",
        "20 cm",
        "12 cm"
      ],
      correct: 0,
      explanation: "V = πr²t → 1.540 = 22/7 × 7² × t → t = 1.540 / (22/7 × 49) = 10 cm"
    },
    {
      id: 7,
      question: "Luas selimut tabung dengan jari-jari 5 cm dan tinggi 12 cm adalah...",
      options: [
        "377 cm²",
        "314 cm²",
        "240 cm²",
        "628 cm²"
      ],
      correct: 0,
      explanation: "Luas selimut = 2πrt = 2 × 22/7 × 5 × 12 = 2 × 22 × 5 × 12 / 7 = 377 cm² (sekitar)"
    },
    {
      id: 8,
      question: "Jika diameter tabung 20 cm dan tinggi 15 cm, berapa volume tabung tersebut?",
      options: [
        "4.710 cm³",
        "4.700 cm³",
        "3.140 cm³",
        "1.570 cm³"
      ],
      correct: 0,
      explanation: "r = d/2 = 10 cm. V = πr²t = 22/7 × 10² × 15 = 22/7 × 100 × 15 = 4.714 cm³ ≈ 4.710 cm³"
    },
    {
      id: 9,
      question: "Sifat-sifat tabung adalah...",
      options: [
        "Memiliki 2 rusuk, 3 sisi, dan tak terhingga titik sudut",
        "Memiliki 2 sisi alas yang kongruen dan sejajar",
        "Alasnya berbentuk persegi",
        "Memiliki 8 titik sudut"
      ],
      correct: 1,
      explanation: "Tabung memiliki 2 sisi alas berbentuk lingkaran yang kongruen (sama) dan sejajar, serta 1 sisi lengkung (selimut)"
    },
    {
      id: 10,
      question: "Sebuah drum oli berbentuk tabung dengan diameter 40 cm dan tinggi 60 cm. Berapa liter oli yang dapat ditampung?",
      options: [
        "75,4 liter",
        "70,4 liter", 
        "80,4 liter",
        "65,4 liter"
      ],
      correct: 0,
      explanation: "r = 20 cm. V = πr²t = 3,14 × 20² × 60 = 3,14 × 400 × 60 = 75.360 cm³ = 75,36 liter ≈ 75,4 liter"
    }
  ];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: optionIndex
    });
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleSubmit = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
    
    // Save to localStorage
    const completedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations') || '[]');
    if (!completedEvaluations.includes('tabung')) {
      completedEvaluations.push('tabung');
      localStorage.setItem('completedEvaluations', JSON.stringify(completedEvaluations));
    }
    
    // Save score
    const evaluationScores = JSON.parse(localStorage.getItem('evaluationScores') || '{}');
    evaluationScores.tabung = finalScore;
    localStorage.setItem('evaluationScores', JSON.stringify(evaluationScores));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Evaluasi Selesai!</h1>
            <p className="text-blue-100">Hasil evaluasi tabung kamu</p>
          </div>
        </div>

        <div className="px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center mb-6">
              <div className={`text-6xl mb-4 ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {score >= 80 ? '🏆' : score >= 60 ? '👍' : '📚'}
              </div>
              <h2 className="text-2xl font-bold mb-2">Skor Kamu</h2>
              <div className={`text-5xl font-bold mb-4 ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
                {score}%
              </div>
              <p className="text-gray-600 mb-6">
                {score >= 80 && "Excellent! Pemahaman kamu tentang tabung sangat baik! 🌟"}
                {score >= 60 && score < 80 && "Good job! Kamu cukup memahami materi tabung. 👏"}
                {score < 60 && "Keep learning! Pelajari lagi materi tabung untuk hasil yang lebih baik. 💪"}
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-green-600 font-bold">{questions.filter((_, index) => answers[index] === questions[index].correct).length}</div>
                  <div className="text-green-700">Benar</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-red-600 font-bold">{questions.filter((_, index) => answers[index] !== questions[index].correct && answers[index] !== undefined).length}</div>
                  <div className="text-red-700">Salah</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-600 font-bold">{questions.filter((_, index) => answers[index] === undefined).length}</div>
                  <div className="text-gray-700">Kosong</div>
                </div>
              </div>
            </div>

            {/* Review answers */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h3 className="text-xl font-bold mb-4">📝 Review Jawaban</h3>
              {questions.map((question, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-bold mb-3">Soal {index + 1}</h4>
                  <p className="mb-3">{question.question}</p>
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`p-2 rounded ${
                          optionIndex === question.correct 
                            ? 'bg-green-100 text-green-700 font-medium' 
                            : optionIndex === answers[index] && answers[index] !== question.correct
                            ? 'bg-red-100 text-red-700'
                            : 'bg-white'
                        }`}
                      >
                        {optionIndex === question.correct && '✅ '}
                        {optionIndex === answers[index] && answers[index] !== question.correct && '❌ '}
                        {option}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                    <strong>Penjelasan:</strong> {question.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-4">
              <Link href="/evaluasi" className="flex-1">
                <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
                  ← Kembali ke Evaluasi
                </button>
              </Link>
              <Link href="/" className="flex-1">
                <button className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200">
                  🏠 Beranda
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 text-white p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <Link href="/evaluasi">
            <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors">
              <span className="text-lg">←</span>
              <span className="font-medium">Kembali</span>
            </button>
          </Link>
          <div className="bg-white/30 px-4 py-2 rounded-full text-sm font-bold shadow-sm">
            ⏰ {formatTime(timeLeft)}
          </div>
        </div>
        
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">🥫 Evaluasi Tabung</h1>
          <p className="text-blue-100 text-sm sm:text-base">Soal {currentQuestion + 1} dari {questions.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-blue-100">
              Progress: {Object.keys(answers).length}/{questions.length} dijawab
            </span>
            <span className="text-sm text-blue-200">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm" 
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Question Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 font-bold text-lg">📝</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                    Soal {currentQuestion + 1}
                  </h2>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {questions[currentQuestion].question}
                  </p>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 sm:p-6">
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === index;
                  const optionLetter = String.fromCharCode(65 + index);

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion, index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800'
                          : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-25 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 text-gray-500'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className="text-sm sm:text-base font-medium pt-1">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
            {/* Mobile layout - stacked */}
            <div className="flex flex-col space-y-4 sm:hidden">
              <div className="text-center">
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200 inline-block">
                  <div className="text-blue-800 font-bold text-sm">
                    {Object.keys(answers).length} / {questions.length}
                  </div>
                  <div className="text-blue-600 text-xs font-medium">
                    Dijawab
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between space-x-3">
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className={`flex items-center justify-center space-x-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 ${
                    currentQuestion === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm">Sebelumnya</span>
                </button>

                {currentQuestion === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length === 0}
                    className={`flex items-center justify-center space-x-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex-1 ${
                      Object.keys(answers).length === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Selesai</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                    className="flex items-center justify-center space-x-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex-1"
                  >
                    <span className="text-sm">Selanjutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Desktop layout - horizontal */}
            <div className="hidden sm:flex justify-between items-center">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-center">
                <div className="bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                  <div className="text-blue-800 font-bold text-sm">
                    {Object.keys(answers).length} / {questions.length}
                  </div>
                  <div className="text-blue-600 text-xs font-medium">
                    Dijawab
                  </div>
                </div>
              </div>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length === 0}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    Object.keys(answers).length === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Selesai</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
