'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ARPage() {
  const router = useRouter();

  const shapes = [
    {
      id: 'silinder',
      name: 'Silinder',
      description: 'Bangun ruang sisi lengkung dengan alas dan tutup berbentuk lingkaran',
      image: '🥽',
      color: 'from-blue-500 to-purple-600',
      available: true
    },
    {
      id: 'kerucut',
      name: 'Kerucut',
      description: 'Bangun ruang dengan alas lingkaran dan puncak berbentuk titik',
      image: '🔺',
      color: 'from-green-500 to-blue-500',
      available: true
    },
    {
      id: 'bola',
      name: 'Bola',
      description: 'Bangun ruang berbentuk bulat sempurna',
      image: '⚽',
      color: 'from-red-500 to-pink-500',
      available: false
    },
    {
      id: 'tabung',
      name: 'Tabung',
      description: 'Bangun ruang dengan alas dan tutup berbentuk lingkaran yang sama',
      image: '🥤',
      color: 'from-yellow-500 to-orange-500',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm"></div>
        <div className="relative px-6 py-8">
          <button 
            onClick={() => router.push('/')}
            className="mb-6 flex items-center space-x-2 text-blue-300 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Kembali ke Dashboard</span>
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl mx-auto mb-6 flex items-center justify-center">
              <span className="text-3xl">🥽</span>
            </div>
            <h1 className="text-3xl font-bold mb-3">AR Experience</h1>
            <p className="text-blue-200 text-lg max-w-md mx-auto">
              Pilih bangun ruang yang ingin kamu jelajahi dengan teknologi Augmented Reality
            </p>
            <div className="mt-6">
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-100">
                  💡 <strong>Tips:</strong> Gunakan popup di dashboard untuk akses yang lebih cepat!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shape Cards */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {shapes.map((shape) => (
            <div key={shape.id} className="relative group">
              {shape.available ? (
                <Link href={`/ar/${shape.id}`}>
                  <div className={`bg-gradient-to-br ${shape.color} rounded-2xl p-6 cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{shape.image}</div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        Tersedia
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{shape.name}</h3>
                    <p className="text-white/80 text-sm mb-4 leading-relaxed">
                      {shape.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Mulai AR Experience</span>
                      <span className="text-lg">→</span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className={`bg-gradient-to-br ${shape.color} rounded-2xl p-6 opacity-50 cursor-not-allowed`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl grayscale">{shape.image}</div>
                    <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                      Segera Hadir
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{shape.name}</h3>
                  <p className="text-white/80 text-sm mb-4 leading-relaxed">
                    {shape.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Coming Soon</span>
                    <span className="text-lg">⏳</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-bold mb-3">Cara Menggunakan AR</h3>
            <div className="space-y-2 text-sm text-blue-200">
              <p>• Pastikan kamera perangkat Anda berfungsi dengan baik</p>
              <p>• Gunakan perangkat yang mendukung WebXR atau ARCore/ARKit</p>
              <p>• Sentuh tombol AR untuk memulai pengalaman AR</p>
              <p>• Arahkan kamera ke permukaan datar untuk penempatan objek yang optimal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
