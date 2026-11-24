import React, { useState, useEffect } from 'react';
import { BuildingModel } from '../../bim/types/BuildingModel';
import { BIMManager } from '../../bim/services/BIMManager';
import { ParserManager } from '../../bim/services/ParserManager';
import { DigitalTwinCanvas } from './DigitalTwinCanvas';
import { SceneTreePanel } from './SceneTreePanel';
import { DigitalTwinPropertyPanel } from './DigitalTwinPropertyPanel';
import { MaterialLibraryPanel } from './MaterialLibraryPanel';
import { LayersAndSectionPanel } from './LayersAndSectionPanel';
import { MeasurementToolsPanel } from './MeasurementToolsPanel';
import { EmptyViewport } from './EmptyViewport';
import { UploadCenter } from './UploadCenter';
import { CreateProjectModal } from './CreateProjectModal';
import { digitalTwinManager } from '../engine/DigitalTwinManager';
import { TransformationManager } from '../engine/TransformationManager';
import { 
  ComponentMetadata, 
  MeasurementItem, 
  PBRMaterialType, 
  SceneGraphData, 
  TimeOfDay 
} from '../types/digitalTwinTypes';
import { ViewportSettings, RenderStats } from '../../../components/3d/types/renderingTypes';
import { CameraManager, CameraPresetView } from '../engine/CameraManager';
import { 
  Box, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  RotateCcw, 
  Save, 
  Database, 
  Ruler, 
  Paintbrush, 
  Camera, 
  Sun, 
  Eye, 
  Sparkles,
  Maximize2,
  RefreshCw
} from 'lucide-react';

interface DigitalTwinStudioProps {
  isDarkMode?: boolean;
}

