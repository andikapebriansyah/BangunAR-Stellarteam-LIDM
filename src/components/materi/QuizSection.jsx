import { useState } from 'react';

export default function QuizSection({ questions, sectionId }) {
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResult, setShowQuizResult] = useState({});

  const handleQuizAnswer = (questionIndex, answer) => {
    const question = questions[questionIndex];
    const isCorrect = answer === question.correct;
    
    setQuizAnswers({
      ...quizAnswers,
      [`${sectionId}-${questionIndex}`]: {
        answer,
        isCorrect,
        explanation: question.explanation
      }
    });
    
    setShowQuizResult({
      ...showQuizResult,
      [`${sectionId}-${questionIndex}`]: true
    });
  };

  return (
    <div className="bg-red-50 rounded-xl p-4 sm:p-6">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🎯</span>
        Kuis Pemahaman
      </h3>
      
      <div className="space-y-4">
        {questions.map((question, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-red-200">
            <h4 className="font-medium text-gray-800 mb-3">{i + 1}. {question.question}</h4>
            <div className="space-y-2">
              {question.options.map((option, j) => (
                <button
                  key={j}
                  onClick={() => handleQuizAnswer(i, option)}
                  className={`w-full p-2 text-left rounded-lg border transition-colors ${
                    quizAnswers[`${sectionId}-${i}`]?.answer === option
                      ? quizAnswers[`${sectionId}-${i}`]?.isCorrect
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  disabled={showQuizResult[`${sectionId}-${i}`]}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {showQuizResult[`${sectionId}-${i}`] && (
              <div className={`mt-3 p-3 rounded-lg text-sm ${
                quizAnswers[`${sectionId}-${i}`]?.isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <div className="font-medium mb-1">
                  {quizAnswers[`${sectionId}-${i}`]?.isCorrect ? '✅ Benar!' : '❌ Salah!'}
                </div>
                <div>{quizAnswers[`${sectionId}-${i}`]?.explanation}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
