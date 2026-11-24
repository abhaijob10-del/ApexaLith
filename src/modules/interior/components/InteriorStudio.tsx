import React, { useState, useEffect } from 'react';
import { BuildingModel } from '../../bim/types/BuildingModel';
import { BIMManager } from '../../bim/services/BIMManager';
import { DigitalTwinCanvas } from '../../digitaltwin/components/DigitalTwinCanvas';
import { 
  RoomDesignState, 
  FurnitureItem, 
  DesignConcept, 
  LightingPresetMode, 
  InteriorStyle, 
  RoomCategory,
  DesignComment,
  VersionRecord,
  FavoriteDesignRecord
} from '../types/interiorTypes';
import { FurnitureLibraryService, CatalogFurnitureTemplate } from '../services/FurnitureLibraryService';
import { InteriorFirestoreService } from '../services/InteriorFirestoreService';
import { FurnitureLibraryPanel } from './FurnitureLibraryPanel';
import { MaterialEditorPanel } from './MaterialEditorPanel';
import { LightingPresetsPanel } from './LightingPresetsPanel';
import { AiConceptsPanel } from './AiConceptsPanel';
import { FurnitureInspectorPanel } from './FurnitureInspectorPanel';
import { CollaborationCommentsPanel } from './CollaborationCommentsPanel';
import { VersionHistoryPanel } from './VersionHistoryPanel';
import { AiInteriorChatBar } from './AiInteriorChatBar';
import { ExportStudioModal } from './ExportStudioModal';
import { FurnitureMeshGenerator } from '../engine/FurnitureMeshGenerator';
import { LightingPreset } from '../../../components/3d/types/renderingTypes';

import { 
  Sparkles, 
  Box, 
  Paintbrush, 
  Sun, 
  Sliders, 
  Users, 
  History, 
  Download, 
  Database, 
  CheckCircle, 
  Layers, 
  ShieldCheck,
  Eye,
  RotateCcw,
  Plus
} from 'lucide-react';

interface InteriorStudioProps {
  isDarkMode?: boolean;
}

