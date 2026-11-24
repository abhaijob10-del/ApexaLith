import React from 'react';
import { ValidationReport, SupportedFileType } from '../types/BuildingModel';
import { 
  FileText, 
  FileCode, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Layers, 
  Image as ImageIcon,
  Compass,
  Building
} from 'lucide-react';

interface ProjectFilesPanelProps {
  files: {
    name: string;
    type: SupportedFileType;
    size: string;
    uploadedAt: string;
    status: string;
  }[];
  validationReport: ValidationReport | null;
  onFileUpload: (file: File) => void;
  isDarkMode?: boolean;
}

export const ProjectFilesPanel: React.FC<ProjectFilesPanelProps> = ({
  files,
  validationReport,
  onFileUpload,
  isDarkMode = true
}) => {
  const getFileIcon = (type: SupportedFileType) => {
    switch (type) {
      case 'IFC':
        return <Building className="w-4 h-4 text-emerald-400" />;
      case 'DXF':
      case 'DWG':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'PDF':
        return <FileText className="w-4 h-4 text-rose-400" />;
      case 'PNG':
      case 'JPEG':
        return <ImageIcon className="w-4 h-4 text-amber-400" />;
      default:
        return <Layers className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className={`p-4 rounded-sm border space-y-4 h-full flex flex-col justify-between ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#B59B6D]" />
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Project File Inspector
              </h3>
              <p className="text-[11px] text-white/50">
                Uploaded architectural drawings & model sources
              </p>
            </div>
          </div>

          <label className="p-1.5 rounded-sm bg-[#B59B6D] hover:bg-[#a3895c] text-black cursor-pointer transition flex items-center space-x-1 text-xs font-bold uppercase">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
              accept=".ifc,.dxf,.dwg,.pdf,.png,.jpg,.jpeg,.zip"
            />
          </label>
        </div>

        {/* Uploaded Files List */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold uppercase font-mono text-white/60">
            Active Project Drawings ({files.length})
          </div>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs font-mono">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="p-2 rounded-sm bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#B59B6D]/50 transition"
              >
                <div className="flex items-center space-x-2 truncate pr-2">
                  {getFileIcon(f.type)}
                  <span className="truncate text-white/90">{f.name}</span>
                </div>
                <div className="shrink-0 text-right text-[10px] text-white/50">
                  <span>{f.size}</span>
                  <span className="block text-emerald-400 font-bold">{f.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Missing Required Files / Low Confidence Warning Callout */}
        {validationReport && validationReport.requestedInformation.length > 0 && (
          <div className="p-3 rounded-sm bg-rose-500/10 border border-rose-500/30 space-y-2 text-xs">
            <div className="flex items-center justify-between text-rose-400 font-bold uppercase tracking-wider text-[11px]">
              <span className="flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Missing Required Files ({validationReport.requestedInformation.length})</span>
              </span>
              <span className="font-mono text-rose-300">{validationReport.confidenceScore}% Quality</span>
            </div>

            <p className="text-[10px] text-white/70 leading-relaxed">
              Confidence is below 80%. Upload these missing drawings to verify complete room boundaries, elevations, and orientations without guessing:
            </p>

            <div className="space-y-1.5 pt-1">
              {validationReport.requestedInformation.map((req) => (
                <div
                  key={req.id}
                  className="p-2 rounded-sm bg-black/60 border border-rose-500/20 text-[11px] space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{req.title}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-xs bg-rose-500/30 text-rose-200">
                      {req.isRequired ? 'Required' : 'Recommended'}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-snug">{req.description}</p>
                  <div className="text-[9px] font-mono text-[#B59B6D]">
                    Accepted Formats: {req.fileType.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Phase 4 Structural Assurance Footer */}
      <div className="p-2.5 rounded-sm bg-white/5 border border-white/10 text-[10px] font-mono text-white/50 space-y-1">
        <div className="flex items-center space-x-1.5 text-white/80 font-bold uppercase">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Phase 4 Non-Geometric Verification</span>
        </div>
        <p>No 3D meshes or digital twins rendered during verification.</p>
      </div>
    </div>
  );
};
