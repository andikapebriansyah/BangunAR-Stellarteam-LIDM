import { 
  DefinitionSection, 
  CharacteristicsSection, 
  RealLifeExamplesSection, 
  ElementsSection 
} from './ContentSections';
import { 
  FormulaSection, 
  ExamplesSection, 
  ApplicationsSection, 
  RealWorldProblemSection 
} from './FormulaExamples';
import CylinderCalculator from './CylinderCalculator';
import QuizSection from './QuizSection';

export default function SectionContent({ section, markAsCompleted }) {
  const content = section.content;

  const renderInteractiveContent = () => {
    return (
      <div className="space-y-6">
        {/* Main Content */}
        <div className="bg-white rounded-2xl p-6 space-y-6">
          {content.definition && (
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="font-bold text-gray-800 mb-2">Definisi</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{content.definition}</p>
            </div>
          )}

          {content.characteristics && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Karakteristik:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {content.characteristics.map((char, i) => (
                  <li key={i}>{char}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Visual Examples with Grid */}
          {content.examples && (
            <div>
              <h3 className="font-bold text-gray-800 mb-3">Contoh Visual:</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {content.examples.map((example, i) => (
                  <div key={i} className="bg-cyan-50 rounded-lg p-3 sm:p-4 text-center">
                    <div className="w-full h-24 sm:h-28 md:h-32 mb-3 relative">
                      <div className="bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-dashed border-cyan-300 rounded-lg flex items-center justify-center w-full h-full">
                        <div className="text-center p-2">
                          <div className="text-xl sm:text-2xl mb-1">🥤</div>
                          <div className="text-xs sm:text-sm text-gray-600 font-medium">{example.name}</div>
                          <div className="text-xs text-gray-500 mt-1 hidden sm:block">Placeholder Image</div>
                        </div>
                      </div>
                    </div>
                    <div className="font-medium text-gray-800 text-sm sm:text-base">{example.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Calculator Widget */}
        {content.calculator && (
          <CylinderCalculator />
        )}

        {/* Quiz Section */}
        {content.quiz && (
          <QuizSection questions={content.quiz.questions} sectionId={section.id} />
        )}

        {/* Study Case */}
        {content.studyCase && (
          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📚</span>
              {content.studyCase.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4">{content.studyCase.scenario}</p>
            
            <div className="space-y-3">
              {content.studyCase.tasks?.map((task, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="font-medium text-gray-800">{task.building || task.product}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className="font-medium text-green-600">{task.shape}</span> - {task.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button 
          onClick={() => markAsCompleted(section.id)}
          className="w-full py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-medium text-lg flex items-center justify-center space-x-2"
        >
          <span>✓</span>
          <span>Selesaikan Pembelajaran</span>
        </button>
      </div>
    );
  };

  return (
    <div className="mt-4">
      {renderInteractiveContent()}
    </div>
  );
}
