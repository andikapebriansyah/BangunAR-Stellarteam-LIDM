'use client';

export default function ARControls({ activeTab, setActiveTab, tabs }) {
  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="relative z-20 bg-blue-900/95 backdrop-blur-md border-t border-blue-400/30 p-5 shadow-lg">
      {/* Tab Navigation */}
      <div className="flex justify-center gap-5 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              activeTab === tab.id
                ? 'text-white bg-blue-400/20 border border-blue-400/30'
                : 'text-blue-300 hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTabData && (
        <div className="text-center">
          <div className="text-white font-semibold mb-2 text-base">
            {activeTabData.content.title}
          </div>
          
          <div className="bg-blue-400/10 border border-blue-400/30 rounded-lg p-3 mb-2 font-mono text-sm text-blue-400">
            {activeTabData.content.formula}
          </div>
          
          <div className="text-blue-300 text-xs mb-3">
            {activeTabData.content.example}
          </div>
          
          <div className="text-green-400 text-base font-bold bg-green-400/10 py-2 px-3 rounded-lg border border-green-400/30">
            {activeTabData.content.result}
          </div>
        </div>
      )}
    </div>
  );
}
