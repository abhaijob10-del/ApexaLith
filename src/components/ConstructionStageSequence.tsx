import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ChevronRight, Layers, ShieldCheck, CheckCircle2, ChevronLeft } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Stage {
  id: number;
  phase: string;
  title: string;
  description: string;
  specifications: string[];
  image: string;
  badge: string;
}

const CONSTRUCTION_STAGES: Stage[] = [
  {
    id: 1,
    phase: 'Phase 01 — Structural Steel & Substructure',
    title: 'Bedrock Anchoring & High-Tensile Steel Framing',
    description: 'Precision civil engineering begins with deep caisson excavation, seismically damped foundation slabs, and Grade 60 structural steel moment frames designed for 12-meter unobstructed cantilevers.',
    specifications: [
      'Deep rock caissons drilled to solid bedrock',
      'Post-tensioned concrete podium slabs',
      'Structural steel I-beams with vibration dampening',
      'Subterranean moisture barrier multi-layer sealing'
    ],
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=1600&auto=format&fit=crop',
    badge: 'Structure & Foundation'
  },
  {
    id: 2,
    phase: 'Phase 02 — High-Performance Envelope',
    title: 'Acoustic Glazing & Titanium-Zinc Cladding',
    description: 'The architectural envelope is sealed with Swiss-engineered motorized Sky-Frame sliding glass panels, custom Swiss titanium-zinc soffits, and insulated thermal breaks guaranteeing near-zero thermal bridging.',
    specifications: [
      'Triple-pane electrochromic solar control glass',
      'Hand-brushed champagne titanium-zinc fascias',
      'Continuous R-40 thermal building envelope',
      'Concealed drainage & perimeter waterproofing'
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    badge: 'Façade & Envelope'
  },
  {
    id: 3,
    phase: 'Phase 03 — Interior Crafting & MEP Systems',
    title: 'Book-Matched Calacatta & Acoustic Millwork',
    description: 'Italian stone artisans mount full-height book-matched Calacatta Borghini marble slabs. Master carpenters execute smoked European bog oak joinery with concealed linear HVAC diffusers and Lutron Quantum scene lighting.',
    specifications: [
      'Direct-quarried Italian book-matched marble',
      'Custom smoked oak architectural millwork',
      'Silent multi-zone geothermal hydronic HVAC',
      'Concealed architectural lighting integration'
    ],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop',
    badge: 'Interior Architecture'
  },
  {
    id: 4,
    phase: 'Phase 04 — Turnkey Handover & Commissioning',
    title: 'The Monolithic Sanctuary Completed',
    description: 'The completed estate stands as an enduring architectural statement. Zero-edge heated reflection pools, native alpine landscaping, biosecurity access systems, and full white-glove commissioning are finalized.',
    specifications: [
      'Zero-edge hydronic reflection pool & spa',
      'Integrated Savant & biosecurity smart controls',
      'Full municipal occupancy & LEED compliance',
      'White-glove executive key handover ceremony'
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
    badge: 'Turnkey Delivery'
  }
];

interface ConstructionStageSequenceProps {
  onOpenConsultation: () => void;
  isDarkMode: boolean;
}

export const ConstructionStageSequence: React.FC<ConstructionStageSequenceProps> = ({
  onOpenConsultation,
  isDarkMode
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        const idx = Math.min(
          CONSTRUCTION_STAGES.length - 1,
          Math.floor(progress * CONSTRUCTION_STAGES.length)
        );
        setActiveStageIndex(idx);
      }
    });

    return () => {
      trigger.kill();
    };
  }, [prefersReducedMotion]);

  const activeStage = CONSTRUCTION_STAGES[activeStageIndex];

  return (
    <section 
      ref={containerRef}
      className={`relative min-h-screen flex flex-col justify-center overflow-hidden transition-colors border-b ${
        isDarkMode ? 'bg-[#090C11] border-white/10 text-[#F5F5F0]' : 'bg-[#F9F8F5] border-slate-200 text-slate-900'
      }`}
      aria-label="Progressive Construction Stage Sequence"
    >
      {/* Background Subtle Gradient */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDarkMode 
          ? 'bg-radial from-[#151B27]/40 via-transparent to-[#090C11]' 
          : 'bg-radial from-[#EDE9DE]/50 via-transparent to-[#F9F8F5]'
      }`} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <div className="inline-flex items-center space-x-2 text-[10px] uppercase font-bold tracking-[0.25em] text-[#B59B6D] mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Progressive Execution Architecture</span>
            </div>
            <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              From Structural Steel to Generational Landmark
            </h2>
            <p className={`text-xs sm:text-sm mt-2 max-w-2xl font-light ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Scroll through the four definitive stages of an ApexaLith luxury construction project. Every transition represents uncompromising structural engineering and fine architectural craftsmanship.
            </p>
          </div>

          {/* Interactive Keyboard & Navigation Controls */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-[10px] font-mono uppercase text-[#B59B6D] font-bold">Stage {activeStageIndex + 1} of {CONSTRUCTION_STAGES.length}</span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setActiveStageIndex(Math.max(0, activeStageIndex - 1))}
                disabled={activeStageIndex === 0}
                aria-label="Previous Construction Stage"
                className={`p-2 rounded-sm border transition ${
                  activeStageIndex === 0 
                    ? 'opacity-30 cursor-not-allowed border-white/10' 
                    : isDarkMode 
                      ? 'border-white/20 hover:border-[#B59B6D] text-white hover:bg-white/5' 
                      : 'border-slate-300 hover:border-[#B59B6D] text-slate-800'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveStageIndex(Math.min(CONSTRUCTION_STAGES.length - 1, activeStageIndex + 1))}
                disabled={activeStageIndex === CONSTRUCTION_STAGES.length - 1}
                aria-label="Next Construction Stage"
                className={`p-2 rounded-sm border transition ${
                  activeStageIndex === CONSTRUCTION_STAGES.length - 1 
                    ? 'opacity-30 cursor-not-allowed border-white/10' 
                    : isDarkMode 
                      ? 'border-white/20 hover:border-[#B59B6D] text-white hover:bg-white/5' 
                      : 'border-slate-300 hover:border-[#B59B6D] text-slate-800'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stage Progress Indicator Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-6 pb-8">
          {CONSTRUCTION_STAGES.map((s, idx) => {
            const isActive = idx === activeStageIndex;
            const isCompleted = idx < activeStageIndex;
            return (
              <button
                key={s.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`text-left p-3 rounded-sm border transition text-xs flex flex-col justify-between ${
                  isActive 
                    ? 'border-[#B59B6D] bg-[#B59B6D]/10' 
                    : isCompleted
                      ? 'border-white/20 bg-white/5 text-slate-300'
                      : 'border-white/5 bg-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className={isActive ? 'text-[#B59B6D] font-bold' : 'text-slate-400'}>0{s.id}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <div className={`mt-1 font-semibold truncate ${isActive ? 'text-[#B59B6D]' : isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {s.badge}
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Stage Presentation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Progressive High-Fidelity Architectural Photography */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden border border-white/10 shadow-2xl bg-black">
              {CONSTRUCTION_STAGES.map((stg, i) => (
                <div
                  key={stg.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    i === activeStageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <img
                    src={stg.image}
                    alt={stg.title}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-black/80 text-[#B59B6D] border border-[#B59B6D]/40 backdrop-blur-md">
                      {stg.badge}
                    </span>
                    <span className="text-[10px] font-mono text-white/70">
                      High-Resolution Architectural Archive
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Technical Deliverables & Narrative */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#B59B6D]">
                {activeStage.phase}
              </span>
              <h3 className={`font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-snug ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {activeStage.title}
              </h3>
              <p className={`text-xs sm:text-sm font-light leading-relaxed pt-1 ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {activeStage.description}
              </p>
            </div>

            {/* Specifications checklist */}
            <div className={`p-4 rounded-sm border space-y-2.5 ${
              isDarkMode ? 'bg-[#0E121A] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#B59B6D]">
                Technical Execution Highlights
              </div>
              <ul className="space-y-2 text-xs">
                {activeStage.specifications.map((spec, sidx) => (
                  <li key={sidx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B59B6D] shrink-0 mt-0.5" />
                    <span className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stage Action */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenConsultation}
                className="px-5 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest transition flex items-center space-x-2 shadow-lg"
              >
                <span>Inquire About Turnkey Build</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
