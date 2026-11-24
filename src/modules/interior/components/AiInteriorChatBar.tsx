import React, { useState } from 'react';
import { Sparkles, Send, Bot, RefreshCw } from 'lucide-react';

interface AiInteriorChatBarProps {
  onSendPrompt: (promptText: string) => void;
  isLoading?: boolean;
  isDarkMode?: boolean;
}

export const AiInteriorChatBar: React.FC<AiInteriorChatBarProps> = ({
  onSendPrompt,
  isLoading = false,
  isDarkMode = true
}) => {
  const [prompt, setPrompt] = useState('');

  const quickPrompts = [
    'Make living room Scandinavian with bleached oak',
    'Increase natural lighting & warm tones',
    'Add luxury Italian velvet modular sofa',
    'Optimize room layout for child safety',
    'Switch to Concept B with golden hour lighting'
  ];

  const handleSend = (text?: string) => {
    const query = text || prompt;
    if (!query.trim()) return;
    onSendPrompt(query);
    setPrompt('');
  };

  return (
    <div className={`p-3 border-t space-y-2 font-sans text-xs ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Quick Prompts Bar */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-[#B59B6D] uppercase shrink-0 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 animate-pulse" />
          <span>Quick AI Prompts:</span>
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            disabled={isLoading}
            className={`px-2.5 py-1 rounded-full border text-[10px] whitespace-nowrap transition ${
              isDarkMode ? 'bg-white/5 border-white/15 text-slate-300 hover:border-[#B59B6D] hover:text-white' : 'bg-slate-100 border-slate-300 text-slate-700 hover:border-[#B59B6D]'
            }`}
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Main Input Field */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Bot className="w-4 h-4 absolute left-3 top-2.5 text-[#B59B6D]" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini AI Interior Designer (e.g., 'Transform bedroom into Japandi sanctuary with travertine low bed')..."
            className={`w-full pl-9 pr-3 py-2 rounded-sm border text-xs focus:outline-none focus:border-[#B59B6D] ${
              isDarkMode ? 'bg-[#070A11] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
        </div>

        <button
          onClick={() => handleSend()}
          disabled={isLoading || !prompt.trim()}
          className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold uppercase tracking-wider text-xs transition flex items-center space-x-1.5 shadow disabled:opacity-50"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span>{isLoading ? 'Designing...' : 'Generate 3D AI'}</span>
        </button>
      </div>
    </div>
  );
};
