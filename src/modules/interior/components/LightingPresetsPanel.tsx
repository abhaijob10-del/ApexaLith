import React from 'react';
import { LightingPresetMode } from '../types/interiorTypes';
import { Sun, Moon, Sunset, Sparkles, Flame } from 'lucide-react';

interface LightingPresetsPanelProps {
  currentPreset: LightingPresetMode;
  onChangePreset: (preset: LightingPresetMode) => void;
  isDarkMode?: boolean;
}

export const LightingPresetsPanel: React.FC<LightingPresetsPanelProps> = ({
  currentPreset,
  onChangePreset,
  isDarkMode = true
}) => {
  const presets: { id: LightingPresetMode; name: string; icon: any; description: string }[] = [
    {
      id: 'daylight',
      name: 'Bright Natural Daylight',
      icon: Sun,
      description: 'Clear mid-day sunlight with cool sky ambient bounce.'
    },
    {
      id: 'golden_hour',
      name: 'Golden Hour Sunset',
      icon: Sunset,
      description: 'Warm low-angle sunlight with rich amber highlights.'
    },
    {
      id: 'warm_cozy',
      name: 'Warm Evening Cozy',
      icon: Flame,
      description: '3000K soft warm tungsten lighting with accent spotlights.'
    },
    {
      id: 'night_ambient',
      name: 'Night Architectural Mood',
      icon: Moon,
      description: 'Dark exterior canvas with focused interior chandelier and sconce lighting.'
    },
    {
      id: 'studio',
      name: 'Studio High-Key',
      icon: Sparkles,
      description: 'Balanced multi-directional studio lighting for clean presentation.'
    }
  ];

  return (
    <div className={`p-3.5 space-y-3 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
        <Sun className="w-4 h-4 text-[#B59B6D]" />
        <h3 className="font-bold text-sm uppercase tracking-wider">Lighting & Environmental Studio</h3>
      </div>

      <div className="space-y-2">
        {presets.map((p) => {
          const Icon = p.icon;
          const isSelected = currentPreset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChangePreset(p.id)}
              className={`w-full p-2.5 rounded-sm border text-left transition flex items-start space-x-3 ${
                isSelected
                  ? 'border-[#B59B6D] bg-[#B59B6D]/20 shadow-sm'
                  : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/30' : 'border-slate-300 bg-slate-50 hover:border-slate-400'
              }`}
            >
              <div className={`p-1.5 rounded-sm shrink-0 ${isSelected ? 'bg-[#B59B6D] text-black' : 'bg-white/10 text-[#B59B6D]'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="font-bold text-xs text-white block">{p.name}</span>
                <p className="text-[10px] text-slate-400 leading-tight">{p.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
