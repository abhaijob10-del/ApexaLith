import React from 'react';
import { RenderStats, SelectedObjectInfo } from '../types/renderingTypes';
import { Activity, Layers, Cpu, Box, X, AlertCircle, RefreshCw } from 'lucide-react';

interface ViewportOverlayProps {
  stats: RenderStats | null;
  showStats: boolean;
  selectedObject: SelectedObjectInfo | null;
  onClearSelection: () => void;
  loadingProgress: number | null;
  loadingMessage?: string;
  errorMessage?: string | null;
  onRetryLoading?: () => void;
}

export const ViewportOverlay: React.FC<ViewportOverlayProps> = ({
  stats,
  showStats,
  selectedObject,
  onClearSelection,
  loadingProgress,
  loadingMessage = 'Loading 3D Architectural Model...',
  errorMessage,
  onRetryLoading
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-4">
      {/* TOP ROW: STATS & SELECTED OBJECT BADGE */}
      <div className="flex items-start justify-between w-full">
        {/* STATS HUD PANEL */}
        {showStats && stats ? (
          <div className="pointer-events-auto bg-[#070A11]/85 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs font-mono text-slate-300 shadow-2xl max-w-xs space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5 text-[#B59B6D] font-bold">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>RENDER PERFORMANCE</span>
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                stats.fps >= 50 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {stats.fps} FPS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Triangles:</span>
                <span className="text-slate-200 font-semibold">{stats.triangles.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Draw Calls:</span>
                <span className="text-slate-200 font-semibold">{stats.drawCalls}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Geometries:</span>
                <span className="text-slate-200 font-semibold">{stats.geometries}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Textures:</span>
                <span className="text-slate-200 font-semibold">{stats.textures}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Frame Time:</span>
                <span className="text-slate-200 font-semibold">{stats.frameTimeMs} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VRAM/Heap:</span>
                <span className="text-slate-200 font-semibold">{stats.memoryMb} MB</span>
              </div>
            </div>
          </div>
        ) : <div />}

        {/* SELECTED OBJECT FLOATING BADGE */}
        {selectedObject && (
          <div className="pointer-events-auto bg-[#070A11]/90 backdrop-blur-md border border-[#B59B6D]/40 rounded-xl p-3 text-xs font-mono text-slate-200 shadow-2xl flex items-center space-x-3 animate-fadeIn">
            <div className="p-2 rounded-lg bg-[#B59B6D]/20 text-[#B59B6D]">
              <Box className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#B59B6D] uppercase font-semibold">SELECTED MESH</div>
              <div className="font-bold text-white text-sm">{selectedObject.name}</div>
              <div className="text-[11px] text-slate-400">{selectedObject.materialName} ({selectedObject.polygonCount} tris)</div>
            </div>
            <button
              onClick={onClearSelection}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* CENTER: LOADING PROGRESS / ERROR BANNER */}
      {loadingProgress !== null && loadingProgress < 100 && (
        <div className="pointer-events-auto self-center bg-[#070A11]/95 backdrop-blur-xl border border-white/15 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#B59B6D]/20 border border-[#B59B6D]/50 flex items-center justify-center text-[#B59B6D]">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-mono">{loadingMessage}</div>
            <div className="text-xs text-slate-400 mt-1">Initializing geometry buffers & PBR materials</div>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#B59B6D] to-amber-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-right text-[10px] font-mono text-[#B59B6D]">{loadingProgress}% COMPLETE</div>
        </div>
      )}

      {/* ERROR BANNER WITH RETRY */}
      {errorMessage && (
        <div className="pointer-events-auto self-center bg-red-950/90 border border-red-500/50 rounded-2xl p-5 shadow-2xl max-w-md w-full text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <div className="text-sm font-bold text-white font-mono">3D Asset Loading Failed</div>
          <div className="text-xs text-red-200">{errorMessage}</div>
          {onRetryLoading && (
            <button
              onClick={onRetryLoading}
              className="px-4 py-2 rounded-xl bg-red-800 hover:bg-red-700 text-white font-mono text-xs font-semibold flex items-center space-x-2 mx-auto transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Load Asset</span>
            </button>
          )}
        </div>
      )}

      {/* BOTTOM ROW: NAVIGATION HINT */}
      <div className="flex items-end justify-between w-full font-mono text-[10px] text-slate-500">
        <div className="bg-[#070A11]/60 backdrop-blur px-2.5 py-1 rounded-md border border-white/5">
          <span>LEFT CLICK: ROTATE | RIGHT CLICK: PAN | SCROLL: ZOOM</span>
        </div>
        <div className="bg-[#070A11]/60 backdrop-blur px-2.5 py-1 rounded-md border border-white/5 text-[#B59B6D]">
          <span>APEXALITH 3D ENGINE v2.0</span>
        </div>
      </div>
    </div>
  );
};
