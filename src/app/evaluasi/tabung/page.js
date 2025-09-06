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
      question: "Unsur-unsur pada bangun ruang tabung adalah …",
      options: [
        "Alas berbentuk lingkaran",
        "Tutup berbentuk lingkaran",
        "Selimut tabung berbentuk persegi panjang",
        "Alas berbentuk persegi panjang",
        "Memiliki titik sudut"
      ],
      correct: [0, 1, 2], // Multiple correct answers
      type: "multiple",
      explanation: "Tabung memiliki unsur-unsur: alas berbentuk lingkaran, tutup berbentuk lingkaran, dan selimut tabung berbentuk persegi panjang. Tabung tidak memiliki titik sudut."
    },
    {
      id: 2,
      question: "Luas permukaan tabung dapat dihitung dengan rumus …",
      options: [
        "2πr² + 2πrt",
        "πr² + πrs",
        "4πr²",
        "2πr(r+t)",
        "⅓πr²t"
      ],
      correct: [0, 3], // Multiple correct answers
      type: "multiple",
      explanation: "Luas permukaan tabung = 2 × luas alas + luas selimut = 2πr² + 2πrt = 2πr(r + t). Kedua rumus ini sama."
    },
    {
      id: 3,
      question: "Volume tabung dengan jari-jari r dan tinggi t adalah …",
      options: [
        "πr²t",
        "⅓πr²t",
        "4/3πr³",
        "2πr²t",
        "alas × tinggi"
      ],
      correct: [0, 4], // Multiple correct answers
      type: "multiple",
      explanation: "Volume tabung = luas alas × tinggi = πr² × t = πr²t"
    },
    {
      id: 4,
      question: "Benda berikut yang berbentuk tabung adalah …",
      options: [
        "Kaleng susu",
        "Tangki air",
        "Bola basket",
        "Piramida",
        "Pipa air"
      ],
      correct: [0, 1, 4], // Multiple correct answers
      type: "multiple",
      explanation: "Kaleng susu, tangki air, dan pipa air adalah contoh benda berbentuk tabung. Bola basket berbentuk bola, piramida berbentuk limas."
    },
    {
      id: 5,
      question: "Jika diameter tabung = 14 cm dan tinggi = 10 cm, maka volumenya adalah …",
      options: [
        "1540 cm³",
        "3080 cm³",
        "1,54 liter",
        "2,16 liter",
        "3,08 liter"
      ],
      correct: [0, 2], // Multiple correct answers
      type: "multiple",
      explanation: "r = d/2 = 7 cm. V = πr²t = 22/7 × 7² × 10 = 22/7 × 49 × 10 = 1540 cm³ = 1,54 liter"
    },
    {
      id: 6,
      question: "Reno memiliki kaleng berbentuk tabung dengan diameter 21 cm dan tinggi 30 cm. Kaleng tersebut diisi minyak tanah sebanyak 11 liter. Berapa liter minyak tanah yang tumpah?",
      options: [
        "0,605 liter",
        "0,560 liter"
      ],
      correct: 0,
      type: "single",
      explanation: "r = 10,5 cm. Volume kaleng = πr²t = 22/7 × 10,5² × 30 = 10.395 cm³ = 10,395 liter. Minyak yang tumpah = 11 - 10,395 = 0,605 liter"
    },
    {
      id: 7,
      question: "Dirga mempunyai tangki minyak berbentuk tabung yang berisi minyak tanah 7.700 liter. Jari-jari alas tangki minyak tersebut adalah 70 cm. Hitunglah tinggi tangki minyak milik Dirga tersebut!",
      options: [
        "345 cm",
        "500 cm"
      ],
      correct: 1,
      type: "single",
      explanation: "V = πr²t → 7.700.000 cm³ = 22/7 × 70² × t → t = 7.700.000 × 7 / (22 × 4900) = 500 cm"
    },
    {
      id: 8,
      question: "Sebuah tangki minyak berbentuk tabung tertutup mempunyai volume 2.156 cm³. Jika panjang tangki minyak tersebut 14 cm, maka luas permukaan tangki tersebut adalah …",
      options: [
        "4.312 cm²",
        "924 cm²",
        "3.696 cm²",
        "776 cm²"
      ],
      correct: 1,
      type: "single",
      explanation: "V = πr²t → 2.156 = 22/7 × r² × 14 → r² = 49 → r = 7 cm. Luas permukaan = 2πr(r+t) = 2 × 22/7 × 7 × (7+14) = 924 cm²"
    },
    {
      id: 9,
      question: "Volume dan tinggi sebuah kaleng susu secara berturut-turut adalah 352 cm³ dan 7 cm. Luas selimut tabung tersebut adalah …",
      options: [
        "174 cm²",
        "178 cm²",
        "176 cm²",
        "180 cm²"
      ],
      correct: 2,
      type: "single",
      explanation: "V = πr²t → 352 = 22/7 × r² × 7 → r² = 16 → r = 4 cm. Luas selimut = 2πrt = 2 × 22/7 × 4 × 7 = 176 cm²"
    },
    {
      id: 10,
      question: "Pemerintah desa ingin membangun sebuah menara air untuk memenuhi kebutuhan air bersih warga. Menara air tersebut berbentuk tabung dengan tinggi 6 meter dan jari-jari alas 2 meter. Air dalam menara akan didistribusikan ke 50 rumah setiap harinya. Setiap rumah rata-rata membutuhkan 200 liter air per hari.\n\nTentukanlah pernyataan berikut benar atau salah!",
      options: [
        "Volume menara air dapat dihitung dengan rumus V = πr²t",
        "Volume menara air tersebut adalah 75,36 m³, atau setara dengan 75.360 liter",
        "Total kebutuhan air seluruh rumah dalam sehari adalah 10.000 liter",
        "Jika menara berisi penuh, air tersebut cukup digunakan untuk 8 hari tanpa diisi ulang"
      ],
      correct: [0, 1, 2], // 3 pernyataan benar, 1 salah (durasi ~7,5 hari bukan 8 hari)
      type: "multiple",
      hasImage: true,
      imagePath: "/images/Soal_10.png",
      imageCaption: "Sumber gambar: MedanWow.id",
      explanation: "Volume = πr²t = 3,14 × 2² × 6 = 75,36 m³ = 75.360 liter. Kebutuhan per hari = 50 × 200 = 10.000 liter. Durasi = 75.360 ÷ 10.000 = 7,536 hari ≈ 7,5 hari (bukan 8 hari)."
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
    const question = questions[questionIndex];
    
    if (question.type === "multiple") {
      // Handle multiple choice
      const currentAnswers = answers[questionIndex] || [];
      const newAnswers = currentAnswers.includes(optionIndex)
        ? currentAnswers.filter(idx => idx !== optionIndex)
        : [...currentAnswers, optionIndex];
      
      setAnswers({
        ...answers,
        [questionIndex]: newAnswers
      });
    } else {
      // Handle single choice
      setAnswers({
        ...answers,
        [questionIndex]: optionIndex
      });
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      
      if (question.type === "multiple") {
        // For multiple choice: check if arrays are equal
        const correctAnswers = question.correct.sort();
        const userAnswers = (userAnswer || []).sort();
        
        if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswers)) {
          correct++;
        }
      } else {
        // For single choice: direct comparison
        if (userAnswer === question.correct) {
          correct++;
        }
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
                  <div className="text-green-600 font-bold">{questions.filter((question, index) => {
                    const userAnswer = answers[index];
                    if (question.type === "multiple") {
                      const correctAnswers = question.correct.sort();
                      const userAnswers = (userAnswer || []).sort();
                      return JSON.stringify(correctAnswers) === JSON.stringify(userAnswers);
                    } else {
                      return userAnswer === question.correct;
                    }
                  }).length}</div>
                  <div className="text-green-700">Benar</div>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="text-red-600 font-bold">{questions.filter((question, index) => {
                    const userAnswer = answers[index];
                    if (userAnswer === undefined) return false;
                    
                    if (question.type === "multiple") {
                      const correctAnswers = question.correct.sort();
                      const userAnswers = (userAnswer || []).sort();
                      return JSON.stringify(correctAnswers) !== JSON.stringify(userAnswers);
                    } else {
                      return userAnswer !== question.correct;
                    }
                  }).length}</div>
                  <div className="text-red-700">Salah</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-gray-600 font-bold">{questions.filter((_, index) => answers[index] === undefined || (Array.isArray(answers[index]) && answers[index].length === 0)).length}</div>
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
                  <p className="mb-3 whitespace-pre-line">{question.question}</p>
                  
                  {/* Display image in review if question has one */}
                  {question.hasImage && (
                    <div className="mb-4">
                      <div className="bg-gray-100 p-3 rounded border">
                        <img 
                          src={question.imagePath}
                          alt={`Gambar untuk soal ${index + 1}`}
                          className="w-full max-w-sm mx-auto rounded shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div 
                          className="text-center text-gray-500 text-sm mt-2 hidden"
                        >
                          Gambar tidak dapat dimuat: {question.imagePath}
                        </div>
                        {question.imageCaption && (
                          <p className="text-center text-gray-500 text-xs mt-2 italic">
                            {question.imageCaption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 mb-3">
                    {question.options.map((option, optionIndex) => {
                      const userAnswer = answers[index];
                      const isCorrect = question.type === "multiple" 
                        ? question.correct.includes(optionIndex)
                        : optionIndex === question.correct;
                      const isUserSelected = question.type === "multiple"
                        ? (userAnswer || []).includes(optionIndex)
                        : userAnswer === optionIndex;
                      const isWrongSelection = isUserSelected && !isCorrect;

                      return (
                        <div 
                          key={optionIndex}
                          className={`p-2 rounded ${
                            isCorrect 
                              ? 'bg-green-100 text-green-700 font-medium' 
                              : isWrongSelection
                              ? 'bg-red-100 text-red-700'
                              : 'bg-white'
                          }`}
                        >
                          {isCorrect && '✅ '}
                          {isWrongSelection && '❌ '}
                          {option}
                        </div>
                      );
                    })}
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
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-4">
                    {questions[currentQuestion].question}
                  </p>
                  
                  {/* Display image if question has one */}
                  {questions[currentQuestion].hasImage && (
                    <div className="mt-4 mb-4">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <img 
                          src={questions[currentQuestion].imagePath}
                          alt={`Gambar untuk soal ${currentQuestion + 1}`}
                          className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div 
                          className="text-center text-gray-500 text-sm mt-2 hidden"
                        >
                          Gambar tidak dapat dimuat: {questions[currentQuestion].imagePath}
                        </div>
                        {questions[currentQuestion].imageCaption && (
                          <p className="text-center text-gray-500 text-xs mt-2 italic">
                            {questions[currentQuestion].imageCaption}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="p-4 sm:p-6">
              {questions[currentQuestion].type === "multiple" && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm font-medium">
                    ℹ️ Pilih semua jawaban yang benar (bisa lebih dari satu)
                  </p>
                </div>
              )}
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => {
                  const question = questions[currentQuestion];
                  const isSelected = question.type === "multiple" 
                    ? (answers[currentQuestion] || []).includes(index)
                    : answers[currentQuestion] === index;
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
                          {question.type === "multiple" && isSelected ? '✓' : optionLetter}
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