import React, { useState } from 'react';
import { BrokerReferral, ProjectArchetype } from '../../../types';
import { Compass, Plus, CheckCircle2, Clock, UserCheck, DollarSign, Building2 } from 'lucide-react';

interface BrokerPortalProps {
  referrals: BrokerReferral[];
  onAddReferral: (ref: BrokerReferral) => void;
  isDarkMode: boolean;
}

export const BrokerPortal: React.FC<BrokerPortalProps> = ({
  referrals,
  onAddReferral,
  isDarkMode
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [projectType, setProjectType] = useState<ProjectArchetype>('Estate');
  const [estimatedValueRange, setEstimatedValueRange] = useState<string>('$15,000,000 - $25,000,000');
  const [notes, setNotes] = useState<string>('');

  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  const handleSubmitReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef: BrokerReferral = {
      id: 'ref_' + Math.random().toString(36).substring(2, 8),
      brokerId: 'broker_current_user',
      brokerName: 'Harrison Ford-Smythe',
      brokerCompany: 'Sotheby\'s International Realty',
      clientName,
      clientEmail,
      clientPhone,
      projectType,
      estimatedValueRange,
      notes,
      status: 'submitted',
      submissionDate: new Date().toISOString().split('T')[0],
      commissionEstimatePct: 2.5
    };

    onAddReferral(newRef);
    setSubmissionSuccess(`Referral for ${clientName} submitted successfully and assigned to Concierge Review.`);
    setShowForm(false);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');

    setTimeout(() => setSubmissionSuccess(null), 4000);
  };

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
              <Compass className="w-4 h-4" />
              <span>ApexaLith Premium Broker Network</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1 text-[#F5F5F0]">
              Client Referral & Status Tracking Portal
            </h1>
            <p className="text-xs text-white/50 font-light mt-1">
              Submit high-net-worth client leads for luxury residential & commercial construction and track pipeline progress.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 shadow-lg hover:bg-[#c4ab7d] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Submit New Client Referral</span>
          </button>
        </div>

        {submissionSuccess && (
          <div className="p-3.5 rounded-sm bg-emerald-500/10 border border-emerald-500 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{submissionSuccess}</span>
          </div>
        )}

        {/* Form Modal / Collapsible */}
        {showForm && (
          <form onSubmit={handleSubmitReferral} className={`p-6 rounded-sm border space-y-4 ${
            isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-serif text-xl font-bold text-[#F5F5F0]">New Client Referral Form</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Sterling"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Client Email *</label>
                <input
                  type="email"
                  required
                  placeholder="client@familyoffice.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Client Phone *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (310) 888-2910"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Project Category</label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as any)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                >
                  <option value="Villa">Villa</option>
                  <option value="Estate">Estate</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Compound">Compound</option>
                  <option value="Commercial Development">Commercial Development</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Estimated Value Range</label>
                <input
                  type="text"
                  value={estimatedValueRange}
                  onChange={(e) => setEstimatedValueRange(e.target.value)}
                  className="w-full bg-[#121212] border border-white/10 rounded-sm px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Referral Notes / Land Acquisition Context</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#121212] border border-white/10 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs text-white/40 hover:text-white uppercase tracking-wider font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#c4ab7d] transition-all"
              >
                Submit Referral
              </button>
            </div>
          </form>
        )}

        {/* Referrals Pipeline Table */}
        <div className={`p-6 sm:p-8 rounded-sm border space-y-4 ${
          isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-serif text-xl font-bold text-[#F5F5F0]">Your Submitted Referrals</h3>

          <div className="space-y-3">
            {referrals.map((ref) => (
              <div key={ref.id} className="p-4 rounded-sm bg-[#121212] border border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{ref.clientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-[#B59B6D] font-mono">
                      {ref.projectType}
                    </span>
                  </div>
                  <div className="text-xs text-white/50">
                    Range: {ref.estimatedValueRange} • Contact: {ref.clientEmail} • Submitted: {ref.submissionDate}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono uppercase font-bold text-amber-400 px-2.5 py-1 rounded-sm bg-amber-500/10 border border-amber-500/20">
                    {ref.status.replace('_', ' ')}
                  </span>
                  <div className="text-[10px] text-white/40 mt-1 font-mono">
                    Est. Fee: {ref.commissionEstimatePct}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
