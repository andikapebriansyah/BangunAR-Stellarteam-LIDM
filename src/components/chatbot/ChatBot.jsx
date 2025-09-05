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

    // Simulate bot thinking time
    setTimeout(() => {
      try {
        console.log('Processing message:', userMessage.content);
        
        // Use simple response generation first
        const matchResult = chatbotUtils.findBestMatch(userMessage.content);
        console.log('Match result:', matchResult);
        
        let response;
        
        if (matchResult.type === 'greeting') {
          response = matchResult.content;
        } else if (matchResult.type === 'help') {
          response = matchResult.content;
        } else {
          response = chatbotUtils.generateResponse(matchResult);
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
          content: "Maaf, ada masalah teknis. Silakan coba lagi! Error: " + error.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
      }
    }, 1000); // Fixed delay for debugging
  };

  // Handle quick replies
  const handleQuickReply = (text) => {
    setInputValue(text);
    inputRef.current?.focus();
  };

  // Quick reply buttons - made more comprehensive
  const quickReplies = [
    "Apa itu tabung?",
    "Rumus volume tabung", 
    "Contoh soal kerucut",
    "Luas permukaan bola",
    "Latihan mudah",
    "Tips dan trik",
    "Visualisasi",
    "Bantuan"
  ];

  // Action buttons for specific functions
  const actionButtons = [
    { text: "📐 Rumus Lengkap", query: "rumus lengkap tabung" },
    { text: "🎯 Latihan Soal", query: "latihan soal volume" },
    { text: "🎨 Visualisasi", query: "visualisasi tabung" },
    { text: "💡 Tips", query: "tips menghitung volume" },
    { text: "🌟 Tantangan", query: "tantangan sulit" },
    { text: "📊 Perbandingan", query: "perbandingan volume tabung kerucut" }
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
          
          {/* Chat Container - Responsive centering */}
          <div 
            className="relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh] md:max-h-[600px] transform transition-all duration-300"
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
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Action Buttons */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-3 font-medium">🚀 Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2 mb-2">
                {actionButtons.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(action.query)}
                    className="px-2 py-2 bg-white hover:bg-blue-50 border border-blue-200 hover:border-blue-300 text-blue-700 text-xs rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 min-h-[32px]"
                  >
                    <span className="text-center leading-tight">{action.text}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-center space-x-2">
                {actionButtons.slice(4).map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(action.query)}
                    className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 border border-purple-200 text-purple-700 text-xs rounded-full transition-all duration-200"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 mb-2">💡 Coba tanya:</p>
                <div className="flex flex-wrap gap-2">
                  {quickReplies.slice(0, 4).map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-full transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <div className="mt-2 flex flex-wrap gap-2">
                {quickReplies.slice(-2).map((reply, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
