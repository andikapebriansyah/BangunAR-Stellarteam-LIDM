import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Calculator, Zap } from 'lucide-react';

const EvaluationHeader = ({ progress, totalQuestions, score }) => {
  return (
    <div className="bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500 text-white p-4 sm:p-6 rounded-t-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Link href="/">
            <button className="bg-white text-blue-400 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
              <span className="text-sm font-medium">Kembali</span>
            </button>
          </Link>
          <div className="bg-white text-blue-400 px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
            <span className="text-sm font-medium">{progress}/{totalQuestions}</span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="mb-4 relative">
            <div className="bg-gradient-to-br from-pink-400 to-pink-500 w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 bg-yellow-400 w-6 h-6 rounded-full flex items-center justify-center">
              <Zap className="w-3 h-3 text-yellow-800" />
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Evaluasi Pembelajaran</h1>
          <p className="text-cyan-100 text-sm sm:text-base">Menguasai Konsep Bangun Ruang Sisi Lengkung</p>
        </div>
      </div>
    </div>
  );
};

export default EvaluationHeader;
