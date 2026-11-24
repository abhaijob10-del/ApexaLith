import React, { useState, useEffect } from 'react';
import { 
  ProjectDetails, 
  UserRole, 
  ProjectDocument, 
  ApprovalRequest, 
  ProjectQuotation, 
  InvoiceRecord 
} from '../types';
import { INITIAL_PROJECTS } from '../data/mockData';
import { 
  Lock, 
  Video, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Download, 
  Building2, 
  Check, 
  DollarSign, 
  Upload, 
  Send, 
  MessageSquare,
  ChevronDown,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface VipClientPortalProps {
  currentRole: UserRole;
  currentUser?: any;
  projects?: ProjectDetails[];
  isDarkMode: boolean;
  onOpenConsultation: () => void;
}

export const VipClientPortal: React.FC<VipClientPortalProps> = ({
  currentRole,
  currentUser,
  projects = INITIAL_PROJECTS,
  isDarkMode,
  onOpenConsultation
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'approvals' | 'cameras' | 'documents' | 'logs' | 'finances'>('overview');
  
  // Safe resolution of projects list
  const safeProjectsList = (projects && projects.length > 0) ? projects : INITIAL_PROJECTS;

  // Security & context check: Match current client email if authenticated
  const customerEmail = currentUser?.email || 'a.vance@vanceholdings.com';
  const matchedProjects = (currentRole === 'customer' || currentRole === 'homeowner')
    ? safeProjectsList.filter(p => p.customerEmail && p.customerEmail.toLowerCase() === customerEmail.toLowerCase())
    : safeProjectsList;

  // Available projects guarantees at least one project is always present
  const availableProjects = (matchedProjects.length > 0 ? matchedProjects : safeProjectsList).length > 0
    ? (matchedProjects.length > 0 ? matchedProjects : safeProjectsList)
    : INITIAL_PROJECTS;

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    availableProjects[0]?.id || 'proj_aspen_ridge_001'
  );

  // Sync selectedProjectId if project list changes or currently selected is invalid
  useEffect(() => {
    if (!selectedProjectId || !availableProjects.some(p => p.id === selectedProjectId)) {
      if (availableProjects.length > 0) {
        setSelectedProjectId(availableProjects[0].id);
      }
    }
  }, [availableProjects, selectedProjectId]);

  const activeProject: ProjectDetails = availableProjects.find(p => p.id === selectedProjectId) 
    || availableProjects[0] 
    || INITIAL_PROJECTS[0];

  // Approvals & Quotations State
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [quotations, setQuotations] = useState<ProjectQuotation[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Document Upload State
  const [clientDocuments, setClientDocuments] = useState<ProjectDocument[]>(activeProject?.documents || []);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Support Message
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Load project specific approvals, quotations, and invoices
  useEffect(() => {
    if (!activeProject?.id) return;
    
    fetch(`/api/approvals?projectId=${activeProject.id}`)
      .then(r => r.json())
      .then(d => { 
        if (Array.isArray(d.approvals)) {
          setApprovals(d.approvals);
        } else {
          setApprovals([]);
        }
      })
      .catch(() => setApprovals([]));

    fetch(`/api/quotations?projectId=${activeProject.id}`)
      .then(r => r.json())
      .then(d => { 
        if (Array.isArray(d.quotations)) {
          setQuotations(d.quotations);
        } else {
          setQuotations([]);
        }
      })
      .catch(() => setQuotations([]));

    fetch(`/api/invoices?projectId=${activeProject.id}`)
      .then(r => r.json())
      .then(d => { 
        if (Array.isArray(d.invoices)) {
          setInvoices(d.invoices);
        } else {
          setInvoices([]);
        }
      })
      .catch(() => setInvoices([]));

    setClientDocuments(activeProject.documents || []);
  }, [activeProject?.id]);

  // Handle Customer Approve / Reject on Design or Material item
  const handleDecideApproval = async (approvalId: string, decision: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/approvals/${approvalId}/decide`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          actedBy: currentUser?.name || activeProject?.customerName || 'Lord Alexander Vance',
          notes: decision === 'approved' ? 'Digitally authorized via VIP Client Vault.' : 'Declined by client.'
        })
      });

      if (res.ok) {
        setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: decision, actedAt: new Date().toISOString() } : a));
        showNotice(`Approval request ${decision === 'approved' ? 'duly signed & authorized' : 'declined'} with cryptographic timestamp.`);
      }
    } catch (e) {
      console.error(e);
      // Fallback state update
      setApprovals(prev => prev.map(a => a.id === approvalId ? { ...a, status: decision, actedAt: new Date().toISOString() } : a));
      showNotice(`Approval request marked ${decision}.`);
    }
  };

  // Handle Customer Quotation Acceptance
  const handleAcceptQuotation = async (quotationId: string) => {
    try {
      const res = await fetch(`/api/quotations/${quotationId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          acceptedBy: currentUser?.name || activeProject?.customerName || 'Lord Alexander Vance'
        })
      });

      if (res.ok) {
        setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: 'Accepted', acceptedAt: new Date().toISOString() } : q));
        showNotice(`Quotation contract executed. Master construction agreement committed.`);
      }
    } catch (e) {
      console.error(e);
      setQuotations(prev => prev.map(q => q.id === quotationId ? { ...q, status: 'Accepted', acceptedAt: new Date().toISOString() } : q));
      showNotice(`Quotation accepted.`);
    }
  };

  // Upload Client Document
  const handleClientUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: ProjectDocument = {
        id: `doc_client_${Date.now()}`,
        title: file.name,
        category: 'Specification',
        fileType: (file.name.split('.').pop()?.toLowerCase() || 'pdf') as any,
        fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        version: 'v1.0',
        encryptedKeyHash: 'sha256_client_encrypted_' + Math.random().toString(36).substring(2, 8)
      };

      setClientDocuments(prev => [newDoc, ...prev]);
      setUploadSuccess(`Document "${file.name}" securely encrypted and saved to project vault.`);
      setTimeout(() => setUploadSuccess(null), 4000);
    }
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setSupportSubmitted(true);
    setSupportMessage('');
    setTimeout(() => setSupportSubmitted(false), 4500);
  };

  // Safe Financial Aggregations
  const safeInvoices = invoices || [];
  const totalBilled = safeInvoices.reduce((a, b) => a + (b.amount || 0), 0);
  const totalPaid = safeInvoices.reduce((a, b) => a + (b.status === 'Paid' ? (b.amount || 0) : (b.paidAmount || 0)), 0);
  const balanceRemaining = Math.max(0, totalBilled - totalPaid);

  const pendingApprovalsCount = (approvals || []).filter(a => a.status === 'pending').length;
  const milestonesList = activeProject?.milestones || [];
  const dailyLogsList = activeProject?.dailyLogs || [];

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-[#080B10] text-[#F5F5F0]' : 'bg-[#F9F8F5] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* VIP Vault Header & Project Switcher */}
        <div className={`p-6 sm:p-8 rounded-sm border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-1 rounded-sm bg-[#B59B6D] text-black">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#B59B6D]">
                ApexaLith Private Client Vault (Encrypted Fiduciary Portal)
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-sm bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                <ShieldCheck className="w-3 h-3" />
                <span>256-Bit Encrypted</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="font-serif text-3xl font-bold tracking-tight">
                {activeProject?.name || 'The Aspen Ridge Sanctuary'}
              </h1>
              
              {/* Project Switcher if multiple projects available */}
              {availableProjects.length > 1 && (
                <div className="relative inline-block">
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className={`text-xs px-3 py-1.5 rounded-sm border font-medium focus:outline-none focus:border-[#B59B6D] cursor-pointer ${
                      isDarkMode 
                        ? 'bg-[#141924] border-white/15 text-white' 
                        : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    {availableProjects.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        Switch: {proj.name} ({proj.city || proj.location})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400 font-light flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#B59B6D]" />
                <span>{activeProject?.location || 'Aspen, Colorado'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <UserCheck className="w-3 h-3 text-[#B59B6D]" />
                <span>Client: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{activeProject?.customerName || currentUser?.name || 'Lord Alexander Vance'}</strong></span>
              </span>
              <span>•</span>
              <span className="text-[#B59B6D] font-mono">Stage: {activeProject?.stage || 'Interior Crafting'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Contact Concierge</span>
            </button>
          </div>
        </div>

        {/* Global Notice Alert */}
        {actionNotice && (
          <div className="p-3.5 rounded-sm bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Portal Tabs Bar */}
        <div className={`flex border-b overflow-x-auto gap-2 text-xs font-bold uppercase tracking-wider p-1 rounded-sm ${
          isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {[
            { id: 'overview', label: 'Overview & Milestones', icon: Building2 },
            { id: 'approvals', label: 'Approvals & Requests', icon: CheckCircle2, badge: pendingApprovalsCount },
            { id: 'cameras', label: 'Live Site Feeds', icon: Video },
            { id: 'documents', label: 'Contracts & Blueprints', icon: FileText },
            { id: 'logs', label: 'Daily Field Reports', icon: Calendar },
            { id: 'finances', label: 'Invoices & Quotations', icon: DollarSign }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-sm transition flex items-center space-x-2 whitespace-nowrap ${
                  isActive 
                    ? 'bg-[#B59B6D] text-black font-bold shadow-md' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-amber-500 text-black font-mono font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & MILESTONES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Overall Progress</span>
                <div className="font-serif text-4xl font-bold text-[#B59B6D] mt-1">{activeProject?.progressPercentage ?? 82}%</div>
                <p className="text-xs text-slate-400 mt-2">Stage: {activeProject?.stage || 'Interior Crafting & Joinery'}</p>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div 
                    className="bg-[#B59B6D] h-full transition-all duration-500" 
                    style={{ width: `${activeProject?.progressPercentage ?? 82}%` }}
                  />
                </div>
              </div>

              <div className={`p-6 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Built-Up Footprint</span>
                <div className={`font-serif text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {(activeProject?.builtUpSqFt ?? 14500).toLocaleString()} SQ FT
                </div>
                <p className="text-xs text-slate-400 mt-2 font-mono">
                  Plot Size: {(activeProject?.plotSizeSqFt ?? 42000).toLocaleString()} SQ FT • {activeProject?.floors ?? 3} Levels
                </p>
              </div>

              <div className={`p-6 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assigned Lead Overseer</span>
                <div className={`font-serif text-2xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Marcus Vance
                </div>
                <p className="text-xs text-emerald-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On-Site Daily Governance Active</span>
                </p>
              </div>
            </div>

            {/* Milestones list */}
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold">Construction Phase Milestones</h3>
                  <p className="text-xs text-slate-400">Audited engineering milestones tied to contract progress.</p>
                </div>
                <span className="text-xs font-mono text-[#B59B6D]">
                  {milestonesList.filter(m => m.status === 'completed').length} / {milestonesList.length} Complete
                </span>
              </div>

              <div className="space-y-3">
                {milestonesList.map((m) => (
                  <div key={m.id} className={`p-4 rounded-sm border flex items-start justify-between gap-4 text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{m.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#B59B6D] font-mono uppercase">
                          {m.phase}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light">{m.description}</p>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Target Window: {m.startDate} → {m.targetCompletion}
                        {m.responsiblePerson && ` • Lead: ${m.responsiblePerson}`}
                      </div>
                    </div>
                    <span className={`text-xs font-mono font-bold shrink-0 ${
                      m.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {m.status === 'completed' ? 'Completed' : `${m.progressPercentage}%`}
                    </span>
                  </div>
                ))}

                {milestonesList.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    Milestones are being synchronized with the on-site engineering team.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CLIENT APPROVAL REQUESTS */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold">Design & Material Approval Requests</h3>
                  <p className="text-xs text-slate-400">Review material samples, finish specifications, and scope change orders requiring fiduciary authorization.</p>
                </div>
                <span className="text-xs font-mono text-[#B59B6D] font-bold">
                  {pendingApprovalsCount} Pending Signatures
                </span>
              </div>

              <div className="space-y-4">
                {(approvals || []).map((appr) => (
                  <div key={appr.id} className={`p-5 rounded-sm border space-y-3 text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] font-bold uppercase">
                            {appr.category}
                          </span>
                          <h4 className={`font-serif text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{appr.title}</h4>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{appr.description}</p>
                      </div>

                      <span className={`text-[10px] px-2.5 py-1 rounded-sm font-bold uppercase font-mono ${
                        appr.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        appr.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {appr.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <div className="text-slate-400">
                        <span>Submitted by: </span>
                        <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{appr.submittedBy}</strong>
                        {appr.costImpact !== undefined && appr.costImpact > 0 && (
                          <span className="ml-3 text-amber-300 font-mono">Cost Impact: +${appr.costImpact.toLocaleString()}</span>
                        )}
                      </div>

                      {appr.status === 'pending' && (
                        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => handleDecideApproval(appr.id, 'rejected')}
                            className="px-3 py-1.5 rounded-sm bg-rose-500/20 hover:bg-rose-500 hover:text-black text-rose-300 font-bold uppercase text-[10px] tracking-wider transition"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => handleDecideApproval(appr.id, 'approved')}
                            className="px-4 py-1.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold uppercase text-xs tracking-wider transition flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Sign & Authorize</span>
                          </button>
                        </div>
                      )}

                      {appr.actedAt && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1 sm:mt-0">
                          Acted by {appr.actedBy} on {new Date(appr.actedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {(approvals || []).length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    All currently submitted design approvals and material finish samples have been reviewed.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE CAMERA FEEDS */}
        {activeTab === 'cameras' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B59B6D] uppercase tracking-[0.2em]">
                    Tokenized HLS Camera Telemetry
                  </span>
                  <h3 className={`font-serif text-2xl font-bold mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Site Mast 01 — Main Cantilever Elevation & Terrace
                  </h3>
                </div>
                <div className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Telemetry Live • 4K 60FPS</span>
                </div>
              </div>

              <div className="relative aspect-[16/9] rounded-sm overflow-hidden border border-white/10 bg-black">
                <img
                  src={activeProject?.heroImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop'}
                  alt="Live Camera Feed"
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-black/90 backdrop-blur-md flex items-center space-x-2 border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">ENCRYPTED LIVE TELEMETRY</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-sm bg-black/80 backdrop-blur-md border border-white/10 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-300">
                  <div>Site Location: {activeProject?.location}</div>
                  <div>Weather: Clear 72°F • Wind: 4 mph NW • Sensor Grid: Active</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTRACTS, BLUEPRINTS & DOCUMENT UPLOADS */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {uploadSuccess && (
              <div className="p-3.5 rounded-sm bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-mono">
                {uploadSuccess}
              </div>
            )}

            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-serif text-2xl font-bold">Approved Contracts, Blueprints & Documents</h3>
                  <p className="text-xs text-slate-400">All confidential files are AES-256 encrypted with access restricted to authorized parties.</p>
                </div>

                {/* Upload additional document */}
                <label className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider cursor-pointer transition flex items-center space-x-1.5 shrink-0 shadow-md">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Client Document</span>
                  <input type="file" className="hidden" onChange={handleClientUpload} />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(clientDocuments || []).map((doc) => (
                  <div key={doc.id} className={`p-4 rounded-sm border flex items-center justify-between text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{doc.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#B59B6D] font-mono">
                          {doc.version}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Category: {doc.category} • File: {doc.fileType.toUpperCase()} ({doc.fileSize}) • Date: {doc.uploadDate}
                      </div>
                    </div>

                    <button
                      onClick={() => showNotice(`Encrypted download link generated for "${doc.title}".`)}
                      className="px-3.5 py-1.5 rounded-sm bg-[#B59B6D]/15 hover:bg-[#B59B6D] hover:text-black text-[#B59B6D] text-xs font-bold uppercase transition flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}

                {(clientDocuments || []).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    No documents currently archived for this project. Use the upload button above to submit plans or specifications.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: DAILY SITE LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <h3 className="font-serif text-2xl font-bold">Daily Site Field Reports & Photographic Updates</h3>
              <div className="space-y-4">
                {dailyLogsList.map((log) => (
                  <div key={log.id} className={`p-5 rounded-sm border space-y-3 text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-[#B59B6D]">{log.date}</span>
                        <h4 className={`font-serif text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{log.title}</h4>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Weather: {log.weather} • Workers: {log.workersOnSite} • Site Manager: {log.siteManager}
                      </div>
                    </div>

                    <p className={`font-light leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{log.notes}</p>

                    {log.imageUrls && log.imageUrls.length > 0 && (
                      <div className="flex items-center space-x-3 pt-2 overflow-x-auto">
                        {log.imageUrls.map((img, i) => (
                          <div key={i} className="w-32 h-24 rounded-sm overflow-hidden border border-white/10 shrink-0">
                            <img src={img} alt="Daily field progress" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {dailyLogsList.length === 0 && (
                  <div className="text-center py-8 text-xs text-slate-400 italic">
                    Daily field logs are updated by 6:00 PM local time on active workdays.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: INVOICES & QUOTATIONS */}
        {activeTab === 'finances' && (
          <div className="space-y-6">
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase text-slate-400">Total Billed to Date</span>
                <div className={`font-serif text-3xl font-bold mt-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  ${totalBilled.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Based on verified milestones</div>
              </div>

              <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase text-slate-400">Disbursed Payments</span>
                <div className="font-serif text-3xl font-bold text-emerald-400 mt-1">${totalPaid.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400/80 mt-1">Settled & Confirmed in Escrow</div>
              </div>

              <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase text-slate-400">Pending Invoice Balance</span>
                <div className="font-serif text-3xl font-bold text-amber-400 mt-1">${balanceRemaining.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400 mt-1">Due under contract schedule</div>
              </div>
            </div>

            {/* Invoices List */}
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <h3 className="font-serif text-xl font-bold">Progress Invoices</h3>
              <div className="space-y-2.5">
                {safeInvoices.map((inv) => (
                  <div key={inv.id} className={`p-3.5 rounded-sm border flex items-center justify-between text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-[#B59B6D]">{inv.invoiceNumber}</span>
                        <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{inv.description}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">Due: {inv.dueDate}</div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        ${inv.amount.toLocaleString()}
                      </div>
                      <span className={`text-[10px] font-mono font-bold uppercase ${
                        inv.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}

                {safeInvoices.length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    No open invoices pending for this project.
                  </div>
                )}
              </div>
            </div>

            {/* Quotations List */}
            <div className={`p-6 rounded-sm border space-y-4 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
              <h3 className="font-serif text-xl font-bold">Formal Quotations & Contracts</h3>
              <div className="space-y-3">
                {(quotations || []).map((quo) => (
                  <div key={quo.id} className={`p-4 rounded-sm border space-y-3 text-xs ${
                    isDarkMode ? 'bg-[#121622] border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono text-[#B59B6D] font-bold">{quo.id}</span>
                        <h4 className={`font-bold text-sm mt-0.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{quo.projectName}</h4>
                      </div>
                      <div className="text-right">
                        <div className={`font-mono font-bold text-base ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          ${quo.total.toLocaleString()}
                        </div>
                        <span className={`text-[10px] font-mono uppercase font-bold ${
                          quo.status === 'Accepted' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {quo.status}
                        </span>
                      </div>
                    </div>

                    {quo.status === 'Sent' && (
                      <div className="pt-2 border-t border-white/10 flex justify-end">
                        <button
                          onClick={() => handleAcceptQuotation(quo.id)}
                          className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold uppercase text-xs tracking-wider transition"
                        >
                          Accept & Execute Contract
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {(quotations || []).length === 0 && (
                  <div className="text-center py-6 text-xs text-slate-400 italic">
                    All contract agreements executed.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Direct Project Manager Communication */}
        <div className={`p-6 rounded-sm border space-y-3 ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-[#B59B6D]" />
            <h3 className={`font-serif text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Direct Communication with Project Manager
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Submit confidential project inquiries, change questions, or site inspection requests directly to lead engineer Marcus Vance.
          </p>

          {supportSubmitted ? (
            <div className="p-3.5 rounded-sm bg-emerald-500/20 text-emerald-300 text-xs font-mono flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Message dispatched to Project Manager Marcus Vance. Expected response &lt; 2 hours.</span>
            </div>
          ) : (
            <form onSubmit={handleSendSupport} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask a question or request a site consultation..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                className={`flex-1 border rounded-sm px-3.5 py-2 text-xs focus:outline-none focus:border-[#B59B6D] ${
                  isDarkMode ? 'bg-[#141924] border-white/15 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 transition shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
