import React from 'react';
import Image from 'next/image';
import { BookOpen, Lightbulb, CheckCircle, XCircle } from 'lucide-react';

// Image Placeholder Component
const ImagePlaceholder = ({ caption, className = "" }) => {
  return (
    <div className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 p-8 text-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <p className="text-gray-600 font-medium">Ilustrasi Soal</p>
          <p className="text-gray-500 text-sm">{caption}</p>
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, userAnswer, onAnswerChange, showResult, isCorrect, showExplanation, onToggleExplanation }) => {
  return (
    <div className="bg-white mx-4 sm:mx-6 my-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 border-b border-blue-100">
        <div className="flex items-start space-x-4">
          <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-3 rounded-xl shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">{question.title}</h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {question.description}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Image placeholder */}
        <ImagePlaceholder 
          caption={question.imageCaption || "Ilustrasi soal"}
          className="w-full max-w-md mx-auto"
        />
        
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -translate-y-10 translate-x-10"></div>
          <p className="font-semibold text-sm sm:text-base relative z-10">{question.question}</p>
        </div>
        
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            {question.answerLabel}
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => onAnswerChange(e.target.value)}
                className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 transition-all duration-200 ${
                  showResult 
                    ? (isCorrect ? 'border-green-400 bg-green-50 text-green-800' : 'border-red-400 bg-red-50 text-red-800')
                    : 'border-gray-300 focus:border-cyan-400'
                }`}
                placeholder="Masukkan jawaban Anda..."
                disabled={showResult}
              />
              {showResult && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isCorrect ? (
                    <div className="bg-green-500 text-white p-1 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white p-1 rounded-full">
                      <XCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-100 px-4 py-3 rounded-xl">
              <span className="text-gray-600 font-medium">{question.unit}</span>
            </div>
          </div>
          
          {showResult && (
            <div className={`p-4 rounded-xl border-2 ${
              isCorrect 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <p className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Jawaban Anda benar!' : 'Jawaban belum tepat'}
                </p>
              </div>
              {question.explanation && (
                <p className="text-gray-700 text-sm bg-white bg-opacity-50 p-3 rounded-lg">
                  <span className="font-medium">Penjelasan Rumus:</span> {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
