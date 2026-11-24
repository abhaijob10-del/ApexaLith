import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  FileCode, 
  Box, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';
import { firebaseService, UploadedProjectFile } from '../../firebase/firebaseService';

interface UploadCenterProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (newFile: UploadedProjectFile) => void;
  isDarkMode?: boolean;
}

type FileCategory = 
  | 'Floor Plans'
  | 'CAD Files'
  | 'IFC Files'
  | 'Site Images'
  | 'Videos'
  | 'Interior References'
  | 'Exterior References';

const ALLOWED_EXTENSIONS = ['pdf', 'png', 'jpg', 'jpeg', 'dwg', 'dxf', 'ifc', 'zip'];

export const UploadCenter: React.FC<UploadCenterProps> = ({
  projectId,
  isOpen,
  onClose,
  onUploadSuccess,
  isDarkMode = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FileCategory>('Floor Plans');
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<UploadedProjectFile[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrorMessage(`File "${file.name}" format .${ext} is not allowed. Supported: PDF, PNG, JPEG, DWG, DXF, IFC, ZIP.`);
        continue;
      }

      setUploading(true);
      setUploadProgress(10);

      try {
        const uploaded = await firebaseService.uploadProjectFile(
          file,
          projectId,
          selectedCategory,
          (prog) => setUploadProgress(Math.round(prog))
        );

        setRecentUploads(prev => [uploaded, ...prev]);
        onUploadSuccess(uploaded);
      } catch (err: any) {
        console.error('Upload error:', err);
        setErrorMessage('Upload failed. Please check network connection.');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className={`relative max-w-xl w-full rounded-lg border p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-[#0D121D] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                Firebase Storage Vault
              </span>
              <h3 className="font-serif text-xl font-bold">
                Digital Twin Upload Center
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Select Document Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {(
              [
                'Floor Plans',
                'CAD Files',
                'IFC Files',
                'Site Images',
                'Videos',
                'Interior References',
                'Exterior References'
              ] as FileCategory[]
            ).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1.5 rounded border text-left truncate transition ${
                  selectedCategory === cat
                    ? 'bg-[#B59B6D] text-black border-[#B59B6D] font-bold shadow'
                    : isDarkMode
                      ? 'bg-[#111622] border-white/10 text-slate-300 hover:border-white/30'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Drag & Drop Card */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. Drag & Drop Architectural File
          </label>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 rounded-lg border-2 border-dashed text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center space-y-3 ${
              dragActive
                ? 'border-[#B59B6D] bg-[#B59B6D]/15 scale-[0.99]'
                : isDarkMode
                  ? 'border-white/15 bg-[#111622]/60 hover:border-[#B59B6D]/60 hover:bg-[#111622]'
                  : 'border-slate-300 bg-slate-50 hover:border-[#B59B6D]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf,.ifc,.zip"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div className="w-12 h-12 rounded-full bg-[#B59B6D]/10 border border-[#B59B6D]/30 flex items-center justify-center text-[#B59B6D]">
              <Upload className="w-6 h-6 animate-bounce-slow" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                Drag & Drop floor plan or CAD/BIM file here
              </p>
              <p className="text-xs text-slate-400">
                or click to browse from local workstation
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-[10px] font-mono">
              {['PDF', 'DWG', 'DXF', 'IFC', 'PNG', 'JPEG', 'ZIP'].map(ext => (
                <span key={ext} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#B59B6D]">
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="p-4 rounded border border-[#B59B6D]/40 bg-[#B59B6D]/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#B59B6D]">
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Firebase Storage...</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#B59B6D] transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Recent Uploads List */}
        {recentUploads.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-[#B59B6D] uppercase tracking-wider">
              Successfully Uploaded to Storage ({recentUploads.length})
            </span>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {recentUploads.map((up) => (
                <div key={up.id} className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-center justify-between">
                  <div className="truncate">
                    <span className="font-bold text-white">{up.fileName}</span>
                    <span className="ml-2 text-[10px] text-slate-400">({up.formattedSize})</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