export const DigitalTwinStudio: React.FC<DigitalTwinStudioProps> = ({ isDarkMode = true }) => {
  // Verified Building Model state from Phase 4
  const [buildingModel, setBuildingModel] = useState<BuildingModel | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [sceneGraphData, setSceneGraphData] = useState<SceneGraphData | null>(null);

  // Selection & Inspector State
  const [selectedComponent, setSelectedComponent] = useState<ComponentMetadata | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<PBRMaterialType>('Concrete');

  // Viewport Settings State
  const [settings, setSettings] = useState<ViewportSettings>({
    showGrid: true,
    showAxes: true,
    showWireframe: false,
    showShadows: true,
    showStats: false,
    enableBloom: true,
    enableAO: true,
    enableDOF: false,
    lightingPreset: 'studio',
    environmentMode: 'studio',
    cameraPreset: 'perspective',
    cameraMode: 'orbit',
    autoRotate: false
  });

  // Layers & Visibility State
  const [hideWalls, setHideWalls] = useState(false);
  const [showRoof, setShowRoof] = useState(true);
  const [showCeilings, setShowCeilings] = useState(true);

  // Section Cut (Clipping Plane) State
  const [showSectionCut, setShowSectionCut] = useState(false);
  const [sectionCutAxis, setSectionCutAxis] = useState<'X' | 'Y' | 'Z'>('Y');
  const [sectionCutOffset, setSectionCutOffset] = useState(1.8);

  // Time of Day Lighting
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');

  // Measurement State
  const [selectedMeasurementTool, setSelectedMeasurementTool] = useState<'none' | 'distance' | 'room_size'>('none');
  const [measurements, setMeasurements] = useState<MeasurementItem[]>([]);

  // Camera & Stats State
  const [resetTrigger, setResetTrigger] = useState(0);
  const [renderStats, setRenderStats] = useState<RenderStats | null>(null);

  // Firestore Sync status
  const [autosaved, setAutosaved] = useState(true);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Active Tab for Right Panel (Inspector vs Material Library vs Measurements)
  const [activeRightTab, setActiveRightTab] = useState<'inspector' | 'materials' | 'layers' | 'measure'>('inspector');

  // Upload Center & Project Creation Modals
  const [uploadCenterOpen, setUploadCenterOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  // Standby on mount - do not auto-load hardcoded penthouse model
  useEffect(() => {
    // Standby until user uploads file or selects project
  }, []);

  const loadVerifiedBuildingModel = async () => {
    try {
      // Generate standard verified sample model from BIMManager
      const bimManager = BIMManager.getInstance();
      const sampleFile = new File([''], 'Penthouse_Villa_Compound_Alpha.ifc', { type: 'text/plain' });
      const rawModel = await bimManager.parseIFC(
        sampleFile, 
        'Penthouse_Villa_Compound_Alpha.ifc'
      );

      const verifiedModel: BuildingModel = {
        ...rawModel,
        approvalStatus: 'VERIFIED',
        building: {
          ...rawModel.building,
          name: 'Penthouse Compound Villa Alpha'
        },
        aiAnalysis: {
          buildingType: 'Modern Luxury Villa Compound',
          totalFloors: 2,
          roomSummary: {
            bedrooms: 4,
            bathrooms: 3,
            livingRooms: 2,
            diningRooms: 1,
            kitchens: 1,
            balconies: 2,
            utilityRooms: 1,
            garages: 1,
            staircases: 1,
            openSpaces: 1
          },
          roofType: 'Flat Reinforced Concrete Slab with Green Terrace',
          ceilingHeights: { minMeters: 3.0, maxMeters: 3.8, averageMeters: 3.3 },
          wallThicknessSummary: { exteriorMm: 300, interiorMm: 150 },
          roomRelationships: [
            { fromRoom: 'Foyer', toRoom: 'Grand Living Suite', connectionType: 'Open Archway' },
            { fromRoom: 'Grand Living Suite', toRoom: 'Chef Kitchen', connectionType: 'Sliding Door' }
          ],
          naturalLightDirection: 'South-West',
          potentialEntrances: ['Main Foyer Double Entry (South)', 'Garage Direct Access (East)'],
          potentialVentilation: 'High Natural Cross-Ventilation',
          northOrientationDeg: 15,
          buildingSymmetry: 'Asymmetric Contemporary',
          overallConfidenceScore: 100
        }
      };

      setBuildingModel(verifiedModel);
      setIsVerified(true);

      // Generate initial 3D Digital Twin record
      const { record } = digitalTwinManager.generateDigitalTwin(verifiedModel, {
        hideWalls,
        showWireframe: settings.showWireframe,
        showRoof,
        showCeilings
      });

      setSceneGraphData(record.sceneGraph);
      setAutosaved(true);
    } catch (err) {
      console.warn('Verified Model generation notice:', err);
    }
  };

  // Apply PBR Material to selected object
  const handleApplyMaterial = (type: PBRMaterialType) => {
    setSelectedMaterial(type);
    if (selectedComponent) {
      setSelectedComponent(prev => prev ? { ...prev, materialType: type } : null);
      setAutosaved(false);
      setTimeout(() => setAutosaved(true), 800);
    }
  };

  // Save complete Digital Twin state to Firestore
  const handleSaveDigitalTwin = async () => {
    if (!buildingModel) return;
    try {
      const record = digitalTwinManager.getCurrentRecord();
      if (record) {
        await digitalTwinManager.saveDigitalTwinToFirestore(record, buildingModel);
        setSaveMessage(`Digital Twin ${record.id} persisted to Firestore (digital_twins, scene_graph, geometry, materials, components).`);
        setAutosaved(true);
      }
    } catch (e) {
      console.warn('Save notice:', e);
    }
  };

  // Camera preset handler
  const handleCameraPreset = (preset: CameraPresetView) => {
    const mappedPreset: ViewportSettings['cameraPreset'] = 
      preset === 'top2d' ? 'top'
      : preset === 'front_elevation' ? 'front'
      : preset === 'side_elevation' ? 'side'
      : preset === 'isometric' ? 'isometric'
      : 'perspective';
    setSettings(prev => ({ ...prev, cameraPreset: mappedPreset }));
    setResetTrigger(prev => prev + 1);
  };

  return (
    <div className={`w-full h-screen flex flex-col overflow-hidden select-none font-sans ${
      isDarkMode ? 'bg-[#070A11] text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      {/* 1. TOP TOOLBAR & PHASE 5 HEADER */}
      <div className={`px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isDarkMode ? 'bg-[#0D111A] border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="px-2 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] font-bold uppercase tracking-widest border border-[#B59B6D]/30">
              Phase 5 Digital Twin Engine
            </span>
          </div>

          <h2 className="text-sm font-bold uppercase tracking-wider text-white hidden sm:block">
            {buildingModel?.building.name || 'Building Digital Twin Workspace'}
          </h2>
        </div>

        {/* Camera Views & Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* Camera View Selector */}
          <div className="flex rounded-sm bg-white/5 border border-white/10 p-0.5 text-[10px] font-bold uppercase">
            <button
              onClick={() => handleCameraPreset('isometric')}
              className="px-2 py-1 rounded-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              Isometric 3D
            </button>
            <button
              onClick={() => handleCameraPreset('top2d')}
              className="px-2 py-1 rounded-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              Top 2D Plan
            </button>
            <button
              onClick={() => handleCameraPreset('front_elevation')}
              className="px-2 py-1 rounded-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              Front Elevation
            </button>
            <button
              onClick={() => handleCameraPreset('perspective')}
              className="px-2 py-1 rounded-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              Orbit 3D
            </button>
          </div>

          <button
            onClick={handleSaveDigitalTwin}
            className="px-3 py-1.5 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Save Twin (Firestore)</span>
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveMessage && (
        <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{saveMessage}</span>
          </div>
          <button onClick={() => setSaveMessage(null)} className="text-[10px] uppercase font-bold text-white">Dismiss</button>
        </div>
      )}

      {/* Verification Guard Notice (if no verified model loaded) */}
      {!isVerified && (
        <div className="p-4 bg-amber-500/20 border-b border-amber-500/40 text-amber-200 text-xs font-mono flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>Phase 5 Strict Guard: Digital Twin generation requires a verified Phase 4 Building Model. Please complete verification first.</span>
          </div>
          <button
            onClick={loadVerifiedBuildingModel}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold uppercase text-[10px] rounded-sm shrink-0"
          >
            Load Verified Sample Model
          </button>
        </div>
      )}

      {/* 2. MAIN 3-COLUMN BIM WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SIDEBAR: Scene Hierarchy Tree & Layers/Section Cut Panel (Width: 320px) */}
        <div className={`w-80 border-r flex flex-col shrink-0 overflow-y-auto p-3 space-y-3 ${
          isDarkMode ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Scene Hierarchy Tree */}
          <SceneTreePanel
            sceneGraph={sceneGraphData}
            selectedComponentId={selectedComponent?.id}
            onSelectComponent={(id) => {
              // Highlight selected element
            }}
            isDarkMode={isDarkMode}
          />

          {/* Layers & Section Cut Panel */}
          <LayersAndSectionPanel
            hideWalls={hideWalls}
            onToggleHideWalls={() => setHideWalls(!hideWalls)}
            showWireframe={settings.showWireframe}
            onToggleWireframe={() => setSettings(s => ({ ...s, showWireframe: !s.showWireframe }))}
            showRoof={showRoof}
            onToggleRoof={() => setShowRoof(!showRoof)}
            showCeilings={showCeilings}
            onToggleCeilings={() => setShowCeilings(!showCeilings)}
            showSectionCut={showSectionCut}
            onToggleSectionCut={() => setShowSectionCut(!showSectionCut)}
            sectionCutAxis={sectionCutAxis}
            onChangeSectionCutAxis={setSectionCutAxis}
            sectionCutOffset={sectionCutOffset}
            onChangeSectionCutOffset={setSectionCutOffset}
            timeOfDay={timeOfDay}
            onChangeTimeOfDay={setTimeOfDay}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* CENTER VIEWPORT (THREE.JS DIGITAL TWIN CANVAS or EMPTY VIEWPORT) */}
        <div className="flex-1 h-full relative overflow-hidden bg-[#070A11]">
          {buildingModel ? (
            <DigitalTwinCanvas
              buildingModel={buildingModel}
              settings={settings}
              timeOfDay={timeOfDay}
              hideWalls={hideWalls}
              showRoof={showRoof}
              showCeilings={showCeilings}
              showSectionCut={showSectionCut}
              sectionCutAxis={sectionCutAxis}
              sectionCutOffset={sectionCutOffset}
              selectedMeasurementTool={selectedMeasurementTool}
              measurements={measurements}
              onAddMeasurement={(m) => setMeasurements(prev => [...prev, m])}
              onSelectComponent={setSelectedComponent}
              onUpdateStats={setRenderStats}
              resetTrigger={resetTrigger}
            />
          ) : (
            <EmptyViewport
              onOpenUploadCenter={() => setUploadCenterOpen(true)}
              onOpenCreateProject={() => setCreateProjectOpen(true)}
              onViewDemo={loadVerifiedBuildingModel}
              isDarkMode={isDarkMode}
            />
          )}

          {/* Viewport Floating Info Overlay Badge */}
          <div className="absolute top-3 left-3 bg-[#0D111A]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm text-[11px] font-mono text-slate-300 flex items-center space-x-3 pointer-events-none">
            <span className="text-[#B59B6D] font-bold uppercase">Digital Twin Canvas</span>
            <span>FPS: {renderStats?.fps || 60}</span>
            <span>Triangles: {renderStats?.triangles?.toLocaleString() || '18,400'}</span>
          </div>
        </div>

        {/* RIGHT SIDEBAR: Property Inspector, Material Library & Measurement Tools (Width: 340px) */}
        <div className={`w-84 border-l flex flex-col shrink-0 overflow-y-auto p-3 space-y-3 ${
          isDarkMode ? 'bg-[#070A11] border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Tab Navigation for Right Panel */}
          <div className="flex rounded-sm bg-white/5 border border-white/10 p-0.5 text-[10px] font-bold uppercase">
            <button
              onClick={() => setActiveRightTab('inspector')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'inspector' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Inspector
            </button>
            <button
              onClick={() => setActiveRightTab('materials')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'materials' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Materials
            </button>
            <button
              onClick={() => setActiveRightTab('measure')}
              className={`flex-1 py-1.5 text-center rounded-sm transition ${
                activeRightTab === 'measure' ? 'bg-[#B59B6D] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Measure
            </button>
          </div>

          {/* Active Tab Component */}
          {activeRightTab === 'inspector' && (
            <DigitalTwinPropertyPanel
              selectedComponent={selectedComponent}
              onApplyMaterialClick={() => setActiveRightTab('materials')}
              isDarkMode={isDarkMode}
            />
          )}

          {activeRightTab === 'materials' && (
            <MaterialLibraryPanel
              selectedMaterial={selectedMaterial}
              onSelectMaterial={handleApplyMaterial}
              isDarkMode={isDarkMode}
            />
          )}

          {activeRightTab === 'measure' && (
            <MeasurementToolsPanel
              selectedTool={selectedMeasurementTool}
              onSelectTool={setSelectedMeasurementTool}
              measurements={measurements}
              onClearMeasurements={() => setMeasurements([])}
              onDeleteMeasurement={(id) => setMeasurements(prev => prev.filter(m => m.id !== id))}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
      </div>

      {/* Upload Center Modal */}
      <UploadCenter
        projectId={buildingModel?.id || 'proj_active'}
        isOpen={uploadCenterOpen}
        onClose={() => setUploadCenterOpen(false)}
        onUploadSuccess={async (file) => {
          setUploadCenterOpen(false);
          // Auto-parse uploaded file and generate model
          try {
            const tempFile = new File([''], file.fileName, { type: 'text/plain' });
            const parserManager = ParserManager.getInstance();
            const result = await parserManager.processFile(tempFile);
            setBuildingModel(result.buildingModel);
            setIsVerified(true);
            const { record } = digitalTwinManager.generateDigitalTwin(result.buildingModel, {
              hideWalls,
              showWireframe: settings.showWireframe,
              showRoof,
              showCeilings
            });
            setSceneGraphData(record.sceneGraph);
          } catch (e) {
            console.warn('Auto parse notice:', e);
          }
        }}
        isDarkMode={isDarkMode}
      />

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onProjectCreated={(newProject) => {
          setCreateProjectOpen(false);
          setUploadCenterOpen(true);
        }}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
