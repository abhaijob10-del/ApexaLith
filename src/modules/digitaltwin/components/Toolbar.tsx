import React, { useState } from 'react';
import { 
  Building2, 
  Save, 
  Share2, 
  Bell, 
  User, 
  Plus, 
  Upload, 
  Check, 
  ChevronDown, 
  Sparkles,
  FolderKanban
} from 'lucide-react';
import { ProjectData } from '../../firebase/firebaseService';

interface ToolbarProps {
  currentProject: ProjectData | null;
  projects: ProjectData[];
  onSelectProject: (project: ProjectData) => void;
  onOpenCreateModal: () => void;
  onOpenUploadCenter: () => void;
  isDarkMode: boolean;
  onToggleTheme?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onOpenCreateModal,
  onOpenUploadCenter,
  isDarkMode
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className={`h-14 px-4 sm:px-6 border-b flex items-center justify-between shrink-0 z-30 transition-colors backdrop-blur-md ${
      isDarkMode 
        ? 'bg-[#0B0F19]/90 border-white/10 text-white' 
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* LEFT: Branding & Current Project Selector */}
      <div className="flex items-center space-x-4">
        {/* ApexaLith Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#B59B6D] to-[#8A7246] flex items-center justify-center text-black font-extrabold text-sm shadow-md shadow-[#B59B6D]/20">
            A
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-wide bg-gradient-to-r from-white via-slate-200 to-[#B59B6D] bg-clip-text text-transparent">
              ApexaLith
            </span>
            <span className="ml-2 text-[9px] font-mono uppercase tracking-widest text-[#B59B6D] font-bold border border-[#B59B6D]/30 px-1.5 py-0.2 rounded bg-[#B59B6D]/10">
              Studio
            </span>
          </div>
        </div>

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        {/* Project Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
            className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center space-x-2 transition ${
              isDarkMode
                ? 'bg-[#111622] border-white/15 hover:border-[#B59B6D]/60 text-slate-200'
                : 'bg-slate-100 border-slate-300 hover:border-[#B59B6D] text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#B59B6D]" />
            <span className="max-w-[160px] sm:max-w-[220px] truncate">
              {currentProject ? currentProject.projectName : 'Select Project'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isProjectDropdownOpen && (
            <div className={`absolute top-full left-0 mt-1 w-72 rounded border shadow-2xl p-2 z-50 space-y-1 ${
              isDarkMode ? 'bg-[#0F1420] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[#B59B6D] tracking-wider flex items-center justify-between">
                <span>Active Projects ({projects.length})</span>
                <button
                  onClick={() => {
                    setIsProjectDropdownOpen(false);
                    onOpenCreateModal();
                  }}
                  className="text-white hover:text-[#B59B6D] flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      setIsProjectDropdownOpen(false);
                    }}
                    className={`p-2 rounded text-xs cursor-pointer flex items-center justify-between transition ${
                      currentProject?.id === p.id
                        ? 'bg-[#B59B6D]/20 text-[#B59B6D] font-bold'
                        : isDarkMode
                          ? 'hover:bg-white/5 text-slate-300'
                          : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="truncate">{p.projectName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{p.clientName}</div>
                    </div>
                    {currentProject?.id === p.id && <Check className="w-3.5 h-3.5 text-[#B59B6D]" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Actions (Save, Share, Notifications, Profile) */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Quick Upload Button */}
        <button
          onClick={onOpenUploadCenter}
          className="hidden md:flex px-3 py-1.5 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider transition items-center space-x-1.5 shadow"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Files</span>
        </button>

        {/* Create Project Button */}
        <button
          onClick={onOpenCreateModal}
          className={`px-3 py-1.5 rounded border text-xs font-bold transition flex items-center space-x-1.5 ${
            isDarkMode 
              ? 'border-[#B59B6D]/40 bg-[#B59B6D]/10 hover:bg-[#B59B6D]/20 text-[#B59B6D]' 
              : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Project</span>
        </button>

        <div className="h-4 w-px bg-white/10 hidden sm:block" />

        {/* Save Project */}
        <button
          onClick={handleSave}
          className={`p-2 rounded border text-xs font-medium flex items-center space-x-1.5 transition ${
            isSaved 
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
              : isDarkMode
                ? 'border-white/10 bg-[#111622] hover:bg-white/10 text-slate-300'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Save Project State to Firestore"
        >
          <Save className="w-4 h-4" />
          <span className="hidden lg:inline">{isSaved ? 'Saved to Cloud' : 'Save'}</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className={`p-2 rounded border text-xs font-medium flex items-center space-x-1.5 transition ${
            copiedLink 
              ? 'bg-[#B59B6D]/20 border-[#B59B6D]/50 text-[#B59B6D]' 
              : isDarkMode
                ? 'border-white/10 bg-[#111622] hover:bg-white/10 text-slate-300'
                : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title="Share Project Link"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden lg:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-2 rounded border transition relative ${
              isDarkMode ? 'border-white/10 bg-[#111622] text-slate-300 hover:text-white' : 'border-slate-300 bg-slate-100 text-slate-700'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B59B6D] animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#B59B6D]" />
          </button>

          {notificationsOpen && (
            <div className={`absolute right-0 top-full mt-2 w-64 p-3 rounded border shadow-2xl z-50 text-xs space-y-2 ${
              isDarkMode ? 'bg-[#0F1420] border-white/15 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
              <div className="font-bold text-[#B59B6D] text-[10px] uppercase tracking-wider">System Activity</div>
              <div className="p-2 rounded bg-white/5 border border-white/5 space-y-1">
                <p className="font-semibold text-slate-200">Digital Twin Workspace Active</p>
                <p className="text-[10px] text-slate-400">Ready for CAD/IFC file upload & metadata extraction.</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#B59B6D] to-[#d8c29d] border border-[#B59B6D] flex items-center justify-center text-black font-bold text-xs shadow">
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
