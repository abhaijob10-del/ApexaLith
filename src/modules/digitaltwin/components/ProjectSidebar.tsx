import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  Image, 
  Film, 
  Box, 
  FileCode, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Upload, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { ProjectData, UploadedProjectFile } from '../../firebase/firebaseService';
import { FileCard } from './FileCard';

interface ProjectSidebarProps {
  currentProject: ProjectData | null;
  projects: ProjectData[];
  projectFiles: UploadedProjectFile[];
  onSelectProject: (project: ProjectData) => void;
  onOpenUploadCenter: () => void;
  onOpenCreateModal: () => void;
  isDarkMode: boolean;
}

type FileCategory = 
  | 'Floor Plans'
  | 'CAD Files'
  | 'IFC Files'
  | 'Site Images'
  | 'Videos'
  | 'Interior References'
  | 'Exterior References';

const CATEGORIES: { name: FileCategory; icon: any }[] = [
  { name: 'Floor Plans', icon: FileText },
  { name: 'CAD Files', icon: FileCode },
  { name: 'IFC Files', icon: Box },
  { name: 'Site Images', icon: Image },
  { name: 'Videos', icon: Film },
  { name: 'Interior References', icon: Sparkles },
  { name: 'Exterior References', icon: Layers }
];

export const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  currentProject,
  projects,
  projectFiles,
  onSelectProject,
  onOpenUploadCenter,
  onOpenCreateModal,
  isDarkMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    'Floor Plans': true,
    'CAD Files': true,
    'IFC Files': true
  });
  const [activeTab, setActiveTab] = useState<'files' | 'info' | 'projects'>('files');

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const filteredFiles = projectFiles.filter(f => 
    f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.fileType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={`w-72 lg:w-80 h-full border-r flex flex-col shrink-0 transition-colors z-20 ${
      isDarkMode ? 'bg-[#0B0F19] border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
    }`}>
      {/* Sidebar Mode Tabs */}
      <div className={`p-2 border-b grid grid-cols-3 gap-1 text-[11px] font-bold uppercase tracking-wider ${
        isDarkMode ? 'border-white/10 bg-[#0F1420]' : 'border-slate-200 bg-white'
      }`}>
        <button
          onClick={() => setActiveTab('files')}
          className={`py-1.5 rounded transition text-center ${
            activeTab === 'files'
              ? 'bg-[#B59B6D] text-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Files
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`py-1.5 rounded transition text-center ${
            activeTab === 'info'
              ? 'bg-[#B59B6D] text-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Info
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`py-1.5 rounded transition text-center ${
            activeTab === 'projects'
              ? 'bg-[#B59B6D] text-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Projects
        </button>
      </div>

      {/* SEARCH & UPLOAD TRIGGER BAR */}
      <div className="p-3 space-y-2 border-b border-white/10">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search blueprints & CAD files..."
            className={`w-full pl-8 pr-3 py-1.5 rounded text-xs border focus:outline-none focus:border-[#B59B6D] transition ${
              isDarkMode
                ? 'bg-[#111622] border-white/10 text-white placeholder-slate-500'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <button
          onClick={onOpenUploadCenter}
          className="w-full py-2 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Center</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* TAB 1: PROJECT FILES */}
        {activeTab === 'files' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#B59B6D]">
              <span>Project Documents ({projectFiles.length})</span>
              <span className="font-mono text-slate-400">Phase 1 Storage</span>
            </div>

            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isOpen = !!openCategories[cat.name];
              const categoryFiles = filteredFiles.filter(f => f.category === cat.name);

              return (
                <div key={cat.name} className="space-y-1.5">
                  <button
                    onClick={() => toggleCategory(cat.name)}
                    className={`w-full p-2 rounded border flex items-center justify-between text-xs font-semibold transition ${
                      isDarkMode
                        ? 'bg-[#111622]/80 border-white/5 hover:border-white/20 text-slate-200'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <Icon className="w-3.5 h-3.5 text-[#B59B6D] shrink-0" />
                      <span className="truncate">{cat.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-[10px] text-slate-400">
                        {categoryFiles.length}
                      </span>
                    </div>
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="pl-2 space-y-1.5 pt-1">
                      {categoryFiles.length === 0 ? (
                        <div className="p-2 text-[11px] text-slate-500 italic border border-dashed border-white/5 rounded text-center">
                          No {cat.name.toLowerCase()} uploaded yet
                        </div>
                      ) : (
                        categoryFiles.map(file => (
                          <FileCard key={file.id} file={file} isDarkMode={isDarkMode} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: PROJECT INFORMATION */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded border border-[#B59B6D]/30 bg-[#B59B6D]/10 space-y-3">
              <div className="flex items-center space-x-2 text-[#B59B6D]">
                <Building2 className="w-5 h-5 shrink-0" />
                <h3 className="font-serif font-bold text-sm">
                  {currentProject?.projectName || 'No Active Project'}
                </h3>
              </div>

              <div className="space-y-2 text-xs divide-y divide-white/10 pt-1">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Client:</span>
                  <span className="font-semibold text-white">{currentProject?.clientName}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Project Type:</span>
                  <span className="font-semibold text-[#B59B6D]">{currentProject?.projectType}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Location:</span>
                  <span className="font-semibold text-white">{currentProject?.location}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Plot Size:</span>
                  <span className="font-semibold text-white">{currentProject?.plotSize}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Floors:</span>
                  <span className="font-semibold text-white">{currentProject?.numberOfFloors} Stories</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Design Style:</span>
                  <span className="font-semibold text-white">{currentProject?.preferredStyle}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Budget Range:</span>
                  <span className="font-semibold text-[#B59B6D]">{currentProject?.budgetRange}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded border border-white/10 bg-[#111622] space-y-2">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-[#B59B6D]" />
                <span>Phase 1 Digital Twin Storage</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Project metadata and CAD/BIM floor plans are securely stored in Firebase Storage and Cloud Firestore.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: RECENT PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#B59B6D]">
              <span>Recent Projects ({projects.length})</span>
              <button
                onClick={onOpenCreateModal}
                className="text-white hover:text-[#B59B6D] flex items-center space-x-1 text-[11px]"
              >
                <Plus className="w-3 h-3" />
                <span>Create</span>
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((p) => {
                const isSel = currentProject?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`p-3 rounded border cursor-pointer transition ${
                      isSel
                        ? 'bg-[#B59B6D]/20 border-[#B59B6D] text-white shadow-md'
                        : isDarkMode
                          ? 'bg-[#111622] border-white/10 hover:border-white/20 text-slate-300'
                          : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{p.projectName}</span>
                      {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-[#B59B6D]" />}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                      <span>{p.location}</span>
                      <span className="font-mono text-[#B59B6D]">{p.projectType}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER METADATA BADGE */}
      <div className={`p-3 border-t text-[10px] text-slate-400 flex items-center justify-between font-mono ${
        isDarkMode ? 'border-white/10 bg-[#0F1420]' : 'border-slate-200 bg-white'
      }`}>
        <span>ApexaLith CAD/BIM Engine</span>
        <span className="text-[#B59B6D] font-bold">Phase 1 Spec</span>
      </div>
    </aside>
  );
};
