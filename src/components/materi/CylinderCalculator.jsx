import { useState } from 'react';

export default function CylinderCalculator() {
  const [values, setValues] = useState({
    radius: '',
    height: '',
    volume: 0,
    surfaceArea: 0
  });

  const calculate = () => {
    const r = parseFloat(values.radius);
    const h = parseFloat(values.height);
    
    if (r > 0 && h > 0) {
      const volume = Math.PI * r * r * h;
      const surfaceArea = 2 * Math.PI * r * (r + h);
      
      setValues({
        ...values,
        volume: volume.toFixed(2),
        surfaceArea: surfaceArea.toFixed(2)
      });
    }
  };

  const reset = () => {
    setValues({
      radius: '',
      height: '',
      volume: 0,
      surfaceArea: 0
    });
  };

  return (
    <div className="bg-green-50 rounded-xl p-4 sm:p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🧮</span>
        Kalkulator Interaktif
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jari-jari (r) - cm
          </label>
          <input
            type="number"
            value={values.radius}
            onChange={(e) => setValues({...values, radius: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Masukkan jari-jari"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tinggi (t) - cm
          </label>
          <input
            type="number"
            value={values.height}
            onChange={(e) => setValues({...values, height: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Masukkan tinggi"
          />
        </div>
      </div>
      
      <button
        onClick={calculate}
        className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors mb-4"
      >
        Hitung
      </button>
      
      {values.volume > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-100 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-600 mb-1">Volume</div>
            <div className="text-lg font-bold text-blue-800">{values.volume} cm³</div>
          </div>
          <div className="bg-purple-100 rounded-lg p-3 text-center">
            <div className="text-sm text-purple-600 mb-1">Luas Permukaan</div>
            <div className="text-lg font-bold text-purple-800">{values.surfaceArea} cm²</div>
          </div>
        </div>
      )}
    </div>
  );
}
