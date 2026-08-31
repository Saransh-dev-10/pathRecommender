import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axiosClient';
import { Sparkles, Send, Bot, User, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AIChatAssistantPage = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello! I'm your AI Learning Coach & Mentor. I can help you with your personalized learning path, skill assessments, and progress. How can I help you today?`,
      suggestions: [
        "What should I learn next?",
        "How is my learning progress?",
        "Suggest a project that will improve my skills",
        "What are my skill gaps?"
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchChatHistory = async () => {
    try {
      const { data } = await API.get('/chat/history');
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error("Chat history fetch error:", err);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const msg = textToSend || inputMessage;
    if (!msg.trim()) return;

    const userMsgObj = { sender: 'user', text: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsgObj]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { message: msg });
      const aiMsgObj = {
        sender: 'ai',
        text: data.reply,
        suggestions: data.suggestions || [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsgObj]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: 'Sorry, I encountered an issue retrieving your career advice. Please try again.',
        suggestions: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full flex flex-col h-[calc(100vh-5rem)]">
          
          {/* Header */}
          <div className="glass-panel p-4 rounded-2xl border-slate-800 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-cyan flex items-center justify-center text-white shadow-lg">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-base text-white">AI Career Assistant & Mentor</h1>
                <p className="text-[11px] text-brand-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected to your profile & roadmap context
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 glass-panel p-4 sm:p-6 rounded-3xl border-slate-800 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg, idx) => (
              <div 
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    AI
                  </div>
                )}

                <div className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  <div className="whitespace-pre-line font-sans">{msg.text}</div>

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Suggested Quick Questions:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="text-[11px] font-semibold px-3 py-1 rounded-xl bg-slate-800 hover:bg-brand-600/30 text-brand-300 border border-slate-700 hover:border-brand-500/40 transition text-left"
                          >
                            "{sug}"
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                    You
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-brand-400 text-xs font-bold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>AI Career Mentor thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Input Bar */}
          <div className="glass-panel p-2 rounded-2xl border-slate-800 flex items-center gap-2">
            <input 
              type="text" 
              placeholder="Ask anything about your readiness, skill gaps, or learning priorities..." 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-lg shadow-brand-600/30 transition flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

        </main>
      </div>
    </div>
  );
};

export default AIChatAssistantPage;
