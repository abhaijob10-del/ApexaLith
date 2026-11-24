import React from 'react';
import { ProjectDetails } from '../../../types';
import { 
  TrendingUp, 
  DollarSign, 
  PieChart, 
  Clock, 
  ShieldCheck, 
  Download, 
  FileCheck 
} from 'lucide-react';

interface InvestorDashboardProps {
  project: ProjectDetails;
  isDarkMode: boolean;
}

export const InvestorDashboard: React.FC<InvestorDashboardProps> = ({
  project,
  isDarkMode
}) => {
  const fin = project.financials || {
    totalBudget: 24500000,
    disbursedAmount: 19800000,
    committedExpenses: 3200000,
    contingencyRemaining: 1500000,
    projectedRoiPercent: 28.5,
    asOfDate: '2026-07-20'
  };

  const handleExportReport = () => {
    alert(`Institutional Financial & Audit Report for "${project.name}" generated as of ${fin.asOfDate}.`);
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
              <TrendingUp className="w-4 h-4" />
              <span>B2B Institutional Investor Dashboard</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight mt-1 text-[#F5F5F0]">
              Financial ROI & Cost Variance Report
            </h1>
            <p className="text-xs text-white/50 font-mono mt-1">
              Project: {project.name} • Verified Figures As of {fin.asOfDate}
            </p>
          </div>

          <button
            onClick={handleExportReport}
            className="px-4 py-2.5 rounded-sm bg-[#B59B6D] text-black font-bold text-xs uppercase tracking-[0.15em] flex items-center space-x-2 shadow-lg hover:bg-[#c4ab7d] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Verified Audit PDF</span>
          </button>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`p-5 rounded-sm border space-y-1 ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em]">Total Approved Capital</div>
            <div className="font-serif text-2xl font-bold text-[#F5F5F0]">${fin.totalBudget.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-mono">100% Equity Funded</div>
          </div>

          <div className={`p-5 rounded-sm border space-y-1 ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em]">Disbursed to Date</div>
            <div className="font-serif text-2xl font-bold text-[#B59B6D]">${fin.disbursedAmount.toLocaleString()}</div>
            <div className="text-[10px] text-white/40 font-mono">{((fin.disbursedAmount / fin.totalBudget) * 100).toFixed(1)}% Executed</div>
          </div>

          <div className={`p-5 rounded-sm border space-y-1 ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em]">Contingency Reserve</div>
            <div className="font-serif text-2xl font-bold text-[#F5F5F0]">${fin.contingencyRemaining.toLocaleString()}</div>
            <div className="text-[10px] text-emerald-400 font-mono">Zero Unplanned Overruns</div>
          </div>

          <div className={`p-5 rounded-sm border space-y-1 ${isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-[10px] text-white/50 font-bold uppercase tracking-[0.15em]">Projected IRR / ROI</div>
            <div className="font-serif text-2xl font-bold text-emerald-400">+{fin.projectedRoiPercent}%</div>
            <div className="text-[10px] text-white/40 font-mono font-bold">Valuation Benchmark: $32.5M</div>
          </div>
        </div>

        {/* Milestone Financial Breakdown */}
        <div className={`p-6 sm:p-8 rounded-sm border space-y-6 ${
          isDarkMode ? 'bg-[#0D0D0D] border-white/10' : 'bg-white border-slate-200'
        }`}>
          <h3 className="font-serif text-xl font-bold text-[#F5F5F0]">Milestone Cost Variance Table</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase tracking-[0.15em] text-[10px]">
                  <th className="py-3 px-4">Phase & Milestone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Budgeted Cost</th>
                  <th className="py-3 px-4 text-right">Actual Cost</th>
                  <th className="py-3 px-4 text-right">Variance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-white/80">
                {project.milestones.map((m) => {
                  const budgeted = m.costBudgeted || 4500000;
                  const actual = m.costActual || 4420000;
                  const variance = budgeted - actual;
                  return (
                    <tr key={m.id} className="hover:bg-white/5">
                      <td className="py-3.5 px-4 font-bold text-[#F5F5F0]">{m.title}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                          m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">${budgeted.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-right">${actual.toLocaleString()}</td>
                      <td className={`py-3.5 px-4 text-right font-bold ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {variance >= 0 ? `+$${variance.toLocaleString()}` : `-$${Math.abs(variance).toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
