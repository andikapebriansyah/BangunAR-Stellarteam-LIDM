import Link from "next/link";

export default function MateriHeader({ materiData, completedTopics }) {
  return (
    <div className={`bg-gradient-to-br ${materiData.color} px-4 sm:px-6 py-6 sm:py-8 text-white`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <Link href="/materi-pembelajaran">
          <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors">
            <span className="text-lg sm:text-xl">←</span>
            <span className="text-sm sm:text-base">Kembali</span>
          </button>
        </Link>
        <div className="bg-white bg-opacity-20 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm backdrop-blur-sm">
          {materiData.sections.length} Modul Interaktif
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{materiData.icon}</div>
        <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{materiData.title}</h1>
        <p className="text-white text-opacity-90 text-sm max-w-md mx-auto">{materiData.subtitle}</p>
      </div>
    </div>
  );
}
