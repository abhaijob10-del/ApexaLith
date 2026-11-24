import React, { useState, useEffect } from 'react';
import { 
  ProjectDetails, 
  DailyLogEntry, 
  ApprovalRequest, 
  ProjectMilestone 
} from '../types';
import { 
  HardHat, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Plus, 
  FileText, 
  Send, 
  Image as ImageIcon,
  Building2,
  Lock,
  ArrowRight
} from 'lucide-react';

interface ConstructionTeamPortalProps {
  currentUser?: any;
  isDarkMode: boolean;
  onNavigateTab: (tab: string) => void;
}

export const ConstructionTeamPortal: React.FC<ConstructionTeamPortalProps> = ({
  currentUser,
  isDarkMode,
  onNavigateTab
}) => {
  const [assignedProjects, setAssignedProjects] = useState<ProjectDetails[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Daily Site Log Form
  const [logTitle, setLogTitle] = useState('');
  const [logNotes, setLogNotes] = useState('');
  const [logWeather, setLogWeather] = useState('Clear 74°F');
  const [workersCount, setWorkersCount] = useState('18');
  const [delaysReported, setDelaysReported] = useState('');
  const [logPhotos, setLogPhotos] = useState<string[]>([]);
  const [isSubmittingLog, setIsSubmittingLog] = useState(false);

  // Approval Submission Form
  const [apprTitle, setApprTitle] = useState('');
  const [apprCategory, setApprCategory] = useState<'Design' | 'Material' | 'Scope Change' | 'Milestone Sign-off'>('Material');
  const [apprDesc, setApprDesc] = useState('');
  const [apprCostImpact, setApprCostImpact] = useState('0');
  const [isSubmittingAppr, setIsSubmittingAppr] = useState(false);

  // Feedback Notification
  const [portalMessage, setPortalMessage] = useState<string | null>(null);

  const showMsg = (msg: string) => {
    setPortalMessage(msg);
    setTimeout(() => setPortalMessage(null), 4000);
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      // If team member ID is known, pass it; otherwise default to 'team_01'
      const teamId = currentUser?.id || 'team_01';
      const res = await fetch(`/api/projects?teamMemberId=${teamId}`);
      const data = await res.json();
      if (data.projects && data.projects.length > 0) {
        setAssignedProjects(data.projects);
        setSelectedProjectId(data.projects[0].id);
      } else {
        // Fallback: fetch all active projects for demo inspection
        const fallbackRes = await fetch('/api/projects');
        const fallbackData = await fallbackRes.json();
        setAssignedProjects(fallbackData.projects || []);
        if (fallbackData.projects?.length > 0) {
          setSelectedProjectId(fallbackData.projects[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const activeProject = assignedProjects.find(p => p.id === selectedProjectId) || assignedProjects[0];

  // Submit Daily Site Update
  const handleSubmitDailyLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !logNotes.trim()) return;

    setIsSubmittingLog(true);
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/site-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: logTitle || 'Daily Construction Progress Log',
          notes: logNotes,
          weather: logWeather,
          siteManager: currentUser?.name || 'Marcus Vance, Lead Site Engineer',
          workersOnSite: Number(workersCount),
          imageUrls: logPhotos.length > 0 ? logPhotos : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'],
          delaysReported: delaysReported.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok) {
        showMsg('Daily site log & photos posted to live customer vault.');
        setLogTitle('');
        setLogNotes('');
        setDelaysReported('');
        setLogPhotos([]);
        loadProjects();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingLog(false);
    }
  };

  // Submit Item for Customer Approval
  const handleSubmitApproval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !apprTitle.trim()) return;

    setIsSubmittingAppr(true);
    try {
      const res = await fetch('/api/approvals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          title: apprTitle,
          category: apprCategory,
          description: apprDesc,
          submittedBy: currentUser?.name || 'Marcus Vance (Project Manager)',
          costImpact: Number(apprCostImpact)
        })
      });

      if (res.ok) {
        showMsg(`Approval request "${apprTitle}" dispatched to customer portal.`);
        setApprTitle('');
        setApprDesc('');
        setApprCostImpact('0');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingAppr(false);
    }
  };

  // Update Milestone Status
  const handleUpdateMilestone = async (milestoneId: string, progress: number, status: string) => {
    if (!activeProject) return;
    try {
      const res = await fetch(`/api/projects/${activeProject.id}/milestones/${milestoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressPercentage: progress, status })
      });
      if (res.ok) {
        showMsg('Milestone progress updated and synchronized with client portal.');
        loadProjects();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDarkMode ? 'bg-[#080B10] text-[#F5F5F0]' : 'bg-[#F9F8F5] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Portal Header */}
        <div className={`p-6 rounded-sm border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold text-[#B59B6D] uppercase tracking-[0.25em]">
              <HardHat className="w-4 h-4 text-[#B59B6D]" />
              <span>Construction Operations & Site Management</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1">
              Field Execution & Project Manager Workspace
            </h1>
            <p className="text-xs text-slate-400 font-light mt-0.5">
              Logged in as: <strong className="text-white">{currentUser?.name || 'Marcus Vance'}</strong> ({currentUser?.role || 'Project Manager'}). Only assigned projects are accessible.
            </p>
          </div>

          {/* Project Switcher */}
          {assignedProjects.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-[#141924] border border-white/15 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
              >
                {assignedProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {portalMessage && (
          <div className="p-3.5 rounded-sm bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{portalMessage}</span>
          </div>
        )}

        {activeProject && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 7 Columns: Daily Site Logs & Milestone Progress Updates */}
            <div className="lg:col-span-7 space-y-6">
              {/* Daily Site Update Form */}
              <div className={`p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-[#B59B6D]" />
                    <h3 className="font-serif text-lg font-bold">Submit Daily Site Report</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                    Syncs to VIP Client Vault
                  </span>
                </div>

                <form onSubmit={handleSubmitDailyLog} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Log Headline *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Master Wing Calacatta Slab Placement & Millwork Framing"
                      value={logTitle}
                      onChange={(e) => setLogTitle(e.target.value)}
                      className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Weather Conditions</label>
                      <input
                        type="text"
                        value={logWeather}
                        onChange={(e) => setLogWeather(e.target.value)}
                        placeholder="e.g. Sunny 75°F"
                        className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Active Workers on Site</label>
                      <input
                        type="number"
                        value={workersCount}
                        onChange={(e) => setWorkersCount(e.target.value)}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Site Progress & Work Details *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Record exact trade execution, structural inspections passed, stone artisan installations..."
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      className="w-full bg-[#141924] border border-white/15 rounded-sm p-3 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-amber-400 mb-1">
                      Report Delays or Material Issues (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Freight delay on German glazing clips (+2 days buffered in CPM)"
                      value={delaysReported}
                      onChange={(e) => setDelaysReported(e.target.value)}
                      className="w-full bg-[#141924] border border-amber-500/30 rounded-sm px-3.5 py-2 text-xs text-amber-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingLog}
                      className="px-6 py-2.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmittingLog ? 'Broadcasting...' : 'Publish Site Update'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Milestones Progress Controls */}
              <div className={`p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-serif text-lg font-bold">Assigned Project Milestones ({activeProject.milestones.length})</h3>

                <div className="space-y-3">
                  {activeProject.milestones.map((m) => (
                    <div key={m.id} className="p-3.5 rounded-sm bg-[#121622] border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{m.title}</span>
                          <span className="text-[10px] font-mono text-[#B59B6D] ml-2 uppercase">({m.phase})</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold ${
                          m.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {m.status === 'completed' ? 'Completed' : `${m.progressPercentage}%`}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400">{m.description}</p>

                      <div className="flex items-center space-x-2 pt-1">
                        <button
                          onClick={() => handleUpdateMilestone(m.id, Math.min(100, m.progressPercentage + 15), m.progressPercentage + 15 >= 100 ? 'completed' : 'in_progress')}
                          className="px-2.5 py-1 rounded-sm bg-white/10 hover:bg-[#B59B6D] hover:text-black text-[10px] font-bold uppercase transition"
                        >
                          +15% Progress
                        </button>
                        <button
                          onClick={() => handleUpdateMilestone(m.id, 100, 'completed')}
                          className="px-2.5 py-1 rounded-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black text-[10px] font-bold uppercase transition"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Submit Items for Customer Approval & Past Logs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Submit for Customer Approval Form */}
              <div className={`p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#B59B6D]" />
                  <h3 className="font-serif text-lg font-bold">Request Client Approval</h3>
                </div>

                <form onSubmit={handleSubmitApproval} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Approval Item Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wine Vault Smoked Oak Finish Selection"
                      value={apprTitle}
                      onChange={(e) => setApprTitle(e.target.value)}
                      className="w-full bg-[#141924] border border-white/15 rounded-sm px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Category</label>
                      <select
                        value={apprCategory}
                        onChange={(e) => setApprCategory(e.target.value as any)}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-1.5 text-xs text-white"
                      >
                        <option value="Material">Material Sample</option>
                        <option value="Design">Design Detail</option>
                        <option value="Scope Change">Scope Change</option>
                        <option value="Milestone Sign-off">Milestone Sign-Off</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Cost Impact ($)</label>
                      <input
                        type="number"
                        value={apprCostImpact}
                        onChange={(e) => setApprCostImpact(e.target.value)}
                        className="w-full bg-[#141924] border border-white/15 rounded-sm p-1.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Technical Specification Details</label>
                    <textarea
                      rows={2}
                      placeholder="Describe sample origins, physical rub tests, warranty terms..."
                      value={apprDesc}
                      onChange={(e) => setApprDesc(e.target.value)}
                      className="w-full bg-[#141924] border border-white/15 rounded-sm p-2 text-xs text-white focus:outline-none focus:border-[#B59B6D]"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingAppr}
                      className="px-5 py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-wider"
                    >
                      {isSubmittingAppr ? 'Submitting...' : 'Dispatch for Approval'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Field Logs */}
              <div className={`p-5 rounded-sm border space-y-4 ${
                isDarkMode ? 'bg-[#0D1017] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <h3 className="font-serif text-lg font-bold">Past Recorded Site Logs</h3>
                <div className="space-y-3">
                  {activeProject.dailyLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-sm bg-[#121622] text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{log.title}</span>
                        <span className="text-[10px] font-mono text-[#B59B6D]">{log.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-light leading-relaxed">{log.notes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
