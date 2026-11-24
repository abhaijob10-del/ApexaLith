import React, { useState } from 'react';
import { 
  ProjectDetails, 
  ProjectArchetype 
} from '../../../types';
import { 
  MapPin, 
  Ruler, 
  CheckCircle2, 
  Clock, 
  Download, 
  ChevronRight, 
  Eye, 
  SlidersHorizontal,
  X,
  FileCheck
} from 'lucide-react';
import { BeforeAfterSlider } from '../../../components/BeforeAfterSlider';

interface PortfolioSpotlightProps {
  projects: ProjectDetails[];
  onOpenConsultation: () => void;
  isDarkMode: boolean;
  searchQuery: string;
}

export const PortfolioSpotlight: React.FC<PortfolioSpotlightProps> = ({
  projects = [],
  onOpenConsultation,
  isDarkMode,
  searchQuery = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<ProjectDetails | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const categories = ['All', 'Villa', 'Estate', 'Penthouse', 'Modernist', 'Mountain Contemporary'];

  const filteredProjects = projects.filter((p) => {
    const q = (searchQuery || '').toLowerCase().trim();
    const matchesSearch = q === '' || 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.archetype && p.archetype.toLowerCase().includes(q)) ||
      (p.stage && p.stage.toLowerCase().includes(q)) ||
      ((p as any).leadEngineer && (p as any).leadEngineer.toLowerCase().includes(q)) ||
      ((p as any).materialsUsed && (p as any).materialsUsed.some((m: string) => m && m.toLowerCase().includes(q)));

    if (!matchesSearch) return false;
    if (selectedCategory === 'All') return true;
    if (p.archetype === selectedCategory) return true;
    if (p.style && p.style.includes(selectedCategory as any)) return true;
    return false;
  });

  const handleDownloadSpec = (docTitle: string) => {
    setDownloadSuccessMessage(`Generating signed download URL for "${docTitle}" (24-Hour TTL)...`);
    setTimeout(() => {
      setDownloadSuccessMessage(`Downloaded signed PDF: ${docTitle}`);
      setTimeout(() => setDownloadSuccessMessage(null), 4000);
    }, 1200);
  };

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 border-b transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
              Curated Architectural Portfolio
            </span>
            <h2 className={`font-serif text-3xl sm:text-5xl font-bold tracking-tight mt-1 ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Project Spotlights & Case Studies
            </h2>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-sm text-[10px] uppercase tracking-wider font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-[#B59B6D] text-black shadow-md'
                    : isDarkMode 
                      ? 'bg-[#121212] border border-white/10 text-white/70 hover:border-[#B59B6D]' 
                      : 'bg-slate-100 border border-slate-200 text-slate-700 hover:border-[#B59B6D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Download notification banner */}
        {downloadSuccessMessage && (
          <div className="p-3 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D] text-[#B59B6D] text-xs flex items-center space-x-2 animate-pulse font-mono">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>{downloadSuccessMessage}</span>
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className={`p-12 text-center rounded-sm border ${
            isDarkMode ? 'border-white/10 bg-[#0D0D0D] text-white' : 'border-slate-300 bg-white text-slate-900 shadow-sm'
          } space-y-3`}>
            <p className="text-sm font-semibold">No projects found matching "{searchQuery}".</p>
            <p className={`text-xs ${isDarkMode ? 'text-white/60' : 'text-slate-500'}`}>Try adjusting your category filter or search keywords (e.g. Villa, Aspen, Penthouse, Modernist).</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredProjects.map((proj) => (
              <div
                key={proj.id}
                className={`rounded-sm border overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {/* Image Banner */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={proj.heroImage}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/90 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-[0.2em] bg-[#0A0A0A]/90 text-[#B59B6D] border border-[#B59B6D]/40 backdrop-blur-md">
                      {proj.archetype}
                    </span>
                    <span className="px-2.5 py-1 rounded-sm text-[9px] font-bold tracking-wider bg-[#0A0A0A]/80 text-white/80 border border-white/10 backdrop-blur-md">
                      {proj.progressPercentage}% Completed
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <div className="flex items-center space-x-1.5 text-xs text-white/80">
                      <MapPin className="w-3.5 h-3.5 text-[#B59B6D]" />
                      <span>{proj.location}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-white/80 font-mono">
                      <Ruler className="w-3.5 h-3.5 text-[#B59B6D]" />
                      <span>{proj.builtUpSqFt.toLocaleString()} SQ FT</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className={`font-serif text-2xl font-bold tracking-wide group-hover:text-[#B59B6D] transition ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {proj.name}
                    </h3>
                    <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {proj.description}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className={`flex justify-between text-[10px] font-bold uppercase tracking-wider ${
                      isDarkMode ? 'text-white/60' : 'text-slate-500'
                    }`}>
                      <span>{proj.stage}</span>
                      <span className="text-[#B59B6D] font-mono">{proj.progressPercentage}%</span>
                    </div>
                    <div className={`w-full h-1 rounded-full overflow-hidden ${
                      isDarkMode ? 'bg-white/10' : 'bg-slate-200'
                    }`}>
                      <div
                        className="h-full bg-[#B59B6D]"
                        style={{ width: `${proj.progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Card footer actions */}
                  <div className={`pt-4 flex items-center justify-between border-t ${
                    isDarkMode ? 'border-white/10' : 'border-slate-200'
                  }`}>
                    <button
                      onClick={() => setActiveProject(proj)}
                      className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#B59B6D] hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Case Study</span>
                    </button>

                    <button
                      onClick={onOpenConsultation}
                      className="px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-[#B59B6D] hover:text-black text-white text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      Inquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Case Study Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className={`relative max-w-4xl w-full rounded-sm border p-6 sm:p-8 space-y-8 max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setActiveProject(null)}
              className="absolute top-4 right-4 p-2 rounded-sm text-white/50 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
                ApexaLith Project Spotlight
              </span>
              <h3 className="font-serif text-3xl font-bold mt-1 text-[#F5F5F0]">
                {activeProject.name}
              </h3>
              <p className="text-xs text-white/50 flex items-center space-x-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#B59B6D]" />
                <span>{activeProject.location}</span>
                <span>•</span>
                <span className="font-mono">{activeProject.builtUpSqFt.toLocaleString()} SQ FT</span>
              </p>
            </div>

            {/* Before/After Slider if available */}
            {activeProject.beforeImage && activeProject.afterImage && (
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D] flex items-center space-x-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#B59B6D]" />
                  <span>Before & After Transformation Comparison</span>
                </h4>
                <BeforeAfterSlider
                  beforeImage={activeProject.beforeImage}
                  afterImage={activeProject.afterImage}
                  beforeLabel="Initial Topography / Site"
                  afterLabel="ApexaLith Architecture"
                />
              </div>
            )}

            {/* Gallery thumbnails */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeProject.gallery.map((img, idx) => (
                <div key={idx} className="aspect-video rounded-sm overflow-hidden border border-white/10">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Milestone Breakdown */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                Construction Milestone Breakdown
              </h4>
              <div className="space-y-3">
                {activeProject.milestones.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-sm bg-[#121212] border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white/90">{m.title}</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-sm bg-white/5 text-[#B59B6D] uppercase font-mono tracking-wider border border-[#B59B6D]/20">
                          {m.phase}
                        </span>
                      </div>
                      <p className="text-xs text-white/50">{m.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-bold ${
                        m.status === 'completed' ? 'text-emerald-400' : 'text-[#B59B6D]'
                      }`}>
                        {m.status === 'completed' ? 'COMPLETED' : `${m.progressPercentage}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Downloadable Specifications */}
            {activeProject.documents.length > 0 && (
              <div className="space-y-3 border-t border-white/10 pt-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                  Gated Technical Specification Sheets & CAD Blueprints
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProject.documents.map((doc) => (
                    <div key={doc.id} className="p-3 rounded-sm bg-[#121212] border border-white/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white">{doc.title}</div>
                        <div className="text-[10px] text-white/40 font-mono">{doc.fileType.toUpperCase()} • {doc.fileSize}</div>
                      </div>
                      <button
                        onClick={() => handleDownloadSpec(doc.title)}
                        className="p-2 rounded-sm bg-[#B59B6D]/10 border border-[#B59B6D]/30 hover:bg-[#B59B6D] hover:text-black text-[#B59B6D] transition-all"
                        title="Download Signed PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
