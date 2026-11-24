import React, { useState } from 'react';
import { 
  Calendar, 
  Palette, 
  Sparkles, 
  ChevronUp, 
  ChevronDown, 
  Clock, 
  Box, 
  Layers, 
  TrendingUp, 
  Info 
} from 'lucide-react';

interface BottomPanelProps {
  isDarkMode?: boolean;
}

type TabType = 'timeline' | 'materials' | 'suggestions';

export const BottomPanel: React.FC<BottomPanelProps> = ({ isDarkMode = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('timeline');

  return (
    <div className={`border-t transition-all duration-300 z-20 shrink-0 ${
      isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* PANEL TOGGLE BAR */}
      <div className={`px-4 py-2 border-b flex items-center justify-between backdrop-blur-md ${
        isDarkMode ? 'bg-[#0F1420] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => {
              setActiveTab('timeline');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 ${
              activeTab === 'timeline' && isExpanded
                ? 'bg-[#B59B6D] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Future Timeline</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-black font-mono font-bold ml-1">
              Phase 2
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('materials');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 ${
              activeTab === 'materials' && isExpanded
                ? 'bg-[#B59B6D] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Future Material Library</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-black font-mono font-bold ml-1">
              Phase 2
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('suggestions');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 ${
              activeTab === 'suggestions' && isExpanded
                ? 'bg-[#B59B6D] text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Future AI Suggestions</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-black font-mono font-bold ml-1">
              Phase 2
            </span>
          </button>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition flex items-center space-x-1 text-xs"
        >
          <span className="hidden sm:inline font-mono">{isExpanded ? 'Collapse Drawer' : 'Expand Preview'}</span>
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* EXPANDED PANEL CONTENT */}
      {isExpanded && (
        <div className="p-4 sm:p-6 max-h-56 overflow-y-auto">
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#B59B6D]">
                <span className="font-bold uppercase tracking-wider">Construction Timeline & CPM Milestones</span>
                <span>Coming Soon in Phase 2</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {[
                  { phase: '01. Substructure & Caisson Anchoring', status: 'Upcoming', progress: '0%' },
                  { phase: '02. Post-Tensioned Slab Framing', status: 'Queued', progress: '0%' },
                  { phase: '03. Smart Glass Enclosure Installation', status: 'Queued', progress: '0%' },
                  { phase: '04. Interior Fitout & Millwork', status: 'Queued', progress: '0%' }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded border border-white/10 bg-[#111622] space-y-1.5">
                    <div className="font-bold text-white text-xs truncate">{item.phase}</div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Status: <strong className="text-[#B59B6D]">{item.status}</strong></span>
                      <span>{item.progress}</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B59B6D] w-0" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'materials' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#B59B6D]">
                <span className="font-bold uppercase tracking-wider">Curated High-End Material Specifications</span>
                <span>Coming Soon in Phase 2</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  { name: 'Calacatta Marble Slabs', origin: 'Carrara, Italy', type: 'Flooring & Countertops' },
                  { name: 'Nordic Bleached Ash Wood', origin: 'Stockholm, Sweden', type: 'Millwork & Cabinetry' },
                  { name: 'Triple-Pane Low-E Acoustical Glass', origin: 'Zurich, Switzerland', type: 'Façade Curtain Wall' }
                ].map((mat, idx) => (
                  <div key={idx} className="p-3 rounded border border-white/10 bg-[#111622] space-y-1">
                    <div className="font-bold text-white">{mat.name}</div>
                    <div className="text-[10px] text-slate-400">{mat.origin} • {mat.type}</div>
                    <div className="text-[10px] text-[#B59B6D] italic">Material assignment active in Phase 2</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#B59B6D]">
                <span className="font-bold uppercase tracking-wider">AI Architectural & Energy Optimization</span>
                <span>Coming Soon in Phase 2</span>
              </div>
              <div className="p-4 rounded border border-amber-500/30 bg-amber-500/10 flex items-start space-x-3 text-xs">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300">Automated Spatial Optimizations</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Once CAD/IFC files are uploaded, Gemini AI will evaluate solar azimuth orientation, acoustic insulation pathways, and cost variances automatically.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
