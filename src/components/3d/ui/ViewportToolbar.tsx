import React from 'react';
import { 
  Camera, 
  Sun, 
  Grid, 
  Eye, 
  RotateCcw, 
  Activity, 
  Sparkles, 
  Box, 
  Play, 
  Pause,
  Layers,
  Compass
} from 'lucide-react';
import { ViewportSettings, CameraPreset, LightingPreset, EnvironmentMode } from '../types/renderingTypes';

interface ViewportToolbarProps {
  settings: ViewportSettings;
  onUpdateSettings: (newSettings: Partial<ViewportSettings>) => void;
  onResetCamera: () => void;
  isDarkMode?: boolean;
}

export const ViewportToolbar: React.FC<ViewportToolbarProps> = ({
  settings,
  onUpdateSettings,
  onResetCamera,
  isDarkMode = true
}) => {
  return (
    <div className={`h-11 px-3 border-b flex items-center justify-between font-mono text-xs backdrop-blur-xl z-20 transition-colors ${
      isDarkMode ? 'bg-[#0B0F19]/90 border-white/10 text-slate-200' : 'bg-slate-100/90 border-slate-300 text-slate-800'
    }`}>
      {/* LEFT: TITLE & CAMERA PRESETS */}
      <div className="flex items-center space-x-3 overflow-x-auto no-scrollbar">
        <span className="flex items-center space-x-1.5 text-[#B59B6D] font-bold text-xs shrink-0">
          <Compass className="w-4 h-4 text-[#B59B6D] animate-spin-slow" />
          <span className="hidden sm:inline">DIGITAL TWIN ENGINE</span>
        </span>

        <span className="text-slate-600 hidden sm:inline">|</span>

        {/* Camera Presets Selector */}
        <div className="flex items-center bg-black/20 p-0.5 rounded-lg border border-white/10 space-x-1 shrink-0">
          <Camera className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
          {(['perspective', 'isometric', 'top', 'front', 'side', 'dollhouse'] as CameraPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => onUpdateSettings({ cameraPreset: preset })}
              className={`px-2 py-1 rounded text-[10px] font-medium uppercase transition ${
                settings.cameraPreset === preset
                  ? 'bg-[#B59B6D] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
              title={`Switch camera to ${preset}`}
            >
              {preset.slice(0, 4)}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: CONTROLS & TOGGLES */}
      <div className="flex items-center space-x-1.5 shrink-0">
        {/* Lighting Preset Selector */}
        <div className="hidden md:flex items-center bg-black/20 p-0.5 rounded-lg border border-white/10 space-x-1">
          <Sun className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5" />
          {(['studio', 'architecturalDay', 'sunset', 'cyberpunkNight', 'overcast'] as LightingPreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => onUpdateSettings({ lightingPreset: preset })}
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase transition ${
                settings.lightingPreset === preset
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {preset === 'architecturalDay' ? 'Day' : preset === 'cyberpunkNight' ? 'Night' : preset}
            </button>
          ))}
        </div>

        {/* Auto Rotate Toggle */}
        <button
          onClick={() => onUpdateSettings({ autoRotate: !settings.autoRotate })}
          className={`p-1.5 rounded-md border text-[10px] transition ${
            settings.autoRotate
              ? 'bg-[#B59B6D]/20 border-[#B59B6D] text-[#B59B6D]'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Toggle Auto Rotate"
        >
          {settings.autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Grid Toggle */}
        <button
          onClick={() => onUpdateSettings({ showGrid: !settings.showGrid })}
          className={`p-1.5 rounded-md border transition ${
            settings.showGrid
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Toggle Architectural Grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        {/* Wireframe Toggle */}
        <button
          onClick={() => onUpdateSettings({ showWireframe: !settings.showWireframe })}
          className={`p-1.5 rounded-md border transition ${
            settings.showWireframe
              ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Toggle Structural Wireframe"
        >
          <Box className="w-3.5 h-3.5" />
        </button>

        {/* Stats Toggle */}
        <button
          onClick={() => onUpdateSettings({ showStats: !settings.showStats })}
          className={`p-1.5 rounded-md border transition ${
            settings.showStats
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
          title="Toggle Real-Time Performance Stats"
        >
          <Activity className="w-3.5 h-3.5" />
        </button>

        {/* Reset Camera */}
        <button
          onClick={onResetCamera}
          className="p-1.5 rounded-md border border-white/10 text-slate-300 hover:bg-white/10 transition"
          title="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
