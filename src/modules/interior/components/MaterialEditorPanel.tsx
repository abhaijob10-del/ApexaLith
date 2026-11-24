import React from 'react';
import { RoomDesignState } from '../types/interiorTypes';
import { Paintbrush, Layers, Check } from 'lucide-react';

interface MaterialEditorPanelProps {
  roomState: RoomDesignState;
  onUpdateRoomMaterials: (updates: Partial<RoomDesignState>) => void;
  isDarkMode?: boolean;
}

export const MaterialEditorPanel: React.FC<MaterialEditorPanelProps> = ({
  roomState,
  onUpdateRoomMaterials,
  isDarkMode = true
}) => {
  const wallMaterialPresets = [
    { name: 'Matte Warm Cream Paint', colorHex: '#EAE6E1', material: 'Paint' },
    { name: 'Venetian Lime Plaster', colorHex: '#D9D2C9', material: 'Plaster' },
    { name: 'Fluted Oak Paneling', colorHex: '#8C6F56', material: 'Wood' },
    { name: 'Bookmatched Calacatta Marble', colorHex: '#F0F2F5', material: 'Marble' },
    { name: 'Exposed Raw Concrete', colorHex: '#8B929A', material: 'Concrete' },
    { name: 'Textured Linen Wallpaper', colorHex: '#C8BFB5', material: 'Wallpaper' }
  ];

  const floorMaterialPresets = [
    { name: 'Chevron European Oak', colorHex: '#B59B6D', material: 'Wood' },
    { name: 'Polished Calacatta Slab', colorHex: '#EBF0F5', material: 'Marble' },
    { name: 'Honed Terrazzo Stone', colorHex: '#D1C8C0', material: 'Tiles' },
    { name: 'Dark American Walnut', colorHex: '#3D2A1C', material: 'Wood' },
    { name: 'Luxury Plush Wool Carpet', colorHex: '#9E988F', material: 'Carpet' }
  ];

  return (
    <div className={`p-3.5 space-y-4 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
        <Paintbrush className="w-4 h-4 text-[#B59B6D]" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Surface Material Editor</h3>
      </div>

      {/* Wall Finish Presets */}
      <div className="space-y-2">
        <label className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider block">
          Wall Finish & Tones
        </label>
        <div className="grid grid-cols-2 gap-2">
          {wallMaterialPresets.map((preset) => {
            const isSelected = roomState.wallColorHex === preset.colorHex;
            return (
              <button
                key={preset.name}
                onClick={() => onUpdateRoomMaterials({
                  wallMaterial: preset.material,
                  wallColorHex: preset.colorHex
                })}
                className={`p-2 rounded-sm border text-left transition flex items-center space-x-2 ${
                  isSelected
                    ? 'border-[#B59B6D] bg-[#B59B6D]/20'
                    : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                  style={{ backgroundColor: preset.colorHex }}
                />
                <span className="truncate text-[10px] font-bold text-slate-200">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floor Finish Presets */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <label className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider block">
          Flooring Finish
        </label>
        <div className="space-y-1.5">
          {floorMaterialPresets.map((preset) => {
            const isSelected = roomState.floorColorHex === preset.colorHex;
            return (
              <button
                key={preset.name}
                onClick={() => onUpdateRoomMaterials({
                  floorMaterial: preset.material,
                  floorColorHex: preset.colorHex
                })}
                className={`w-full p-2 rounded-sm border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-[#B59B6D] bg-[#B59B6D]/20'
                    : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span
                    className="w-3.5 h-3.5 rounded-sm border border-white/20"
                    style={{ backgroundColor: preset.colorHex }}
                  />
                  <span className="text-[10px] font-bold text-slate-200">{preset.name}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#B59B6D]" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
