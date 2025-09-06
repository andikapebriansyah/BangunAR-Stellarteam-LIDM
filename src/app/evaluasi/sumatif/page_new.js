'use client';
import React, { useState } from 'react';

// Import components
import EvaluationHeader from '../../../components/evaluasi/EvaluationHeader';
import ProgressBar from '../../../components/evaluasi/ProgressBar';
import QuestionCard from '../../../components/evaluasi/QuestionCard';
import SphereCubeInteractive from '../../../components/evaluasi/SphereCubeInteractive';
import ActionButtons from '../../../components/evaluasi/ActionButtons';

// Hint Component (new addition)
import { Lightbulb } from 'lucide-react';

const HintCard = ({ hint, isVisible, onToggle }) => {
  if (!hint) return null;
  
  return (
    <div className="mx-4 sm:mx-6 mb-4">
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 text-orange-600 hover:text-orange-700 mb-3 bg-orange-50 hover:bg-orange-100 transition-all duration-200 px-4 py-2 rounded-lg border border-orange-200"
      >
        <div className="bg-orange-200 p-1 rounded-full">
          <Lightbulb className="w-4 h-4 text-orange-600" />
        </div>
        <span className="text-sm font-semibold">
          {isVisible ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk?'}
        </span>
      </button>
      
      {isVisible && (
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200 bg-opacity-50 rounded-full -translate-y-8 translate-x-8"></div>
          <div className="relative z-10">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-400 p-2 rounded-full">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-orange-800 mb-2">💡 Petunjuk:</p>
                <p className="text-orange-800 text-sm sm:text-base leading-relaxed">{hint}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Evaluation Page Component
export default function EvaluasiSumatif() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(0);

  const questions = [
    {
      id: 1,
      title: "🐑 Tempat Minum Domba",
      description: "Tempat minum domba di sebuah peternakan di Amerika Serikat didesain sehingga memiliki bentuk seperti tabung yang dipotong seperti gambar. Diameter tabung tersebut adalah 40 cm sedangkan panjangnya 5 meter.",
      question: "Tentukan volume air yang dapat ditampung oleh satu tempat minum ini!",
      answerLabel: "Volume =",
      unit: "cm³",
      correctAnswer: 628000,
      tolerance: 10000,
      hint: "Ingat bahwa tabung memiliki alas berbentuk lingkaran. Pikirkan rumus luas lingkaran terlebih dahulu, lalu kalikan dengan tinggi tabung. Jangan lupa mengkonversi satuan panjang ke cm!",
      explanation: "Volume tabung = π × r² × t. Dengan diameter 40 cm (r = 20 cm) dan panjang 5 m (500 cm), maka volume = π × 20² × 500 = 628.318 cm³",
      imageCaption: "Gambar 2.83 Ilustrasi Tempat Minum di Peternakan"
    },
    {
      id: 2,
      title: "🏗️ Menara Air",
      description: "Sebuah menara air dengan penutup berbentuk kerucut. Tinggi menara tanpa tutup adalah 6 meter dengan jari-jari 2 m. Tinggi penutup menara air adalah 1 m. Bagian bawah menara yang berbentuk setengah bola memiliki tinggi 2 m.",
      question: "Jika menara tersebut akan dicat seluruh permukaannya termasuk alas dan penutupnya tentukan luas permukaan menara air tersebut!",
      answerLabel: "Luas Permukaan =",
      unit: "m²",
      correctAnswer: 87.96,
      tolerance: 10,
      hint: "Menara terdiri dari tiga bagian: tabung, kerucut (penutup), dan setengah bola (bawah). Hitung luas permukaan masing-masing bagian lalu jumlahkan. Ingat rumus luas permukaan untuk setiap bangun!",
      explanation: "Luas permukaan = Luas tabung + Luas kerucut + Luas setengah bola. LP tabung = 2πrt = 2π(2)(6) = 75.4 m². LP kerucut = πrs, dengan s = √(r²+t²) = √(4+1) = √5. LP kerucut = π(2)(√5) = 14.1 m². LP setengah bola = 2πr² = 2π(4) = 25.1 m². Total ≈ 87.96 m²",
      imageCaption: "Ilustrasi Menara Air dengan Berbagai Komponen"
    },
    {
      id: 3,
      title: "📐 Perbandingan Volume Bola dan Kubus",
      type: "interactive",
      description: "Sebuah bola diletakkan dalam sebuah kubus sehingga seluruh sisi kubus menempel pada bola. Tentukan perbandingan antara volume bola dan volume kubus tersebut.",
      question: "Analisis perbandingan volume antara bola dan kubus yang mengelilinginya!",
      correctAnswer: 52.36,
      tolerance: 10,
      hint: "Jika bola diletakkan dalam kubus dan menyentuh semua sisi, maka diameter bola sama dengan sisi kubus. Gunakan rumus volume masing-masing bangun untuk mencari perbandingannya!",
      explanation: "Volume bola = (4/3)πr³, Volume kubus = s³. Jika bola menyentuh semua sisi kubus, maka diameter bola = sisi kubus (2r = s). Perbandingan volume = (4/3)πr³ : (2r)³ = (4/3)πr³ : 8r³ = π/6 ≈ 0.5236 atau 52.36%",
      imageCaption: "Visualisasi Bola dalam Kubus"
    },
    {
      id: 4,
      title: "🏛️ Miniatur Tugu Sekolah",
      description: "Dani akan membuat karya seni berupa miniatur tugu sekolah dari karton yang akan dilapisi kertas warna. Bentuk tugu terdiri dari: Kubus alas dengan panjang sisi 20 cm. Tabung dengan jari-jari 10 cm dan tinggi 25 cm. Kerucut sebagai atap dengan tinggi 12 cm.",
      question: "Hitung jumlah kertas minimal yang diperlukan untuk melapisi seluruh permukaan bangun (luas permukaan), kecuali bagian bawah kubus!",
      answerLabel: "Luas Permukaan =",
      unit: "cm²",
      correctAnswer: 4061,
      tolerance: 100,
      hint: "Tugu terdiri dari kubus (tanpa alas bawah), tabung (tanpa alas atas), dan kerucut. Hitung luas permukaan setiap bagian yang akan dilapisi kertas, lalu jumlahkan semuanya!",
      explanation: "LP = LP kubus (tanpa alas) + LP tabung (tanpa alas atas) + LP kerucut. LP kubus = 5 × 20² = 2000 cm². LP tabung = 2πrt = 2π(10)(25) = 1571 cm². LP kerucut = πrs, dengan s = √(10²+12²) = √244 ≈ 15.62. LP kerucut = π(10)(15.62) = 490 cm². Total ≈ 4061 cm²",
      imageCaption: "Desain Miniatur Tugu Sekolah"
    },
    {
      id: 5,
      title: "🎂 Nasi Tumpeng Gilang",
      description: "Untuk memperingati ulang tahun Gilang, ibunya membuat nasi tumpeng yang disusun sedemikian rupa sehingga nasinya berbentuk kerucut dengan diameter 20 cm. Tinggi nasi dengan bentuk kerucut ini sekitar 35 cm.",
      question: "Jika nasi kerucut ini ingin ditutupi dengan daun pisang, berapa luas daun pisang yang akan dibutuhkan?",
      answerLabel: "Luas Permukaan =",
      unit: "cm²",
      correctAnswer: 1256,
      tolerance: 50,
      hint: "Untuk menutupi kerucut dengan daun pisang, kita perlu menghitung luas permukaan kerucut. Ingat bahwa kerucut terdiri dari alas lingkaran dan selimut kerucut. Pikirkan apa saja yang perlu ditutupi!",
      explanation: "Luas permukaan kerucut = luas alas + luas selimut = πr² + πrs. Dengan r = 10 cm, s = √(r² + t²) = √(10² + 35²) = √1325 ≈ 36.4 cm. Maka luas = π(10)² + π(10)(36.4) ≈ 314 + 1144 = 1256 cm²",
      imageCaption: "🎉 Visualisasi Nasi Tumpeng Berbentuk Kerucut"
    }
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    if (currentQuestion.type === 'interactive') return; // Handle by SphereCubeInteractive
    
    const answer = parseFloat(userAnswer);
    const correct = Math.abs(answer - currentQuestion.correctAnswer) <= currentQuestion.tolerance;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct && completedQuestions === currentQuestionIndex) {
      setCompletedQuestions(completedQuestions + 1);
    }

    // Save completion to localStorage
    if (correct && currentQuestionIndex === questions.length - 1) {
      const completedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations') || '[]');
      if (!completedEvaluations.includes('sumatif')) {
        completedEvaluations.push('sumatif');
        localStorage.setItem('completedEvaluations', JSON.stringify(completedEvaluations));
      }
    }
  };

  const handleInteractiveComplete = (userAnswer, isCorrect) => {
    setIsCorrect(isCorrect);
    setShowResult(true);
    
    if (isCorrect && completedQuestions === currentQuestionIndex) {
      setCompletedQuestions(completedQuestions + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(null);
      setShowHint(false);
    } else {
      // Mark as completed and show completion message
      const completedEvaluations = JSON.parse(localStorage.getItem('completedEvaluations') || '[]');
      if (!completedEvaluations.includes('sumatif')) {
        completedEvaluations.push('sumatif');
        localStorage.setItem('completedEvaluations', JSON.stringify(completedEvaluations));
      }
      
      alert('🎉 Selamat! Anda telah menyelesaikan semua soal evaluasi sumatif dengan baik! Anda sekarang adalah Master of 3D Shapes! 🏆');
      
      // Redirect to evaluation page after a short delay
      setTimeout(() => {
        window.location.href = '/evaluasi';
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <EvaluationHeader 
          progress={completedQuestions}
          totalQuestions={questions.length}
        />
        
        <ProgressBar 
          current={completedQuestions}
          total={questions.length}
        />
        
        <div className="pb-4">
          {currentQuestion.type === 'interactive' ? (
            <SphereCubeInteractive
              onComplete={handleInteractiveComplete}
              showResult={showResult}
              isCorrect={isCorrect}
              question={currentQuestion}
            />
          ) : (
            <QuestionCard
              question={currentQuestion}
              userAnswer={userAnswer}
              onAnswerChange={setUserAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
            />
          )}
          
          <HintCard
            hint={currentQuestion.hint}
            isVisible={showHint}
            onToggle={() => setShowHint(!showHint)}
          />
        </div>
        
        <ActionButtons
          onSubmit={handleSubmit}
          onNext={handleNext}
          showResult={showResult}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          hasAnswer={userAnswer.trim() !== '' || currentQuestion.type === 'interactive'}
        />
      </div>
    </div>
  );
}
