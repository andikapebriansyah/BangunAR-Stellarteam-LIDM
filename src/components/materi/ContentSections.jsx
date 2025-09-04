export function DefinitionSection({ definition }) {
  return (
    <div className="bg-blue-50 rounded-2xl p-6">
      <h3 className="font-bold text-blue-800 mb-3 flex items-center">
        <span className="mr-2">📖</span>
        Definisi
      </h3>
      <p className="text-gray-700 leading-relaxed">{definition}</p>
    </div>
  );
}

export function CharacteristicsSection({ characteristics }) {
  return (
    <div className="bg-green-50 rounded-2xl p-6">
      <h3 className="font-bold text-green-800 mb-4 flex items-center">
        <span className="mr-2">✨</span>
        Karakteristik Tabung
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {characteristics.map((char, i) => (
          <div key={i} className="flex items-start space-x-2">
            <span className="text-green-600 mt-1">✓</span>
            <span className="text-gray-700 text-sm">{char}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RealLifeExamplesSection({ examples }) {
  return (
    <div className="bg-yellow-50 rounded-2xl p-6">
      <h3 className="font-bold text-yellow-800 mb-4 flex items-center">
        <span className="mr-2">🌍</span>
        Contoh dalam Kehidupan Sehari-hari
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium text-gray-800 mb-2">{example.name}</h4>
            <p className="text-gray-600 text-sm">{example.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ElementsSection({ elements }) {
  return (
    <div className="bg-purple-50 rounded-2xl p-6">
      <h3 className="font-bold text-purple-800 mb-4 flex items-center">
        <span className="mr-2">🔧</span>
        Unsur-unsur Tabung
      </h3>
      <div className="space-y-4">
        {elements.map((element, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-purple-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">{element.symbol}</span>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">{element.name}</h4>
                <p className="text-gray-600 text-sm mb-2">{element.description}</p>
                {element.formula && (
                  <div className="bg-purple-100 rounded px-3 py-1 text-sm font-mono text-purple-800 mb-2">
                    {element.formula}
                  </div>
                )}
                {element.properties && (
                  <div className="space-y-1">
                    {element.properties.map((prop, j) => (
                      <div key={j} className="text-xs text-gray-500 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {prop}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
