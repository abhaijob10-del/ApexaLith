import React, { useState } from 'react';
import { 
  ProjectArchetype 
} from '../../../types';
import { 
  PhoneCall, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  Building2, 
  Clock, 
  User 
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: any;
  isDarkMode: boolean;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledData,
  isDarkMode
}) => {
  const [step, setStep] = useState<number>(1);
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const [projectType, setProjectType] = useState<ProjectArchetype>(prefilledData?.projectType || 'Villa');
  const [scaleSqFt, setScaleSqFt] = useState<number>(prefilledData?.scaleSqFt || 12000);
  const [timelineUrgency, setTimelineUrgency] = useState<string>(prefilledData?.timelineUrgency || 'Immediate (1-3 mos)');
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email,
          phone,
          city,
          project_type: projectType,
          scale_sqft: scaleSqFt,
          timeline_urgency: timelineUrgency,
          notes
        })
      });

      if (!response.ok) {
        throw new Error('Server returned error status.');
      }

      const data = await response.json();
      setSubmissionResult(data);
      setStep(3); // Confirmation screen
    } catch (err: any) {
      console.error('Consultation webhook error:', err);
      setErrorMsg('Direct webhook submission failed. Please call our white-glove concierge desk directly at +1 (800) 555-APEXA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative max-w-xl w-full rounded-sm border p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${
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
          <div className="w-10 h-10 rounded-sm bg-[#B59B6D] text-black flex items-center justify-center font-bold shrink-0">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
              White-Glove Executive Outreach
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#F5F5F0]">
              Book a Private Consultation
            </h3>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-sm bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step < 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 1: Contact Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                  Step 1: Contact & Location Information
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lord Sterling / Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="a.vance@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Mobile / Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (310) 555-0192"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">City & Region</label>
                    <input
                      type="text"
                      placeholder="e.g. Aspen, Bel Air, TriBeCa, London"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (!fullName || !email || !phone) {
                        setErrorMsg('Please complete required contact fields before continuing.');
                        return;
                      }
                      setErrorMsg(null);
                      setStep(2);
                    }}
                    className="px-6 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 hover:bg-[#c4ab7d] transition-all"
                  >
                    <span>Next: Project Scope</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Project Scope & Notes */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B59B6D]">
                  Step 2: Project Scope & Design Notes
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Project Category</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value as any)}
                      className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Estate">Estate</option>
                      <option value="Penthouse">Penthouse</option>
                      <option value="Compound">Compound</option>
                      <option value="Historic Restoration">Historic Restoration</option>
                      <option value="Commercial Development">Commercial Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Timeline Urgency</label>
                    <select
                      value={timelineUrgency}
                      onChange={(e) => setTimelineUrgency(e.target.value)}
                      className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    >
                      <option value="Immediate (1-3 mos)">Immediate (1-3 mos)</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="Exploratory Phase">Exploratory Phase</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Architectural / Site Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Mention hillside constraints, subterranean requirements, or specific material preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-[#121212] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs text-white/50 hover:text-white uppercase font-bold tracking-wider"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-7 py-3 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#c4ab7d] flex items-center space-x-2 transition-all"
                  >
                    {loading ? (
                      <span>Dispatching Webhook...</span>
                    ) : (
                      <>
                        <span>Submit Consultation Request</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        {/* Step 3: Confirmation Screen */}
        {step === 3 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-sm bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className="font-serif text-2xl font-bold text-[#F5F5F0]">
                Consultation Request Dispatched
              </h4>
              <p className="text-xs text-white/70 font-light max-w-md mx-auto">
                Thank you, <strong className="text-white">{submissionResult?.lead?.name || fullName}</strong>. Your inquiry has been routed to the ApexaLith White-Glove Concierge Queue.
              </p>
            </div>

            <div className="p-4 rounded-sm bg-[#121212] border border-white/10 space-y-2 text-left max-w-md mx-auto">
              <div className="flex justify-between text-xs text-white/50">
                <span>Lead Reference ID:</span>
                <span className="font-mono text-[#B59B6D] font-bold">{submissionResult?.lead?.id || 'lead_9f8a2b1c'}</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>Assigned Queue:</span>
                <span className="text-white/80">white_glove_concierge</span>
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <span>SLA Outreach Window:</span>
                <span className="text-emerald-400 font-bold">&lt; 60 Minutes</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] hover:bg-[#c4ab7d] transition-all"
            >
              Return to Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
