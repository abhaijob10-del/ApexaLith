import React from 'react';
import { VersionRecord } from '../types/interiorTypes';
import { History, RotateCcw, RotateCw, Save, Check } from 'lucide-react';

interface VersionHistoryPanelProps {
  history: VersionRecord[];
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onSaveVersion: (title: string) => void;
  onRestoreVersion: (version: VersionRecord) => void;
  isDarkMode?: boolean;
}

export const VersionHistoryPanel: React.FC<VersionHistoryPanelProps> = ({
  history,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onSaveVersion,
  onRestoreVersion,
  isDarkMode = true
}) => {
  return (
    <div className={`p-3.5 space-y-3 text-xs font-sans rounded-sm border ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="font-bold text-sm uppercase tracking-wider">Version Control & History</h3>
        </div>

        {/* Undo / Redo Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 disabled:opacity-30 transition"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 disabled:opacity-30 transition"
            title="Redo"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Save Version Button */}
      <button
        onClick={() => onSaveVersion(`v1.${history.length + 1} User Snapshot`)}
        className="w-full py-2 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold uppercase tracking-wider text-[10px] transition flex items-center justify-center space-x-1.5 shadow"
      >
        <Save className="w-3.5 h-3.5" />
        <span>Save New Design Snapshot</span>
      </button>

      {/* History Timeline */}
      <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
        {history.map((ver) => (
          <div
            key={ver.id}
            className={`p-2.5 rounded-sm border flex items-center justify-between transition ${
              isDarkMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="space-y-0.5">
              <span className="font-bold text-xs text-white block">{ver.title}</span>
              <span className="text-[9px] font-mono text-slate-400 block">{ver.createdAt}</span>
              <p className="text-[10px] text-slate-300">{ver.changeSummary}</p>
            </div>

            <button
              onClick={() => onRestoreVersion(ver)}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-[#B59B6D] font-bold text-[9px] uppercase transition border border-[#B59B6D]/30 shrink-0"
            >
              Restore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
