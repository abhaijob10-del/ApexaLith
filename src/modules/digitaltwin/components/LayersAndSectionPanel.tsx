import React from 'react';
import { TimeOfDay } from '../types/digitalTwinTypes';
import { 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Scissors, 
  Layers, 
  Box, 
  Grid, 
  SunMedium
} from 'lucide-react';

interface LayersAndSectionPanelProps {
  hideWalls: boolean;
  onToggleHideWalls: () => void;
  showWireframe: boolean;
  onToggleWireframe: () => void;
  showRoof: boolean;
  onToggleRoof: () => void;
  showCeilings: boolean;
  onToggleCeilings: () => void;
  showSectionCut: boolean;
  onToggleSectionCut: () => void;
  sectionCutAxis: 'X' | 'Y' | 'Z';
  onChangeSectionCutAxis: (axis: 'X' | 'Y' | 'Z') => void;
  sectionCutOffset: number;
  onChangeSectionCutOffset: (val: number) => void;
  timeOfDay: TimeOfDay;
  onChangeTimeOfDay: (time: TimeOfDay) => void;
  isDarkMode?: boolean;
}

export const LayersAndSectionPanel: React.FC<LayersAndSectionPanelProps> = ({
  hideWalls,
  onToggleHideWalls,
  showWireframe,
  onToggleWireframe,
  showRoof,
  onToggleRoof,
  showCeilings,
  onToggleCeilings,
  showSectionCut,
  onToggleSectionCut,
  sectionCutAxis,
  onChangeSectionCutAxis,
  sectionCutOffset,
  onChangeSectionCutOffset,
  timeOfDay,
  onChangeTimeOfDay,
  isDarkMode = true
}) => {
  return (
    <div className={`p-3 rounded-sm border space-y-3 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* 1. Visibility Toggles */}
      <div className="space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5" />
          <span>Layer Visibility & Modes</span>
        </h4>

        <div className="grid grid-cols-2 gap-1.5 text-xs">
          <button
            onClick={onToggleHideWalls}
            className={`p-2 rounded-sm border flex items-center justify-between transition ${
              hideWalls 
                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span>Hide Walls</span>
            {hideWalls ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleWireframe}
            className={`p-2 rounded-sm border flex items-center justify-between transition ${
              showWireframe 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' 
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
            }`}
          >
            <span>Wireframe</span>
            <Box className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onToggleRoof}
            className={`p-2 rounded-sm border flex items-center justify-between transition ${
              showRoof 
                ? 'bg-white/10 border-white/20 text-white font-bold' 
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>Roof Slab</span>
            {showRoof ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onToggleCeilings}
            className={`p-2 rounded-sm border flex items-center justify-between transition ${
              showCeilings 
                ? 'bg-white/10 border-white/20 text-white font-bold' 
                : 'bg-white/5 border-white/10 text-slate-500'
            }`}
          >
            <span>Ceilings</span>
            {showCeilings ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Section Cut (Clipping Plane) */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
            <Scissors className="w-3.5 h-3.5" />
            <span>Section Cut Plane</span>
          </h4>

          <button
            onClick={onToggleSectionCut}
            className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider border transition ${
              showSectionCut 
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {showSectionCut ? 'Active' : 'Off'}
          </button>
        </div>

        {showSectionCut && (
          <div className="space-y-2 p-2 rounded-sm bg-white/5 border border-white/10 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Cut Axis:</span>
              <div className="flex space-x-1">
                {(['X', 'Y', 'Z'] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => onChangeSectionCutAxis(axis)}
                    className={`px-2 py-0.5 rounded-sm font-mono text-[10px] font-bold ${
                      sectionCutAxis === axis 
                        ? 'bg-[#B59B6D] text-black' 
                        : 'bg-white/10 text-slate-300 hover:bg-white/20'
                    }`}
                  >
                    {axis}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Offset Position:</span>
                <span className="text-white font-bold">{sectionCutOffset.toFixed(1)} m</span>
              </div>
              <input
                type="range"
                min="-5"
                max="10"
                step="0.2"
                value={sectionCutOffset}
                onChange={(e) => onChangeSectionCutOffset(parseFloat(e.target.value))}
                className="w-full accent-[#B59B6D]"
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Time of Day Lighting */}
      <div className="pt-2 border-t border-white/10 space-y-2">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
          <SunMedium className="w-3.5 h-3.5" />
          <span>Lighting & Time of Day</span>
        </h4>

        <div className="grid grid-cols-4 gap-1 text-[10px] font-bold uppercase">
          {(['morning', 'afternoon', 'evening', 'night'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onChangeTimeOfDay(t)}
              className={`p-1.5 rounded-sm border text-center transition ${
                timeOfDay === t 
                  ? 'bg-[#B59B6D] text-black border-[#B59B6D]' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
