'use client';
import { useState, useRef, useEffect } from 'react';
import { chatbotData, chatbotUtils } from './chatbotData';
import FormulaDisplay from './FormulaDisplay';

// Custom styles for smooth animations
const customStyles = `
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .chatbot-backdrop {
    backdrop-filter: blur(2px) brightness(1.1);
    -webkit-backdrop-filter: blur(2px) brightness(1.1);
  }
`;

const ChatBot = () => {
  // Inject custom styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = customStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Halo! Saya ChatBot Matematika. Saya siap membantu Anda belajar tentang bangun ruang! 😊\n\nKetik "bantuan" untuk melihat menu lengkap.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to bottom when new message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      console.log('Processing message:', userMessage.content);
      
      // STEP 1: Try Rule-Based First (Priority)
      const matchResult = chatbotUtils.findBestMatch(userMessage.content);
      console.log('Match result:', matchResult);
      
      let response;
      
      // Check if rule-based found a match
      if (matchResult.type === 'greeting') {
        // Instant response for greetings
        response = matchResult.content;
        
        // Simulate minimal delay for natural feel
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } else if (matchResult.type === 'help') {
        // Instant response for help
        response = matchResult.content;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } else {
        // Try to generate rule-based response
        response = chatbotUtils.generateResponse(matchResult);
        
        if (response) {
          // Rule-based found answer
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // STEP 2: No rule-based match, use RAG with Gemini
          console.log('No rule-based match, calling Gemini RAG...');
          
          const ragResult = await chatbotUtils.callGeminiRAG(userMessage.content);
          
          if (ragResult.success) {
            response = ragResult.response;
          } else {
            response = ragResult.response; // Error message
          }
        }
      }

      console.log('Generated response:', response);

      const botMessage = {
        type: 'bot',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage = {
        type: 'bot',
        content: "Maaf, ada masalah teknis. Silakan coba lagi atau ketik 'bantuan' untuk menu! 🔧",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  // Handle quick replies
  const handleQuickReply = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  // Combined quick actions - menggabungkan suggestions dengan action buttons
  const quickActions = [
    { text: "📐 Rumus Lengkap", query: "rumus lengkap tabung" },
    { text: "🎯 Latihan Soal", query: "latihan soal volume" },
    { text: "💡 Tips", query: "tips menghitung volume" },
    { text: "🌟 Tantangan", query: "tantangan sulit" },
    { text: "📊 Perbandingan", query: "perbandingan volume tabung kerucut" },
    { text: "Apa itu tabung?", query: "apa itu tabung" },
    { text: "Rumus volume tabung", query: "rumus volume tabung" },
    { text: "Contoh soal kerucut", query: "contoh soal kerucut" },
    { text: "Luas permukaan bola", query: "luas permukaan bola" }
  ];

  // Format message content (handle line breaks, formulas, etc.)
  const formatMessage = (content) => {
    // Use FormulaDisplay for better mathematical rendering
    return <FormulaDisplay content={content} />;
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-110 z-50 ${isOpen ? 'hidden' : 'flex'} items-center justify-center`}
        aria-label="Buka ChatBot"
      >
        <div className="relative">
          <span className="text-xl">🤖</span>
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with subtle overlay - background tetap terlihat */}
          <div 
            className="absolute inset-0 bg-white bg-opacity-5 chatbot-backdrop transition-all duration-300"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* Chat Container - Responsive centering with fixed height */}
          <div 
            className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[85vh] md:h-[600px] transform transition-all duration-300"
            style={{ animation: 'fadeInScale 0.3s ease-out' }}
          >
            
            
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  🤖
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Math ChatBot</h3>
                  <p className="text-sm opacity-90">Bangun Ruang Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-2 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                    }`}
                  >
                    <div className={`text-sm ${message.type === 'bot' ? 'leading-relaxed' : ''}`}>
                      {message.type === 'bot' ? formatMessage(message.content) : message.content}
                    </div>
                    <div className={`text-xs mt-1 opacity-70 ${message.type === 'user' ? 'text-white' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 italic animate-pulse">AI sedang berpikir...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Collapsible Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-gray-200">
              {/* Toggle Header */}
              <button
                onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-blue-100/50 transition-colors"
              >
                <span className="text-xs text-gray-700 font-medium">🚀 Quick Actions</span>
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isQuickActionsOpen ? '' : 'rotate-180'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Collapsible Content */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isQuickActionsOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-4 pb-3">
                  {/* Grid Layout for Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(action.query)}
                        className="px-2 py-2 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-700 text-xs rounded-lg transition-all duration-200 flex items-center justify-center text-center leading-tight min-h-[36px]"
                      >
                        {action.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
