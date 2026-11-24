import React, { useState } from 'react';
import { 
  CustomerInquiry 
} from '../types';
import { 
  PhoneCall, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle, 
  Building2, 
  Clock, 
  User, 
  FileText,
  Upload,
  Calendar,
  Sparkles,
  MapPin,
  Compass,
  FileCheck,
  ShieldCheck
} from 'lucide-react';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefilledData?: any;
  isDarkMode: boolean;
  onInquirySubmitted?: (inquiry: CustomerInquiry) => void;
}

const AVAILABLE_SERVICES = [
  'Architecture & Design',
  'Structural Engineering',
  'Luxury Residential Construction',
  'Commercial Construction',
  'Turnkey Project Execution',
  'Interior Architecture & Space Planning',
  'Renovation & Remodeling',
  'Allied Civil & Foundation Engineering',
  'Smart Home & Biosecurity Integration',
  'Landscape & Pool Architecture',
  'Custom Italian Joinery & Millwork',
  'Modular Kitchen & Wardrobe Systems',
  'Architectural Acoustic Plaster & Lighting',
  'Material Sourcing & Quarry Procurement'
];

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefilledData,
  isDarkMode,
  onInquirySubmitted
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Customer Information
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [communicationMethod, setCommunicationMethod] = useState<'phone' | 'email' | 'whatsapp'>('phone');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');

  // Step 2: Project Information & Planning
  const [projectType, setProjectType] = useState<'residential' | 'commercial' | 'interior_design' | 'renovation' | 'turnkey'>(
    prefilledData?.projectType || 'residential'
  );
  const [projectName, setProjectName] = useState<string>('');
  const [siteAddress, setSiteAddress] = useState<string>('');
  const [plotSizeSqFt, setPlotSizeSqFt] = useState<string>(prefilledData?.scaleSqFt ? String(prefilledData.scaleSqFt) : '');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<string>('');
  const [floors, setFloors] = useState<string>('2');
  const [currentProjectStage, setCurrentProjectStage] = useState<string>('Raw Land / Concept Planning');
  const [budgetRange, setBudgetRange] = useState<string>('$10,000,000 - $25,000,000');
  const [budgetFlexibility, setBudgetFlexibility] = useState<'fixed' | 'plus_minus_10' | 'flexible'>('flexible');
  const [preferredStartDate, setPreferredStartDate] = useState<string>('');
  const [expectedCompletionDate, setExpectedCompletionDate] = useState<string>('');

  // Step 3: Service Selection & Design Preferences
  const [selectedServices, setSelectedServices] = useState<string[]>([
    'Architecture & Design',
    'Luxury Residential Construction',
    'Turnkey Project Execution'
  ]);
  const [designPreference, setDesignPreference] = useState<'modern' | 'luxury' | 'minimalist' | 'contemporary' | 'traditional'>('luxury');
  const [preferredColorsMaterials, setPreferredColorsMaterials] = useState<string>('');
  const [inspirationLinks, setInspirationLinks] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');

  // Step 4: Documents & Consultation Meeting Preferences
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [meetingPreference, setMeetingPreference] = useState<'online' | 'site_visit' | 'office'>('site_visit');
  const [preferredMeetingDate, setPreferredMeetingDate] = useState<string>('');
  const [preferredMeetingTime, setPreferredMeetingTime] = useState<string>('11:00 AM');
  const [meetingPurpose, setMeetingPurpose] = useState<string>('Initial Architectural Review & Structural Feasibility');

  // Request State
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const toggleService = (svc: string) => {
    setSelectedServices(prev => 
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      
      // Permit max 50MB
      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage('File size exceeds 50MB limit. Please upload optimized files.');
        return;
      }

      setUploadedFiles(prev => [...prev, {
        name: file.name,
        size: sizeMB,
        type: ext
      }]);
      setErrorMessage(null);
    }
  };

  const validateStep1 = () => {
    if (!fullName.trim()) return 'Please enter your full name.';
    if (!email.trim() || !email.includes('@')) return 'Please provide a valid email address.';
    if (!phone.trim()) return 'Please enter your phone number.';
    if (!city.trim() || !state.trim()) return 'Please provide your city and state/region.';
    return null;
  };

  const validateStep2 = () => {
    if (!siteAddress.trim()) return 'Please provide the project or site location address.';
    return null;
  };

  const validateStep3 = () => {
    if (selectedServices.length === 0) return 'Please select at least one required service.';
    if (!projectDescription.trim() || projectDescription.trim().length < 10) {
      return 'Please write a brief project description (minimum 10 characters).';
    }
    return null;
  };

  const handleNextStep = () => {
    setErrorMessage(null);
    if (step === 1) {
      const err = validateStep1();
      if (err) { setErrorMessage(err); return; }
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setErrorMessage(err); return; }
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setErrorMessage(err); return; }
      setStep(4);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const step3Err = validateStep3();
    if (step3Err) {
      setErrorMessage(step3Err);
      setStep(3);
      return;
    }

    setLoading(true);

    const payload = {
      fullName,
      email,
      phone,
      whatsapp,
      preferredCommunication: communicationMethod,
      city,
      state,
      projectType,
      projectName,
      siteAddress,
      plotSizeSqFt: Number(plotSizeSqFt) || undefined,
      builtUpAreaSqFt: Number(builtUpAreaSqFt) || undefined,
      floors: Number(floors) || undefined,
      currentProjectStage,
      budgetRange,
      budgetFlexibility,
      preferredStartDate,
      expectedCompletionDate,
      requiredServices: selectedServices,
      projectDescription,
      designPreference,
      preferredColorsMaterials,
      inspirationLinks,
      uploadedDocuments: uploadedFiles,
      meetingPreference,
      preferredMeetingDate,
      preferredMeetingTime,
      meetingPurpose
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Server error occurred while submitting inquiry.');
      }

      setSuccessResult(data);
      if (onInquirySubmitted && data.inquiry) {
        onInquirySubmitted(data.inquiry);
      }
      setStep(5); // Success step
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setErrorMessage(err.message || 'Unable to submit inquiry. Please try again or contact concierge.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className={`relative max-w-2xl w-full rounded-sm border p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto ${
        isDarkMode ? 'bg-[#0D1017] border-white/10 text-[#F5F5F0]' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-sm text-slate-400 hover:text-white transition"
          aria-label="Close Inquiry Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
          <div className="w-9 h-9 rounded-sm bg-[#B59B6D] text-black flex items-center justify-center font-bold shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
              ApexaLith Client Engagement
            </span>
            <h2 className={`font-serif text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Consultation & Project Quotation Request
            </h2>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-sm bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Multi-Step Navigation Indicator (Steps 1 to 4) */}
        {step <= 4 && (
          <div className="grid grid-cols-4 gap-2 pb-2">
            {[
              { num: 1, title: 'Client Info' },
              { num: 2, title: 'Project Scope' },
              { num: 3, title: 'Services & Design' },
              { num: 4, title: 'Consultation' }
            ].map((s) => (
              <div 
                key={s.num} 
                className={`text-center py-2 border-b-2 transition ${
                  step === s.num 
                    ? 'border-[#B59B6D] text-[#B59B6D] font-bold' 
                    : step > s.num
                      ? 'border-emerald-400 text-emerald-400 font-semibold'
                      : 'border-white/10 text-slate-500'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider">0{s.num}</div>
                <div className="text-[11px] truncate">{s.title}</div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Customer Contact Information */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Step 1: Customer & Communication Details
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord Alexander Vance / Julian Sterling"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@estateholdings.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (310) 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (310) 555-0192"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preferred Communication
                  </label>
                  <select
                    value={communicationMethod}
                    onChange={(e) => setCommunicationMethod(e.target.value as any)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="phone">Phone Call</option>
                    <option value="email">Email</option>
                    <option value="whatsapp">WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aspen, Beverly Hills, London"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    State / Province / Region *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Colorado, California, UK"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest flex items-center space-x-2 transition"
              >
                <span>Next: Project Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Project Scope & Site Information */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Step 2: Project Information & Planning Timeline
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Project Type *
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="residential">Luxury Residential (Estate/Villa)</option>
                    <option value="commercial">Commercial Development</option>
                    <option value="interior_design">Interior Architecture & Space Planning</option>
                    <option value="renovation">Renovation & Remodeling</option>
                    <option value="turnkey">Full Turnkey Execution</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Project / Residence Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Red Mountain Sanctuary"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Site / Land Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10440 Bellagio Road, Bel Air, Los Angeles, CA"
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Plot Size (Sq Ft)
                  </label>
                  <input
                    type="number"
                    placeholder="45000"
                    value={plotSizeSqFt}
                    onChange={(e) => setPlotSizeSqFt(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Built-Up Area (Sq Ft)
                  </label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={builtUpAreaSqFt}
                    onChange={(e) => setBuiltUpAreaSqFt(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Floors
                  </label>
                  <input
                    type="number"
                    placeholder="3"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Estimated Budget Range
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="$5M - $10M">$5,000,000 – $10,000,000</option>
                    <option value="$10M - $25M">$10,000,000 – $25,000,000</option>
                    <option value="$25M - $50M">$25,000,000 – $50,000,000</option>
                    <option value="$50M+">$50,000,000+ (Ultra-Luxury Compound)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Budget Flexibility
                  </label>
                  <select
                    value={budgetFlexibility}
                    onChange={(e) => setBudgetFlexibility(e.target.value as any)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="fixed">Strictly Fixed Budget</option>
                    <option value="plus_minus_10">Target ± 10% Contingency</option>
                    <option value="flexible">Flexible for Premium Specifications</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    value={preferredStartDate}
                    onChange={(e) => setPreferredStartDate(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="date"
                    value={expectedCompletionDate}
                    onChange={(e) => setExpectedCompletionDate(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest flex items-center space-x-2 transition"
              >
                <span>Next: Services & Design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Service Selection & Design Preferences */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Step 3: Service Selection & Architectural Styling
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Required Services (Select all that apply) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-[#141924] border border-white/15 rounded-sm">
                  {AVAILABLE_SERVICES.map((svc) => {
                    const isChecked = selectedServices.includes(svc);
                    return (
                      <button
                        type="button"
                        key={svc}
                        onClick={() => toggleService(svc)}
                        className={`text-left p-2 rounded-sm text-xs flex items-center space-x-2 transition ${
                          isChecked 
                            ? 'bg-[#B59B6D]/20 text-[#B59B6D] font-bold border border-[#B59B6D]/40' 
                            : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-[#B59B6D] border-[#B59B6D] text-black' : 'border-white/30'
                        }`}>
                          {isChecked && <CheckCircle2 className="w-3 h-3 text-black" />}
                        </div>
                        <span className="truncate">{svc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Design Preference Style
                  </label>
                  <select
                    value={designPreference}
                    onChange={(e) => setDesignPreference(e.target.value as any)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="luxury">Luxury Monolithic Architecture</option>
                    <option value="modern">Modernist Clean Geometry</option>
                    <option value="minimalist">Minimalist Warmth & Limestone</option>
                    <option value="contemporary">Mountain Contemporary</option>
                    <option value="traditional">Neoclassical Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preferred Colors & Materials
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Calacatta marble, titanium-zinc, smoked oak"
                    value={preferredColorsMaterials}
                    onChange={(e) => setPreferredColorsMaterials(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Inspiration Links or Reference URLs (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://pinterest.com/... or architectural link"
                  value={inspirationLinks}
                  onChange={(e) => setInspirationLinks(e.target.value)}
                  className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Project Description & Vision *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail your architectural aspirations, site topography challenges, subterranean requirements, or key lifestyle amenities..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full bg-[#141924] border border-white/15 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest flex items-center space-x-2 transition"
              >
                <span>Next: Documents & Meeting</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Documents & Meeting Preferences */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Step 4: Supporting Plans & Consultation Meeting Preferences
            </div>

            <div className="space-y-3">
              {/* Document Upload Area */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Upload Site Documents, Surveys, Floor Plans or Reference Images
                </label>
                <div className="p-4 border border-dashed border-white/20 bg-[#141924] rounded-sm text-center space-y-2">
                  <Upload className="w-6 h-6 text-[#B59B6D] mx-auto" />
                  <p className="text-xs text-slate-300">
                    Permitted formats: PDF, DWG, DXF, PNG, JPEG, ZIP (Max 50MB per file)
                  </p>
                  <label className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-sm bg-white/10 hover:bg-[#B59B6D] hover:text-black text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg,.zip"
                      onChange={handleFileUploadSim}
                    />
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {uploadedFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#0E121A] border border-white/10 rounded-sm">
                        <div className="flex items-center space-x-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-[#B59B6D] shrink-0" />
                          <span className="truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles(prev => prev.filter((_, idx) => idx !== i))}
                          className="text-slate-400 hover:text-rose-400 text-xs px-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Consultation Meeting Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Meeting Format
                  </label>
                  <select
                    value={meetingPreference}
                    onChange={(e) => setMeetingPreference(e.target.value as any)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  >
                    <option value="site_visit">On-Site Topography Visit</option>
                    <option value="online">Virtual Video Conference</option>
                    <option value="office">Executive Studio Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    value={preferredMeetingDate}
                    onChange={(e) => setPreferredMeetingDate(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Preferred Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM PST"
                    value={preferredMeetingTime}
                    onChange={(e) => setPreferredMeetingTime(e.target.value)}
                    className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Primary Meeting Agenda / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. Review topographical survey and preliminary investment framework"
                  value={meetingPurpose}
                  onChange={(e) => setMeetingPurpose(e.target.value)}
                  className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              {/* Data Protection Guarantee */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Non-Disclosure & AES-256 Vault Guarantee: All uploaded surveys and client data are protected under strict fiduciary confidentiality.</span>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.18em] flex items-center space-x-2 transition shadow-xl"
              >
                {loading ? (
                  <span>Registering Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Consultation & Quotation Request</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 5: Genuine Success & Reference ID Confirmation */}
        {step === 5 && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className={`font-serif text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Inquiry Successfully Logged
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you, <strong className="text-white">{fullName}</strong>. Your project inquiry has been recorded in our executive management system with single-point accountability.
              </p>
            </div>

            {/* Reference ID card */}
            <div className="p-4 rounded-sm bg-[#141924] border border-white/15 space-y-2.5 text-left max-w-md mx-auto text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Reference Tracking ID:</span>
                <span className="font-mono text-[#B59B6D] font-bold text-sm">
                  {successResult?.referenceId || 'INQ-2026-84210'}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Assigned Director:</span>
                <span className="text-white font-medium">Marcus Vance (Principal)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Executive Outreach Window:</span>
                <span className="text-emerald-400 font-bold font-mono">&lt; 60 Minutes SLA</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Selected Meeting Format:</span>
                <span className="text-white capitalize">{meetingPreference.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-7 py-3 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest transition"
              >
                Return to Platform
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
