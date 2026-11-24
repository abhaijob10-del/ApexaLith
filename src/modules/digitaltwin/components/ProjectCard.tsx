import React from 'react';
import { Building2, MapPin, Calendar, Layers, CheckCircle2 } from 'lucide-react';
import { ProjectData } from '../../firebase/firebaseService';

interface ProjectCardProps {
  project: ProjectData;
  isActive?: boolean;
  onSelect: (project: ProjectData) => void;
  isDarkMode?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isActive = false,
  onSelect,
  isDarkMode = true
}) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className={`p-3.5 rounded border transition-all duration-200 cursor-pointer ${
        isActive
          ? 'bg-[#B59B6D]/15 border-[#B59B6D] shadow-md shadow-[#B59B6D]/10'
          : isDarkMode
            ? 'bg-[#111622] border-white/10 hover:border-white/30 hover:bg-[#161d2d]'
            : 'bg-white border-slate-200 hover:border-slate-400 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2.5">
          <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
            isActive ? 'bg-[#B59B6D] text-black font-bold' : 'bg-white/10 text-[#B59B6D]'
          }`}>
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className={`text-xs font-bold leading-snug truncate ${
              isActive ? 'text-[#B59B6D]' : isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {project.projectName}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              Client: {project.clientName}
            </p>
          </div>
        </div>

        {isActive && (
          <span className="px-1.5 py-0.5 rounded bg-[#B59B6D]/20 text-[#B59B6D] text-[9px] font-bold uppercase tracking-wider shrink-0 flex items-center space-x-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            <span>Active</span>
          </span>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 pt-2.5 border-t border-white/10 text-[10px] text-slate-400">
        <div className="flex items-center space-x-1 truncate">
          <MapPin className="w-3 h-3 text-[#B59B6D] shrink-0" />
          <span className="truncate">{project.location}</span>
        </div>
        <div className="flex items-center space-x-1 truncate justify-end">
          <Layers className="w-3 h-3 text-[#B59B6D] shrink-0" />
          <span>{project.projectType} • {project.numberOfFloors}F</span>
        </div>
      </div>
    </div>
  );
};
