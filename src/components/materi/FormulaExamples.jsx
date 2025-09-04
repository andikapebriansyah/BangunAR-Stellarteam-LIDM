export function FormulaSection({ formula, concept, title }) {
  return (
    <div className="bg-indigo-50 rounded-2xl p-6">
      <h3 className="font-bold text-indigo-800 mb-4 flex items-center">
        <span className="mr-2">🧮</span>
        Rumus {title}
      </h3>
      
      <div className="bg-white rounded-lg p-4 border border-indigo-200 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-2">{formula.main}</div>
          <p className="text-gray-600 text-sm">{concept}</p>
        </div>
      </div>

      {formula.components && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {Object.entries(formula.components).map(([symbol, meaning], i) => (
            <div key={i} className="bg-white rounded-lg p-3 border border-indigo-200">
              <div className="font-bold text-indigo-600">{symbol}</div>
              <div className="text-sm text-gray-600">{meaning}</div>
            </div>
          ))}
        </div>
      )}

      {formula.derivation && (
        <div className="bg-indigo-100 rounded-lg p-3 text-center text-sm text-indigo-700">
          💡 {formula.derivation}
        </div>
      )}
    </div>
  );
}

export function ExamplesSection({ examples }) {
  return (
    <div className="bg-orange-50 rounded-2xl p-6">
      <h3 className="font-bold text-orange-800 mb-4 flex items-center">
        <span className="mr-2">📝</span>
        Contoh Perhitungan
      </h3>
      
      <div className="space-y-4">
        {examples.map((example, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-orange-200">
            <h4 className="font-bold text-gray-800 mb-3">{example.title}</h4>
            <div className="text-sm text-gray-600 mb-3">
              Diketahui: r = {example.given.radius} cm, t = {example.given.height} cm
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(example.solution).map(([step, value], j) => (
                <div key={j} className="flex items-start space-x-2">
                  <span className="text-orange-600 font-medium">{j + 1}.</span>
                  <span className="font-mono text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ApplicationsSection({ applications }) {
  return (
    <div className="bg-purple-50 rounded-2xl p-6">
      <h3 className="font-bold text-purple-800 mb-4 flex items-center">
        <span className="mr-2">🏭</span>
        Aplikasi dalam Berbagai Bidang
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {applications.map((app, i) => (
          <div key={i} className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3 text-center">{app.category}</h4>
            <div className="space-y-2">
              {app.items.map((item, j) => (
                <div key={j} className="text-sm">
                  <div className="font-medium text-purple-600">{item.name}</div>
                  <div className="text-gray-600 text-xs">{item.benefit}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RealWorldProblemSection({ problem }) {
  return (
    <div className="bg-orange-50 rounded-2xl p-6">
      <h3 className="font-bold text-orange-800 mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        {problem.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4">{problem.scenario}</p>
      
      <div className="bg-white rounded-lg p-4">
        <h4 className="font-medium text-gray-800 mb-2">Batasan dan Persyaratan:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {problem.constraints?.map((constraint, i) => (
            <li key={i} className="flex items-start">
              <span className="mr-2 text-orange-500">•</span>
              {constraint}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
