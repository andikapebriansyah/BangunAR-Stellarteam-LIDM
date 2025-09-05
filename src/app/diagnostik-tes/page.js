'use client';
import React, { useState, useMemo } from 'react';
import { CheckCircle, XCircle, BarChart3, BookOpen, ArrowRight, ArrowLeft, Lightbulb } from 'lucide-react';

// Header Component
const DiagnosticHeader = ({ progress, totalQuestions }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-teal-600 text-white p-6 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            🧪 Tes Diagnostik
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            Bangun Ruang dan Bangun Datar
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart3 className="w-5 h-5" />
            <span className="text-sm font-medium">
              Progress: {progress}/{totalQuestions}
            </span>
          </div>
          <div className="text-xs text-indigo-200">
            {Math.round((progress / totalQuestions) * 100)}% Selesai
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Bar Component
const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Soal {current + 1} dari {total}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Question Card Component
const QuestionCard = ({ question, selectedAnswer, onAnswerSelect, showResult, isCorrect }) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <div className="flex items-start space-x-3 mb-4">
          <div className="bg-indigo-100 p-2 rounded-full">
            <BookOpen className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
              Soal {question.id}
            </h2>
            <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
              {question.question}
            </p>
          </div>
        </div>
      </div>

      {/* Multiple Choice Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
          const isSelected = selectedAnswer === optionLetter;
          const isCorrect = showResult && optionLetter === question.correctAnswer;
          const isWrong = showResult && isSelected && optionLetter !== question.correctAnswer;

          return (
            <button
              key={optionLetter}
              onClick={() => !showResult && onAnswerSelect(optionLetter)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                showResult
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : isWrong
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                  : isSelected
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                  : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-25 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : isWrong
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                      : isSelected
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {optionLetter}
                  </div>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>
                {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                {showResult && isWrong && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Result Display */}
      {showResult && (
        <div className={`mt-6 p-4 rounded-xl border-2 ${
          isCorrect 
            ? 'border-green-500 bg-green-50' 
            : 'border-red-500 bg-red-50'
        }`}>
          <div className="flex items-center space-x-3 mb-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <h3 className={`font-semibold ${
              isCorrect ? 'text-green-800' : 'text-red-800'
            }`}>
              {isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Salah!'}
            </h3>
          </div>
          <p className={`text-sm ${
            isCorrect ? 'text-green-700' : 'text-red-700'
          }`}>
            Jawaban yang benar adalah <strong>{question.correctAnswer}. {question.options[question.correctAnswer.charCodeAt(0) - 65]}</strong>
          </p>
          {question.explanation && (
            <div className="mt-3 p-3 bg-white bg-opacity-70 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>💡 Penjelasan:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Action Buttons Component
const ActionButtons = ({ onSubmit, onNext, onPrev, showResult, isLastQuestion, hasAnswer, isFirstQuestion }) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={onPrev}
          disabled={isFirstQuestion}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
            isFirstQuestion
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700 shadow-lg hover:shadow-xl'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>

        <div className="flex space-x-3">
          {!showResult ? (
            <button
              onClick={onSubmit}
              disabled={!hasAnswer}
              className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                hasAnswer
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              onClick={onNext}
              className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span>{isLastQuestion ? 'Selesai' : 'Lanjut'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Questions data
const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    question: "Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku adalah …",
    options: ["Persegi", "Persegi panjang", "Segitiga", "Trapesium"],
    correctAnswer: "A",
    explanation: "Persegi adalah bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku (90°)."
  },
  {
    id: 2,
    question: "Bangun datar yang memiliki 3 sisi dan 3 sudut adalah …",
    options: ["Persegi", "Segitiga", "Lingkaran", "Jajar genjang"],
    correctAnswer: "B",
    explanation: "Segitiga adalah bangun datar yang memiliki 3 sisi dan 3 sudut."
  },
  {
    id: 3,
    question: "Luas persegi dengan panjang sisi 6 cm adalah …",
    options: ["12 cm²", "18 cm²", "36 cm²", "72 cm²"],
    correctAnswer: "C",
    explanation: "Luas persegi = sisi × sisi = 6 × 6 = 36 cm²"
  },
  {
    id: 4,
    question: "Bangun ruang yang memiliki 6 sisi berbentuk persegi adalah …",
    options: ["Balok", "Kubus", "Prisma segitiga", "Limas segiempat"],
    correctAnswer: "B",
    explanation: "Kubus adalah bangun ruang yang memiliki 6 sisi berbentuk persegi yang sama besar."
  },
  {
    id: 5,
    question: "Sebuah balok memiliki panjang 8 cm, lebar 5 cm, dan tinggi 3 cm. Volumenya adalah …",
    options: ["16 cm³", "40 cm³", "120 cm³", "144 cm³"],
    correctAnswer: "C",
    explanation: "Volume balok = panjang × lebar × tinggi = 8 × 5 × 3 = 120 cm³"
  },
  {
    id: 6,
    question: "Bangun ruang yang memiliki alas berbentuk persegi panjang dan 4 sisi tegak berbentuk persegi panjang adalah …",
    options: ["Balok", "Kubus", "Limas segiempat", "Prisma segitiga"],
    correctAnswer: "A",
    explanation: "Balok adalah bangun ruang yang memiliki alas dan tutup berbentuk persegi panjang serta 4 sisi tegak berbentuk persegi panjang."
  },
  {
    id: 7,
    question: "Bangun datar yang tidak memiliki sudut adalah …",
    options: ["Lingkaran", "Persegi", "Segitiga", "Jajar genjang"],
    correctAnswer: "A",
    explanation: "Lingkaran adalah bangun datar yang tidak memiliki sudut karena bentuknya melengkung."
  },
  {
    id: 8,
    question: "Jika sebuah kubus memiliki panjang sisi 4 cm, luas permukaannya adalah …",
    options: ["16 cm²", "24 cm²", "64 cm²", "96 cm²"],
    correctAnswer: "D",
    explanation: "Luas permukaan kubus = 6 × sisi² = 6 × 4² = 6 × 16 = 96 cm²"
  },
  {
    id: 9,
    question: "Limas segiempat memiliki …",
    options: [
      "1 alas segiempat dan 4 sisi tegak berbentuk segitiga",
      "2 alas segiempat dan 4 sisi tegak berbentuk persegi panjang",
      "1 alas segiempat dan 4 sisi tegak berbentuk persegi",
      "1 alas segitiga dan 3 sisi tegak berbentuk segitiga"
    ],
    correctAnswer: "A",
    explanation: "Limas segiempat memiliki 1 alas berbentuk segiempat dan 4 sisi tegak berbentuk segitiga yang bertemu di satu titik puncak."
  },
  {
    id: 10,
    question: "Prisma segitiga memiliki …",
    options: [
      "2 alas segitiga dan 3 sisi tegak berbentuk persegi panjang",
      "1 alas segitiga dan 3 sisi tegak berbentuk persegi panjang",
      "2 alas segitiga dan 3 sisi tegak berbentuk segitiga",
      "2 alas persegi dan 4 sisi tegak berbentuk persegi panjang"
    ],
    correctAnswer: "A",
    explanation: "Prisma segitiga memiliki 2 alas berbentuk segitiga dan 3 sisi tegak berbentuk persegi panjang."
  }
];

// Main Diagnostic Test Page Component
export default function DiagnosticTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [finalTestResult, setFinalTestResult] = useState(null);

  const questions = DIAGNOSTIC_QUESTIONS;

  // Load progress from localStorage on component mount
  React.useEffect(() => {
    // First check if test is already completed
    const completedTest = localStorage.getItem('diagnosticTest');
    if (completedTest) {
      const testResult = JSON.parse(completedTest);
      if (testResult.completed) {
        setShowFinalResult(true);
        setFinalTestResult(testResult);
        return; // Don't load progress if test is completed
      }
    }

    // Load progress if test is not completed
    const savedProgress = localStorage.getItem('diagnosticProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      const questionIndex = progress.currentQuestionIndex || 0;
      setCurrentQuestionIndex(questionIndex);
      setUserAnswers(progress.userAnswers || {});
      setCompletedQuestions(progress.completedQuestions || 0);
      setScore(progress.score || 0);
      
      // Set initial states for the current question
      const currentAnswer = progress.userAnswers[questionIndex];
      if (currentAnswer) {
        setSelectedAnswer(currentAnswer);
        setShowResult(true);
        setIsCorrect(currentAnswer === DIAGNOSTIC_QUESTIONS[questionIndex]?.correctAnswer);
      }
    }
  }, []); // DIAGNOSTIC_QUESTIONS is static, so we don't need it in deps

  // Save progress to localStorage whenever state changes
  const saveProgress = (questionIndex, answers, completed, currentScore) => {
    const progress = {
      currentQuestionIndex: questionIndex,
      userAnswers: answers,
      completedQuestions: completed,
      score: currentScore,
      timestamp: Date.now()
    };
    localStorage.setItem('diagnosticProgress', JSON.stringify(progress));
  };

  // Final Result Component
  const FinalResultComponent = ({ result }) => {
    const getResultMessage = (percentage) => {
      if (percentage >= 70) return { 
        icon: '🎉', 
        title: 'Excellent!', 
        message: 'Pemahaman Anda tentang bangun ruang dan bangun datar sangat baik!',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      };
      if (percentage >= 50) return { 
        icon: '👍', 
        title: 'Good!', 
        message: 'Anda memiliki pemahaman yang cukup baik, terus tingkatkan!',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      };
      return { 
        icon: '💪', 
        title: 'Keep Learning!', 
        message: 'Jangan menyerah! Pelajari materi lebih dalam lagi.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      };
    };

    const resultInfo = getResultMessage(result.percentage);

    const handleRetakeTest = () => {
      localStorage.removeItem('diagnosticTest');
      localStorage.removeItem('diagnosticProgress');
      window.location.reload();
    };

    const handleGoHome = () => {
      window.location.href = '/';
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <DiagnosticHeader progress={result.totalQuestions} totalQuestions={result.totalQuestions} />
        
        <div className="max-w-2xl mx-auto p-6">
          <div className={`${resultInfo.bgColor} ${resultInfo.borderColor} border-2 rounded-2xl p-8 text-center`}>
            <div className="text-6xl mb-4">{resultInfo.icon}</div>
            <h2 className={`text-3xl font-bold ${resultInfo.color} mb-2`}>
              {resultInfo.title}
            </h2>
            <p className="text-gray-700 mb-6">{resultInfo.message}</p>
            
            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Hasil Tes Anda</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${resultInfo.color}`}>
                    {result.score}/{result.totalQuestions}
                  </div>
                  <div className="text-gray-600">Skor</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${resultInfo.color}`}>
                    {result.percentage}%
                  </div>
                  <div className="text-gray-600">Persentase</div>
                </div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                Diselesaikan pada: {new Date(result.completedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-indigo-700 transition-all duration-200"
              >
                🏠 Kembali ke Beranda
              </button>
              <button
                onClick={handleRetakeTest}
                className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-all duration-200"
              >
                🔄 Ulangi Tes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If test is completed, show final result
  if (showFinalResult && finalTestResult) {
    return <FinalResultComponent result={finalTestResult} />;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update user answers
    const newUserAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: selectedAnswer
    };
    setUserAnswers(newUserAnswers);
    
    let newScore = score;
    let newCompletedQuestions = completedQuestions;
    
    if (correct && completedQuestions === currentQuestionIndex) {
      newCompletedQuestions = completedQuestions + 1;
      newScore = score + 1;
      setCompletedQuestions(newCompletedQuestions);
      setScore(newScore);
    }
    
    // Save progress after updating answers
    saveProgress(currentQuestionIndex, newUserAnswers, newCompletedQuestions, newScore);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const newQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newQuestionIndex);
      setSelectedAnswer(userAnswers[newQuestionIndex] || '');
      setShowResult(userAnswers[newQuestionIndex] !== undefined);
      setIsCorrect(userAnswers[newQuestionIndex] === questions[newQuestionIndex]?.correctAnswer);
      
      // Save progress with new question index
      saveProgress(newQuestionIndex, userAnswers, completedQuestions, score);
    } else {
      // Test completed - show final results and clear progress
      const finalScore = Object.keys(userAnswers).reduce((total, questionIndex) => {
        return total + (userAnswers[questionIndex] === questions[questionIndex].correctAnswer ? 1 : 0);
      }, 0);
      
      // Save final result to different localStorage key
      localStorage.setItem('diagnosticTest', JSON.stringify({
        completed: true,
        score: finalScore,
        totalQuestions: questions.length,
        percentage: Math.round((finalScore/questions.length) * 100),
        completedAt: new Date().toISOString()
      }));
      
      // Clear progress cache since test is finished
      localStorage.removeItem('diagnosticProgress');
      
      alert(`🎉 Tes Diagnostik Selesai!\n\nSkor Anda: ${finalScore}/${questions.length}\nPersentase: ${Math.round((finalScore/questions.length) * 100)}%\n\n${
        finalScore >= 7 ? 'Excellent! Pemahaman Anda sangat baik!' : 
        finalScore >= 5 ? 'Good! Anda perlu sedikit latihan lagi.' :
        'Perlu belajar lebih giat lagi!'
      }\n\nAnda sekarang dapat mengakses materi pembelajaran!`);
      
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const newQuestionIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newQuestionIndex);
      setSelectedAnswer(userAnswers[newQuestionIndex] || '');
      setShowResult(userAnswers[newQuestionIndex] !== undefined);
      setIsCorrect(userAnswers[newQuestionIndex] === questions[newQuestionIndex]?.correctAnswer);
      
      // Save progress with new question index
      saveProgress(newQuestionIndex, userAnswers, completedQuestions, score);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        <DiagnosticHeader 
          progress={completedQuestions}
          totalQuestions={questions.length}
        />
        
        <ProgressBar 
          current={currentQuestionIndex}
          total={questions.length}
        />
        
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={setSelectedAnswer}
          showResult={showResult}
          isCorrect={isCorrect}
        />
        
        <ActionButtons
          onSubmit={handleSubmit}
          onNext={handleNext}
          onPrev={handlePrev}
          showResult={showResult}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          isFirstQuestion={currentQuestionIndex === 0}
          hasAnswer={selectedAnswer !== ''}
        />
      </div>
    </div>
  );
}
