import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Layers, 
  Star, 
  Check, 
  Sparkles, 
  DollarSign, 
  Copy,
  ArrowRight
} from 'lucide-react';
import { DesignVariant, BimBuildingData } from '../../bim/types/bim';

interface DesignVariantsPanelProps {
  variants: DesignVariant[];
  activeVariantId: string;
  currentBuildingData: BimBuildingData;
  onSelectVariant: (variantId: string) => void;
  onCreateVariant: (name: string) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const DesignVariantsPanel: React.FC<DesignVariantsPanelProps> = ({
  variants,
  activeVariantId,
  currentBuildingData,
  onSelectVariant,
  onCreateVariant,
  onClose,
  isDarkMode
}) => {
  const [newVariantName, setNewVariantName] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const handleSaveVariant = () => {
    if (!newVariantName.trim()) return;
    onCreateVariant(newVariantName);
    setNewVariantName('');
    setIsCreating(false);
  };

  return (
    <div className={`w-80 h-full border-l flex flex-col justify-between shadow-2xl z-20 transition-all ${
      isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="font-serif text-base font-bold">Design Variants & Options</h3>
        </div>

        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
        {/* Save Current as Variant Button */}
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full p-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold uppercase tracking-wider text-[11px] transition flex items-center justify-center space-x-2 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Save Current Concept Variant</span>
          </button>
        ) : (
          <div className={`p-3 rounded-sm border space-y-2 ${
            isDarkMode ? 'bg-white/5 border-white/20' : 'bg-slate-100 border-slate-300'
          }`}>
            <span className="font-bold text-[#B59B6D] uppercase text-[10px]">New Variant Name:</span>
            <input 
              type="text" 
              value={newVariantName}
              onChange={(e) => setNewVariantName(e.target.value)}
              placeholder="e.g. Concept B - Scandinavian Bleached Ash"
              className={`w-full p-2 rounded-sm border text-xs focus:outline-none focus:border-[#B59B6D] ${
                isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
              }`}
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button 
                onClick={() => setIsCreating(false)}
                className="px-2.5 py-1 rounded border text-[10px] text-slate-400"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveVariant}
                className="px-3 py-1 rounded bg-[#B59B6D] text-black font-bold text-[10px] uppercase"
              >
                Save Variant
              </button>
            </div>
          </div>
        )}

        {/* Variants List */}
        <div className="space-y-3 pt-2">
          <span className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px]">
            Saved Concepts ({variants.length})
          </span>

          <div className="space-y-2">
            {variants.map((v) => {
              const isActive = v.id === activeVariantId;
              return (
                <div
                  key={v.id}
                  onClick={() => onSelectVariant(v.id)}
                  className={`p-3 rounded-sm border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                    isActive 
                      ? 'border-[#B59B6D] bg-[#B59B6D]/15 shadow-md' 
                      : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-300 bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-sm">{v.name}</span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded bg-[#B59B6D] text-black text-[9px] font-bold uppercase">
                        Active 3D
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] font-mono">
                    <span className="text-[#B59B6D] font-bold">${v.estimatedCostUsd.toLocaleString()}</span>
                    <span className="text-slate-400">{v.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t text-[10px] text-slate-400 text-center ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        Compare variants in Vault or Admin Dashboard.
      </div>
    </div>
  );
};
