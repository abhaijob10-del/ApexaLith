import React, { useState } from 'react';
import { BuildingModel } from '../types/BuildingModel';
import { Sparkles, Send, Bot, User, HelpCircle, Sun, Wind, Home, ShieldCheck } from 'lucide-react';

interface ArchitecturalAssistantChatProps {
  model: BuildingModel;
  isDarkMode?: boolean;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const ArchitecturalAssistantChat: React.FC<ArchitecturalAssistantChatProps> = ({
  model,
  isDarkMode = true
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'assistant',
      text: `Greetings! I am ApexaLith's AI Architectural Reviewer. I have analyzed ${model.building.name} (${model.building.type}). Ask me about floor plan circulation, daylighting exposure, ventilation quality, bedroom counts, wall detection reasons, or missing document rationales!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickQuestions = [
    "Explain this floor plan and circulation.",
    "How many bedrooms and bathrooms exist?",
    "Where is natural light exposure strongest?",
    "Is natural cross-ventilation sufficient?",
    "Explain why confidence score is rated at " + model.metadata.parsingConfidence + "%."
  ];

  const handleSendPrompt = async (promptToSend?: string) => {
    const text = promptToSend || inputPrompt;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/architectural-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          verifiedBuildingModel: model
        })
      });

      const data = await response.json();
      const botMsg: Message = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.response || data.textExplanation || 'I have completed analyzing your query based on the verified building model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: `bot_err_${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered an issue analyzing the building model. Please try asking again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 rounded-sm border space-y-4 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <span>Architectural AI Reviewer Assistant</span>
              <span className="px-2 py-0.5 rounded-xs text-[10px] bg-[#B59B6D]/20 text-[#B59B6D] font-mono">
                Gemini 2.5 Flash
              </span>
            </h3>
            <p className="text-[11px] text-white/50">
              Ask questions regarding drawing interpretation, room counts, daylighting, and ventilation.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex flex-wrap gap-2 text-xs">
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(q)}
            disabled={loading}
            className="px-2.5 py-1 rounded-xs bg-white/5 hover:bg-[#B59B6D]/20 border border-white/10 hover:border-[#B59B6D]/50 text-white/80 hover:text-white transition text-left text-[11px]"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Message Chat Feed */}
      <div className="h-48 overflow-y-auto space-y-3 p-3 rounded-sm bg-black/50 border border-white/10 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-6 h-6 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D]/40 text-[#B59B6D] flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div className={`p-2.5 rounded-sm max-w-[85%] space-y-1 ${
              msg.sender === 'user'
                ? 'bg-[#B59B6D] text-black font-medium'
                : 'bg-white/10 text-white/90 border border-white/10'
            }`}>
              <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <div className="text-[9px] opacity-60 text-right font-mono">{msg.timestamp}</div>
            </div>
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-sm bg-white/20 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#B59B6D] animate-pulse">
            <Bot className="w-4 h-4 animate-spin" />
            <span>AI Architectural Reviewer is analyzing model parameters...</span>
          </div>
        )}
      </div>

      {/* Prompt Input Box */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
          placeholder="Ask AI architectural questions (e.g., 'Where is natural light strongest?')"
          className="flex-1 px-3 py-2 rounded-sm bg-black border border-white/20 text-white text-xs focus:border-[#B59B6D] outline-none"
        />
        <button
          onClick={() => handleSendPrompt()}
          disabled={loading || !inputPrompt.trim()}
          className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#a3895c] text-black font-bold uppercase tracking-wider text-xs transition flex items-center space-x-1 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </div>
  );
};
