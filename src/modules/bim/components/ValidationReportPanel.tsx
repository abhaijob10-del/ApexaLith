import React, { useState } from 'react';
import { ValidationReport, SupportedFileType } from '../types/BuildingModel';
import { ShieldAlert, CheckCircle, AlertTriangle, Upload, HelpCircle, FilePlus, ChevronRight } from 'lucide-react';

interface ValidationReportPanelProps {
  report: ValidationReport;
  onUploadAdditionalFile?: (file: File) => void;
  isDarkMode?: boolean;
}

export const ValidationReportPanel: React.FC<ValidationReportPanelProps> = ({
  report,
  onUploadAdditionalFile,
  isDarkMode = true
}) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onUploadAdditionalFile) {
      onUploadAdditionalFile(e.target.files[0]);
    }
  };

  return (
    <div className={`rounded-sm border p-4 space-y-4 ${
      isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Header Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-sm border flex items-center justify-center ${
            report.isSufficient 
              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
              : 'bg-amber-950/40 border-amber-500/50 text-amber-400'
          }`}>
            {report.isSufficient ? <CheckCircle className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
              Parsing Quality & Validation Audit
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {report.statusMessage}
            </div>
          </div>
        </div>

        {/* Confidence Score Gauge */}
        <div className="flex items-center space-x-3 bg-black/40 px-3.5 py-2 rounded-sm border border-white/10">
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-white/50">Quality Confidence</div>
            <div className={`text-base font-bold font-mono ${
              report.confidenceScore >= 80 ? 'text-emerald-400' : report.confidenceScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {report.confidenceScore}%
            </div>
          </div>
          <div className="w-12 h-2 rounded-full bg-slate-800 overflow-hidden border border-white/10">
            <div 
              className={`h-full transition-all duration-500 ${
                report.confidenceScore >= 80 ? 'bg-emerald-400' : report.confidenceScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Audit Checks List */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[#B59B6D]">
          BIM/CAD Structural Verification Checks
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {report.validationChecks.map((chk, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-sm border flex items-start space-x-2.5 ${
                chk.passed 
                  ? 'bg-emerald-950/20 border-emerald-800/30 text-emerald-200' 
                  : 'bg-amber-950/20 border-amber-800/30 text-amber-200'
              }`}
            >
              {chk.passed ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              <div>
                <div className="font-bold text-white">{chk.checkName}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{chk.details}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requested Information / Additional File Prompts */}
      {report.requestedInformation.length > 0 && (
        <div className="border-t border-white/10 pt-3 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>Requested Architectural Documentation</span>
            </div>
            <span className="text-[10px] text-white/50">
              Never invent missing geometry
            </span>
          </div>

          <div className="space-y-2">
            {report.requestedInformation.map(req => (
              <div
                key={req.id}
                className={`p-3 rounded-sm border transition flex items-center justify-between ${
                  selectedPrompt === req.id 
                    ? 'bg-[#B59B6D]/15 border-[#B59B6D]' 
                    : 'bg-[#141414] border-white/10 hover:border-[#B59B6D]/50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <FilePlus className="w-5 h-5 text-[#B59B6D] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center space-x-2">
                      <span>{req.title}</span>
                      {req.isRequired && (
                        <span className="px-1.5 py-0.2 rounded bg-rose-900/50 text-rose-300 text-[9px] uppercase font-bold border border-rose-700/50">
                          Mandatory
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-white/70 mt-0.5">{req.description}</div>
                    <div className="text-[10px] text-[#B59B6D] font-mono mt-1">
                      Accepted Formats: {req.fileType.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Upload Action Button */}
                <label className="cursor-pointer px-3 py-1.5 rounded-sm bg-[#B59B6D] text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1 hover:bg-[#c4ab7d] transition shrink-0 ml-3">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Supply File</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={req.fileType.map(ft => `.${ft.toLowerCase()}`).join(',')}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
