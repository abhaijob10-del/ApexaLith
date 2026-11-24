import React from 'react';
import { 
  X, 
  Paintbrush, 
  Layers, 
  Box, 
  Sparkles, 
  Sliders, 
  Check, 
  Sun, 
  Droplet,
  Home
} from 'lucide-react';
import { BimBuildingData, BimRoom } from '../../bim/types/bim';

interface PropertyInspectorProps {
  buildingData: BimBuildingData;
  selectedRoomId: string | null;
  onUpdateRoomProperty: (roomId: string, updates: Partial<BimRoom>) => void;
  onClose: () => void;
  isDarkMode: boolean;
}

export const PropertyInspector: React.FC<PropertyInspectorProps> = ({
  buildingData,
  selectedRoomId,
  onUpdateRoomProperty,
  onClose,
  isDarkMode
}) => {
  if (!selectedRoomId) return null;

  const room = buildingData.rooms.find(r => r.id === selectedRoomId);
  if (!room) return null;

  const wallCoatings = [
    { name: 'French Venetian Plaster', hex: '#F8FAFC' },
    { name: 'Soft Greige Limewash', hex: '#E2E8F0' },
    { name: 'Matte Anthracite Accent', hex: '#1E293B' },
    { name: 'Raw Architectural Concrete', hex: '#94A3B8' },
    { name: 'Fluted Smoked Timber', hex: '#451A03' }
  ];

  const flooringOptions = [
    { name: 'Italian Carrara White Marble', hex: '#F8FAFC' },
    { name: 'Chevron Smoked Oak Hardwood', hex: '#78350F' },
    { name: 'Bleached Nordic Ash', hex: '#E2E8F0' },
    { name: 'Polished Terrazzo Tile', hex: '#CBD5E1' },
    { name: 'Black Nero Marquina Marble', hex: '#0F172A' }
  ];

  const ceilingTypes: BimRoom['ceilingType'][] = [
    'Coffered LED',
    'Recessed Spotlights',
    'Exposed Timber Beams',
    'Flat Venetian'
  ];

  return (
    <div className={`w-80 h-full border-l flex flex-col justify-between shadow-2xl z-20 transition-all ${
      isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="font-serif text-base font-bold truncate">{room.name}</h3>
        </div>

        <button 
          onClick={onClose}
          className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Inspector Body */}
      <div className="p-4 overflow-y-auto space-y-6 flex-1 text-xs">
        {/* Room Quick Metrics */}
        <div className={`p-3 rounded-sm border grid grid-cols-2 gap-2 text-center ${
          isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Area</span>
            <div className="text-sm font-bold text-[#B59B6D] font-mono">{room.areaSqMeters} m²</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Room Type</span>
            <div className="text-sm font-bold truncate">{room.type}</div>
          </div>
        </div>

        {/* Wall Finish & Coating */}
        <div className="space-y-2">
          <label className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Wall Finish & Coating</span>
          </label>

          <div className="space-y-1.5">
            {wallCoatings.map((wc) => (
              <button
                key={wc.name}
                onClick={() => onUpdateRoomProperty(room.id, { wallFinish: wc.name })}
                className={`w-full p-2 rounded-sm border text-left flex items-center justify-between transition ${
                  room.wallFinish === wc.name
                    ? 'border-[#B59B6D] bg-[#B59B6D]/20 text-[#B59B6D] font-bold'
                    : isDarkMode ? 'border-white/10 hover:border-white/30' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0" style={{ backgroundColor: wc.hex }} />
                  <span className="truncate">{wc.name}</span>
                </div>
                {room.wallFinish === wc.name && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Flooring Material */}
        <div className="space-y-2">
          <label className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Flooring Material</span>
          </label>

          <div className="space-y-1.5">
            {flooringOptions.map((fl) => (
              <button
                key={fl.name}
                onClick={() => onUpdateRoomProperty(room.id, { flooringMaterial: fl.name, flooringColorHex: fl.hex })}
                className={`w-full p-2 rounded-sm border text-left flex items-center justify-between transition ${
                  room.flooringMaterial === fl.name
                    ? 'border-[#B59B6D] bg-[#B59B6D]/20 text-[#B59B6D] font-bold'
                    : isDarkMode ? 'border-white/10 hover:border-white/30' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-3.5 h-3.5 rounded-full border border-white/40 shrink-0" style={{ backgroundColor: fl.hex }} />
                  <span className="truncate">{fl.name}</span>
                </div>
                {room.flooringMaterial === fl.name && <Check className="w-3.5 h-3.5 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Ceiling Type */}
        <div className="space-y-2">
          <label className="font-bold text-[#B59B6D] uppercase tracking-wider text-[10px] flex items-center space-x-1">
            <Home className="w-3.5 h-3.5" />
            <span>Ceiling Architecture</span>
          </label>

          <div className="grid grid-cols-2 gap-1.5">
            {ceilingTypes.map((ct) => (
              <button
                key={ct}
                onClick={() => onUpdateRoomProperty(room.id, { ceilingType: ct })}
                className={`p-2 rounded-sm border text-center text-[10px] font-bold transition truncate ${
                  room.ceilingType === ct
                    ? 'border-[#B59B6D] bg-[#B59B6D] text-black'
                    : isDarkMode ? 'border-white/10 hover:border-white/30' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {ct}
              </button>
            ))}
          </div>
        </div>

        {/* Furniture Item Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-bold text-[#B59B6D] uppercase tracking-wider text-[10px]">
            <span className="flex items-center space-x-1">
              <Box className="w-3.5 h-3.5" />
              <span>Furniture & Decor ({room.furnitureItems.length})</span>
            </span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {room.furnitureItems.map((item) => (
              <div 
                key={item.id} 
                className={`p-2 rounded-sm border flex items-center justify-between text-[11px] ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}
              >
                <span className="font-semibold truncate">{item.name}</span>
                <span className="text-[10px] font-mono text-slate-400 capitalize">{item.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className={`p-3 border-t text-[10px] text-slate-400 text-center ${
        isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
      }`}>
        Changes instantly update 3D WebGL Digital Twin viewport.
      </div>
    </div>
  );
};
