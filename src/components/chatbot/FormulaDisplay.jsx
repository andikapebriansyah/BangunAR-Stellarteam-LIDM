'use client';

const FormulaDisplay = ({ content }) => {
  // Check if content contains formulas
  const containsFormula = content.includes('=') || content.includes('π') || content.includes('²') || content.includes('³');
  
  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => {
      // Format mathematical expressions
      let formattedLine = line
        .replace(/π/g, '<span class="text-blue-600 font-semibold">π</span>')
        .replace(/²/g, '<sup class="text-sm">2</sup>')
        .replace(/³/g, '<sup class="text-sm">3</sup>')
        .replace(/⁴⁄₃/g, '<sup class="text-sm">4</sup>/<sub class="text-xs">3</sub>')
        .replace(/⅓/g, '<sup class="text-sm">1</sup>/<sub class="text-xs">3</sub>')
        .replace(/½/g, '<sup class="text-sm">1</sup>/<sub class="text-xs">2</sub>');

      // Highlight formulas
      if (line.includes('=') && (line.includes('V') || line.includes('L') || line.includes('r') || line.includes('t'))) {
        return (
          <div 
            key={index} 
            className="bg-blue-50 border-l-4 border-blue-400 p-3 my-2 rounded-r-lg font-mono text-sm"
            dangerouslySetInnerHTML={{ __html: formattedLine }}
          />
        );
      }

      // Bold headers
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-blue-600 mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }

      // List items
      if (line.startsWith('•')) {
        return (
          <div key={index} className="ml-4 flex items-start">
            <span className="text-blue-500 mr-2">•</span>
            <span dangerouslySetInnerHTML={{ __html: formattedLine.substring(1).trim() }} />
          </div>
        );
      }

      // Numbered steps
      if (/^\d+\./.test(line.trim())) {
        return (
          <div key={index} className="ml-2 bg-gray-50 p-2 rounded my-1 font-mono text-sm">
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          </div>
        );
      }

      // Regular text
      return (
        <div 
          key={index} 
          className={line.trim() === '' ? 'h-2' : ''}
          dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }}
        />
      );
    });
  };

  if (!containsFormula) {
    return <div>{formatMessage(content)}</div>;
  }

  return <div className="space-y-1">{formatMessage(content)}</div>;
};

export default FormulaDisplay;
