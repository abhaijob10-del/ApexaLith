import React, { useState } from 'react';
import { 
  BuildingModel, 
  RoomData, 
  WallData, 
  DoorData, 
  WindowData,
  VerificationLog 
} from '../types/BuildingModel';
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Layers, 
  Split, 
  Combine, 
  AlertTriangle, 
  ShieldCheck, 
  Info, 
  Save, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface VerificationPropertiesPanelProps {
  model: BuildingModel;
  selectedElementId: string | null;
  selectedElementType: 'room' | 'wall' | 'door' | 'window' | null;
  onUpdateModel: (updatedModel: BuildingModel, logMessage: string) => void;
  isDarkMode?: boolean;
}

export const VerificationPropertiesPanel: React.FC<VerificationPropertiesPanelProps> = ({
  model,
  selectedElementId,
  selectedElementType,
  onUpdateModel,
  isDarkMode = true
}) => {
  const [mergeTargetRoomId, setMergeTargetRoomId] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');

  // Find selected element
  const selectedRoom = model.rooms.find(r => r.id === selectedElementId);
  const selectedWall = model.walls.find(w => w.id === selectedElementId);
  const selectedDoor = model.doors.find(d => d.id === selectedElementId);
  const selectedWindow = model.windows.find(win => win.id === selectedElementId);

  // Rename & Category handlers
  const handleRenameRoom = (newName: string, category: RoomData['category']) => {
    if (!selectedRoom) return;
    const updatedRooms = model.rooms.map(r => {
      if (r.id === selectedRoom.id) {
        return {
          ...r,
          name: newName,
          category,
          detection: {
            ...r.detection!,
            isUserEdited: true,
            isApproved: true,
            confidenceScore: 100,
            detectionMethod: 'Manual User Verification' as const
          }
        };
      }
      return r;
    });

    onUpdateModel({
      ...model,
      rooms: updatedRooms
    }, `Renamed space ${selectedRoom.id} to '${newName}' (${category}).`);
  };

  // Merge Room Handler
  const handleMergeRooms = () => {
    if (!selectedRoom || !mergeTargetRoomId) return;
    const targetRoom = model.rooms.find(r => r.id === mergeTargetRoomId);
    if (!targetRoom) return;

    const mergedName = `${selectedRoom.name} & ${targetRoom.name}`;
    const mergedArea = Math.round((selectedRoom.areaSqMeters + targetRoom.areaSqMeters) * 10) / 10;

    const mergedRoom: RoomData = {
      ...selectedRoom,
      name: mergedName,
      areaSqMeters: mergedArea,
      bounds: {
        minX: Math.min(selectedRoom.bounds.minX, targetRoom.bounds.minX),
        maxX: Math.max(selectedRoom.bounds.maxX, targetRoom.bounds.maxX),
        minZ: Math.min(selectedRoom.bounds.minZ, targetRoom.bounds.minZ),
        maxZ: Math.max(selectedRoom.bounds.maxZ, targetRoom.bounds.maxZ)
      },
      detection: {
        confidenceScore: 100,
        sourceFile: selectedRoom.detection?.sourceFile || 'Merged Vector Polygons',
        detectionMethod: 'Manual User Verification',
        isApproved: true,
        isUserEdited: true
      }
    };

    const remainingRooms = model.rooms.filter(r => r.id !== selectedRoom.id && r.id !== targetRoom.id);
    remainingRooms.push(mergedRoom);

    onUpdateModel({
      ...model,
      rooms: remainingRooms
    }, `Merged rooms ${selectedRoom.name} and ${targetRoom.name} into '${mergedName}' (${mergedArea} m²).`);
  };

  // Split Room Handler
  const handleSplitRoom = () => {
    if (!selectedRoom) return;
    const halfArea = Math.round((selectedRoom.areaSqMeters / 2) * 10) / 10;
    const roomA: RoomData = {
      ...selectedRoom,
      id: `${selectedRoom.id}_A`,
      name: `${selectedRoom.name} A`,
      areaSqMeters: halfArea,
      detection: {
        confidenceScore: 100,
        sourceFile: selectedRoom.detection?.sourceFile || 'Manual Split',
        detectionMethod: 'Manual User Verification',
        isApproved: true,
        isUserEdited: true
      }
    };

    const roomB: RoomData = {
      ...selectedRoom,
      id: `${selectedRoom.id}_B`,
      name: `${selectedRoom.name} B`,
      areaSqMeters: halfArea,
      detection: {
        confidenceScore: 100,
        sourceFile: selectedRoom.detection?.sourceFile || 'Manual Split',
        detectionMethod: 'Manual User Verification',
        isApproved: true,
        isUserEdited: true
      }
    };

    const updatedRooms = model.rooms.filter(r => r.id !== selectedRoom.id).concat([roomA, roomB]);

    onUpdateModel({
      ...model,
      rooms: updatedRooms
    }, `Split room ${selectedRoom.name} into two equal sub-spaces (${halfArea} m² each).`);
  };

  // Approve Element
  const handleApproveElement = () => {
    if (!selectedElementId) return;

    if (selectedRoom) {
      const updatedRooms = model.rooms.map(r => r.id === selectedRoom.id ? {
        ...r,
        detection: { ...r.detection!, isApproved: true, isUserEdited: true }
      } : r);
      onUpdateModel({ ...model, rooms: updatedRooms }, `Approved room space ${selectedRoom.name}.`);
    } else if (selectedWall) {
      const updatedWalls = model.walls.map(w => w.id === selectedWall.id ? {
        ...w,
        detection: { ...w.detection!, isApproved: true, isUserEdited: true }
      } : w);
      onUpdateModel({ ...model, walls: updatedWalls }, `Approved wall segment ${selectedWall.id}.`);
    }
  };

  // Mark Unknown Area
  const handleMarkUnknown = () => {
    if (!selectedRoom) return;
    const updatedRooms = model.rooms.map(r => r.id === selectedRoom.id ? {
      ...r,
      detection: {
        ...r.detection!,
        isUnknownArea: true,
        userNotes: 'Marked as Unknown Zone - Requires On-Site Measurement Inspection'
      }
    } : r);

    onUpdateModel({ ...model, rooms: updatedRooms }, `Marked room ${selectedRoom.name} as Unknown Area needing site inspection.`);
  };

  return (
    <div className={`p-4 rounded-sm border flex flex-col space-y-4 h-full ${
      isDarkMode ? 'bg-[#0D111A] border-white/10 text-slate-100' : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`}>
      {/* Header Title */}
      <div className="flex items-center space-x-2 pb-3 border-b border-white/10">
        <ShieldCheck className="w-5 h-5 text-[#B59B6D]" />
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Manual Verification Editor
          </h3>
          <p className="text-[11px] text-white/50">
            Inspect AI detection scores, edit room dimensions, merge or split layout spaces.
          </p>
        </div>
      </div>

      {/* Case 1: Room Selected */}
      {selectedRoom && (
        <div className="space-y-4 text-xs">
          {/* Status Badge */}
          <div className="p-3 rounded-sm bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/50 uppercase font-mono">Selected Room Space</span>
              <div className="text-sm font-bold text-[#B59B6D]">{selectedRoom.name}</div>
            </div>
            <div className="text-right font-mono">
              <span className={`px-2 py-0.5 rounded-xs text-[10px] uppercase font-bold border ${
                selectedRoom.detection?.isApproved 
                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                  : (selectedRoom.detection?.confidenceScore ?? 85) >= 80
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
              }`}>
                {selectedRoom.detection?.isApproved ? 'Verified' : `${selectedRoom.detection?.confidenceScore}% Confidence`}
              </span>
            </div>
          </div>

          {/* Rename & Category Form */}
          <div className="p-3 rounded-sm bg-white/5 border border-white/10 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Edit3 className="w-3.5 h-3.5 text-[#B59B6D]" />
              <span>Rename Space & Category</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-white/50 block mb-1">Room Name</label>
                <input
                  type="text"
                  defaultValue={selectedRoom.name}
                  onBlur={(e) => handleRenameRoom(e.target.value, selectedRoom.category)}
                  className="w-full px-2 py-1 rounded-sm bg-black border border-white/20 text-white focus:border-[#B59B6D] outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-white/50 block mb-1">Category</label>
                <select
                  defaultValue={selectedRoom.category}
                  onChange={(e) => handleRenameRoom(selectedRoom.name, e.target.value as any)}
                  className="w-full px-2 py-1 rounded-sm bg-black border border-white/20 text-white focus:border-[#B59B6D] outline-none font-mono"
                >
                  <option value="Bedroom">Bedroom</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Balcony">Balcony</option>
                  <option value="Utility Room">Utility Room</option>
                  <option value="Garage">Garage</option>
                  <option value="Staircase">Staircase</option>
                  <option value="Open Space">Open Space</option>
                </select>
              </div>
            </div>

            <div className="pt-1 flex items-center justify-between text-[11px] text-white/60 font-mono">
              <span>Area: <strong>{selectedRoom.areaSqMeters} m²</strong></span>
              <span>Detection: <strong>{selectedRoom.detection?.detectionMethod}</strong></span>
            </div>
          </div>

          {/* Merge Rooms Action */}
          <div className="p-3 rounded-sm bg-white/5 border border-white/10 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white flex items-center space-x-1.5">
              <Combine className="w-3.5 h-3.5 text-blue-400" />
              <span>Merge Space with Adjacent Room</span>
            </div>
            <p className="text-[10px] text-white/50">Select an adjacent room space to combine total floor area and boundary contours.</p>
            <div className="flex space-x-2">
              <select
                value={mergeTargetRoomId}
                onChange={(e) => setMergeTargetRoomId(e.target.value)}
                className="flex-1 px-2 py-1 rounded-sm bg-black border border-white/20 text-white text-xs outline-none"
              >
                <option value="">-- Choose Target Room --</option>
                {model.rooms.filter(r => r.id !== selectedRoom.id).map(r => (
                  <option key={r.id} value={r.id}>{r.name} ({r.areaSqMeters} m²)</option>
                ))}
              </select>
              <button
                onClick={handleMergeRooms}
                disabled={!mergeTargetRoomId}
                className="px-3 py-1 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-40 transition"
              >
                Merge
              </button>
            </div>
          </div>

          {/* Split Room & Mark Unknown Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleSplitRoom}
              className="px-3 py-2 rounded-sm bg-amber-600/20 border border-amber-500/40 text-amber-300 hover:bg-amber-600/30 font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1 text-[11px]"
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split Space</span>
            </button>
            <button
              onClick={handleMarkUnknown}
              className="px-3 py-2 rounded-sm bg-rose-600/20 border border-rose-500/40 text-rose-300 hover:bg-rose-600/30 font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1 text-[11px]"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Mark Unknown</span>
            </button>
          </div>

          {/* Approve Action */}
          <button
            onClick={handleApproveElement}
            className="w-full py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve & Verify Room Space</span>
          </button>
        </div>
      )}

      {/* Case 2: Wall Selected */}
      {selectedWall && (
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-sm bg-black/40 border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-white/50 uppercase font-mono">Selected Wall Segment</span>
              <div className="text-sm font-bold text-[#B59B6D]">{selectedWall.id} ({selectedWall.type})</div>
            </div>
            <div className="text-right font-mono">
              <span className="px-2 py-0.5 rounded-xs text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {selectedWall.thickness}m Thickness
              </span>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-white/5 border border-white/10 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-white/50">Start Coords:</span>
              <span>[{selectedWall.start.join(', ')}]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">End Coords:</span>
              <span>[{selectedWall.end.join(', ')}]</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Height / Material:</span>
              <span>{selectedWall.height}m / {selectedWall.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Load Bearing:</span>
              <span className={selectedWall.isLoadBearing ? 'text-amber-400 font-bold' : 'text-white/70'}>
                {selectedWall.isLoadBearing ? 'YES (Structural)' : 'NO (Partition)'}
              </span>
            </div>
          </div>

          <button
            onClick={handleApproveElement}
            className="w-full py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider transition flex items-center justify-center space-x-1.5"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Approve Wall Segment</span>
          </button>
        </div>
      )}

      {/* Case 3: Overview (No Element Selected) */}
      {!selectedRoom && !selectedWall && (
        <div className="space-y-3 text-xs flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 rounded-sm bg-black/40 border border-white/10">
              <div className="text-[10px] text-white/50 font-mono uppercase">Verification Summary</div>
              <div className="text-lg font-bold text-[#B59B6D] mt-0.5">
                {model.building.name}
              </div>
              <div className="text-[11px] text-white/70 mt-1">
                Click any room space or wall on the 2D canvas to edit properties, merge spaces, or correct wall dimensions.
              </div>
            </div>

            {/* Stats Breakdown */}
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-sm bg-white/5 border border-white/10">
                <div className="text-white/50">Verified Rooms</div>
                <div className="text-base font-bold text-emerald-400">
                  {model.rooms.filter(r => r.detection?.isApproved).length} / {model.rooms.length}
                </div>
              </div>
              <div className="p-2.5 rounded-sm bg-white/5 border border-white/10">
                <div className="text-white/50">Confidence Score</div>
                <div className="text-base font-bold text-[#B59B6D]">
                  {model.metadata.parsingConfidence}%
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-sm bg-[#B59B6D]/10 border border-[#B59B6D]/30 text-[11px] text-[#B59B6D]">
            <strong className="block uppercase font-bold mb-0.5">Phase 4 Verification Standard</strong>
            Data verified here will be saved into Firestore collections and locked for Phase 5 Digital Twin generation.
          </div>
        </div>
      )}
    </div>
  );
};
