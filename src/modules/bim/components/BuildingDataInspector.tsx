import React, { useState } from 'react';
import { BuildingModel } from '../types/BuildingModel';
import { Building2, Layers, Grid, Box, DoorClosed, Copy, Check, FileCode2 } from 'lucide-react';

interface BuildingDataInspectorProps {
  model: BuildingModel;
  isDarkMode?: boolean;
}

export const BuildingDataInspector: React.FC<BuildingDataInspectorProps> = ({
  model,
  isDarkMode = true
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'floors' | 'rooms' | 'walls' | 'openings' | 'materials' | 'json'>('overview');
  const [copiedJson, setCopiedJson] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(model, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className={`rounded-sm border overflow-hidden flex flex-col ${
      isDarkMode ? 'bg-[#0D0D0D] border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Header Navigation Bar */}
      <div className={`px-4 py-2 border-b flex flex-wrap items-center justify-between gap-2 ${
        isDarkMode ? 'bg-[#121212] border-white/10' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-[#B59B6D]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#B59B6D]">
            Structured Building Data Inspector
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto text-xs uppercase tracking-wider font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-sm transition ${
              activeTab === 'overview' ? 'bg-[#B59B6D] text-black' : isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('floors')}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1 ${
              activeTab === 'floors' ? 'bg-[#B59B6D] text-black' : isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Floors ({model.floors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1 ${
              activeTab === 'rooms' ? 'bg-[#B59B6D] text-black' : isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3 h-3" />
            <span>Rooms ({model.rooms.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('walls')}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1 ${
              activeTab === 'walls' ? 'bg-[#B59B6D] text-black' : isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Box className="w-3 h-3" />
            <span>Walls ({model.walls.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1 ${
              activeTab === 'openings' ? 'bg-[#B59B6D] text-black' : isDarkMode ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DoorClosed className="w-3 h-3" />
            <span>Openings ({model.doors.length + model.windows.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1 rounded-sm transition flex items-center space-x-1 border ${
              activeTab === 'json' ? 'bg-[#B59B6D] text-black border-[#B59B6D]' : 'border-[#B59B6D]/40 text-[#B59B6D]'
            }`}
          >
            <FileCode2 className="w-3 h-3" />
            <span>JSON Schema</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-[380px] overflow-y-auto font-sans text-sm">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className={`p-3 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] uppercase font-bold text-[#B59B6D]">Building Name</div>
                <div className="text-base font-bold truncate mt-0.5">{model.building.name}</div>
              </div>

              <div className={`p-3 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] uppercase font-bold text-[#B59B6D]">Total Area</div>
                <div className="text-base font-bold font-mono mt-0.5">{model.building.totalAreaSqMeters} m² ({Math.round(model.building.totalAreaSqMeters * 10.764).toLocaleString()} sq ft)</div>
              </div>

              <div className={`p-3 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] uppercase font-bold text-[#B59B6D]">Floors & Storeys</div>
                <div className="text-base font-bold font-mono mt-0.5">{model.building.totalFloors} Storeys</div>
              </div>

              <div className={`p-3 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <div className="text-[10px] uppercase font-bold text-[#B59B6D]">Parsing Confidence</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{model.metadata.parsingConfidence}%</div>
              </div>
            </div>

            {/* Spatial Extents */}
            <div className={`p-3.5 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs font-bold uppercase text-[#B59B6D] mb-2">Spatial Bounding Box Dimensions</div>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div>Length (X): <strong className="text-white">{model.building.dimensions.length} m</strong></div>
                <div>Width (Z): <strong className="text-white">{model.building.dimensions.width} m</strong></div>
                <div>Height (Y): <strong className="text-white">{model.building.dimensions.height} m</strong></div>
              </div>
            </div>

            {/* Coordinate System */}
            <div className={`p-3.5 rounded-sm border ${isDarkMode ? 'bg-[#141414] border-white/10' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-xs font-bold uppercase text-[#B59B6D] mb-2">Coordinates & Units</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>CRS: {model.coordinates.crs || 'Local Architectural Grid'}</div>
                <div>Scale Units: {model.coordinates.units} (Scale Factor: {model.coordinates.scaleFactor})</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLOORS */}
        {activeTab === 'floors' && (
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] border-b ${isDarkMode ? 'text-white/60 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="py-2">Level</th>
                  <th>Storey Name</th>
                  <th>Elevation</th>
                  <th>Height</th>
                  <th>Area</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                {model.floors.map(flr => (
                  <tr key={flr.id}>
                    <td className="py-2.5 font-bold text-[#B59B6D]">L{flr.level}</td>
                    <td className="font-sans font-bold">{flr.name}</td>
                    <td>{flr.elevation} m</td>
                    <td>{flr.height} m</td>
                    <td>{flr.areaSqMeters} m²</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ROOMS */}
        {activeTab === 'rooms' && (
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] border-b ${isDarkMode ? 'text-white/60 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="py-2">Room Name</th>
                  <th>Category</th>
                  <th>Area (m²)</th>
                  <th>Area (sq ft)</th>
                  <th>Center Point [x,y,z]</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                {model.rooms.map(rm => (
                  <tr key={rm.id}>
                    <td className="py-2.5 font-sans font-bold text-white">{rm.name}</td>
                    <td><span className="px-2 py-0.5 rounded bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] uppercase font-bold">{rm.category}</span></td>
                    <td className="font-bold text-[#B59B6D]">{rm.areaSqMeters} m²</td>
                    <td>{Math.round(rm.areaSqMeters * 10.764)} sq ft</td>
                    <td className="text-white/60">[{rm.centerPoint.join(', ')}]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: WALLS */}
        {activeTab === 'walls' && (
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] border-b ${isDarkMode ? 'text-white/60 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Type</th>
                  <th>Start [x,z]</th>
                  <th>End [x,z]</th>
                  <th>Thickness</th>
                  <th>Height</th>
                  <th>Material</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                {model.walls.map(w => (
                  <tr key={w.id}>
                    <td className="py-2.5 text-[#B59B6D] font-bold">{w.id}</td>
                    <td>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        w.type === 'exterior' ? 'bg-[#B59B6D]/20 text-[#B59B6D]' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {w.type}
                      </span>
                    </td>
                    <td>[{w.start[0]}, {w.start[2]}]</td>
                    <td>[{w.end[0]}, {w.end[2]}]</td>
                    <td>{w.thickness} m</td>
                    <td>{w.height} m</td>
                    <td className="font-sans text-white/80">{w.material}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 5: OPENINGS */}
        {activeTab === 'openings' && (
          <div className="space-y-4">
            <div className="text-xs font-bold uppercase text-[#B59B6D]">Detected Doors ({model.doors.length})</div>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] border-b ${isDarkMode ? 'text-white/60 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Position [x,y,z]</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Type / Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                {model.doors.map(d => (
                  <tr key={d.id}>
                    <td className="py-2 font-bold text-[#06B6D4]">{d.id}</td>
                    <td>[{d.position.join(', ')}]</td>
                    <td>{d.width} m</td>
                    <td>{d.height} m</td>
                    <td className="font-sans text-white/80">{d.style || d.openingType || 'Door'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-xs font-bold uppercase text-[#F59E0B] pt-2">Detected Windows ({model.windows.length})</div>
            <table className="w-full text-left text-xs">
              <thead className={`uppercase text-[10px] border-b ${isDarkMode ? 'text-white/60 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                <tr>
                  <th className="py-2">ID</th>
                  <th>Position [x,y,z]</th>
                  <th>Width</th>
                  <th>Height</th>
                  <th>Sill Height</th>
                  <th>Style</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 font-mono">
                {model.windows.map(win => (
                  <tr key={win.id}>
                    <td className="py-2 font-bold text-[#F59E0B]">{win.id}</td>
                    <td>[{win.position.join(', ')}]</td>
                    <td>{win.width} m</td>
                    <td>{win.height} m</td>
                    <td>{win.sillHeight} m</td>
                    <td className="font-sans text-white/80">{win.style || 'Window'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: JSON */}
        {activeTab === 'json' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#B59B6D] font-mono font-bold">Standardized BuildingModel Schema JSON</span>
              <button
                onClick={handleCopyJson}
                className="px-3 py-1 rounded bg-[#B59B6D] text-black text-xs font-bold uppercase tracking-wider flex items-center space-x-1 hover:bg-[#c4ab7d] transition"
              >
                {copiedJson ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedJson ? 'Copied JSON!' : 'Copy JSON'}</span>
              </button>
            </div>
            <pre className="p-3 rounded bg-black/60 font-mono text-xs text-emerald-400 overflow-x-auto max-h-[300px] border border-white/10">
              {JSON.stringify(model, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
