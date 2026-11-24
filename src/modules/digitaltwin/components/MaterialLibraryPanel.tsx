import React from 'react';
import { PBRMaterialType } from '../types/digitalTwinTypes';
import { Paintbrush, Check } from 'lucide-react';

interface MaterialLibraryPanelProps {
  selectedMaterial?: PBRMaterialType;
  onSelectMaterial: (type: PBRMaterialType) => void;
  isDarkMode?: boolean;
}

const MATERIAL_OPTIONS: { type: PBRMaterialType; name: string; colorHex: string; desc: string }[] = [
  { type: 'Concrete', name: 'Polished Concrete', colorHex: '#8C929E', desc: 'High-strength structural finish' },
  { type: 'Brick', name: 'Red Facing Brick', colorHex: '#B91C1C', desc: 'Traditional masonry' },
  { type: 'Stone', name: 'Natural Slate Stone', colorHex: '#78716C', desc: 'Exterior facade stone' },
  { type: 'Wood', name: 'Natural Timber Oak', colorHex: '#A0522D', desc: 'Warm hardwood parquet' },
  { type: 'Tiles', name: 'Ceramic Porcelain', colorHex: '#CBD5E1', desc: 'Waterproof floor tile' },
  { type: 'Marble', name: 'Carrara White Marble', colorHex: '#F8FAFC', desc: 'Luxury polished marble' },
  { type: 'Granite', name: 'Dark Basalt Granite', colorHex: '#334155', desc: 'Heavy duty stone' },
  { type: 'Glass', name: 'Low-E Double Glass', colorHex: '#38BDF8', desc: 'Insulated curtain glass' },
  { type: 'Steel', name: 'Stainless Steel', colorHex: '#64748B', desc: 'Brushed metal alloy' },
  { type: 'Paint', name: 'Matte Interior Paint', colorHex: '#F1F5F9', desc: 'Pure white interior' }
];

export const MaterialLibraryPanel: React.FC<MaterialLibraryPanelProps> = ({
  selectedMaterial,
  onSelectMaterial,
  isDarkMode = true
}) => {
  return (
    <div className={`p-3 rounded-sm border space-y-3 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
        <Paintbrush className="w-4 h-4 text-[#B59B6D]" />
        <h3 className="text-xs font-bold uppercase tracking-wider">PBR Material Selector</h3>
      </div>

      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
        {MATERIAL_OPTIONS.map((item) => {
          const isSelected = selectedMaterial === item.type;
          return (
            <button
              key={item.type}
              onClick={() => onSelectMaterial(item.type)}
              className={`p-2 rounded-sm border text-left flex items-start space-x-2 transition ${
                isSelected 
                  ? 'bg-[#B59B6D]/20 border-[#B59B6D] text-white' 
                  : isDarkMode 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300' 
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <span 
                className="w-4 h-4 rounded-full shrink-0 border border-white/20 mt-0.5 shadow-sm"
                style={{ backgroundColor: item.colorHex }}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold truncate">{item.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-[#B59B6D] shrink-0" />}
                </div>
                <span className="text-[9px] text-slate-400 block truncate">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
