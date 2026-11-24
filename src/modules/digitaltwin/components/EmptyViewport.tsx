import React from 'react';
import { 
  Upload, 
  FolderPlus, 
  Eye, 
  Box, 
  Layers, 
  Compass, 
  Sparkles, 
  Ruler, 
  FileCode, 
  Grid 
} from 'lucide-react';

interface EmptyViewportProps {
  onOpenUploadCenter: () => void;
  onOpenCreateProject: () => void;
  onViewDemo: () => void;
  isDarkMode?: boolean;
}

export const EmptyViewport: React.FC<EmptyViewportProps> = ({
  onOpenUploadCenter,
  onOpenCreateProject,
  onViewDemo,
  isDarkMode = true
}) => {
  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-6 select-none overflow-hidden bg-[#070A11] text-white">
      {/* ARCHITECTURAL CAD GRID BACKGROUND */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(181, 155, 109, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(181, 155, 109, 0.15) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px'
        }}
      />

      {/* RADIAL CENTER GLOW */}
      <div className="absolute w-[600px] h-[600px] rounded-full bg-[#B59B6D]/10 blur-3xl pointer-events-none" />

      {/* TOP-LEFT VIEWPORT STATUS INDICATOR */}
      <div className="absolute top-4 left-4 z-10 flex items-center space-x-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded bg-[#0F1420]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>VIEWPORT: STANDBY (0 GEOMETRY MESHES)</span>
        </div>
      </div>

      {/* TOP-RIGHT VIEWPORT CONTROLS OVERLAY */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded bg-[#0F1420]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-[#B59B6D] flex items-center space-x-2">
          <Grid className="w-3 h-3" />
          <span>GRID: 1.0m • ORTHO GRID ACTIVE</span>
        </div>
      </div>

      {/* CENTER EMPTY STATE HERO CARD */}
      <div className="relative z-20 max-w-lg w-full text-center space-y-6 p-8 rounded-lg border border-white/10 bg-[#0D121D]/90 backdrop-blur-xl shadow-2xl shadow-black/80">
        
        {/* Architectural Vector Icon Blueprint Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#B59B6D]/20 to-[#B59B6D]/5 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D] shadow-lg shadow-[#B59B6D]/10 group">
          <Compass className="w-10 h-10 animate-spin-slow" />
          <Ruler className="w-5 h-5 absolute -bottom-1 -right-1 text-white bg-[#B59B6D] p-1 rounded-md" />
        </div>

        {/* Header Text */}
        <div className="space-y-2">
          <span className="px-2.5 py-0.5 rounded-full border border-[#B59B6D]/40 bg-[#B59B6D]/10 text-[#B59B6D] text-[10px] font-bold uppercase tracking-[0.2em]">
            Digital Twin Studio
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
            No Building Loaded
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light max-w-md mx-auto">
            Upload your floor plan or BIM/CAD file to begin generating your Digital Twin.
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenUploadCenter}
            className="w-full sm:w-auto px-5 py-2.5 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.15em] transition flex items-center justify-center space-x-2 shadow-lg shadow-[#B59B6D]/20"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Files</span>
          </button>

          <button
            onClick={onOpenCreateProject}
            className="w-full sm:w-auto px-5 py-2.5 rounded border border-[#B59B6D]/40 bg-[#B59B6D]/10 hover:bg-[#B59B6D]/20 text-[#B59B6D] font-bold text-xs uppercase tracking-[0.15em] transition flex items-center justify-center space-x-2"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Create Project</span>
          </button>

          <button
            onClick={onViewDemo}
            className="w-full sm:w-auto px-5 py-2.5 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs uppercase tracking-[0.15em] transition flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4 text-slate-400" />
            <span>View Demo</span>
          </button>
        </div>

        {/* Accepted Specifications Footnote */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="text-slate-500">Supported Formats:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">PDF</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">DWG</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">DXF</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">IFC</span>
          <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">PNG/JPG</span>
        </div>
      </div>

      {/* BOTTOM-LEFT CARTESIAN AXIS GIZMO ILLUSTRATION */}
      <div className="absolute bottom-4 left-4 z-10 p-3 rounded bg-[#0F1420]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono space-y-1.5 pointer-events-none">
        <div className="text-slate-400 font-bold">SPATIAL AXIS ORIGIN</div>
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-red-400 font-bold">X+ (0.00m)</span>
          <span className="text-emerald-400 font-bold">Y+ (0.00m)</span>
          <span className="text-sky-400 font-bold">Z+ (0.00m)</span>
        </div>
      </div>

      {/* BOTTOM-RIGHT SCALE FOOTER */}
      <div className="absolute bottom-4 right-4 z-10 p-3 rounded bg-[#0F1420]/80 border border-white/10 backdrop-blur-md text-[10px] font-mono text-slate-400 pointer-events-none">
        ApexaLith Digital Twin Workspace • Phase 1 Core Architecture
      </div>
    </div>
  );
};
