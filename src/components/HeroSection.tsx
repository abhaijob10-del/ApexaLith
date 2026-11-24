import React from 'react';
import { ArrowRight, ShieldCheck, Award, Ruler, Compass, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onOpenEstimator,
  onOpenAuth,
  onNavigateTab,
  isDarkMode
}) => {
  return (
    <section 
      className={`relative min-h-[82vh] flex flex-col justify-between overflow-hidden transition-colors border-b ${
        isDarkMode ? 'bg-[#0A0D14] border-white/10 text-[#F5F5F0]' : 'bg-[#FDFCF7] border-slate-200 text-slate-900'
      }`}
      aria-label="ApexaLith Hero"
    >
      {/* Background Architectural Photography with Editorial Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop"
          alt="ApexaLith Architectural Landmark"
          className="w-full h-full object-cover object-center scale-105 transform opacity-35"
          loading="eager"
        />
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-[#0A0D14] via-[#0A0D14]/90 to-[#0A0D14]/75' 
            : 'bg-gradient-to-r from-[#FDFCF7] via-[#FDFCF7]/95 to-[#FDFCF7]/80'
        }`} />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Subtle Institutional Brand Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-sm border border-[#B59B6D]/40 bg-[#B59B6D]/10 text-[#B59B6D]">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-[10px] uppercase font-bold tracking-[0.25em]">
              Architectural Studio & Turnkey Construction
            </span>
          </div>

          {/* Moderate Headline - "From Vision to Reality" */}
          <h1 className={`font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            From Vision to <span className="italic font-normal text-[#B59B6D]">Reality</span>.
          </h1>

          {/* Concise Supporting Copy */}
          <p className={`text-base sm:text-lg max-w-2xl leading-relaxed font-light ${
            isDarkMode ? 'text-slate-300' : 'text-slate-700'
          }`}>
            ApexaLith crafts exceptional residential estates, commercial landmarks, and refined interior spaces. We integrate structural engineering, bespoke artisan fabrication, and rigorous project governance into an uncompromised turnkey execution model.
          </p>

          {/* Clear Consultation and Portfolio Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-3">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.18em] transition-all flex items-center space-x-2 shadow-xl"
            >
              <span>Request Private Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('portfolio')}
              className={`px-6 py-3.5 rounded-sm border text-xs uppercase tracking-[0.18em] font-bold transition flex items-center space-x-2 backdrop-blur-sm ${
                isDarkMode 
                  ? 'border-white/20 text-white hover:border-[#B59B6D] hover:bg-white/5' 
                  : 'border-slate-300 text-slate-800 hover:border-[#B59B6D] hover:bg-slate-100'
              }`}
            >
              <span>Explore Portfolio</span>
            </button>

            <button
              onClick={() => onNavigateTab('domains')}
              className={`px-5 py-3.5 rounded-sm text-xs uppercase tracking-[0.18em] font-semibold transition ${
                isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>View Services</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Pillars Bar */}
      <div className={`relative z-10 border-t ${
        isDarkMode ? 'bg-[#080B10]/95 border-white/10 text-white' : 'bg-white/95 border-slate-200 text-slate-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Single-Point Accountability</span>
              </span>
              <div className="text-sm font-semibold">Turnkey Execution</div>
              <p className="text-[11px] text-slate-400 font-light">From permits to finished interior handover.</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
                <Ruler className="w-3.5 h-3.5" />
                <span>Engineering Rigor</span>
              </span>
              <div className="text-sm font-semibold">Post-Tensioned Cantilevers</div>
              <p className="text-[11px] text-slate-400 font-light">Precision bedrock & seismic calculations.</p>
            </div>

            <div 
              onClick={() => onNavigateTab('vault')}
              className="space-y-1 cursor-pointer group"
            >
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B59B6D] flex items-center space-x-1.5 group-hover:underline">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Client Transparency</span>
              </span>
              <div className="text-sm font-semibold group-hover:text-[#B59B6D] transition">VIP Project Portal</div>
              <p className="text-[11px] text-slate-400 font-light">Daily site logs, verified milestones & approvals.</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#B59B6D] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Generational Quality</span>
              </span>
              <div className="text-sm font-semibold">Direct Quarry Sourcing</div>
              <p className="text-[11px] text-slate-400 font-light">Italian stone, Swiss metals & German glazing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
