import React from 'react';
import { FurnitureItem } from '../types/interiorTypes';
import { Sliders, Move, RotateCw, Trash2, Copy, Lock, Unlock, Check } from 'lucide-react';

interface FurnitureInspectorPanelProps {
  selectedItem: FurnitureItem | null;
  onUpdateItem: (updated: FurnitureItem) => void;
  onDuplicateItem: (item: FurnitureItem) => void;
  onDeleteItem: (itemId: string) => void;
  isDarkMode?: boolean;
}

export const FurnitureInspectorPanel: React.FC<FurnitureInspectorPanelProps> = ({
  selectedItem,
  onUpdateItem,
  onDuplicateItem,
  onDeleteItem,
  isDarkMode = true
}) => {
  if (!selectedItem) {
    return (
      <div className={`p-4 text-center space-y-2 rounded-sm border ${
        isDarkMode ? 'bg-[#0D111A] border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <Sliders className="w-6 h-6 mx-auto text-[#B59B6D]/50" />
        <p className="text-xs">Select any 3D furniture item in the canvas to edit position, rotation, scale, color & material.</p>
      </div>
    );
  }

  const handlePositionChange = (axis: 0 | 1 | 2, val: number) => {
    const newPos: [number, number, number] = [...selectedItem.position];
    newPos[axis] = val;
    onUpdateItem({ ...selectedItem, position: newPos });
  };

  const handleRotationYChange = (deg: number) => {
    const rad = (deg * Math.PI) / 180;
    onUpdateItem({ ...selectedItem, rotation: [0, rad, 0] });
  };

  const currentDegY = Math.round((selectedItem.rotation[1] * 180) / Math.PI) % 360;

  return (
    <div className={`p-3.5 space-y-4 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="space-y-0.5">
          <span className="text-[9px] font-mono uppercase text-[#B59B6D]">{selectedItem.category}</span>
          <h3 className="font-bold text-sm truncate text-white">{selectedItem.name}</h3>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => onUpdateItem({ ...selectedItem, isLocked: !selectedItem.isLocked })}
            className={`p-1.5 rounded-sm border transition ${
              selectedItem.isLocked ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-white/5 border-white/15 text-slate-400'
            }`}
            title={selectedItem.isLocked ? 'Locked' : 'Unlocked'}
          >
            {selectedItem.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => onDuplicateItem(selectedItem)}
            className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 transition"
            title="Duplicate Item"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDeleteItem(selectedItem.id)}
            className="p-1.5 rounded-sm bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 transition"
            title="Delete Item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Position X, Y, Z Controls */}
      <div className="space-y-2">
        <label className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider flex items-center space-x-1">
          <Move className="w-3.5 h-3.5" />
          <span>3D Position (Meters)</span>
        </label>

        <div className="grid grid-cols-3 gap-2 font-mono">
          <div>
            <span className="text-[9px] text-slate-400 block">X (Width)</span>
            <input
              type="number"
              step="0.1"
              value={selectedItem.position[0]}
              onChange={(e) => handlePositionChange(0, parseFloat(e.target.value) || 0)}
              className="w-full p-1.5 rounded-sm bg-[#070A11] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block">Y (Height)</span>
            <input
              type="number"
              step="0.1"
              value={selectedItem.position[1]}
              onChange={(e) => handlePositionChange(1, parseFloat(e.target.value) || 0)}
              className="w-full p-1.5 rounded-sm bg-[#070A11] border border-white/15 text-xs text-white"
            />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block">Z (Depth)</span>
            <input
              type="number"
              step="0.1"
              value={selectedItem.position[2]}
              onChange={(e) => handlePositionChange(2, parseFloat(e.target.value) || 0)}
              className="w-full p-1.5 rounded-sm bg-[#070A11] border border-white/15 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Rotation Y Control */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider flex items-center space-x-1">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotation Y</span>
          </label>
          <span className="font-mono text-[10px] text-slate-300">{currentDegY}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={currentDegY < 0 ? currentDegY + 360 : currentDegY}
          onChange={(e) => handleRotationYChange(parseInt(e.target.value))}
          className="w-full accent-[#B59B6D] cursor-pointer"
        />
      </div>

      {/* Color Hex Swatch Picker */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <label className="font-bold text-[#B59B6D] uppercase text-[10px] tracking-wider block">
          Upholstery / Finish Color
        </label>

        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={selectedItem.colorHex}
            onChange={(e) => onUpdateItem({ ...selectedItem, colorHex: e.target.value })}
            className="w-8 h-8 rounded-sm border border-white/20 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={selectedItem.colorHex}
            onChange={(e) => onUpdateItem({ ...selectedItem, colorHex: e.target.value })}
            className="flex-1 p-1.5 rounded-sm bg-[#070A11] border border-white/15 font-mono text-xs text-white uppercase"
          />
        </div>
      </div>
    </div>
  );
};
