import React, { useState } from 'react';
import { DesignConcept, FavoriteDesignRecord } from '../types/interiorTypes';
import { Sparkles, Star, Check, Compass, Shield, ArrowRight, Eye } from 'lucide-react';

interface AiConceptsPanelProps {
  concepts: DesignConcept[];
  activeConceptId: string;
  onSelectConcept: (conceptId: string) => void;
  onSaveFavorite: (concept: DesignConcept) => void;
  isDarkMode?: boolean;
}

export const AiConceptsPanel: React.FC<AiConceptsPanelProps> = ({
  concepts,
  activeConceptId,
  onSelectConcept,
  onSaveFavorite,
  isDarkMode = true
}) => {
  const [favoriteSaved, setFavoriteSaved] = useState(false);
  const activeConcept = concepts.find(c => c.id === activeConceptId) || concepts[0];

  const handleFavoriteClick = () => {
    onSaveFavorite(activeConcept);
    setFavoriteSaved(true);
    setTimeout(() => setFavoriteSaved(false), 2000);
  };

  return (
    <div className={`p-3.5 space-y-4 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#B59B6D] animate-pulse" />
          <h3 className="font-bold text-sm uppercase tracking-wider">AI Design Concepts (4 Concepts)</h3>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 rounded-sm border transition flex items-center space-x-1 ${
            favoriteSaved
              ? 'bg-amber-500 text-black border-amber-400'
              : 'bg-white/5 border-white/15 hover:border-amber-400 text-amber-300'
          }`}
          title="Save to Favorite Designs"
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span className="text-[10px] font-bold uppercase">{favoriteSaved ? 'Saved!' : 'Favorite'}</span>
        </button>
      </div>

      {/* 4 Concept Tabs (Concept A, B, C, D) */}
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-sm bg-black/40 border border-white/10">
        {concepts.map((c) => {
          const isSelected = c.id === activeConceptId;
          return (
            <button
              key={c.id}
              onClick={() => onSelectConcept(c.id)}
              className={`py-1.5 text-center rounded-sm text-[10px] font-bold uppercase transition ${
                isSelected
                  ? 'bg-[#B59B6D] text-black font-extrabold shadow'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.id.replace('concept_', 'Concept ')}
            </button>
          );
        })}
      </div>

      {/* Selected Concept Summary Card */}
      {activeConcept && (
        <div className="space-y-3 p-3 rounded-sm bg-white/5 border border-white/10">
          <div className="flex items-center justify-between">
            <h4 className="font-serif font-bold text-sm text-[#B59B6D]">{activeConcept.name}</h4>
            <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[9px] font-bold uppercase">
              {activeConcept.style}
            </span>
          </div>

          <p className="text-slate-300 leading-relaxed text-[11px]">{activeConcept.description}</p>

          {/* Color Palette Pill Preview */}
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Palette:</span>
            <div className="flex items-center space-x-1">
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: activeConcept.colorPalette.walls }} title="Walls" />
              <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: activeConcept.colorPalette.floor }} title="Floor" />
              {activeConcept.colorPalette.accents.map((acc, idx) => (
                <span key={idx} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: acc }} title="Accent" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Design Explanation & Rationale Breakdown */}
      {activeConcept && (
        <div className="space-y-2 pt-2 border-t border-white/10">
          <span className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider flex items-center space-x-1">
            <Compass className="w-3.5 h-3.5" />
            <span>AI Architectural & Design Rationale</span>
          </span>

          <div className="space-y-2 text-[11px] font-sans">
            <div className="p-2 rounded-sm bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#B59B6D] uppercase text-[9px] block">1. Furniture Rationale</span>
              <p className="text-slate-300 leading-snug">{activeConcept.rationale.whyFurnitureSelected}</p>
            </div>

            <div className="p-2 rounded-sm bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#B59B6D] uppercase text-[9px] block">2. Color & Finish Rationale</span>
              <p className="text-slate-300 leading-snug">{activeConcept.rationale.colorRationale}</p>
            </div>

            <div className="p-2 rounded-sm bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#B59B6D] uppercase text-[9px] block">3. Traffic & Circulation Improvement</span>
              <p className="text-slate-300 leading-snug">{activeConcept.rationale.circulationImprovement}</p>
            </div>

            <div className="p-2 rounded-sm bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#B59B6D] uppercase text-[9px] block">4. Lighting Optimization</span>
              <p className="text-slate-300 leading-snug">{activeConcept.rationale.lightingOptimization}</p>
            </div>

            <div className="p-2 rounded-sm bg-white/5 border border-white/10 space-y-1">
              <span className="font-bold text-[#B59B6D] uppercase text-[9px] block">5. Durability & Maintenance</span>
              <p className="text-slate-300 leading-snug">{activeConcept.rationale.maintenanceAndDurability}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
