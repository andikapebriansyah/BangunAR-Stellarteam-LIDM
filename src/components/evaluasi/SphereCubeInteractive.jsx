import React, { useState } from 'react';
import { Lightbulb, Eye, EyeOff, Square, Circle } from 'lucide-react';

const SphereCubeInteractive = ({ onComplete, showResult, isCorrect, showExplanation, onToggleExplanation }) => {
  const [selectedShape, setSelectedShape] = useState('');
  const [userRatio, setUserRatio] = useState('');
  
  const correctAnswer = {
    shape: 'sphere',
    ratio: 52.36 // π/6 ≈ 0.5236 atau bisa ditulis sebagai 52.36%
  };

  const handleSubmit = () => {
    const ratioNum = parseFloat(userRatio);
    const isShapeCorrect = selectedShape === 'sphere';
    const isRatioCorrect = Math.abs(ratioNum - correctAnswer.ratio) <= 10; // tolerance
    const finalCorrect = isShapeCorrect && isRatioCorrect;
    onComplete(userRatio, finalCorrect);
  };

  if (showResult) {
    return (
      <div className="bg-white mx-4 sm:mx-6 my-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 border-b border-blue-100">
          <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">📐 Perbandingan Volume Bola dan Kubus</h3>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-3">
            <button
              onClick={onToggleExplanation}
              className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              {showExplanation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showExplanation ? 'Sembunyikan' : 'Lihat'} Penjelasan</span>
            </button>
            
            {showExplanation && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 p-4 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-5 h-5 text-indigo-600" />
                  <p className="font-semibold text-indigo-800">Penjelasan Rumus:</p>
                </div>
                <p className="text-indigo-700 text-sm leading-relaxed">
                  Volume bola = (4/3)πr³, Volume kubus = s³. Jika bola diletakkan dalam kubus sehingga menyentuh semua sisi, 
                  maka diameter bola = sisi kubus. Perbandingan volume = (4/3)πr³ : (2r)³ = (4/3)πr³ : 8r³ = π/6 ≈ 0.5236 atau 52.36%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mx-4 sm:mx-6 my-4 rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 sm:p-6 border-b border-blue-100">
        <h3 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">📐 Perbandingan Volume Bola dan Kubus</h3>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Sebuah bola diletakkan dalam sebuah kubus sehingga seluruh sisi kubus menempel pada bola. 
          Tentukan perbandingan antara volume bola dan volume kubus tersebut.
        </p>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Visual representation */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border-2 border-dashed border-blue-300">
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Cube representation */}
              <div className="w-32 h-32 border-4 border-red-400 rounded-lg flex items-center justify-center">
                {/* Sphere inside */}
                <div className="w-28 h-28 bg-blue-400 rounded-full opacity-70 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Bola</span>
                </div>
              </div>
              <p className="text-center mt-2 text-sm text-gray-600">Bola dalam Kubus</p>
            </div>
          </div>
        </div>

        {/* Interactive selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              1️⃣ Pilih bentuk yang memiliki volume lebih besar:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedShape('sphere')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedShape === 'sphere'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <Circle className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">Bola</span>
              </button>
              <button
                onClick={() => setSelectedShape('cube')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedShape === 'cube'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-300'
                }`}
              >
                <Square className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">Kubus</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              2️⃣ Berapa persentase perbandingan volume bola terhadap kubus? (dalam %)
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                step="0.1"
                value={userRatio}
                onChange={(e) => setUserRatio(e.target.value)}
                className="flex-1 px-4 py-3 text-lg border-2 rounded-xl focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 transition-all duration-200 border-gray-300"
                placeholder="Masukkan persentase..."
              />
              <div className="bg-gray-100 px-4 py-3 rounded-xl">
                <span className="text-gray-600 font-medium">%</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedShape || !userRatio}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
              selectedShape && userRatio
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            🔍 Periksa Jawaban
          </button>
        </div>
      </div>
    </div>
  );
};

export default SphereCubeInteractive;
