import React from 'react';
import { Award } from 'lucide-react';

const ProgressBar = ({ current, total }) => {
  const percentage = (current / total) * 100;
  return (
    <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 mb-2">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-orange-500" />
          <span className="font-medium">Progress Evaluasi</span>
        </div>
        <span className="text-cyan-600 font-semibold">{current} dari {total} soal selesai</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
        <div 
          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
