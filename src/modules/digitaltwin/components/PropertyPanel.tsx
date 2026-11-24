import React from 'react';
import { 
  Building2, 
  Layers, 
  Upload, 
  Sparkles, 
  Box, 
  Cpu, 
  CheckCircle2, 
  SlidersHorizontal,
  Ruler,
  Maximize2
} from 'lucide-react';
import { ProjectData, UploadedProjectFile } from '../../firebase/firebaseService';
import { SelectedObjectInfo } from '../../../components/3d/types/renderingTypes';

interface PropertyPanelProps {
  currentProject: ProjectData | null;
  projectFiles: UploadedProjectFile[];
  selectedObject?: SelectedObjectInfo | null;
  onOpenUploadCenter: () => void;
  isDarkMode?: boolean;
}

export const PropertyPanel: React.FC<PropertyPanelProps> = ({
  currentProject,
  projectFiles,
  selectedObject,
  onOpenUploadCenter,
  isDarkMode = true
}) => {
  return (
    <aside className={`w-80 lg:w-88 h-full border-l flex flex-col shrink-0 overflow-y-auto transition-colors z-20 ${
      isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* PANEL HEADER */}
      <div className={`p-3.5 border-b flex items-center justify-between ${
        isDarkMode ? 'border-white/10 bg-[#0F1420]' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center space-x-2 text-[#B59B6D] font-bold text-xs uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Properties Panel</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
          Phase 2 Engine
        </span>
      </div>

      <div className="p-4 space-y-5">
        {/* 1. SELECTED 3D OBJECT PROPERTIES */}
        <div className="p-3.5 rounded-lg border border-[#B59B6D]/30 bg-[#111622] space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59B6D] flex items-center space-x-1">
              <Box className="w-3.5 h-3.5" />
              <span>3D Object Inspector</span>
            </span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
              selectedObject ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {selectedObject ? 'Active Mesh' : 'No Selection'}
            </span>
          </div>

          {selectedObject ? (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2 rounded bg-white/5 border border-white/5">
                <div className="text-[10px] text-[#B59B6D] uppercase">Element Name</div>
                <div className="font-bold text-white text-sm mt-0.5">{selectedObject.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">Material</span>
                  <span className="text-amber-300 font-semibold truncate block">{selectedObject.materialName}</span>
                </div>
                <div className="p-2 rounded bg-white/5">
                  <span className="text-slate-400 block text-[9px] uppercase">Polygons</span>
                  <span className="text-slate-200 font-semibold block">{selectedObject.polygonCount} tris</span>
                </div>
              </div>

              <div className="p-2 rounded bg-white/5 space-y-1">
                <div className="flex items-center space-x-1 text-[10px] text-[#B59B6D] uppercase font-bold">
                  <Ruler className="w-3 h-3" />
                  <span>Physical Bounding Box (Meters)</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                  <div className="p-1 rounded bg-black/30">X: <span className="text-white font-bold">{selectedObject.dimensions.x}m</span></div>
                  <div className="p-1 rounded bg-black/30">Y: <span className="text-white font-bold">{selectedObject.dimensions.y}m</span></div>
                  <div className="p-1 rounded bg-black/30">Z: <span className="text-white font-bold">{selectedObject.dimensions.z}m</span></div>
                </div>
              </div>

              <div className="p-2 rounded bg-white/5 space-y-1">
                <div className="flex items-center space-x-1 text-[10px] text-slate-400 uppercase font-bold">
                  <Maximize2 className="w-3 h-3 text-slate-400" />
                  <span>World Coordinates</span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-300">
                  <div>X: {selectedObject.position.x}</div>
                  <div>Y: {selectedObject.position.y}</div>
                  <div>Z: {selectedObject.position.z}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded bg-white/5 border border-dashed border-white/10 text-center space-y-1">
              <p className="text-xs text-slate-400 italic">Click any object in 3D viewport to inspect properties</p>
            </div>
          )}
        </div>

        {/* 2. PROJECT INFORMATION */}
        <div className="p-3.5 rounded-lg border border-white/10 bg-[#111622] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59B6D] flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Project Information</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">
              Synced
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Project Name:</span>
              <span className="font-bold text-white text-right max-w-[150px] truncate">
                {currentProject?.projectName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Client Name:</span>
              <span className="font-semibold text-slate-200 text-right truncate">
                {currentProject?.clientName || 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Type:</span>
              <span className="font-bold text-[#B59B6D]">{currentProject?.projectType || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Location:</span>
              <span className="text-slate-300">{currentProject?.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Budget Range:</span>
              <span className="font-bold text-[#B59B6D]">{currentProject?.budgetRange || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* 3. BUILDING SPECIFICATIONS */}
        <div className="p-3.5 rounded-lg border border-white/10 bg-[#111622] space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59B6D] flex items-center space-x-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Building Specifications</span>
          </span>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">Plot Area</div>
              <div className="font-bold text-white mt-0.5">{currentProject?.plotSize || 'N/A'}</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5">
              <div className="text-[10px] text-slate-400">Total Floors</div>
              <div className="font-bold text-white mt-0.5">{currentProject?.numberOfFloors || '0'} Stories</div>
            </div>
            <div className="p-2 rounded bg-white/5 border border-white/5 col-span-2">
              <div className="text-[10px] text-slate-400">Preferred Design Style</div>
              <div className="font-bold text-[#B59B6D] mt-0.5">{currentProject?.preferredStyle || 'N/A'}</div>
            </div>
          </div>
        </div>

        {/* 4. UPLOAD STATUS */}
        <div className="p-3.5 rounded-lg border border-white/10 bg-[#111622] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B59B6D] flex items-center space-x-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Status</span>
            </span>
            <span className="text-[10px] font-mono text-[#B59B6D] font-bold">
              {projectFiles.length} Files
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Firebase Storage Vault</span>
              <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Ready</span>
              </span>
            </div>

            <button
              onClick={onOpenUploadCenter}
              className="w-full py-1.5 rounded border border-[#B59B6D]/40 bg-[#B59B6D]/10 hover:bg-[#B59B6D]/20 text-[#B59B6D] font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Add Blueprint Files</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
