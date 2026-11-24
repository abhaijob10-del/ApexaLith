import React, { useState } from 'react';
import { 
  ConsultationRequestPayload, 
  AuditLogEntry 
} from '../../../types';
import { 
  BarChart3, 
  Users, 
  Building2, 
  Shield, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search 
} from 'lucide-react';

interface AdminDashboardProps {
  leads: ConsultationRequestPayload[];
  auditLogs: AuditLogEntry[];
  onUpdateLeadStatus: (leadId: string, status: any) => void;
  isDarkMode: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  leads,
  auditLogs,
  onUpdateLeadStatus,
  isDarkMode
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'audit_logs'>('leads');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredLeads = statusFilter === 'All' 
    ? leads 
    : leads.filter(l => l.status === statusFilter);

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-[#0A0A0A] text-[#F5F5F0]' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className={`p-6 sm:p-8 rounded-sm border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#B59B6D] uppercase tracking-[0.25em]">
              <Shield className="w-4 h-4" />
              <span>ApexaLith Operational Command & CRM</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1 text-[#F5F5F0]">
              Lead Lifecycle & System Security Audit
            </h1>
            <p className="text-xs text-white/50 font-light mt-1">
              Manage client inquiries, concierge queue SLAs, and immutable platform security logs.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-sm border border-emerald-500/30 uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Concierge Queue Active • 60m SLA</span>
          </div>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-[0.15em]">Total Inquiries</div>
            <div className="font-serif text-3xl font-bold text-[#F5F5F0] mt-1">{leads.length}</div>
            <div className="text-[10px] text-[#B59B6D] font-mono">Concierge SLA Monitored</div>
          </div>

          <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-[0.15em]">Active VIP Vaults</div>
            <div className="font-serif text-3xl font-bold text-[#B59B6D] mt-1">3</div>
            <div className="text-[10px] text-white/40 font-mono">AES-256 Encrypted</div>
          </div>

          <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-[0.15em]">Security Audits</div>
            <div className="font-serif text-3xl font-bold text-emerald-400 mt-1">{auditLogs.length}</div>
            <div className="text-[10px] text-white/40 font-mono">Immutable Log Stream</div>
          </div>

          <div className={`p-5 rounded-sm border ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 uppercase font-bold tracking-[0.15em]">Platform Uptime</div>
            <div className="font-serif text-3xl font-bold text-[#F5F5F0] mt-1">99.98%</div>
            <div className="text-[10px] text-emerald-400 font-mono">WAF / DDoS Protected</div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-white/10 gap-4 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'leads' ? 'border-[#B59B6D] text-[#B59B6D]' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            CRM Consultation Queue & Leads ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`pb-3 transition border-b-2 ${
              activeTab === 'audit_logs' ? 'border-[#B59B6D] text-[#B59B6D]' : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Security Audit Logs ({auditLogs.length})
          </button>
        </div>

        {/* Tab 1: Leads Queue */}
        {activeTab === 'leads' && (
          <div className={`p-6 sm:p-8 rounded-sm border space-y-4 ${
            isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl font-bold text-[#F5F5F0]">Inquiry Pipeline Management</h3>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#121212] border border-white/10 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
              >
                <option value="All">All Statuses</option>
                <option value="new_inquiry">New Inquiry</option>
                <option value="consultation_scheduled">Consultation Scheduled</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <div key={lead.id} className="p-4 rounded-sm bg-[#121212] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-white">{lead.fullName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#B59B6D] font-mono">
                        {lead.projectType}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-white/70 font-mono">
                        {lead.estimatedTier?.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-white/50">
                      Email: {lead.email} • Phone: {lead.phone} • City: {lead.city} • Created: {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                    {lead.notes && (
                      <p className="text-xs text-white/70 font-light italic mt-1">"{lead.notes}"</p>
                    )}
                  </div>

                  {/* Status Dropdown Transition */}
                  <div className="shrink-0 flex items-center space-x-3">
                    <select
                      value={lead.status}
                      onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as any)}
                      className="bg-[#0D0D0D] border border-white/10 rounded-sm px-3 py-1.5 text-xs text-[#B59B6D] font-bold font-mono focus:outline-none focus:border-[#B59B6D]"
                    >
                      <option value="new_inquiry">New Inquiry</option>
                      <option value="contact_initiated">Contact Initiated</option>
                      <option value="consultation_scheduled">Consultation Scheduled</option>
                      <option value="site_visit">Site Visit</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Security Audit Logs */}
        {activeTab === 'audit_logs' && (
          <div className={`p-6 sm:p-8 rounded-sm border space-y-4 ${
            isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-serif text-xl font-bold text-[#F5F5F0]">PRD Section 5.3 Audit Log Stream</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase tracking-[0.15em] text-[10px]">
                    <th className="py-3 px-4">Log ID</th>
                    <th className="py-3 px-4">Actor ID</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Resource ID</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-white/80">
                  {auditLogs.map((log) => (
                    <tr key={log.log_id} className="hover:bg-white/5">
                      <td className="py-3 px-4 text-[#B59B6D] font-bold">{log.log_id}</td>
                      <td className="py-3 px-4">{log.actor_id}</td>
                      <td className="py-3 px-4 uppercase">{log.role}</td>
                      <td className="py-3 px-4 text-white">{log.action}</td>
                      <td className="py-3 px-4 text-white/50">{log.resource_id}</td>
                      <td className="py-3 px-4">{log.ip_address}</td>
                      <td className="py-3 px-4">{log.timestamp}</td>
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
        )}
      </div>
    </div>
  );
};
