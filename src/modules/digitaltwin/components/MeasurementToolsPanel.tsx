import React from 'react';
import { MeasurementItem } from '../types/digitalTwinTypes';
import { Ruler, Trash2, Plus, Check } from 'lucide-react';

interface MeasurementToolsPanelProps {
  selectedTool: 'none' | 'distance' | 'room_size';
  onSelectTool: (tool: 'none' | 'distance' | 'room_size') => void;
  measurements: MeasurementItem[];
  onClearMeasurements: () => void;
  onDeleteMeasurement: (id: string) => void;
  isDarkMode?: boolean;
}

export const MeasurementToolsPanel: React.FC<MeasurementToolsPanelProps> = ({
  selectedTool,
  onSelectTool,
  measurements,
  onClearMeasurements,
  onDeleteMeasurement,
  isDarkMode = true
}) => {
  return (
    <div className={`p-3 rounded-sm border space-y-3 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <Ruler className="w-4 h-4 text-[#B59B6D]" />
          <h3 className="text-xs font-bold uppercase tracking-wider">3D Measurement Tools</h3>
        </div>

        {measurements.length > 0 && (
          <button
            onClick={onClearMeasurements}
            className="text-[10px] text-red-400 hover:text-red-300 font-bold uppercase flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-xs">
        <button
          onClick={() => onSelectTool(selectedTool === 'distance' ? 'none' : 'distance')}
          className={`p-2 rounded-sm border flex items-center justify-between transition ${
            selectedTool === 'distance' 
              ? 'bg-[#B59B6D]/20 border-[#B59B6D] text-[#B59B6D] font-bold' 
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Distance Tool</span>
          {selectedTool === 'distance' ? <Check className="w-3.5 h-3.5 text-[#B59B6D]" /> : <Plus className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => onSelectTool(selectedTool === 'room_size' ? 'none' : 'room_size')}
          className={`p-2 rounded-sm border flex items-center justify-between transition ${
            selectedTool === 'room_size' 
              ? 'bg-[#B59B6D]/20 border-[#B59B6D] text-[#B59B6D] font-bold' 
              : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
          }`}
        >
          <span>Room Extents</span>
          {selectedTool === 'room_size' ? <Check className="w-3.5 h-3.5 text-[#B59B6D]" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {selectedTool === 'distance' && (
        <p className="text-[10px] text-amber-300/80 bg-amber-500/10 p-2 rounded-sm border border-amber-500/20 font-mono">
          Click 2 points in the 3D viewport canvas to calculate exact point-to-point distance.
        </p>
      )}

      {/* Active Measurements List */}
      {measurements.length > 0 && (
        <div className="space-y-1 pt-1 max-h-[140px] overflow-y-auto">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Recorded Measurements:</span>
          {measurements.map((m) => (
            <div
              key={m.id}
              className="p-1.5 rounded-sm bg-white/5 border border-white/10 flex items-center justify-between text-xs font-mono"
            >
              <span className="text-white font-bold">{m.valueFormatted}</span>
              <button
                onClick={() => onDeleteMeasurement(m.id)}
                className="text-slate-400 hover:text-red-400 p-0.5"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
