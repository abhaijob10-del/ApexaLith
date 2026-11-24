import React from 'react';
import { 
  X, 
  DollarSign, 
  Layers, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  Sun, 
  Wind, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  PieChart
} from 'lucide-react';
import { BimAnalytics, BimBuildingData } from '../../bim/types/bim';

interface CostAndBimAnalyticsProps {
  isOpen: boolean;
  onClose: () => void;
  analytics: BimAnalytics;
  buildingData: BimBuildingData;
  isDarkMode: boolean;
}

export const CostAndBimAnalytics: React.FC<CostAndBimAnalyticsProps> = ({
  isOpen,
  onClose,
  analytics,
  buildingData,
  isDarkMode
}) => {
  if (!isOpen) return null;

  const { costBreakdown, quantityEstimates, constructionTimelineMonths, sustainabilityScore, energyEfficiencyGrade, naturalLightingIndex, ventilationIndex, sustainabilitySuggestions, lightingVentilationAnalysis } = analytics;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full max-w-4xl max-h-[90vh] rounded-sm border overflow-hidden flex flex-col shadow-2xl ${
        isDarkMode ? 'bg-[#0B0F17] border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D]">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold">BIM Estimation & Sustainability Intelligence</h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Granular material quantities, cost estimations, daylighting autonomy & LEED sustainability metrics.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={`p-4 rounded-sm border ${
              isDarkMode ? 'bg-[#121824] border-white/10' : 'bg-slate-100 border-slate-300'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B59B6D]">Total Turn-Key Budget</span>
              <div className="text-2xl font-serif font-bold text-[#B59B6D] mt-1">
                ${costBreakdown.totalEstimatedCostUsd.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">Fixed Cap Price</span>
            </div>

            <div className={`p-4 rounded-sm border ${
              isDarkMode ? 'bg-[#121824] border-white/10' : 'bg-slate-100 border-slate-300'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B59B6D]">Construction Timeline</span>
              <div className="text-2xl font-serif font-bold mt-1">
                {constructionTimelineMonths} Months
              </div>
              <span className="text-[10px] text-slate-400">Guaranteed Handover</span>
            </div>

            <div className={`p-4 rounded-sm border ${
              isDarkMode ? 'bg-[#121824] border-white/10' : 'bg-slate-100 border-slate-300'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B59B6D]">LEED Sustainability</span>
              <div className="text-2xl font-serif font-bold mt-1 text-emerald-400">
                {sustainabilityScore} / 100
              </div>
              <span className="text-[10px] text-slate-400">Grade {energyEfficiencyGrade} Net-Zero Ready</span>
            </div>

            <div className={`p-4 rounded-sm border ${
              isDarkMode ? 'bg-[#121824] border-white/10' : 'bg-slate-100 border-slate-300'
            }`}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B59B6D]">Daylight Autonomy</span>
              <div className="text-2xl font-serif font-bold mt-1 text-amber-400">
                {naturalLightingIndex}%
              </div>
              <span className="text-[10px] text-slate-400">Passive Solar Efficiency</span>
            </div>
          </div>

          {/* Cost Breakdown & Quantity Estimates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Breakdown */}
            <div className={`p-4 rounded-sm border space-y-3 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm text-[#B59B6D] uppercase tracking-wider">
                <DollarSign className="w-4 h-4" />
                <span>Financial Budget Breakdown</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'Structural Steel & Concrete Substructure', amount: costBreakdown.structuralConcreteSteel },
                  { label: 'High-Spec Glazing & Facade Panels', amount: costBreakdown.facadeAndGlazing },
                  { label: 'MEP, Plumbing & Smart Home Automation', amount: costBreakdown.mepplumbingElectrical },
                  { label: 'Interior Finishes, Stone & Millwork', amount: costBreakdown.interiorFinishesAndJoinery },
                  { label: 'Bespoke Loose Furniture & Decor', amount: costBreakdown.furnitureAndDecor },
                  { label: 'Permits, Insurance & Engineering Fee', amount: costBreakdown.contingencyAndPermits }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono font-bold">${item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity Estimates */}
            <div className={`p-4 rounded-sm border space-y-3 ${
              isDarkMode ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 font-bold text-sm text-[#B59B6D] uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>BIM Material Quantity Estimates</span>
              </div>

              <div className="space-y-2">
                {[
                  { label: 'High-Strength Concrete Volume', qty: `${quantityEstimates.concreteVolumeCubicMeters} m³` },
                  { label: 'Structural Steel I-Beams', qty: `${quantityEstimates.structuralSteelTons} Tons` },
                  { label: 'Double-Glazed Facade Glass', qty: `${quantityEstimates.glazingGlassAreaSqMeters} m²` },
                  { label: 'Hardwood & Marble Flooring', qty: `${quantityEstimates.flooringAreaSqMeters} m²` },
                  { label: 'Interior Partition Drywalls', qty: `${quantityEstimates.drywallWallAreaSqMeters} m²` },
                  { label: 'Venetian & Limewash Paint Coating', qty: `${quantityEstimates.paintAreaSqMeters} m²` }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1 border-b border-white/10">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-mono font-bold text-[#B59B6D]">{item.qty}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental, Daylight & Ventilation Reasoning */}
          <div className={`p-4 rounded-sm border space-y-3 ${
            isDarkMode ? 'bg-[#0D121D] border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
          }`}>
            <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Passivhaus & Natural Lighting Engineering Analysis</span>
            </div>

            <p className="leading-relaxed text-slate-300">
              {lightingVentilationAnalysis}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="font-bold text-[10px] uppercase text-[#B59B6D] tracking-wider">
                Sustainability Efficiency Recommendations:
              </span>
              {sustainabilitySuggestions.map((sugg, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sugg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t flex items-center justify-between ${
          isDarkMode ? 'border-white/10 bg-[#0D121D]' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="text-xs text-slate-400">
            Export full BIM schedule for contractors & bank financing.
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-sm bg-[#B59B6D] text-black font-bold uppercase text-xs tracking-wider hover:bg-[#c4ab7d] transition"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
