import React, { useState } from 'react';
import { BuildingModel, RoomData, WallData, DoorData, WindowData } from '../types/BuildingModel';
import { Layers, Eye, Compass, ZoomIn, ZoomOut, CheckCircle, AlertTriangle, HelpCircle, UserCheck, Check, Edit, ShieldCheck, Sun, Wind } from 'lucide-react';

interface Schematic2DOverlayProps {
  model: BuildingModel;
  selectedElementId: string | null;
  onSelectElement: (id: string, type: 'room' | 'wall' | 'door' | 'window') => void;
  isDarkMode?: boolean;
}

export const Schematic2DOverlay: React.FC<Schematic2DOverlayProps> = ({
  model,
  selectedElementId,
  onSelectElement,
  isDarkMode = true
}) => {
  const [activeLevel, setActiveLevel] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showWalls, setShowWalls] = useState(true);
  const [showRooms, setShowRooms] = useState(true);
  const [showFenestrations, setShowFenestrations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Filter elements by active level
  const filteredWalls = model.walls.filter(w => w.level === activeLevel || model.walls.length < 6);
  const filteredRooms = model.rooms.filter(r => r.level === activeLevel || model.rooms.length < 4);
  const filteredDoors = model.doors.filter(d => d.level === activeLevel || model.doors.length < 4);
  const filteredWindows = model.windows.filter(w => w.level === activeLevel || model.windows.length < 4);

  // Compute bounding viewbox dynamically from model elements
  let minX = -10;
  let maxX = 20;
  let minZ = -10;
  let maxZ = 20;

  if (model && model.walls && model.walls.length > 0) {
    const xs: number[] = [];
    const zs: number[] = [];
    model.walls.forEach(w => {
      xs.push(w.start[0], w.end[0]);
      zs.push(w.start[2], w.end[2]);
    });
    model.rooms.forEach(r => {
      if (r.bounds) {
        xs.push(r.bounds.minX, r.bounds.maxX);
        zs.push(r.bounds.minZ, r.bounds.maxZ);
      }
    });
    if (xs.length > 0) {
      minX = Math.min(...xs) - 2;
      maxX = Math.max(...xs) + 2;
      minZ = Math.min(...zs) - 2;
      maxZ = Math.max(...zs) + 2;
    }
  }

  const width = Math.max(maxX - minX, 10);
  const height = Math.max(maxZ - minZ, 10);

  const getConfidenceColor = (confidence: number = 85, isApproved?: boolean, isUserEdited?: boolean) => {
    if (isUserEdited || isApproved) return '#3B82F6'; // Blue (User Verified)
    if (confidence >= 80) return '#10B981'; // Emerald Green (High Confidence)
    if (confidence >= 60) return '#F59E0B'; // Amber (Medium Confidence)
    return '#EF4444'; // Rose/Red (Low Confidence)
  };

  return (
    <div className={`p-4 rounded-sm border flex flex-col space-y-4 ${
      isDarkMode ? 'bg-[#0D111A] border-white/10' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header Bar Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-sm bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <span>2D Interactive Verification Canvas</span>
              <span className="px-2 py-0.5 rounded-xs text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                Phase 4 Schematic
              </span>
            </h3>
            <p className="text-[11px] text-white/50">
              Interactive structural vector plan overlay. Click any space or wall to inspect & verify.
            </p>
          </div>
        </div>

        {/* Level Switcher & View Controls */}
        <div className="flex items-center space-x-2">
          {/* Level selector */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-sm p-0.5 text-xs">
            {model.levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setActiveLevel(lvl.elevation > 2 ? 1 : 0)}
                className={`px-2.5 py-1 rounded-xs font-mono transition ${
                  (lvl.elevation > 2 ? 1 : 0) === activeLevel
                    ? 'bg-[#B59B6D] text-black font-bold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {lvl.name}
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 border-l border-white/10 pl-2">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
              className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/80 transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
              className="p-1.5 rounded-sm bg-white/5 hover:bg-white/10 text-white/80 transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Toggles & Color Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs gap-3">
        <div className="flex items-center space-x-3 text-white/70">
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showRooms}
              onChange={(e) => setShowRooms(e.target.checked)}
              className="accent-[#B59B6D]"
            />
            <span>Rooms ({filteredRooms.length})</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showWalls}
              onChange={(e) => setShowWalls(e.target.checked)}
              className="accent-[#B59B6D]"
            />
            <span>Walls ({filteredWalls.length})</span>
          </label>
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showFenestrations}
              onChange={(e) => setShowFenestrations(e.target.checked)}
              className="accent-[#B59B6D]"
            />
            <span>Doors & Windows ({filteredDoors.length + filteredWindows.length})</span>
          </label>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[10px] uppercase font-mono">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
            <span className="text-emerald-400">High Confidence (&ge;80%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-500 inline-block" />
            <span className="text-amber-400">Medium (60-79%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
            <span className="text-rose-400">Low (&lt;60%)</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-xs bg-blue-500 inline-block" />
            <span className="text-blue-400">User Verified</span>
          </span>
        </div>
      </div>

      {/* 2D SVG Canvas Container */}
      <div className="relative w-full h-[420px] bg-[#07090E] rounded-sm border border-white/10 overflow-hidden flex items-center justify-center">
        {/* Compass Overlay (Top Right) */}
        <div className="absolute top-3 right-3 z-10 bg-black/70 border border-white/15 backdrop-blur-md p-2 rounded-sm text-center space-y-1">
          <div className="text-[10px] font-mono uppercase text-[#B59B6D]">North Orientation</div>
          <div className="w-8 h-8 mx-auto relative flex items-center justify-center text-[#B59B6D]">
            <Compass className="w-7 h-7 transform -rotate-12 animate-pulse" />
          </div>
          <div className="text-[9px] font-mono text-white/60">
            {model.aiAnalysis?.northOrientationDeg || 15}° N
          </div>
        </div>

        {/* Natural Light Direction Overlay (Top Left) */}
        <div className="absolute top-3 left-3 z-10 bg-black/70 border border-white/15 backdrop-blur-md px-2.5 py-1.5 rounded-sm flex items-center space-x-2">
          <Sun className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">
              Sunlight: {model.aiAnalysis?.naturalLightDirection || 'South-West'}
            </div>
            <div className="text-[9px] text-white/50">Primary Daylighting Exposure</div>
          </div>
        </div>

        {/* SVG Render Canvas */}
        <svg
          viewBox={`${minX} ${minZ} ${width} ${height}`}
          className="w-full h-full transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Background Grid Pattern */}
          <defs>
            <pattern id="schematicGrid" width="2" height="2" patternUnits="userSpaceOnUse">
              <path d="M 2 0 L 0 0 0 2" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.05" />
            </pattern>
          </defs>
          {showGrid && <rect x={minX} y={minZ} width={width} height={height} fill="url(#schematicGrid)" />}

          {/* Render Rooms (Polygons / Bounding Boxes) */}
          {showRooms && filteredRooms.map((room) => {
            const isSelected = selectedElementId === room.id;
            const confidence = room.detection?.confidenceScore ?? 85;
            const color = getConfidenceColor(confidence, room.detection?.isApproved, room.detection?.isUserEdited);
            const rWidth = Math.max(room.bounds.maxX - room.bounds.minX, 2.5);
            const rHeight = Math.max(room.bounds.maxZ - room.bounds.minZ, 2.5);

            return (
              <g 
                key={room.id}
                onClick={() => onSelectElement(room.id, 'room')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                {/* Room Fill */}
                <rect
                  x={room.bounds.minX}
                  y={room.bounds.minZ}
                  width={rWidth}
                  height={rHeight}
                  fill={color}
                  fillOpacity={isSelected ? 0.35 : 0.15}
                  stroke={color}
                  strokeWidth={isSelected ? 0.25 : 0.1}
                  strokeDasharray={room.detection?.isUnknownArea ? "0.2,0.2" : "none"}
                />

                {/* Room Text Label */}
                <text
                  x={room.centerPoint[0]}
                  y={room.centerPoint[2]}
                  fill="#FFFFFF"
                  fontSize="0.55"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none font-sans uppercase"
                >
                  {room.name}
                </text>
                <text
                  x={room.centerPoint[0]}
                  y={room.centerPoint[2] + 0.6}
                  fill="#B59B6D"
                  fontSize="0.4"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none font-mono"
                >
                  {room.areaSqMeters} m² ({confidence}%)
                </text>
              </g>
            );
          })}

          {/* Render Walls */}
          {showWalls && filteredWalls.map((wall) => {
            const isSelected = selectedElementId === wall.id;
            const confidence = wall.detection?.confidenceScore ?? 90;
            const color = getConfidenceColor(confidence, wall.detection?.isApproved, wall.detection?.isUserEdited);
            const strokeWidth = wall.type === 'exterior' ? 0.45 : 0.25;

            return (
              <line
                key={wall.id}
                x1={wall.start[0]}
                y1={wall.start[2]}
                x2={wall.end[0]}
                y2={wall.end[2]}
                stroke={color}
                strokeWidth={isSelected ? strokeWidth + 0.2 : strokeWidth}
                strokeLinecap="round"
                onClick={() => onSelectElement(wall.id, 'wall')}
                className="cursor-pointer hover:stroke-white transition"
              />
            );
          })}

          {/* Render Doors */}
          {showFenestrations && filteredDoors.map((door) => {
            const isSelected = selectedElementId === door.id;
            const confidence = door.detection?.confidenceScore ?? 80;
            const color = getConfidenceColor(confidence, door.detection?.isApproved, door.detection?.isUserEdited);

            return (
              <g 
                key={door.id}
                onClick={() => onSelectElement(door.id, 'door')}
                className="cursor-pointer"
              >
                <circle
                  cx={door.position[0]}
                  cy={door.position[2]}
                  r={0.4}
                  fill={color}
                  fillOpacity={0.8}
                  stroke="#000"
                  strokeWidth="0.05"
                />
                <path
                  d={`M ${door.position[0]} ${door.position[2]} A 0.8 0.8 0 0 1 ${door.position[0] + 0.8} ${door.position[2] + 0.8}`}
                  fill="none"
                  stroke={color}
                  strokeWidth="0.1"
                  strokeDasharray="0.1,0.1"
                />
              </g>
            );
          })}

          {/* Render Windows */}
          {showFenestrations && filteredWindows.map((win) => {
            const isSelected = selectedElementId === win.id;
            const confidence = win.detection?.confidenceScore ?? 85;
            const color = getConfidenceColor(confidence, win.detection?.isApproved, win.detection?.isUserEdited);

            return (
              <rect
                key={win.id}
                x={win.position[0] - 0.4}
                y={win.position[2] - 0.15}
                width={0.8}
                height={0.3}
                fill="#38BDF8"
                stroke={color}
                strokeWidth={isSelected ? 0.15 : 0.08}
                onClick={() => onSelectElement(win.id, 'window')}
                className="cursor-pointer hover:fill-cyan-300"
              />
            );
          })}
        </svg>

        {/* Selected Element Floating Badge */}
        {selectedElementId && (
          <div className="absolute bottom-3 left-3 bg-black/80 border border-[#B59B6D] backdrop-blur-md px-3 py-1.5 rounded-sm text-xs font-mono text-white flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#B59B6D] animate-ping" />
            <span>Selected Element: <strong className="text-[#B59B6D]">{selectedElementId}</strong></span>
          </div>
        )}
      </div>
    </div>
  );
};
