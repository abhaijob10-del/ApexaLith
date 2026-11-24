import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  Box, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Layers
} from 'lucide-react';
import { UploadedFile, FileType } from '../types/bim';
import { BimParserService } from '../services/bimParserService';

export interface BimUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onParseComplete: (files: UploadedFile[]) => void;
  isDarkMode: boolean;
}

export const BimUploadModal: React.FC<BimUploadModalProps> = ({
  isOpen,
  onClose,
  onParseComplete,
  isDarkMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([
    {
      id: 'f_01',
      name: 'Ground_Floor_Architectural_Plan_v2.dwg',
      type: 'DWG',
      category: 'floorplan',
      url: '/uploads/cad/Ground_Floor_Architectural_Plan_v2.dwg',
      uploadedAt: 'Just now',
      sizeBytes: 4250000
    },
    {
      id: 'f_02',
      name: 'Site_Drone_Photo_North.jpg',
      type: 'JPEG',
      category: 'site_image',
      url: '/uploads/site-images/Site_Drone_Photo_North.jpg',
      uploadedAt: 'Just now',
      sizeBytes: 1850000
    }
  ]);

  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<UploadedFile['category']>('floorplan');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  if (!isOpen) return null;

  const missingPrompts = BimParserService.evaluateFileCompleteness(uploadedFiles);

  const processUploadedFilesList = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    const newFiles: UploadedFile[] = filesArray.map((file) => {
      const nameLower = file.name.toLowerCase();
      let ext = file.name.split('.').pop()?.toUpperCase() || 'DWG';
      let fileType: FileType = 'DWG';

      if (ext === 'PNG') fileType = 'PNG';
      else if (ext === 'JPG' || ext === 'JPEG') fileType = 'JPEG';
      else if (ext === 'DWG') fileType = 'DWG';
      else if (ext === 'DXF') fileType = 'DXF';
      else if (ext === 'IFC') fileType = 'IFC';
      else if (ext === 'RVT' || ext === 'RFA' || ext === 'REVIT') fileType = 'Revit';
      else if (ext === 'MP4' || ext === 'MOV' || ext === 'AVI') fileType = 'Video';
      else if (ext === 'PDF') fileType = 'PDF';
      else fileType = 'DWG';

      let inferredCat: UploadedFile['category'] = selectedCategory;

      if (
        nameLower.includes('plan') || 
        nameLower.includes('floor') || 
        nameLower.includes('level') || 
        nameLower.includes('layout') || 
        nameLower.includes('blueprint') || 
        nameLower.includes('drawing') || 
        nameLower.includes('schematic')
      ) {
        inferredCat = 'floorplan';
      } else if (
        nameLower.includes('site') || 
        nameLower.includes('drone') || 
        nameLower.includes('photo') || 
        nameLower.includes('aerial') || 
        nameLower.includes('land')
      ) {
        inferredCat = 'site_image';
      } else if (
        nameLower.includes('elevation') || 
        nameLower.includes('facade') || 
        nameLower.includes('exterior') || 
        nameLower.includes('section')
      ) {
        inferredCat = 'exterior_ref';
      } else if (
        nameLower.includes('ifc') || 
        nameLower.includes('revit') || 
        nameLower.includes('rvt') || 
        nameLower.includes('3d') || 
        nameLower.includes('cad') || 
        nameLower.includes('bim')
      ) {
        inferredCat = 'cad';
      } else {
        inferredCat = selectedCategory;
      }

      return {
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        name: file.name,
        type: fileType,
        category: inferredCat,
        url: URL.createObjectURL(file),
        uploadedAt: 'Just now',
        sizeBytes: file.size && file.size > 0 ? file.size : 2800000
      };
    });

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    processUploadedFilesList(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFilesList(e.dataTransfer.files);
    }
  };

  const handleAddSampleCad = (sampleType: 'dwg' | 'ifc' | 'dxf' | 'pdf' | 'elevation') => {
    let sampleFile: UploadedFile;
    if (sampleType === 'dwg') {
      sampleFile = {
        id: 'f_' + Math.random().toString(36).substring(2, 8),
        name: 'Master_Villa_Structural_Plan_Level01.dwg',
        type: 'DWG',
        category: 'floorplan',
        url: '/uploads/cad/Master_Villa_Structural_Plan_Level01.dwg',
        uploadedAt: 'Just now',
        sizeBytes: 5800000
      };
    } else if (sampleType === 'ifc') {
      sampleFile = {
        id: 'f_' + Math.random().toString(36).substring(2, 8),
        name: 'Full_Building_BIM_Model_v4.ifc',
        type: 'IFC',
        category: 'cad',
        url: '/uploads/cad/Full_Building_BIM_Model_v4.ifc',
        uploadedAt: 'Just now',
        sizeBytes: 12400000
      };
    } else if (sampleType === 'dxf') {
      sampleFile = {
        id: 'f_' + Math.random().toString(36).substring(2, 8),
        name: 'Site_Boundary_Vector_Layout.dxf',
        type: 'DXF',
        category: 'dimensions',
        url: '/uploads/cad/Site_Boundary_Vector_Layout.dxf',
        uploadedAt: 'Just now',
        sizeBytes: 3100000
      };
    } else if (sampleType === 'elevation') {
      sampleFile = {
        id: 'f_' + Math.random().toString(36).substring(2, 8),
        name: 'South_Facade_Elevation_Drawings.dwg',
        type: 'DWG',
        category: 'exterior_ref',
        url: '/uploads/cad/South_Facade_Elevation_Drawings.dwg',
        uploadedAt: 'Just now',
        sizeBytes: 4100000
      };
    } else {
      sampleFile = {
        id: 'f_' + Math.random().toString(36).substring(2, 8),
        name: 'Architectural_Permit_Blueprints.pdf',
        type: 'PDF',
        category: 'floorplan',
        url: '/uploads/cad/Architectural_Permit_Blueprints.pdf',
        uploadedAt: 'Just now',
        sizeBytes: 2800000
      };
    }
    setUploadedFiles(prev => [...prev, sampleFile]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleStartAiParsing = () => {
    setIsParsing(true);
    setTimeout(() => {
      setIsParsing(false);
      onParseComplete(uploadedFiles);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-sm border overflow-hidden flex flex-col shadow-2xl ${
        isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D]">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">BIM & CAD File Upload Engine</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Upload floor plans, DWG, IFC, site photos & property drawings for AI Digital Twin parsing.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 transition text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* File Category Selection Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Select Document Classification Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'floorplan', label: '2D Floor Plan (DWG/PDF)', icon: Layers },
                { id: 'site_image', label: 'Site / Drone Photo', icon: ImageIcon },
                { id: 'cad', label: 'CAD / IFC Model', icon: Box },
                { id: 'exterior_ref', label: 'Elevation / Exterior Ref', icon: FileText }
              ].map((cat) => {
                const Icon = cat.icon;
                const isSel = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`p-3 rounded-sm border text-left transition flex items-center space-x-2 ${
                      isSel 
                        ? 'bg-[#B59B6D] text-black border-[#B59B6D] font-bold' 
                        : isDarkMode ? 'border-white/10 bg-white/5 hover:border-white/20' : 'border-slate-300 bg-slate-100 hover:border-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-8 border-2 border-dashed rounded-sm text-center transition flex flex-col items-center justify-center space-y-3 cursor-pointer ${
              isDragOver 
                ? 'border-[#B59B6D] bg-[#B59B6D]/10 ring-2 ring-[#B59B6D]/30' 
                : isDarkMode ? 'border-white/20 bg-white/5 hover:border-[#B59B6D]' : 'border-slate-300 bg-slate-50 hover:border-[#B59B6D]'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleSimulateFileUpload}
              className="hidden"
              accept="*"
              multiple
            />
            <div className="p-4 rounded-full bg-[#B59B6D]/20 text-[#B59B6D]">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold">
                Drag & drop architectural drawings here or <span className="text-[#B59B6D] underline">browse files</span>
              </p>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Supports DWG, DXF, IFC, Revit (RVT), PDF, PNG, JPEG, and MP4 Site Videos (All CAD/BIM Formats)
              </p>
            </div>
          </div>

          {/* Quick Demo CAD Sample Attachments */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Quick Test: Insert Sample Architectural CAD Drawings</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleAddSampleCad('dwg')}
                className="px-2.5 py-1.5 rounded border border-[#B59B6D]/40 bg-[#B59B6D]/10 hover:bg-[#B59B6D]/20 text-[#B59B6D] font-mono transition flex items-center space-x-1.5"
              >
                <span>+</span>
                <span>Floorplan DWG</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleCad('ifc')}
                className="px-2.5 py-1.5 rounded border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-mono transition flex items-center space-x-1.5"
              >
                <span>+</span>
                <span>3D Building IFC</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleCad('dxf')}
                className="px-2.5 py-1.5 rounded border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono transition flex items-center space-x-1.5"
              >
                <span>+</span>
                <span>Site Layout DXF</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleCad('elevation')}
                className="px-2.5 py-1.5 rounded border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 font-mono transition flex items-center space-x-1.5"
              >
                <span>+</span>
                <span>Elevation DWG</span>
              </button>
            </div>
          </div>

          {/* Uploaded File List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Uploaded Files ({uploadedFiles.length})
            </h4>

            {uploadedFiles.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No files uploaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className={`p-3 rounded-sm border flex items-center justify-between text-xs ${
                      isDarkMode ? 'bg-[#121824] border-white/10' : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <FileText className="w-4 h-4 text-[#B59B6D] shrink-0" />
                      <div className="truncate">
                        <div className="font-bold truncate">{file.name}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">
                          {file.type} • {file.sizeBytes >= 1048576 ? (file.sizeBytes / 1048576).toFixed(2) + ' MB' : (file.sizeBytes / 1024).toFixed(0) + ' KB'} • {file.category}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="p-1 text-slate-400 hover:text-red-400 transition"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Intelligent Verification Prompts */}
          {missingPrompts.length > 0 && (
            <div className={`p-4 rounded-sm border space-y-3 ${
              isDarkMode ? 'bg-amber-950/20 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <AlertCircle className="w-4 h-4" />
                <span>AI Architectural File Completeness Audit</span>
              </div>

              <p className="text-xs">
                To guarantee millimeter accuracy in the 3D Digital Twin without inventing structural geometry, our AI recommends uploading the following additional drawings:
              </p>

              <div className="space-y-2">
                {missingPrompts.map((prompt) => (
                  <div key={prompt.id} className="p-2.5 rounded bg-black/40 border border-amber-500/20 text-xs flex justify-between items-start gap-2">
                    <div>
                      <div className="font-bold text-amber-300">{prompt.title}</div>
                      <div className="text-[11px] opacity-80 mt-0.5">{prompt.description}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase shrink-0">
                      {prompt.isMandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <CheckCircle2 className="w-4 h-4 text-[#B59B6D]" />
            <span>Files ready for 3D BIM Extraction</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-sm border text-xs font-bold uppercase tracking-wider border-slate-500 text-slate-300 hover:bg-white/10"
            >
              Cancel
            </button>

            <button
              onClick={handleStartAiParsing}
              disabled={isParsing || uploadedFiles.length === 0}
              className={`px-6 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black text-xs font-bold uppercase tracking-wider transition flex items-center space-x-2 shadow-lg disabled:opacity-50`}
            >
              {isParsing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Parsing BIM Geometry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Digital Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
