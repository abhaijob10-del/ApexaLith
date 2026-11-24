import React, { useState, useEffect } from 'react';
import { 
  CustomerInquiry, 
  ProjectDetails, 
  ProjectQuotation, 
  ServiceOffering, 
  TeamMember, 
  ApprovalRequest, 
  InvoiceRecord, 
  AuditLogEntry, 
  InquiryStatus,
  ProjectMilestone 
} from '../types';
import { 
  Shield, 
  Users, 
  Building2, 
  FileText, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  Calendar, 
  Briefcase, 
  Compass, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Download,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Check,
  X,
  FileSpreadsheet,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  isDarkMode: boolean;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isDarkMode,
  onNavigateTab
}) => {
  const [activeModule, setActiveModule] = useState<
    'overview' | 'inquiries' | 'projects' | 'services' | 'quotations' | 'team' | 'finance' | 'approvals' | 'audit'
  >('overview');

  // Core Data States
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [quotations, setQuotations] = useState<ProjectQuotation[]>([]);
  const [services, setServices] = useState<ServiceOffering[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>([]);
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('All');

  // Modals & Sub-actions
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(null);
  const [selectedQuotation, setSelectedQuotation] = useState<ProjectQuotation | null>(null);
  const [newNoteText, setNewNoteText] = useState('');
  const [convertingInquiry, setConvertingInquiry] = useState<CustomerInquiry | null>(null);
  const [convertManagerId, setConvertManagerId] = useState('team_01');
  const [convertBudget, setConvertBudget] = useState('18000000');

  // New Quotation Modal State
  const [createQuoOpen, setCreateQuoOpen] = useState(false);
  const [newQuoClient, setNewQuoClient] = useState('');
  const [newQuoEmail, setNewQuoEmail] = useState('');
  const [newQuoProject, setNewQuoProject] = useState('');
  const [newQuoItems, setNewQuoItems] = useState<{ description: string; category: string; quantity: number; unitPrice: number }[]>([
    { description: 'Foundation & Bedrock Caisson Engineering', category: 'Civil', quantity: 1, unitPrice: 1200000 },
    { description: 'High-Tensile Structural Steel Moment Framing', category: 'Structure', quantity: 1, unitPrice: 3800000 }
  ]);

  // New Service Modal State
  const [editingService, setEditingService] = useState<ServiceOffering | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  // Fetch all live backend data
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [resInq, resProj, resQuo, resSvc, resTeam, resAppr, resInv, resAudit] = await Promise.all([
        fetch('/api/inquiries').then(r => r.json()),
        fetch('/api/projects').then(r => r.json()),
        fetch('/api/quotations').then(r => r.json()),
        fetch('/api/services').then(r => r.json()),
        fetch('/api/team').then(r => r.json()),
        fetch('/api/approvals').then(r => r.json()),
        fetch('/api/invoices').then(r => r.json()),
        fetch('/api/audit-logs').then(r => r.json())
      ]);

      if (resInq.inquiries) setInquiries(resInq.inquiries);
      if (resProj.projects) setProjects(resProj.projects);
      if (resQuo.quotations) setQuotations(resQuo.quotations);
      if (resSvc.services) setServices(resSvc.services);
      if (resTeam.team) setTeamMembers(resTeam.team);
      if (resAppr.approvals) setApprovalRequests(resAppr.approvals);
      if (resInv.invoices) setInvoices(resInv.invoices);
      if (resAudit.auditLogs) setAuditLogs(resAudit.auditLogs);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered Inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const q = inquirySearch.toLowerCase().trim();
    const matchQuery = q === '' ||
      inq.fullName.toLowerCase().includes(q) ||
      inq.id.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.city.toLowerCase().includes(q);
    const matchStatus = inquiryStatusFilter === 'All' || inq.status === inquiryStatusFilter;
    return matchQuery && matchStatus;
  });

  // Handle Inquiry Status Update
  const handleUpdateInquiryStatus = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setInquiries(prev => prev.map(i => i.id === id ? { ...i, status: newStatus } : i));
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null);
        }
        showFeedback(`Inquiry status updated to ${newStatus}.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Contact Note to Inquiry
  const handleAddInquiryNote = async () => {
    if (!selectedInquiry || !newNoteText.trim()) return;
    try {
      const res = await fetch(`/api/inquiries/${selectedInquiry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNoteText.trim(), author: 'Executive Admin' })
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedInquiry(data.inquiry);
        setInquiries(prev => prev.map(i => i.id === data.inquiry.id ? data.inquiry : i));
        setNewNoteText('');
        showFeedback('Contact note recorded to audit trail.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Convert Approved Inquiry to Project
  const handleExecuteConvertInquiry = async () => {
    if (!convertingInquiry) return;
    try {
      const res = await fetch(`/api/inquiries/${convertingInquiry.id}/convert-to-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedManagerId: convertManagerId,
          totalBudget: Number(convertBudget)
        })
      });
      const data = await res.json();
      if (res.ok) {
        showFeedback(`Project "${data.project.name}" initialized successfully.`);
        setConvertingInquiry(null);
        loadDashboardData();
        setActiveModule('projects');
      } else {
        alert(data.error || 'Conversion failed');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Quotation
  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/quotations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: newQuoClient,
          clientEmail: newQuoEmail,
          projectName: newQuoProject,
          items: newQuoItems,
          taxPercentage: 5
        })
      });
      const data = await res.json();
      if (res.ok) {
        setQuotations(prev => [data.quotation, ...prev]);
        setCreateQuoOpen(false);
        showFeedback(`Quotation ${data.quotation.id} prepared with derived totals.`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Update Service Offering
  const handleSaveService = async () => {
    if (!editingService) return;
    try {
      const res = await fetch(`/api/services/${editingService.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService)
      });
      if (res.ok) {
        setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
        setEditingService(null);
        showFeedback('Service offering updated and published live.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Financial Computations from Stored Invoices
  const totalBilled = invoices.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const totalReceived = invoices.reduce((acc, curr) => acc + (curr.status === 'Paid' ? curr.amount : (curr.paidAmount || 0)), 0);
  const totalPending = totalBilled - totalReceived;

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-[#080B10] text-[#F5F5F0]' : 'bg-[#F9F8F5] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className={`p-6 rounded-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#B59B6D] uppercase tracking-[0.25em]">
              <Shield className="w-4 h-4 text-[#B59B6D]" />
              <span>ApexaLith Executive Command & Governance</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1">
              Platform Administration Control Centre
            </h1>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Comprehensive governance across customer inquiries, project milestones, services, contracts, and audit trails.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-[10px] font-mono px-3 py-1.5 rounded-sm bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 uppercase font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Admin Access</span>
            </span>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {actionFeedback && (
          <div className="p-3.5 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D] text-[#B59B6D] text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#B59B6D]" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* High-Density Navigation Module Bar */}
        <div className={`flex items-center space-x-1 overflow-x-auto p-1.5 rounded-sm border text-xs uppercase tracking-wider font-bold ${
          isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, count: null },
            { id: 'inquiries', label: 'Inquiries', icon: FileText, count: inquiries.length },
            { id: 'projects', label: 'Projects', icon: Building2, count: projects.length },
            { id: 'quotations', label: 'Quotations', icon: FileSpreadsheet, count: quotations.length },
            { id: 'services', label: 'Services', icon: Layers, count: services.length },
            { id: 'team', label: 'Team', icon: Users, count: teamMembers.length },
            { id: 'finance', label: 'Finance', icon: DollarSign, count: null },
            { id: 'approvals', label: 'Approvals', icon: CheckCircle2, count: approvalRequests.filter(a => a.status === 'pending').length },
            { id: 'audit', label: 'Audit Logs', icon: Lock, count: auditLogs.length }
          ].map((m) => {
            const Icon = m.icon;
            const isActive = activeModule === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setActiveModule(m.id as any)}
                className={`px-3 py-2 rounded-sm transition flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
                  isActive 
                    ? 'bg-[#B59B6D] text-black font-bold shadow-md' 
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-white hover:bg-white/5' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{m.label}</span>
                {m.count !== null && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-sm font-mono font-bold ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-[#B59B6D]'
                  }`}>
                    {m.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* MODULE 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeModule === 'overview' && (
          <div className="space-y-6">
            {/* Top KPI Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Customer Inquiries</span>
                <div className="font-serif text-3xl font-bold mt-1 text-[#B59B6D]">{inquiries.length}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-1">SLA Concierge Tracked</div>
              </div>

              <div className={`p-4 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active Construction Projects</span>
                <div className="font-serif text-3xl font-bold mt-1">{projects.filter(p => p.status === 'active').length}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{projects.length} Total Registered</div>
              </div>

              <div className={`p-4 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Quotations</span>
                <div className="font-serif text-3xl font-bold mt-1 text-amber-400">{quotations.filter(q => q.status === 'Sent').length}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">{quotations.filter(q => q.status === 'Accepted').length} Legally Accepted</div>
              </div>

              <div className={`p-4 rounded-sm border ${isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Billed Revenue</span>
                <div className="font-serif text-3xl font-bold mt-1 text-emerald-400">${(totalBilled / 1000000).toFixed(1)}M</div>
                <div className="text-[10px] text-slate-400 font-mono mt-1">${(totalReceived / 1000000).toFixed(1)}M Disbursed</div>
              </div>
            </div>

            {/* Quick Actions & Recent Queue */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Inquiries List */}
              <div className={`lg:col-span-8 p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold">New & Active Inquiries Queue</h3>
                  <button
                    onClick={() => setActiveModule('inquiries')}
                    className="text-xs uppercase tracking-wider font-bold text-[#B59B6D] hover:underline flex items-center space-x-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {inquiries.slice(0, 4).map((inq) => (
                    <div 
                      key={inq.id}
                      onClick={() => { setSelectedInquiry(inq); setActiveModule('inquiries'); }}
                      className={`p-3.5 rounded-sm border cursor-pointer transition flex items-center justify-between ${
                        isDarkMode ? 'bg-[#121622] border-white/10 hover:border-[#B59B6D]' : 'bg-slate-50 border-slate-200 hover:border-[#B59B6D]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs">{inq.fullName}</span>
                          <span className="text-[10px] font-mono text-[#B59B6D] font-bold">{inq.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-sm bg-black/30 text-slate-300 font-mono capitalize">
                            {inq.projectType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-md">
                          {inq.siteAddress} • Budget: {inq.budgetRange}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase font-mono ${
                          inq.status === 'New Inquiry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          inq.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          'bg-white/10 text-slate-300'
                        }`}>
                          {inq.status}
                        </span>
                        <div className="text-[10px] text-slate-500 font-mono mt-1">{new Date(inq.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Approvals & Quick Shortcuts */}
              <div className={`lg:col-span-4 p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-serif text-lg font-bold">Action Centre & Approvals</h3>

                <div className="space-y-3">
                  {approvalRequests.filter(a => a.status === 'pending').map((appr) => (
                    <div key={appr.id} className="p-3 rounded-sm bg-[#121622] border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-amber-400 font-bold uppercase font-mono">{appr.category} Sign-Off</span>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(appr.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs font-bold text-white">{appr.title}</div>
                      <p className="text-[11px] text-slate-400">{appr.projectName}</p>
                    </div>
                  ))}

                  {approvalRequests.filter(a => a.status === 'pending').length === 0 && (
                    <p className="text-xs text-slate-400 italic">No pending client approvals awaiting action.</p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <button
                    onClick={() => setCreateQuoOpen(true)}
                    className="w-full py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Quotation</span>
                  </button>

                  <button
                    onClick={() => setActiveModule('projects')}
                    className="w-full py-2.5 rounded-sm border border-white/20 hover:border-[#B59B6D] text-xs uppercase tracking-wider font-bold transition flex items-center justify-center space-x-2"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#B59B6D]" />
                    <span>Manage Projects & Milestones</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: LEADS & INQUIRIES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'inquiries' && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className={`p-4 rounded-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search inquiries by client name, reference ID, email, city..."
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  className="w-full bg-transparent text-xs focus:outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-[10px] uppercase font-bold text-slate-400">Status Filter:</span>
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="bg-[#141924] border border-white/15 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                >
                  <option value="All">All Statuses ({inquiries.length})</option>
                  <option value="New Inquiry">New Inquiry</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Consultation Scheduled">Consultation Scheduled</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Quotation Preparation">Quotation Preparation</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>
            </div>

            {/* Inquiries Table Grid */}
            <div className={`rounded-sm border overflow-hidden ${
              isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] font-bold uppercase tracking-wider ${
                    isDarkMode ? 'bg-[#121622] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Ref ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Project Type & Location</th>
                      <th className="py-3 px-4">Budget Scope</th>
                      <th className="py-3 px-4">Owner</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredInquiries.map((inq) => (
                      <tr 
                        key={inq.id}
                        className={`hover:bg-white/5 transition cursor-pointer ${
                          selectedInquiry?.id === inq.id ? 'bg-[#B59B6D]/10' : ''
                        }`}
                        onClick={() => setSelectedInquiry(inq)}
                      >
                        <td className="py-3 px-4 font-mono font-bold text-[#B59B6D]">{inq.id}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{inq.fullName}</div>
                          <div className="text-[11px] text-slate-400">{inq.email}</div>
                          <div className="text-[10px] text-slate-500">{inq.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="capitalize font-medium">{inq.projectType}</div>
                          <div className="text-[11px] text-slate-400">{inq.siteAddress}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-mono text-white">{inq.budgetRange}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{inq.budgetFlexibility.replace('_', ' ')}</div>
                        </td>
                        <td className="py-3 px-4 text-slate-300">{inq.assignedOwner || 'Unassigned'}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase font-mono ${
                            inq.status === 'New Inquiry' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            inq.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-white/10 text-slate-300 border border-white/10'
                          }`}>
                            {inq.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedInquiry(inq); }}
                            className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-[#B59B6D] hover:text-black text-xs font-bold transition"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Detailed Selected Inquiry Drawer / Modal */}
            {selectedInquiry && (
              <div className={`p-6 rounded-sm border space-y-5 ${
                isDarkMode ? 'bg-[#0D1017] border-[#B59B6D]/40' : 'bg-white border-slate-300 shadow-xl'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#B59B6D] font-bold uppercase tracking-widest">
                      {selectedInquiry.id} • Active Customer Lead
                    </span>
                    <h3 className="font-serif text-2xl font-bold mt-0.5">{selectedInquiry.fullName}</h3>
                    <p className="text-xs text-slate-400">
                      Email: {selectedInquiry.email} • Phone: {selectedInquiry.phone} • Preferred: {selectedInquiry.preferredCommunication}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status Dropdown Transition */}
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleUpdateInquiryStatus(selectedInquiry.id, e.target.value as InquiryStatus)}
                      className="bg-[#141924] border border-[#B59B6D] rounded-sm px-3 py-1.5 text-xs text-[#B59B6D] font-bold font-mono focus:outline-none"
                    >
                      <option value="New Inquiry">New Inquiry</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Consultation Scheduled">Consultation Scheduled</option>
                      <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                      <option value="Quotation Preparation">Quotation Preparation</option>
                      <option value="Quotation Sent">Quotation Sent</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="On Hold">On Hold</option>
                    </select>

                    {/* Convert to Project Action */}
                    {!selectedInquiry.convertedProjectId && (
                      <button
                        onClick={() => setConvertingInquiry(selectedInquiry)}
                        className="px-4 py-1.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-md"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Convert to Project</span>
                      </button>
                    )}

                    {selectedInquiry.convertedProjectId && (
                      <span className="text-[10px] px-2.5 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 font-bold uppercase font-mono border border-emerald-500/30">
                        Converted ({selectedInquiry.convertedProjectId})
                      </span>
                    )}

                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Requirements Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-sm bg-[#121622] border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Site & Dimensions</span>
                    <div className="font-semibold text-white">{selectedInquiry.siteAddress}</div>
                    <div className="text-slate-400">Plot: {selectedInquiry.plotSizeSqFt?.toLocaleString() || 'N/A'} Sq Ft</div>
                    <div className="text-slate-400">Built-Up: {selectedInquiry.builtUpAreaSqFt?.toLocaleString() || 'N/A'} Sq Ft ({selectedInquiry.floors || 2} Floors)</div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#121622] border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Financial Framework</span>
                    <div className="font-semibold font-mono text-[#B59B6D]">{selectedInquiry.budgetRange}</div>
                    <div className="text-slate-400 capitalize">Flexibility: {selectedInquiry.budgetFlexibility.replace('_', ' ')}</div>
                    <div className="text-slate-400">Meeting Format: {selectedInquiry.meetingPreference}</div>
                  </div>

                  <div className="p-3.5 rounded-sm bg-[#121622] border border-white/10 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Required Services</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedInquiry.requiredServices.map((s, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Description */}
                <div className="p-3.5 rounded-sm bg-[#121622] border border-white/10 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Project Description & Client Vision</span>
                  <p className="text-slate-200 leading-relaxed font-light">{selectedInquiry.projectDescription}</p>
                </div>

                {/* Contact Notes & Follow-Up Log */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs font-bold text-[#B59B6D] uppercase tracking-wider">
                    <span>Contact Audit Log & Notes</span>
                    <span className="font-mono text-slate-400">{selectedInquiry.contactNotes?.length || 0} Recorded</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Enter follow-up note (e.g. Completed site survey review call with client)..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddInquiryNote()}
                      className="flex-1 bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                    <button
                      onClick={handleAddInquiryNote}
                      className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider transition"
                    >
                      Add Note
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedInquiry.contactNotes?.map((n, i) => (
                      <div key={i} className="p-2.5 rounded-sm bg-[#141924] border border-white/5 text-xs flex justify-between items-start">
                        <span className="text-slate-200">{n.note}</span>
                        <div className="text-[10px] text-slate-400 font-mono text-right shrink-0 ml-4">
                          <span>{n.author}</span> • <span>{new Date(n.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Convert Inquiry Modal */}
            {convertingInquiry && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className={`max-w-md w-full rounded-sm border p-6 space-y-4 ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <h3 className="font-serif text-xl font-bold">Convert Inquiry to Construction Project</h3>
                  <p className="text-xs text-slate-400">
                    Converting <strong className="text-white">{convertingInquiry.fullName}</strong>'s inquiry into an active project will automatically link their customer record without duplicating profiles.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Assign Lead Project Manager</label>
                      <select
                        value={convertManagerId}
                        onChange={(e) => setConvertManagerId(e.target.value)}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      >
                        {teamMembers.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.role.replace('_', ' ')})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Contract Total Budget ($)</label>
                      <input
                        type="number"
                        value={convertBudget}
                        onChange={(e) => setConvertBudget(e.target.value)}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setConvertingInquiry(null)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExecuteConvertInquiry}
                      className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider"
                    >
                      Confirm Project Creation
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: PROJECT MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'projects' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold">Active Projects & Construction Governance</h2>
              <span className="text-xs font-mono text-slate-400">{projects.length} Total Registered Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div 
                  key={proj.id}
                  className={`p-5 rounded-sm border space-y-4 ${
                    isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#B59B6D] uppercase">{proj.id}</span>
                      <h3 className="font-serif text-xl font-bold text-white mt-0.5">{proj.name}</h3>
                      <p className="text-xs text-slate-400">{proj.location}</p>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase font-mono ${
                      proj.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-500/20 text-slate-300'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{proj.stage}</span>
                      <span className="font-mono text-[#B59B6D] font-bold">{proj.progressPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-[#B59B6D]" style={{ width: `${proj.progressPercentage}%` }} />
                    </div>
                  </div>

                  {/* Milestones count and financial */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Assigned Client</span>
                      <div className="font-semibold text-white">{proj.customerName || 'Private Client'}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase">Total Budget</span>
                      <div className="font-mono text-[#B59B6D] font-bold">
                        ${proj.financials ? (proj.financials.totalBudget / 1000000).toFixed(1) + 'M' : '15.0M'}
                      </div>
                    </div>
                  </div>

                  {/* Milestones accordion */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] font-bold uppercase text-[#B59B6D]">Milestone Progress ({proj.milestones.length})</span>
                    <div className="space-y-1.5">
                      {proj.milestones.map((m) => (
                        <div key={m.id} className="p-2 rounded-sm bg-[#121622] text-xs flex justify-between items-center">
                          <span className="truncate max-w-[200px] text-slate-200">{m.title}</span>
                          <span className={`text-[10px] font-mono font-bold ${m.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {m.status === 'completed' ? '100%' : `${m.progressPercentage}%`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: QUOTATIONS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'quotations' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold">Project Quotations & Line-Item Estimates</h2>
                <p className="text-xs text-slate-400">All figures derived mathematically from saved unit prices and quantities.</p>
              </div>

              <button
                onClick={() => setCreateQuoOpen(true)}
                className="px-4 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Quotation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quotations.map((quo) => (
                <div key={quo.id} className={`p-5 rounded-sm border space-y-4 ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#B59B6D]">{quo.id} (Rev {quo.revision})</span>
                      <h3 className="font-serif text-lg font-bold text-white">{quo.projectName}</h3>
                      <p className="text-xs text-slate-400">Client: {quo.clientName} ({quo.clientEmail})</p>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase font-mono ${
                      quo.status === 'Accepted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      quo.status === 'Sent' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-white/10 text-slate-300'
                    }`}>
                      {quo.status}
                    </span>
                  </div>

                  {/* Line Items Preview */}
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Line Items ({quo.items.length})</span>
                    {quo.items.map((it) => (
                      <div key={it.id} className="p-2 rounded-sm bg-[#121622] flex justify-between items-center text-[11px]">
                        <span className="text-slate-300 truncate max-w-xs">{it.description}</span>
                        <span className="font-mono text-white font-semibold">${it.total.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Totals Summary */}
                  <div className="pt-3 border-t border-white/10 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Subtotal:</span>
                      <span className="font-mono text-white">${quo.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Taxes & Permitting Fees ({quo.taxPercentage}%):</span>
                      <span className="font-mono text-white">${quo.taxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-white/10 text-[#B59B6D]">
                      <span>Grand Total:</span>
                      <span className="font-mono">${quo.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {quo.acceptedAt && (
                    <div className="p-2 rounded-sm bg-emerald-500/10 text-emerald-300 text-[11px] font-mono flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Legally Accepted by {quo.acceptedBy} on {new Date(quo.acceptedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Create Quotation Modal */}
            {createQuoOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className={`max-w-lg w-full rounded-sm border p-6 space-y-4 max-h-[90vh] overflow-y-auto ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif text-xl font-bold">Prepare Project Quotation</h3>
                    <button onClick={() => setCreateQuoOpen(false)} className="p-1 text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateQuotation} className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Client Full Name *</label>
                      <input
                        type="text"
                        required
                        value={newQuoClient}
                        onChange={(e) => setNewQuoClient(e.target.value)}
                        placeholder="e.g. Lord Alexander Vance"
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Client Email *</label>
                      <input
                        type="email"
                        required
                        value={newQuoEmail}
                        onChange={(e) => setNewQuoEmail(e.target.value)}
                        placeholder="client@holdings.com"
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={newQuoProject}
                        onChange={(e) => setNewQuoProject(e.target.value)}
                        placeholder="e.g. Bel Air Sanctuary Contract"
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    {/* Line Items */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-[#B59B6D]">
                        <span>Scope Line Items</span>
                        <button
                          type="button"
                          onClick={() => setNewQuoItems(prev => [...prev, { description: 'New item', category: 'Civil', quantity: 1, unitPrice: 500000 }])}
                          className="hover:underline"
                        >
                          + Add Line
                        </button>
                      </div>

                      {newQuoItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 rounded-sm bg-[#141924] space-y-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewQuoItems(prev => prev.map((it, i) => i === idx ? { ...it, description: val } : it));
                            }}
                            className="w-full bg-black/30 border border-white/10 rounded-sm p-1.5 text-xs text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400">Qty</span>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setNewQuoItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: val } : it));
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-sm p-1 text-xs text-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400">Unit Price ($)</span>
                              <input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setNewQuoItems(prev => prev.map((it, i) => i === idx ? { ...it, unitPrice: val } : it));
                                }}
                                className="w-full bg-black/30 border border-white/10 rounded-sm p-1 text-xs text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex justify-end space-x-2 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setCreateQuoOpen(false)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider"
                      >
                        Emit Formal Quotation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 5: SERVICES DATA-DRIVEN MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'services' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold">Data-Driven Service Offerings</h2>
                <p className="text-xs text-slate-400">All public services are loaded from this database. Edit here to update live website copy without touching code.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div key={svc.id} className={`p-5 rounded-sm border flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#B59B6D] font-bold uppercase">{svc.category}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase font-mono ${
                        svc.published ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {svc.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-white">{svc.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{svc.description}</p>

                    <div className="space-y-1 pt-2 border-t border-white/10">
                      <span className="text-[10px] font-bold text-[#B59B6D] uppercase">Key Deliverables</span>
                      <ul className="text-[11px] text-slate-300 space-y-0.5">
                        {svc.keyDeliverables.map((d, i) => (
                          <li key={i}>• {d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-end">
                    <button
                      onClick={() => setEditingService(svc)}
                      className="px-3 py-1.5 rounded-sm bg-white/10 hover:bg-[#B59B6D] hover:text-black text-xs font-bold transition flex items-center space-x-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Service</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Service Modal */}
            {editingService && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <div className={`max-w-lg w-full rounded-sm border p-6 space-y-4 ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <h3 className="font-serif text-xl font-bold">Edit Public Service Offering</h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={editingService.tagline}
                        onChange={(e) => setEditingService({ ...editingService, tagline: e.target.value })}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingService.description}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="pub_check"
                        checked={editingService.published}
                        onChange={(e) => setEditingService({ ...editingService, published: e.target.checked })}
                      />
                      <label htmlFor="pub_check" className="text-xs font-bold text-white">Publish live on public website</label>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveService}
                      className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider"
                    >
                      Save & Publish
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 6: TEAM MANAGEMENT */}
        {/* ========================================================================= */}
        {activeModule === 'team' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold">Authorized Team & Project Managers</h2>
                <p className="text-xs text-slate-400">Each team member is restricted strictly to assigned projects and permitted operational roles.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <div key={member.id} className={`p-5 rounded-sm border space-y-3 ${
                  isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-white">{member.name}</h3>
                      <div className="text-xs text-slate-400">{member.email}</div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] font-mono font-bold uppercase">
                      {member.role.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Assigned Projects ({member.assignedProjectIds.length})</span>
                    <div className="flex flex-wrap gap-1">
                      {member.assignedProjectIds.map((pId) => (
                        <span key={pId} className="text-[10px] font-mono px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-slate-300">
                          {pId}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 7: AUDIT LOGS */}
        {/* ========================================================================= */}
        {activeModule === 'audit' && (
          <div className="space-y-4">
            <h2 className="font-serif text-xl font-bold">Immutable System Security & Operation Audit Logs</h2>
            <div className={`rounded-sm border overflow-hidden ${
              isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className={`border-b text-[10px] uppercase font-bold tracking-wider ${
                    isDarkMode ? 'bg-[#121622] border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="py-3 px-4">Log ID</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Resource</th>
                      <th className="py-3 px-4">IP Address</th>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {auditLogs.map((log) => (
                      <tr key={log.log_id} className="hover:bg-white/5">
                        <td className="py-3 px-4 text-[#B59B6D] font-bold">{log.log_id}</td>
                        <td className="py-3 px-4 text-white">{log.actor_id}</td>
                        <td className="py-3 px-4 uppercase">{log.role}</td>
                        <td className="py-3 px-4">{log.action}</td>
                        <td className="py-3 px-4 text-slate-500">{log.resource_id}</td>
                        <td className="py-3 px-4">{log.ip_address}</td>
                        <td className="py-3 px-4 text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-sm text-[10px] bg-emerald-500/20 text-emerald-400 font-bold uppercase border border-emerald-500/30">
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
