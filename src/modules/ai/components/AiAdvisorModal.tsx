import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User } from 'lucide-react';

export interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

interface Message {
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  isDarkMode
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Welcome to ApexaLith Architectural Advisory. How may I assist with your estate, structural engineering, or material selection parameters today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || loading) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: Message = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });

      const data = await response.json();
      const aiMsg: Message = {
        sender: 'ai',
        text: data.text || 'Thank you for your inquiry. An ApexaLith senior architect will assist you during your scheduled consultation.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI Advisor error:', err);
      const fallbackMsg: Message = {
        sender: 'ai',
        text: 'ApexaLith AI Architectural Advisory: For a project of this magnitude, we recommend scheduling an in-person or virtual consultation with our principal structural engineers.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative max-w-2xl w-full rounded-sm border p-6 flex flex-col h-[650px] shadow-2xl ${
        isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-sm text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-sm bg-[#B59B6D] text-black flex items-center justify-center font-bold shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif text-xl font-bold text-[#F5F5F0]">ApexaLith AI Advisor</span>
              <span className="px-2 py-0.5 rounded-sm text-[10px] bg-[#B59B6D]/20 border border-[#B59B6D]/30 text-[#B59B6D] font-mono font-bold uppercase tracking-wider">
                Gemini 2.5 Server-Side
              </span>
            </div>
            <p className="text-xs text-white/50 font-light">
              Architectural feasibility, material pairings & structural guidance
            </p>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] flex items-center justify-center shrink-0 border border-[#B59B6D]/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[80%] rounded-sm p-4 text-xs leading-relaxed space-y-1 ${
                m.sender === 'user'
                  ? 'bg-[#B59B6D] text-black font-medium'
                  : 'bg-[#121212] border border-white/10 text-white/90'
              }`}>
                <p>{m.text}</p>
                <div className={`text-[9px] text-right font-mono opacity-60 ${m.sender === 'user' ? 'text-black' : 'text-white/40'}`}>
                  {m.time}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-8 h-8 rounded-sm bg-[#121212] text-white/70 flex items-center justify-center shrink-0 border border-white/10">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#B59B6D] font-mono animate-pulse pl-11">
              <Sparkles className="w-4 h-4" />
              <span>Analyzing architectural parameters with Gemini 2.5...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="pt-3 border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about geothermal HVAC, Calacatta marble, structural caissons..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 bg-[#121212] border border-white/10 rounded-sm px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
          />
          <button
            type="submit"
            disabled={loading || !inputPrompt.trim()}
            className="p-2.5 rounded-sm bg-[#B59B6D] text-black font-bold hover:bg-[#c4ab7d] disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
