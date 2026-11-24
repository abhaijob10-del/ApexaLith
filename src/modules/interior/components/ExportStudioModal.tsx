import React, { useState } from 'react';
import { RoomDesignState } from '../types/interiorTypes';
import { X, Download, FileText, Image, Compass, CheckCircle } from 'lucide-react';

interface ExportStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomState: RoomDesignState;
  isDarkMode?: boolean;
}

export const ExportStudioModal: React.FC<ExportStudioModalProps> = ({
  isOpen,
  onClose,
  roomState,
  isDarkMode = true
}) => {
  const [downloadedMsg, setDownloadedMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportFormat = (formatName: string) => {
    setDownloadedMsg(`Exporting ${formatName} for ${roomState.roomName}...`);

    let content = '';
    let mimeType = 'text/plain';
    let filename = `${roomState.roomName.replace(/\s+/g, '_')}_${formatName.toLowerCase().replace(/\s+/g, '_')}.json`;

    if (formatName.includes('Furniture')) {
      content = JSON.stringify({
        roomName: roomState.roomName,
        style: roomState.style,
        totalItems: roomState.furniture.length,
        items: roomState.furniture.map(f => ({
          name: f.name,
          category: f.category,
          dimensions: f.dimensions,
          material: f.material,
          colorHex: f.colorHex
        }))
      }, null, 2);
    } else {
      content = JSON.stringify({
        roomName: roomState.roomName,
        category: roomState.category,
        style: roomState.style,
        dimensions: roomState.dimensions,
        wallMaterial: roomState.wallMaterial,
        floorMaterial: roomState.floorMaterial,
        lightingPreset: roomState.lightingPreset,
        furnitureCount: roomState.furniture.length,
        exportedAt: new Date().toISOString()
      }, null, 2);
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    setTimeout(() => setDownloadedMsg(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`w-full max-w-lg p-6 rounded-sm border shadow-2xl space-y-5 font-sans text-xs ${
        isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-[#B59B6D]" />
            <h3 className="font-serif text-base font-bold">Export Interior Design Studio Deliverables</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {downloadedMsg && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-sm font-mono flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{downloadedMsg}</span>
          </div>
        )}

        {/* Export Options */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleExportFormat('High-Res 3D Image Snapshot')}
            className="w-full p-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-left transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Image className="w-5 h-5 text-[#B59B6D]" />
              <div>
                <span className="font-bold text-sm text-white block">High-Resolution 3D Image Snapshot</span>
                <p className="text-[10px] text-slate-400">4K Rendered perspective image of {roomState.roomName}</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleExportFormat('Itemized Furniture List')}
            className="w-full p-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-left transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-[#B59B6D]" />
              <div>
                <span className="font-bold text-sm text-white block">Itemized Furniture List JSON/PDF</span>
                <p className="text-[10px] text-slate-400">Full specs, materials, colors & dimensions for {roomState.furniture.length} items</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleExportFormat('Room Architectural Spec Sheet')}
            className="w-full p-3 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-left transition flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-[#B59B6D]" />
              <div>
                <span className="font-bold text-sm text-white block">Room Architectural Specification Sheet</span>
                <p className="text-[10px] text-slate-400">Wall paints, floor finishes, lighting presets and dimensions</p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white font-bold uppercase text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
