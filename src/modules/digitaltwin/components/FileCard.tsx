import React from 'react';
import { FileText, Image, Film, Box, FileCode, CheckCircle2, Download, Trash2 } from 'lucide-react';
import { UploadedProjectFile } from '../../firebase/firebaseService';

interface FileCardProps {
  file: UploadedProjectFile;
  isDarkMode?: boolean;
  onDelete?: (id: string) => void;
}

export const FileCard: React.FC<FileCardProps> = ({ file, isDarkMode = true, onDelete }) => {
  const getFileIcon = (fileType: string) => {
    const t = fileType.toUpperCase();
    if (t === 'PDF') return FileText;
    if (['PNG', 'JPG', 'JPEG', 'WEBP'].includes(t)) return Image;
    if (['MP4', 'MOV', 'AVI'].includes(t)) return Film;
    if (['IFC', 'RVT'].includes(t)) return Box;
    if (['DWG', 'DXF'].includes(t)) return FileCode;
    return FileText;
  };

  const IconComponent = getFileIcon(file.fileType);

  return (
    <div className={`p-3 rounded border transition-all duration-200 flex items-center justify-between group ${
      isDarkMode 
        ? 'bg-[#111622] border-white/10 hover:border-[#B59B6D]/50 hover:bg-[#161d2d]' 
        : 'bg-white border-slate-200 hover:border-[#B59B6D] hover:bg-slate-50 shadow-sm'
    }`}>
      <div className="flex items-center space-x-3 overflow-hidden">
        <div className="w-8 h-8 rounded bg-[#B59B6D]/15 border border-[#B59B6D]/30 flex items-center justify-center text-[#B59B6D] shrink-0">
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="truncate">
          <div className="text-xs font-semibold truncate group-hover:text-[#B59B6D] transition">
            {file.fileName}
          </div>
          <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
            <span className="font-mono text-[#B59B6D]">{file.fileType}</span>
            <span>•</span>
            <span>{file.formattedSize}</span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center space-x-0.5">
              <CheckCircle2 className="w-2.5 h-2.5" />
              <span>{file.status}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 shrink-0">
        {file.downloadUrl && file.downloadUrl !== '#' && (
          <a
            href={file.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </a>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(file.id)}
            className="p-1.5 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition"
            title="Remove file"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
