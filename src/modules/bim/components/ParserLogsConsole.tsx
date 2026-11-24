import React from 'react';
import { ParserLog } from '../types/BuildingModel';
import { Terminal, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';

interface ParserLogsConsoleProps {
  logs: ParserLog[];
  isDarkMode?: boolean;
}

export const ParserLogsConsole: React.FC<ParserLogsConsoleProps> = ({
  logs,
  isDarkMode = true
}) => {
  return (
    <div className={`rounded-sm border flex flex-col h-[280px] overflow-hidden ${
      isDarkMode ? 'bg-[#0A0D14] border-white/10 text-slate-200' : 'bg-slate-900 border-slate-700 text-slate-100'
    }`}>
      {/* Console Header */}
      <div className="px-3.5 py-2 border-b border-white/10 flex items-center justify-between bg-black/40">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#B59B6D]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#B59B6D]">
            Parser Engine System Logs
          </span>
          <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] font-mono text-[10px]">
            {logs.length} events
          </span>
        </div>
        <div className="text-[10px] text-white/50 font-mono">
          Web Worker Thread Active
        </div>
      </div>

      {/* Console Stream */}
      <div className="flex-1 p-3 overflow-y-auto space-y-1.5 font-mono text-xs">
        {logs.length === 0 ? (
          <div className="text-white/40 italic py-6 text-center">
            Upload an IFC or DXF/DWG file to observe real-time parser execution logs...
          </div>
        ) : (
          logs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
            return (
              <div
                key={log.id}
                className={`flex items-start space-x-2.5 p-1.5 rounded-sm border transition ${
                  log.level === 'error'
                    ? 'bg-rose-950/30 border-rose-800/40 text-rose-300'
                    : log.level === 'warn'
                    ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
                    : log.level === 'success'
                    ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                    : 'bg-white/5 border-white/5 text-slate-300'
                }`}
              >
                <span className="text-white/40 shrink-0 select-none text-[10px] pt-0.5">
                  [{timeStr}]
                </span>

                <span className="px-1.5 py-0.2 rounded bg-black/40 text-[#B59B6D] text-[9px] uppercase font-bold shrink-0">
                  {log.module}
                </span>

                <div className="flex-1 min-w-0 break-words leading-relaxed">
                  {log.message}
                  {log.details && (
                    <pre className="mt-1 p-1 rounded bg-black/50 text-[10px] text-slate-400 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                </div>

                <div className="shrink-0 pt-0.5">
                  {log.level === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  {log.level === 'warn' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                  {log.level === 'error' && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                  {log.level === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
