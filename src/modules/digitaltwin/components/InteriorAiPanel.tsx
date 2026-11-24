import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Compass, 
  Palette, 
  Bot, 
  MessageSquare, 
  Check, 
  ChevronRight,
  TrendingDown,
  Sun
} from 'lucide-react';
import { ArchitecturalStyle, BimBuildingData } from '../../bim/types/bim';
import { GeminiDigitalTwinService } from '../../ai/services/geminiDigitalTwinService';

interface InteriorAiPanelProps {
  buildingData: BimBuildingData;
  onUpdateBuildingData: (newData: BimBuildingData) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const InteriorAiPanel: React.FC<InteriorAiPanelProps> = ({
  buildingData,
  onUpdateBuildingData,
  onClose,
  isDarkMode
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; savings?: number }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Gemini AI Digital Twin Architectural Assistant. Ask me to redesign rooms, switch architectural styles, replace materials, optimize costs, or enhance daylighting.'
    }
  ]);

  const stylesList: ArchitecturalStyle[] = [
    'Luxury',
    'Scandinavian',
    'Modern',
    'Minimalist',
    'Japandi',
    'Industrial',
    'Mediterranean',
    'Contemporary',
    'Traditional'
  ];

  const quickPrompts = [
    'Show a Scandinavian version',
    'Replace marble with wood',
    'Make this kitchen luxury',
    'Reduce the project cost',
    'Improve ventilation & daylight'
  ];

  const handleApplyStyle = async (style: ArchitecturalStyle) => {
    setIsLoading(true);
    setChatHistory(prev => [...prev, { sender: 'user', text: `Apply ${style} style concept across all rooms.` }]);

    const res = await GeminiDigitalTwinService.processDesignQuery(
      `Apply ${style} design aesthetic to entire building`,
      buildingData
    );

    setIsLoading(false);
    if (res.updatedBuildingData) {
      onUpdateBuildingData(res.updatedBuildingData);
    }
    setChatHistory(prev => [...prev, { sender: 'ai', text: res.textExplanation, savings: res.suggestedCostSavingsUsd }]);
  };

  const handleSendPrompt = async (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setPrompt('');
    setIsLoading(true);
    setChatHistory(prev => [...prev, { sender: 'user', text: query }]);

    const res = await GeminiDigitalTwinService.processDesignQuery(query, buildingData);

    setIsLoading(false);
    if (res.updatedBuildingData) {
      onUpdateBuildingData(res.updatedBuildingData);
    }
    setChatHistory(prev => [...prev, { sender: 'ai', text: res.textExplanation, savings: res.suggestedCostSavingsUsd }]);
  };

  return (
    <div className={`w-96 h-full border-l flex flex-col justify-between shadow-2xl z-20 transition-all ${
      isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#B59B6D] animate-pulse" />
          <h3 className="font-serif text-base font-bold">Gemini AI Interior Assistant</h3>
        </div>

        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Panel Body */}
      <div className="p-4 overflow-y-auto space-y-5 flex-1 text-xs">
        {/* Style Selector Grid */}
        <div className="space-y-2">
          <label className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Architectural Concept Styles</span>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {stylesList.map((st) => (
              <button
                key={st}
                onClick={() => handleApplyStyle(st)}
                disabled={isLoading}
                className={`p-2 rounded-sm border text-center text-[10px] font-bold transition truncate ${
                  buildingData.overallStyle === st
                    ? 'bg-[#B59B6D] text-black border-[#B59B6D]'
                    : isDarkMode ? 'border-white/10 bg-white/5 hover:border-[#B59B6D]' : 'border-slate-300 bg-slate-100 hover:border-[#B59B6D]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-1.5">
          <span className="font-bold text-slate-400 uppercase text-[9px] tracking-wider">Quick Suggestions:</span>
          <div className="flex flex-wrap gap-1">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                onClick={() => handleSendPrompt(qp)}
                disabled={isLoading}
                className={`px-2.5 py-1 rounded-full border text-[10px] transition text-left ${
                  isDarkMode ? 'border-white/20 bg-white/5 hover:border-[#B59B6D] text-slate-300' : 'border-slate-300 bg-slate-100 hover:border-[#B59B6D] text-slate-700'
                }`}
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* AI Conversation Stream */}
        <div className="space-y-3 pt-2">
          <span className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>AI Consultation Log</span>
          </span>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {chatHistory.map((msg, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-sm border text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#B59B6D]/20 border-[#B59B6D]/40 ml-4 text-right' 
                    : isDarkMode ? 'bg-[#121824] border-white/10 mr-2' : 'bg-slate-100 border-slate-300 mr-2'
                }`}
              >
                <div className="font-bold text-[10px] text-[#B59B6D] mb-1 uppercase font-mono">
                  {msg.sender === 'user' ? 'Client Request' : 'Gemini AI Architectural Engine'}
                </div>
                <p className="leading-relaxed">{msg.text}</p>
                {msg.savings && msg.savings > 0 && (
                  <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center space-x-1">
                    <TrendingDown className="w-3 h-3" />
                    <span>Estimated Budget Savings: ${msg.savings.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="p-3 rounded-sm border border-[#B59B6D]/40 bg-[#B59B6D]/10 text-xs text-[#B59B6D] flex items-center space-x-2 animate-pulse">
                <Bot className="w-4 h-4" />
                <span>Gemini is recalculating 3D BIM spatial parameters...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className={`p-3 border-t ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
            placeholder="Ask AI to redesign, optimize cost or ventilation..."
            className={`flex-1 p-2 rounded-sm border text-xs focus:outline-none focus:border-[#B59B6D] ${
              isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
            }`}
          />
          <button
            onClick={() => handleSendPrompt()}
            disabled={isLoading || !prompt.trim()}
            className="p-2 rounded-sm bg-[#B59B6D] text-black font-bold hover:bg-[#c4ab7d] transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