export const InteriorStudio: React.FC<InteriorStudioProps> = ({ isDarkMode = true }) => {
  // Verified Building Model from Phase 5
  const [buildingModel, setBuildingModel] = useState<BuildingModel | null>(null);
  
  // Selected Room State
  const [selectedRoomId, setSelectedRoomId] = useState<string>('sp_01');
  const [roomState, setRoomState] = useState<RoomDesignState>({
    roomId: 'sp_01',
    roomName: 'Foyer & Grand Living Suite',
    category: 'Living Room',
    style: 'Luxury',
    dimensions: { length: 8.5, width: 6.2, height: 3.3, areaSqMeters: 52.7 },
    wallMaterial: 'Venetian Plaster',
    wallColorHex: '#EAE6E1',
    floorMaterial: 'Chevron Oak',
    floorColorHex: '#B59B6D',
    ceilingMaterial: 'Gypsum Board',
    ceilingColorHex: '#F8FAFC',
    lightingPreset: 'golden_hour',
    furniture: [
      {
        id: 'f_01',
        catalogId: 'sofa_01',
        name: 'Apexa Italian Modular Velvet Sofa',
        category: 'Sofas & Seating',
        style: 'Luxury',
        dimensions: { length: 2.8, width: 1.1, height: 0.8 },
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        material: 'Velvet',
        colorHex: '#2C3E35',
        isLocked: false,
        roomId: 'sp_01',
        meshType: 'sofa'
      },
      {
        id: 'f_02',
        catalogId: 'table_03',
        name: 'Minimalist Monolithic Coffee Table',
        category: 'Tables & Dining',
        style: 'Minimalist',
        dimensions: { length: 1.3, width: 0.8, height: 0.38 },
        position: [0, 0, 1.4],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        material: 'Travertine Stone',
        colorHex: '#D1C7BD',
        isLocked: false,
        roomId: 'sp_01',
        meshType: 'table'
      },
      {
        id: 'f_03',
        catalogId: 'light_01',
        name: 'Sculptural Brass Branch Chandelier',
        category: 'Lighting Fixtures',
        style: 'Luxury',
        dimensions: { length: 1.2, width: 1.2, height: 0.9 },
        position: [0, 2.2, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        material: 'Brushed Brass',
        colorHex: '#D4AF37',
        isLocked: false,
        roomId: 'sp_01',
        meshType: 'lamp'
      }
    ]
  });

  // Selected Furniture Item in 3D Canvas
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string | null>('f_01');

  // AI Concepts (4 Concepts: Concept A, B, C, D)
  const [activeConceptId, setActiveConceptId] = useState<string>('concept_a');
  const [concepts, setConcepts] = useState<DesignConcept[]>([
    {
      id: 'concept_a',
      name: 'Concept A: Italian High-Luxury Sanctuary',
      style: 'Luxury',
      description: 'Opulent living environment featuring modular velvet seating, honed Calacatta marble accents, and warm brass fixtures.',
      colorPalette: {
        walls: '#EAE6E1',
        floor: '#B59B6D',
        accents: ['#2C3E35', '#D4AF37', '#1A1C20']
      },
      rationale: {
        whyFurnitureSelected: 'Selected low-profile modular velvet sofa to preserve open sightlines toward panoramic windows while anchoring the living space.',
        colorRationale: 'Paired warm off-white Venetian plaster walls with brushed brass accents to enhance soft ambient light reflection.',
        circulationImprovement: 'Established 1.4m clear traffic clearance between seating zone and main foyer doorway.',
        lightingOptimization: 'Integrated warm 3000K chandelier downlighting with accent wall spotlights.',
        maintenanceAndDurability: 'Specified stain-resistant Italian velvet and sealed brass hardware rated for high commercial durability.'
      },
      furniture: []
    },
    {
      id: 'concept_b',
      name: 'Concept B: Warm Nordic Scandinavian',
      style: 'Scandinavian',
      description: 'Organic minimalist atmosphere centered on bleached ash flooring, limewash plaster walls, and light linen textiles.',
      colorPalette: {
        walls: '#F0EFEA',
        floor: '#C5B299',
        accents: ['#8C6F56', '#D9D2C9', '#385E38']
      },
      rationale: {
        whyFurnitureSelected: 'Employed clean timber frame seating and tactile linen upholstery to foster a tranquil hygge atmosphere.',
        colorRationale: 'Bleached ash and light stone colors maximize interior brightness during low natural daylight hours.',
        circulationImprovement: 'Reconfigured coffee table alignment to allow direct access from living space to exterior terrace.',
        lightingOptimization: 'Soft diffused natural sunlight bounced off matte limewash wall finishes.',
        maintenanceAndDurability: 'Removable and washable linen covers with solid FSC-certified European white oak.'
      },
      furniture: []
    },
    {
      id: 'concept_c',
      name: 'Concept C: Modern Japandi Serenity',
      style: 'Japandi',
      description: 'Harmonious fusion of Japanese wabi-sabi simplicity and Scandinavian functionality with low ground profiles.',
      colorPalette: {
        walls: '#D1C7BD',
        floor: '#3D2A1C',
        accents: ['#1A1C20', '#A59281', '#5B6858']
      },
      rationale: {
        whyFurnitureSelected: 'Used low-slung travertine platform tables and woven tatami textures for grounded spatial serenity.',
        colorRationale: 'Subdued earth pigments create an intimate, calming contrast against dark walnut floorboards.',
        circulationImprovement: 'Minimalist perimeter layout frees central floor area for fluid movement.',
        lightingOptimization: 'Low-angle warm floor lamps and indirect LED cove lighting.',
        maintenanceAndDurability: 'Honed natural travertine and dark sealed walnut with high wear resistance.'
      },
      furniture: []
    },
    {
      id: 'concept_d',
      name: 'Concept D: Architectural Industrial Modern',
      style: 'Industrial',
      description: 'Bold architectural statement featuring raw board-formed concrete, blackened steel frames, and cognac leather.',
      colorPalette: {
        walls: '#8B929A',
        floor: '#2A1F17',
        accents: ['#3D2817', '#C0C0C0', '#1A1C20']
      },
      rationale: {
        whyFurnitureSelected: 'Aniline leather lounge chairs paired with heavy steel structure produce an authentic loft aesthetic.',
        colorRationale: 'Cool concrete walls balanced by rich cognac leather warmth.',
        circulationImprovement: 'Open architectural spatial flow with central island orientation.',
        lightingOptimization: 'High-contrast directional spot tracks and exposed bulb pendants.',
        maintenanceAndDurability: 'Industrial-grade powder-coated steel and full-grain aniline leather that patinas gracefully.'
      },
      furniture: []
    }
  ]);

  // Version Control History (Undo / Redo stack)
  const [historyStack, setHistoryStack] = useState<RoomDesignState[]>([roomState]);
  const [historyPointer, setHistoryPointer] = useState<number>(0);
  const [savedVersions, setSavedVersions] = useState<VersionRecord[]>([
    {
      id: 'v_1',
      versionNumber: 1,
      title: 'v1.0 Initial Concept Baseline',
      createdAt: 'Today 10:30 AM',
      roomState,
      changeSummary: 'Verified Phase 5 Digital Twin layout loaded.'
    }
  ]);

  // Team Collaboration Comments & Roles
  const [currentRole, setCurrentRole] = useState<'Architect' | 'Interior Designer' | 'Customer' | 'Admin'>('Interior Designer');
  const [comments, setComments] = useState<DesignComment[]>([
    {
      id: 'c_1',
      roomId: 'sp_01',
      userRole: 'Architect',
      userName: 'Principal Architect Sarah',
      text: 'Ensure the sofa position preserves at least 1.2m egress clearance from the structural column.',
      timestamp: 'Today 11:15 AM',
      status: 'Approved'
    },
    {
      id: 'c_2',
      roomId: 'sp_01',
      userRole: 'Customer',
      userName: 'Client Mr. Sterling',
      text: 'I love the Concept A velvet sofa color. Can we try warm golden hour lighting in 3D?',
      timestamp: 'Today 11:40 AM',
      status: 'Pending'
    }
  ]);

  // Favorite Designs
  const [favorites, setFavorites] = useState<FavoriteDesignRecord[]>([]);

  // Modals & UI Navigation State
  const [activeLeftTab, setActiveLeftTab] = useState<'furniture' | 'materials' | 'lighting'>('furniture');
  const [activeRightTab, setActiveRightTab] = useState<'concepts' | 'inspector' | 'comments' | 'history'>('concepts');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Standby on mount - do not auto-load hardcoded penthouse model
  useEffect(() => {
    // Standby until user uploads model or selects project
  }, []);

  const loadVerifiedModel = async () => {
    try {
      const bimManager = BIMManager.getInstance();
      const sampleFile = new File([''], 'Penthouse_Villa_Compound_Alpha.ifc', { type: 'text/plain' });
      const rawModel = await bimManager.parseIFC(sampleFile, 'Penthouse_Villa_Compound_Alpha.ifc');

      const verifiedModel: BuildingModel = {
        ...rawModel,
        approvalStatus: 'VERIFIED',
        building: {
          ...rawModel.building,
          name: 'Penthouse Compound Villa Alpha'
        }
      };
      setBuildingModel(verifiedModel);
    } catch (e) {
      console.warn('Model load notice:', e);
    }
  };

  // State update wrapper with Undo/Redo stack tracking
  const updateRoomState = (newState: RoomDesignState) => {
    const newStack = historyStack.slice(0, historyPointer + 1);
    newStack.push(newState);
    setHistoryStack(newStack);
    setHistoryPointer(newStack.length - 1);
    setRoomState(newState);
  };

  // Handle Undo
  const handleUndo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      setHistoryPointer(prevPointer);
      setRoomState(historyStack[prevPointer]);
    }
  };

  // Handle Redo
  const handleRedo = () => {
    if (historyPointer < historyStack.length - 1) {
      const nextPointer = historyPointer + 1;
      setHistoryPointer(nextPointer);
      setRoomState(historyStack[nextPointer]);
    }
  };

  // Add Furniture Item from Catalog
  const handleAddFurnitureFromCatalog = (template: CatalogFurnitureTemplate) => {
    const newInstance = FurnitureLibraryService.createFurnitureInstance(template.catalogId, selectedRoomId, [0, 0, 0]);
    const updatedFurniture = [...roomState.furniture, newInstance];
    updateRoomState({ ...roomState, furniture: updatedFurniture });
    setSelectedFurnitureId(newInstance.id);
    setActiveRightTab('inspector');
  };

  // Update Individual Furniture Item properties
  const handleUpdateFurnitureItem = (updated: FurnitureItem) => {
    const updatedList = roomState.furniture.map(f => f.id === updated.id ? updated : f);
    updateRoomState({ ...roomState, furniture: updatedList });
  };

  // Duplicate Furniture Item
  const handleDuplicateFurnitureItem = (item: FurnitureItem) => {
    const dupInstance: FurnitureItem = {
      ...item,
      id: `furn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: `${item.name} (Copy)`,
      position: [item.position[0] + 0.8, item.position[1], item.position[2] + 0.8]
    };
    const updatedFurniture = [...roomState.furniture, dupInstance];
    updateRoomState({ ...roomState, furniture: updatedFurniture });
    setSelectedFurnitureId(dupInstance.id);
  };

  // Delete Furniture Item
  const handleDeleteFurnitureItem = (itemId: string) => {
    const updatedList = roomState.furniture.filter(f => f.id !== itemId);
    updateRoomState({ ...roomState, furniture: updatedList });
    if (selectedFurnitureId === itemId) {
      setSelectedFurnitureId(null);
    }
  };

  // AI Prompt Assistant Trigger
  const handleAiSendPrompt = async (promptText: string) => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/interior-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          selectedRoomName: roomState.roomName,
          roomCategory: roomState.category,
          stylePreference: roomState.style,
          currentMaterials: {
            wall: roomState.wallMaterial,
            floor: roomState.floorMaterial
          }
        })
      });

      const data = await res.json();

      // Apply AI styling recommendations
      if (data.recommendedWallColor) {
        const updatedState: RoomDesignState = {
          ...roomState,
          wallColorHex: data.recommendedWallColor,
          lightingPreset: (data.recommendedLightingPreset as LightingPresetMode) || roomState.lightingPreset,
          style: (data.suggestedStyle as InteriorStyle) || roomState.style
        };
        updateRoomState(updatedState);
      }
    } catch (e) {
      console.warn('AI prompt notice:', e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Sync state across all 8 Firestore Collections
  const handleSyncFirestore = async () => {
    const firestoreService = InteriorFirestoreService.getInstance();
    const result = await firestoreService.syncPhase6ToFirestore({
      projectId: 'proj_alpha_01',
      buildingModelId: buildingModel?.id || 'bld_01',
      roomState,
      comments,
      history: savedVersions,
      favorites
    });

    setSyncMessage(result.message);
    setTimeout(() => setSyncMessage(null), 4000);
  };

  // Helper mapper for viewport lighting preset
  const mapInteriorLightingToViewportPreset = (mode: LightingPresetMode): LightingPreset => {
    switch (mode) {
      case 'daylight': return 'architecturalDay';
      case 'golden_hour': return 'sunset';
      case 'warm_cozy': return 'studio';
      case 'night_ambient': return 'cyberpunkNight';
      case 'studio': return 'studio';
      default: return 'studio';
    }
  };

  const selectedFurnitureItem = roomState.furniture.find(f => f.id === selectedFurnitureId) || null;

  return (
    <div className={`w-full h-screen flex flex-col overflow-hidden select-none font-sans ${
      isDarkMode ? 'bg-[#070A11] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* 1. TOP HEADER & STUDIO CONTROLS */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isDarkMode ? 'bg-[#0D111A] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="px-2.5 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] font-bold uppercase tracking-widest border border-[#B59B6D]/30">
              Phase 6 AI Interior Design Studio
            </span>
          </div>

          <h2 className="text-sm font-bold uppercase tracking-wider text-white hidden sm:block">
            {roomState.roomName} ({roomState.category})
          </h2>
        </div>

        {/* Room & Style Switcher Controls */}
        <div className="flex items-center space-x-2">
          {/* Role Switcher */}
          <div className="flex items-center space-x-1.5 bg-white/5 border border-white/10 p-1 rounded-sm text-[10px] font-bold uppercase">
            <span className="text-slate-400 px-1">Role:</span>
            {(['Architect', 'Interior Designer', 'Customer', 'Admin'] as const).map(role => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-2 py-0.5 rounded-sm transition ${
                  currentRole === role ? 'bg-[#B59B6D] text-black font-extrabold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            onClick={() => setExportModalOpen(true)}
            className="px-3 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 border border-white/15"
          >
            <Download className="w-3.5 h-3.5 text-[#B59B6D]" />
            <span>Export Specs</span>
          </button>

          <button
            onClick={handleSyncFirestore}
            className="px-3.5 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sync Firestore (8 Collections)</span>
          </button>
        </div>
      </div>

      {/* Sync Success Banner */}
      {syncMessage && (
        <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{syncMessage}</span>
          </div>
          <button onClick={() => setSyncMessage(null)} className="text-[10px] uppercase font-bold text-white">Dismiss</button>
        </div>
      )}

      {/* 2. MAIN 3-COLUMN STUDIO LAYOUT */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR: Furniture Catalog, Materials & Lighting (Width: 320px) */}
        <div className={`w-80 border-r flex flex-col shrink-0 overflow-y-auto p-3 space-y-3 ${
          isDarkMode ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Tab Selector */}
          <div className="flex rounded-sm bg-white/5 border border-white/10 p-0.5 text-[10px] font-bold uppercase">
            <button
              onClick={() => setActiveLeftTab('furniture')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeLeftTab === 'furniture' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Furniture
            </button>
            <button
              onClick={() => setActiveLeftTab('materials')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeLeftTab === 'materials' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveLeftTab('lighting')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeLeftTab === 'lighting' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lighting
            </button>
          </div>

          {activeLeftTab === 'furniture' && (
            <FurnitureLibraryPanel
              onAddFurniture={handleAddFurnitureFromCatalog}
              isDarkMode={isDarkMode}
            />
          )}

          {activeLeftTab === 'materials' && (
            <MaterialEditorPanel
              roomState={roomState}
              onUpdateRoomMaterials={(updates) => updateRoomState({ ...roomState, ...updates })}
              isDarkMode={isDarkMode}
            />
          )}

          {activeLeftTab === 'lighting' && (
            <LightingPresetsPanel
              currentPreset={roomState.lightingPreset}
              onChangePreset={(preset) => updateRoomState({ ...roomState, lightingPreset: preset })}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* CENTER VIEWPORT: 3D DIGITAL TWIN + REAL-TIME FURNITURE CANVAS */}
        <div className="flex-1 h-full relative overflow-hidden bg-[#070A11]">
          {!buildingModel ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 bg-[#070A11] text-white space-y-6">
              <div className="w-16 h-16 rounded-full bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="text-center space-y-2 max-w-md">
                <h2 className="text-2xl font-bold uppercase tracking-wider text-white">No Interior Building Loaded</h2>
                <p className="text-xs text-slate-400">
                  Select a verified Digital Twin building model or load the interior canvas to customize furniture layouts and PBR materials.
                </p>
              </div>
              <button
                onClick={loadVerifiedModel}
                className="px-6 py-2.5 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest transition shadow-lg shadow-[#B59B6D]/20 flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Active Project Model</span>
              </button>
            </div>
          ) : (
            <DigitalTwinCanvas
              buildingModel={buildingModel}
              settings={{
                showGrid: true,
                showAxes: true,
                showWireframe: false,
                showShadows: true,
                showStats: false,
                enableBloom: true,
                enableAO: true,
                enableDOF: false,
                lightingPreset: mapInteriorLightingToViewportPreset(roomState.lightingPreset),
                environmentMode: 'studio',
                cameraPreset: 'perspective',
                cameraMode: 'orbit',
                autoRotate: false
              }}
              timeOfDay={roomState.lightingPreset === 'golden_hour' ? 'evening' : roomState.lightingPreset === 'night_ambient' ? 'night' : 'afternoon'}
              hideWalls={false}
              showRoof={false}
              showCeilings={false}
              showSectionCut={false}
              sectionCutAxis="Y"
              sectionCutOffset={1.8}
              selectedMeasurementTool="none"
              measurements={[]}
              onAddMeasurement={() => {}}
              onSelectComponent={() => {}}
              onUpdateStats={() => {}}
            />
          )}

          {/* Floating Badge */}
          <div className="absolute top-3 left-3 bg-[#0D111A]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm text-[11px] font-mono text-slate-300 flex items-center space-x-3 pointer-events-none">
            <span className="text-[#B59B6D] font-bold uppercase">AI Interior Studio Canvas</span>
            <span>Room: {roomState.roomName}</span>
            <span>Items: {roomState.furniture.length}</span>
            <span>Target: 60 FPS</span>
          </div>
        </div>

        {/* RIGHT SIDEBAR: AI Concepts, Inspector, Comments, Version Control (Width: 340px) */}
        <div className={`w-84 border-l flex flex-col shrink-0 overflow-y-auto p-3 space-y-3 ${
          isDarkMode ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Right Panel Tab Navigation */}
          <div className="flex rounded-sm bg-white/5 border border-white/10 p-0.5 text-[9px] font-bold uppercase">
            <button
              onClick={() => setActiveRightTab('concepts')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'concepts' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Concepts
            </button>
            <button
              onClick={() => setActiveRightTab('inspector')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'inspector' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inspector
            </button>
            <button
              onClick={() => setActiveRightTab('comments')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'comments' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setActiveRightTab('history')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'history' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              History
            </button>
          </div>

          {activeRightTab === 'concepts' && (
            <AiConceptsPanel
              concepts={concepts}
              activeConceptId={activeConceptId}
              onSelectConcept={setActiveConceptId}
              onSaveFavorite={(concept) => setFavorites(prev => [...prev, {
                id: `fav_${Date.now()}`,
                designName: concept.name,
                roomId: roomState.roomId,
                roomName: roomState.roomName,
                style: concept.style,
                savedAt: new Date().toLocaleTimeString(),
                previewColor: concept.colorPalette.walls
              }])}
              isDarkMode={isDarkMode}
            />
          )}

          {activeRightTab === 'inspector' && (
            <FurnitureInspectorPanel
              selectedItem={selectedFurnitureItem}
              onUpdateItem={handleUpdateFurnitureItem}
              onDuplicateItem={handleDuplicateFurnitureItem}
              onDeleteItem={handleDeleteFurnitureItem}
              isDarkMode={isDarkMode}
            />
          )}

          {activeRightTab === 'comments' && (
            <CollaborationCommentsPanel
              comments={comments}
              currentRole={currentRole}
              onAddComment={(text) => setComments(prev => [...prev, {
                id: `c_${Date.now()}`,
                roomId: selectedRoomId,
                userRole: currentRole,
                userName: `${currentRole} User`,
                text,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'Pending'
              }])}
              onUpdateCommentStatus={(id, status) => setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c))}
              isDarkMode={isDarkMode}
            />
          )}

          {activeRightTab === 'history' && (
            <VersionHistoryPanel
              history={savedVersions}
              canUndo={historyPointer > 0}
              canRedo={historyPointer < historyStack.length - 1}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onSaveVersion={(title) => setSavedVersions(prev => [...prev, {
                id: `v_${Date.now()}`,
                versionNumber: prev.length + 1,
                title,
                createdAt: new Date().toLocaleTimeString(),
                roomState,
                changeSummary: `Custom snapshot created by ${currentRole}.`
              }])}
              onRestoreVersion={(ver) => setRoomState(ver.roomState)}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* 3. BOTTOM INTERACTIVE AI CHAT PROMPT BAR */}
      <AiInteriorChatBar
        onSendPrompt={handleAiSendPrompt}
        isLoading={isAiGenerating}
        isDarkMode={isDarkMode}
      />

      {/* Export Modal */}
      <ExportStudioModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        roomState={roomState}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
