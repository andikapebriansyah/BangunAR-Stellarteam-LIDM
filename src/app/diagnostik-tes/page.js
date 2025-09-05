'use client';
import React, { useState } from 'react';
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

// Main Diagnostic Test Page Component
export default function DiagnosticTestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [completedQuestions, setCompletedQuestions] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);

  const questions = [
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

  const currentQuestion = questions[currentQuestionIndex];

  const handleSubmit = () => {
    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Save user answer
    setUserAnswers({
      ...userAnswers,
      [currentQuestionIndex]: selectedAnswer
    });
    
    if (correct && completedQuestions === currentQuestionIndex) {
      setCompletedQuestions(completedQuestions + 1);
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex + 1] || '');
      setShowResult(userAnswers[currentQuestionIndex + 1] !== undefined);
      setIsCorrect(userAnswers[currentQuestionIndex + 1] === questions[currentQuestionIndex + 1]?.correctAnswer);
    } else {
      // Show final results
      const finalScore = Object.keys(userAnswers).reduce((total, questionIndex) => {
        return total + (userAnswers[questionIndex] === questions[questionIndex].correctAnswer ? 1 : 0);
      }, 0);
      
      alert(`🎉 Tes Diagnostik Selesai!\n\nSkor Anda: ${finalScore}/${questions.length}\nPersentase: ${Math.round((finalScore/questions.length) * 100)}%\n\n${
        finalScore >= 7 ? 'Excellent! Pemahaman Anda sangat baik!' : 
        finalScore >= 5 ? 'Good! Anda perlu sedikit latihan lagi.' :
        'Perlu belajar lebih giat lagi!'
      }`);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(userAnswers[currentQuestionIndex - 1] || '');
      setShowResult(userAnswers[currentQuestionIndex - 1] !== undefined);
      setIsCorrect(userAnswers[currentQuestionIndex - 1] === questions[currentQuestionIndex - 1]?.correctAnswer);
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
