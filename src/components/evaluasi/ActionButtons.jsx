import React from 'react';

const ActionButtons = ({ onSubmit, onNext, showResult, isLastQuestion, hasAnswer }) => {
  return (
    <div className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 space-y-3">
      {!showResult ? (
        <button
          onClick={onSubmit}
          disabled={!hasAnswer}
          className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-200 shadow-lg transform ${
            hasAnswer 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white hover:scale-[1.02] shadow-cyan-200' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-gray-200'
          }`}
        >
          {hasAnswer ? '🔍 Periksa Jawaban' : '⌨️ Masukkan jawaban terlebih dahulu'}
        </button>
      ) : (
        <button
          onClick={onNext}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:scale-[1.02] shadow-green-200"
        >
          {isLastQuestion ? '🏆 Selesai Evaluasi' : '➡️ Lanjut ke Soal Berikutnya'}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
