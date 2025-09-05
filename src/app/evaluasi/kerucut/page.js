'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

export default function EvaluasiKerucut() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const questions = [
    {
      id: 1,
      question: "Sebuah kerucut memiliki jari-jari alas 7 cm dan tinggi 24 cm. Berapa volume kerucut tersebut?",
      options: [
        "1.232 cm³",
        "1.230 cm³",
        "1.540 cm³",
        "924 cm³"
      ],
      correct: 0,
      explanation: "Volume kerucut = 1/3 × π × r² × t = 1/3 × 22/7 × 7² × 24 = 1/3 × 22/7 × 49 × 24 = 1.232 cm³"
    },
    {
      id: 2,
      question: "Rumus luas permukaan kerucut adalah...",
      options: [
        "πr(r + s)",
        "πr²",
        "2πr(r + t)",
        "1/3 πr²t"
      ],
      correct: 0,
      explanation: "Luas permukaan kerucut = luas alas + luas selimut = πr² + πrs = πr(r + s), dimana s adalah garis pelukis"
    },
    {
      id: 3,
      question: "Sebuah kerucut memiliki jari-jari 5 cm dan tinggi 12 cm. Berapa panjang garis pelukisnya?",
      options: [
        "13 cm",
        "17 cm",
        "10 cm",
        "7 cm"
      ],
      correct: 0,
      explanation: "Garis pelukis s = √(r² + t²) = √(5² + 12²) = √(25 + 144) = √169 = 13 cm"
    },
    {
      id: 4,
      question: "Jika volume kerucut 1.540 cm³ dengan tinggi 15 cm, berapa jari-jari alasnya?",
      options: [
        "7 cm",
        "10 cm",
        "14 cm",
        "5 cm"
      ],
      correct: 0,
      explanation: "V = 1/3πr²t → 1.540 = 1/3 × 22/7 × r² × 15 → r² = (1.540 × 3 × 7)/(22 × 15) = 49 → r = 7 cm"
    },
    {
      id: 5,
      question: "Unsur-unsur kerucut meliputi...",
      options: [
        "Alas, selimut, titik puncak, dan tinggi",
        "Alas, tutup, dan selimut",
        "Alas dan selimut saja",
        "Rusuk, sudut, dan sisi"
      ],
      correct: 0,
      explanation: "Kerucut memiliki alas berbentuk lingkaran, selimut berbentuk juring lingkaran, titik puncak, dan tinggi dari puncak ke pusat alas"
    },
    {
      id: 6,
      question: "Sebuah topi ulang tahun berbentuk kerucut dengan diameter alas 14 cm dan garis pelukis 25 cm. Berapa luas permukaannya?",
      options: [
        "704 cm²",
        "700 cm²",
        "550 cm²",
        "154 cm²"
      ],
      correct: 0,
      explanation: "r = 7 cm, s = 25 cm. Luas = πr(r + s) = 22/7 × 7 × (7 + 25) = 22 × 32 = 704 cm²"
    },
    {
      id: 7,
      question: "Jika jari-jari kerucut diperbesar 2 kali dan tingginya tetap, maka volumenya akan...",
      options: [
        "Menjadi 4 kali lipat",
        "Menjadi 2 kali lipat", 
        "Menjadi 8 kali lipat",
        "Tetap sama"
      ],
      correct: 0,
      explanation: "Volume = 1/3πr²t. Jika r menjadi 2r, maka volume = 1/3π(2r)²t = 1/3π(4r²)t = 4 × (1/3πr²t). Jadi 4 kali lipat."
    },
    {
      id: 8,
      question: "Sebuah kerucut memiliki luas alas 154 cm² dan tinggi 12 cm. Berapa volumenya?",
      options: [
        "616 cm³",
        "1.848 cm³",
        "1.540 cm³",
        "308 cm³"
      ],
      correct: 0,
      explanation: "Luas alas = πr² = 154 cm². Volume = 1/3 × luas alas × t = 1/3 × 154 × 12 = 616 cm³"
    },
    {
      id: 9,
      question: "Perbandingan volume kerucut dan tabung dengan alas dan tinggi yang sama adalah...",
      options: [
        "1 : 3",
        "2 : 3",
        "1 : 2",
        "3 : 1"
      ],
      correct: 0,
      explanation: "Volume kerucut = 1/3πr²t, Volume tabung = πr²t. Perbandingan = (1/3πr²t) : (πr²t) = 1 : 3"
    },
    {
      id: 10,
      question: "Sebuah corong air berbentuk kerucut terbalik dengan diameter 20 cm dan tinggi 15 cm. Berapa liter air maksimal yang bisa ditampung?",
      options: [
        "1,57 liter",
        "1,5 liter",
        "4,7 liter",
        "3,14 liter"
      ],
      correct: 0,
      explanation: "r = 10 cm. V = 1/3πr²t = 1/3 × 3,14 × 10² × 15 = 1/3 × 3,14 × 100 × 15 = 1.570 cm³ = 1,57 liter"
    }
  ];

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
    
    const completedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations') || '[]');
    if (!completedEvaluations.includes('kerucut')) {
      completedEvaluations.push('kerucut');
      localStorage.setItem('completedEvaluations', JSON.stringify(completedEvaluations));
    }
    
    const evaluationScores = JSON.parse(localStorage.getItem('evaluationScores') || '{}');
    evaluationScores.kerucut = finalScore;
    localStorage.setItem('evaluationScores', JSON.stringify(evaluationScores));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <div className="bg-gradient-to-br from-orange-500 to-red-500 px-6 py-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-2">Evaluasi Selesai!</h1>
            <p className="text-orange-100">Hasil evaluasi kerucut kamu</p>
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
                {score >= 80 && "Excellent! Pemahaman kamu tentang kerucut sangat baik! 🍦"}
                {score >= 60 && score < 80 && "Good job! Kamu cukup memahami materi kerucut. 👏"}
                {score < 60 && "Keep learning! Pelajari lagi materi kerucut untuk hasil yang lebih baik. 💪"}
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
                <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
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
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white p-6 sm:p-8">
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">🍦 Evaluasi Kerucut</h1>
          <p className="text-orange-100 text-sm sm:text-base">Soal {currentQuestion + 1} dari {questions.length}</p>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-orange-100">
              Progress: {Object.keys(answers).length}/{questions.length} dijawab
            </span>
            <span className="text-sm text-orange-200">
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
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <span className="text-orange-600 font-bold text-lg">📝</span>
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
                          ? 'border-orange-500 bg-orange-50 text-orange-800'
                          : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-25 text-gray-700'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500 text-white'
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

          <div className="mt-6 bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
            {/* Mobile layout - stacked */}
            <div className="flex flex-col space-y-4 sm:hidden">
              <div className="text-center">
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-200 inline-block">
                  <div className="text-orange-800 font-bold text-sm">
                    {Object.keys(answers).length} / {questions.length}
                  </div>
                  <div className="text-orange-600 text-xs font-medium">
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
                    className="flex items-center justify-center space-x-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex-1"
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
                <div className="bg-orange-50 px-4 py-2 rounded-full border border-orange-200">
                  <div className="text-orange-800 font-bold text-sm">
                    {Object.keys(answers).length} / {questions.length}
                  </div>
                  <div className="text-orange-600 text-xs font-medium">
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
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
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
