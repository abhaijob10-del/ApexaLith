import React, { useState } from 'react';
import { 
  ProjectArchetype, 
  ArchitecturalStyle, 
  ProjectDetails 
} from '../../../types';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Ruler, 
  Building2, 
  Compass, 
  ShieldCheck,
  Check
} from 'lucide-react';

interface SmartEstimatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectDetails[];
  onOpenConsultationWithData: (data: any) => void;
  isDarkMode: boolean;
}

export const SmartEstimatorModal: React.FC<SmartEstimatorModalProps> = ({
  isOpen,
  onClose,
  projects,
  onOpenConsultationWithData,
  isDarkMode
}) => {
  const [step, setStep] = useState<number>(1);
  const [archetype, setArchetype] = useState<ProjectArchetype>('Estate');
  const [sqFtScale, setSqFtScale] = useState<number>(12500);
  const [siteComplexity, setSiteComplexity] = useState<'Flat Lot' | 'Hillside / Slope' | 'Waterfront / Marine' | 'Historic Landmark Constraints'>('Hillside / Slope');
  const [materialAspiration, setMaterialAspiration] = useState<'Refined' | 'Rare' | 'Bespoke & One-of-a-Kind'>('Rare');
  const [timelineUrgency, setTimelineUrgency] = useState<'Immediate (1-3 mos)' | '3-6 months' | '6-12 months' | 'Exploratory Phase'>('3-6 months');
  const [selectedStyles, setSelectedStyles] = useState<ArchitecturalStyle[]>(['Modernist', 'Mountain Contemporary']);

  const [loading, setLoading] = useState<boolean>(false);
  const [investmentProfileResult, setInvestmentProfileResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleStyleToggle = (style: ArchitecturalStyle) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleSubmitProfiler = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/smart-estimator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          archetype,
          sqFtScale,
          siteComplexity,
          materialAspiration,
          timelineUrgency,
          styleAffinity: selectedStyles
        })
      });
      const data = await response.json();
      setInvestmentProfileResult(data);
      setStep(4); // Results screen
    } catch (err) {
      console.error('Estimator API error:', err);
      // Fallback
      setInvestmentProfileResult({
        success: true,
        internalTier: 'tier_i',
        message: 'Your dedicated senior architectural consultant will prepare a tailored investment framework ahead of your private consultation.'
      });
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const matchedProjects = projects.filter(
    p => p.archetype === archetype || p.style.some(s => selectedStyles.includes(s))
  ).slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative max-w-2xl w-full rounded-sm border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
        isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-sm text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-sm bg-[#B59B6D]/20 flex items-center justify-center text-[#B59B6D] shrink-0 border border-[#B59B6D]/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
              Qualitative Investment Profiling
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#F5F5F0]">
              Smart Estimator Framework
            </h3>
          </div>
        </div>

        {/* Step Progress Bar */}
        {step < 4 && (
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-white/50 font-bold uppercase tracking-wider">
              <span>Step {step} of 3</span>
              <span>{step === 1 ? 'Archetype & Scale' : step === 2 ? 'Site & Materials' : 'Style & Timeline'}</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B59B6D] transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step 1: Archetype & Scale */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                1. Select Property Archetype
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(['Villa', 'Estate', 'Penthouse', 'Compound', 'Historic Restoration'] as ProjectArchetype[]).map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setArchetype(item)}
                    className={`p-3 rounded-sm border text-xs font-bold text-left transition ${
                      archetype === item
                        ? 'border-[#B59B6D] bg-[#B59B6D]/15 text-[#B59B6D]'
                        : 'border-white/10 bg-[#121212] text-white/70 hover:border-white/20'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/60">
                <label className="tracking-[0.15em]">2. Built-Up Scale Band</label>
                <span className="text-[#B59B6D] font-mono font-bold text-xs">{sqFtScale.toLocaleString()} SQ FT</span>
              </div>
              <input
                type="range"
                min={4000}
                max={40000}
                step={500}
                value={sqFtScale}
                onChange={(e) => setSqFtScale(Number(e.target.value))}
                className="w-full accent-[#B59B6D] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>4,000 SQ FT (Boutique Villa)</span>
                <span>20,000 SQ FT</span>
                <span>40,000+ SQ FT (Compound)</span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 hover:bg-[#c4ab7d] transition-all"
              >
                <span>Next: Site & Material Parameters</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Site Complexity & Materials */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                3. Site Typology & Topographical Complexity
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Flat Lot', 
                  'Hillside / Slope', 
                  'Waterfront / Marine', 
                  'Historic Landmark Constraints'
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSiteComplexity(item as any)}
                    className={`p-3 rounded-sm border text-xs font-bold text-left transition ${
                      siteComplexity === item
                        ? 'border-[#B59B6D] bg-[#B59B6D]/15 text-[#B59B6D]'
                        : 'border-white/10 bg-[#121212] text-white/70 hover:border-white/20'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                4. Material Finish Aspiration Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'Refined', desc: 'High architectural grade finishes & standard luxury glazing.' },
                  { name: 'Rare', desc: 'Direct quarry stone slabs, custom millwork, smart glass.' },
                  { name: 'Bespoke & One-of-a-Kind', desc: 'Quarried Calacatta slabs, titanium zinc, subterranean vaults.' }
                ].map((mat) => (
                  <button
                    key={mat.name}
                    type="button"
                    onClick={() => setMaterialAspiration(mat.name as any)}
                    className={`p-3 rounded-sm border text-xs text-left transition space-y-1 ${
                      materialAspiration === mat.name
                        ? 'border-[#B59B6D] bg-[#B59B6D]/15 text-[#B59B6D]'
                        : 'border-white/10 bg-[#121212] text-white/70 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold uppercase tracking-wider text-xs">{mat.name}</div>
                    <div className="text-[10px] text-white/40 leading-relaxed">{mat.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 hover:bg-[#c4ab7d] transition-all"
              >
                <span>Next: Style & Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Style & Timeline */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                5. Architectural Style Affinity
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Modernist', 
                  'Mountain Contemporary', 
                  'Neoclassical Luxury', 
                  'Minimalist Warmth',
                  'Biophilic Architecture',
                  'Industrial Chic'
                ].map((styleName) => {
                  const active = selectedStyles.includes(styleName as any);
                  return (
                    <button
                      key={styleName}
                      type="button"
                      onClick={() => handleStyleToggle(styleName as any)}
                      className={`p-2.5 rounded-sm border text-xs font-bold text-left transition flex items-center justify-between ${
                        active
                          ? 'border-[#B59B6D] bg-[#B59B6D]/20 text-[#B59B6D]'
                          : 'border-white/10 bg-[#121212] text-white/70 hover:border-white/20'
                      }`}
                    >
                      <span>{styleName}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#B59B6D]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                6. Execution Timeline Urgency
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Immediate (1-3 mos)', 
                  '3-6 months', 
                  '6-12 months', 
                  'Exploratory Phase'
                ].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimelineUrgency(t as any)}
                    className={`p-3 rounded-sm border text-xs font-bold text-left transition ${
                      timelineUrgency === t
                        ? 'border-[#B59B6D] bg-[#B59B6D]/15 text-[#B59B6D]'
                        : 'border-white/10 bg-[#121212] text-white/70 hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider"
              >
                Back
              </button>
              <button
                onClick={handleSubmitProfiler}
                disabled={loading}
                className="px-7 py-3 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#c4ab7d] flex items-center space-x-2 transition-all"
              >
                {loading ? (
                  <span>Generating Investment Framework...</span>
                ) : (
                  <>
                    <span>Generate Personalized Profile</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Results (Personalized Investment Profile) */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-sm bg-[#B59B6D]/10 border border-[#B59B6D]/40 space-y-2">
              <div className="flex items-center space-x-2 text-[#B59B6D] font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Personalized Architectural Investment Profile Generated</span>
              </div>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                {investmentProfileResult?.message || 'Your dedicated senior architectural consultant will prepare a tailored investment framework ahead of your private consultation.'}
              </p>
            </div>

            {/* Matched Reference Projects */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                Matched Comparable Portfolio References
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedProjects.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-sm bg-[#121212] border border-white/10 space-y-2">
                    <div className="aspect-video rounded-sm overflow-hidden">
                      <img src={p.heroImage} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-serif text-sm font-bold text-[#F5F5F0]">{p.name}</div>
                      <div className="text-[10px] text-white/40 font-mono">{p.location} • {p.builtUpSqFt.toLocaleString()} SQ FT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Action */}
            <div className="pt-4 border-t border-white/10 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenConsultationWithData({
                    projectType: archetype,
                    scaleSqFt: sqFtScale,
                    timelineUrgency,
                    styleAffinity: selectedStyles
                  });
                }}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#c4ab7d] transition-all"
              >
                Proceed to Consultation Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
