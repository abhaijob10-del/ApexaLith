import React from 'react';
import { ComponentMetadata } from '../types/digitalTwinTypes';
import { 
  Box, 
  Ruler, 
  Paintbrush, 
  ShieldCheck, 
  Layers, 
  Info,
  DollarSign,
  Sparkles,
  Tag
} from 'lucide-react';

interface DigitalTwinPropertyPanelProps {
  selectedComponent: ComponentMetadata | null;
  onApplyMaterialClick?: () => void;
  isDarkMode?: boolean;
}

export const DigitalTwinPropertyPanel: React.FC<DigitalTwinPropertyPanelProps> = ({
  selectedComponent,
  onApplyMaterialClick,
  isDarkMode = true
}) => {
  if (!selectedComponent) {
    return (
      <div className={`p-4 rounded-sm border text-center space-y-3 ${
        isDarkMode ? 'bg-[#0D111A] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <Box className="w-8 h-8 text-[#B59B6D] mx-auto opacity-50" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">Element Inspector</h4>
          <p className="text-[11px] max-w-xs mx-auto">
            Click any 3D element (wall, door, window, floor, roof, stair) in the viewport to inspect verified dimensions, materials & BIM metadata.
          </p>
        </div>
      </div>
    );
  }

  const { dimensions } = selectedComponent;

  return (
    <div className={`p-4 rounded-sm border space-y-4 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-white/10">
        <div>
          <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] font-bold uppercase tracking-widest border border-[#B59B6D]/30">
            {selectedComponent.type.toUpperCase()} ELEMENT
          </span>
          <h3 className="text-sm font-bold text-white mt-1 uppercase tracking-tight">{selectedComponent.name}</h3>
          <p className="text-[11px] text-slate-400 font-mono">ID: {selectedComponent.id}</p>
        </div>
      </div>

      {/* Verified Dimensions Grid */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
          <Ruler className="w-3.5 h-3.5" />
          <span>Verified Geometric Dimensions</span>
        </h4>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="p-2 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Length / Span</span>
            <span className="font-bold text-white">{dimensions.length} m</span>
          </div>

          <div className="p-2 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Height</span>
            <span className="font-bold text-white">{dimensions.height} m</span>
          </div>

          <div className="p-2 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Thickness / Depth</span>
            <span className="font-bold text-white">{dimensions.width} m</span>
          </div>

          <div className="p-2 rounded-sm bg-white/5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase block">Area</span>
            <span className="font-bold text-[#B59B6D]">{dimensions.areaSqMeters || (dimensions.length * dimensions.height).toFixed(2)} m²</span>
          </div>
        </div>
      </div>

      {/* PBR Material & Room Location */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
          <Paintbrush className="w-3.5 h-3.5" />
          <span>PBR Surface Finish</span>
        </h4>

        <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">{selectedComponent.materialType}</span>
            <span className="text-[10px] text-slate-400 font-mono">{selectedComponent.materialName}</span>
          </div>

          {onApplyMaterialClick && (
            <button
              onClick={onApplyMaterialClick}
              className="px-2.5 py-1 rounded-sm bg-[#B59B6D] hover:bg-[#A38859] text-black text-[10px] font-bold uppercase tracking-wider transition"
            >
              Change Material
            </button>
          )}
        </div>
      </div>

      {/* Structural Metadata */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>BIM Construction Attributes</span>
        </h4>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Level Storey:</span>
            <span className="font-mono text-white font-bold">Level {selectedComponent.level}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Load Bearing:</span>
            <span className={`font-bold font-mono ${selectedComponent.isLoadBearing ? 'text-amber-400' : 'text-slate-300'}`}>
              {selectedComponent.isLoadBearing ? 'YES (STRUCTURAL)' : 'NO (PARTITION)'}
            </span>
          </div>

          {selectedComponent.roomName && (
            <div className="flex items-center justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Assigned Space:</span>
              <span className="font-mono text-emerald-400 font-bold">{selectedComponent.roomName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Phase 6 & Phase 7 Future Placeholders */}
      <div className="p-3 rounded-sm bg-white/5 border border-white/10 space-y-2 opacity-75">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
          <span className="flex items-center space-x-1 text-[#B59B6D]">
            <Sparkles className="w-3 h-3" />
            <span>Phase 6/7 Future Hooks</span>
          </span>
          <span className="text-slate-500 font-mono">In Design Phase</span>
        </div>
        <p className="text-[10px] text-slate-400 italic">
          Cost estimation and interior AI suggestions will unlock after Phase 5 Digital Twin verification completes.
        </p>
      </div>
    </div>
  );
};
