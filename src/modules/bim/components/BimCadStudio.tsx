import React, { useState, useEffect } from 'react';
import { ParserManager, ParsePipelineResult } from '../services/ParserManager';
import { StorageManager } from '../services/StorageManager';
import { 
  BuildingModel, 
  ParserLog, 
  ValidationReport, 
  SupportedFileType,
  VerificationLog,
  VerificationSession
} from '../types/BuildingModel';
import { ProjectFilesPanel } from './ProjectFilesPanel';
import { Schematic2DOverlay } from './Schematic2DOverlay';
import { VerificationPropertiesPanel } from './VerificationPropertiesPanel';
import { ArchitecturalSummaryCard } from './ArchitecturalSummaryCard';
import { ArchitecturalAssistantChat } from './ArchitecturalAssistantChat';
import { ParserLogsConsole } from './ParserLogsConsole';
import { BuildingDataInspector } from './BuildingDataInspector';
import { 
  Upload, 
  RotateCcw, 
  Clock, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  Save, 
  Database,
  FileCode,
  Check
} from 'lucide-react';

interface BimCadStudioProps {
  isDarkMode?: boolean;
}

export const BimCadStudio: React.FC<BimCadStudioProps> = ({ isDarkMode = true }) => {
  const [parsing, setParsing] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [logs, setLogs] = useState<ParserLog[]>([]);
  const [pipelineResult, setPipelineResult] = useState<ParsePipelineResult | null>(null);
  
  // Selection state
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementType, setSelectedElementType] = useState<'room' | 'wall' | 'door' | 'window' | null>(null);

  // Firestore sync state
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);
  const [savingToFirestore, setSavingToFirestore] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  // Uploaded files list
  const [projectFiles, setProjectFiles] = useState<{
    name: string;
    type: SupportedFileType;
    size: string;
    uploadedAt: string;
    status: string;
  }[]>([]);

  // Do not auto-load sample model on mount - wait for user file upload
  useEffect(() => {
    // Standby for user upload
  }, []);

  const loadSampleModel = async () => {
    setParsing(true);
    setProgressPercent(10);
    setProgressStep('Initializing Phase 4 AI Architectural Verification Pipeline...');
    setLogs([]);

    const sampleIfcContent = `
ISO-10303-21;
HEADER;
FILE_DESCRIPTION(('ApexaLith Phase 4 Verified BIM Model'),'2;1');
FILE_NAME('Villa_Alpha_Compound.ifc','2026-07-28',('ApexaLith Senior Engineer'),('Architectural Group'),'web-ifc','ApexaLith AI Engine','');
FILE_SCHEMA(('IFC4'));
ENDSEC;
DATA;
#1= IFCORGANIZATION($,'ApexaLith Architecture',$,$,$);
#2= IFCAPPLICATION(#1,'4.0.0','ApexaLith AI Engine','ApexaLith');
#3= IFCBUILDING('bld_01',#1,'Penthouse Villa Compound Alpha',$,$,$,$,$,$,$,$,$);
#4= IFCBUILDINGSTOREY('flr_01',$,'Ground Living Floor Level 0',$,$,0.0,$,$,$,$);
#5= IFCBUILDINGSTOREY('flr_02',$,'First Executive Suite Level 1',$,$,3.2,$,$,$,$);
#6= IFCWALLSTANDARDCASE('w_01',$,'Outer Load-Bearing Wall',$,$,$,$,$,$);
#7= IFCDOOR('d_01',$,'Main Foyer Double Glass Door',$,$,$,$,$,$);
#8= IFCWINDOW('win_01',$,'Panoramic Low-E Window Suite',$,$,$,$,$,$);
#9= IFCSPACE('sp_01',$,'Foyer & Grand Living Suite',$,$,$,$,$,$);
#10= IFCSPACE('sp_02',$,'Master Bedroom Suite',$,$,$,$,$,$);
ENDSEC;
END-ISO-10303-21;
    `;

    const sampleFile = new File([sampleIfcContent], 'Villa_Alpha_Compound.ifc', { type: 'text/plain' });

    try {
      const parserManager = ParserManager.getInstance();
      const result = await parserManager.processFile(
        sampleFile,
        (percent, step) => {
          setProgressPercent(percent);
          setProgressStep(step);
        },
        (log) => setLogs(prev => [...prev, log])
      );

      // Enrich building model with AI Analysis parameters for Phase 4
      const enrichedModel: BuildingModel = {
        ...result.buildingModel,
        approvalStatus: 'PENDING_REVIEW',
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
          overallConfidenceScore: result.validationReport.confidenceScore || 88
        },
        rooms: result.buildingModel.rooms.map((r, i) => ({
          ...r,
          category: i === 0 ? 'Living Room' : i === 1 ? 'Bedroom' : 'Kitchen',
          detection: {
            confidenceScore: 85 + (i * 5),
            sourceFile: 'Villa_Alpha_Compound.ifc',
            detectionMethod: 'IFC STEP Entity Parser',
            isApproved: false,
            isUserEdited: false
          }
        })),
        walls: result.buildingModel.walls.map(w => ({
          ...w,
          detection: {
            confidenceScore: 92,
            sourceFile: 'Villa_Alpha_Compound.ifc',
            detectionMethod: 'DXF Polyline Vector Stream',
            isApproved: false,
            isUserEdited: false
          }
        }))
      };

      setPipelineResult({
        ...result,
        buildingModel: enrichedModel
      });
    } catch (err) {
      console.error('Sample loading error:', err);
    } finally {
      setParsing(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setParsing(true);
    setProgressPercent(5);
    setProgressStep(`Analyzing ${file.name}...`);
    setLogs([]);

    const ext = file.name.split('.').pop()?.toUpperCase() as SupportedFileType || 'PDF';
    const formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    // Add to uploaded files list
    setProjectFiles(prev => [
      {
        name: file.name,
        type: ext,
        size: formattedSize,
        uploadedAt: 'Just Now',
        status: 'PROCESSING'
      },
      ...prev
    ]);

    try {
      const parserManager = ParserManager.getInstance();
      const result = await parserManager.processFile(
        file,
        (percent, step) => {
          setProgressPercent(percent);
          setProgressStep(step);
        },
        (log) => setLogs(prev => [...prev, log])
      );

      // Trigger server-side Gemini AI analysis endpoint
      try {
        const aiRes = await fetch('/api/gemini/architectural-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileType: ext,
            rawModelData: {
              rooms: result.buildingModel.rooms.length,
              walls: result.buildingModel.walls.length
            }
          })
        });
        const aiAnalysisData = await aiRes.json();
        
        const updatedModel: BuildingModel = {
          ...result.buildingModel,
          approvalStatus: 'PENDING_REVIEW',
          aiAnalysis: aiAnalysisData
        };

        setPipelineResult({
          ...result,
          buildingModel: updatedModel
        });
      } catch (e) {
        setPipelineResult(result);
      }

      setProjectFiles(prev => prev.map(f => f.name === file.name ? { ...f, status: 'PARSED' } : f));
    } catch (err) {
      console.error('File process error:', err);
    } finally {
      setParsing(false);
    }
  };

  // Handle Model Updates from Verification Property Panel
  const handleUpdateModel = (updatedModel: BuildingModel, logMessage: string) => {
    if (!pipelineResult) return;

    const newLog: VerificationLog = {
      id: `vlog_${Date.now()}`,
      sessionId: `session_${pipelineResult.buildingModel.id}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionType: 'rename_room',
      user: 'Architect Reviewer',
      details: logMessage
    };

    setVerificationLogs(prev => [newLog, ...prev]);

    setPipelineResult({
      ...pipelineResult,
      buildingModel: updatedModel
    });
  };

  // Authoritative Freeze & Firestore Sync
  const handleFreezeAndSyncFirestore = async () => {
    if (!pipelineResult) return;
    setSavingToFirestore(true);
    setSavedMessage(null);

    const updatedModel: BuildingModel = {
      ...pipelineResult.buildingModel,
      approvalStatus: 'VERIFIED',
      metadata: {
        ...pipelineResult.buildingModel.metadata,
        parsingConfidence: 100,
        aiModelVersion: 'gemini-2.5-flash'
      }
    };

    const session: VerificationSession = {
      id: `session_${updatedModel.id}`,
      buildingModelId: updatedModel.id,
      projectId: updatedModel.projectId,
      status: 'Approved',
      overallConfidenceScore: 100,
      totalElementsDetected: updatedModel.rooms.length + updatedModel.walls.length + updatedModel.doors.length + updatedModel.windows.length,
      verifiedCount: updatedModel.rooms.length + updatedModel.walls.length,
      pendingCount: 0,
      requiredFilesList: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    try {
      const storageManager = StorageManager.getInstance();
      await storageManager.saveVerifiedBuildingModel(updatedModel, session, verificationLogs);

      setPipelineResult({
        ...pipelineResult,
        buildingModel: updatedModel
      });

      setSavedMessage(`Authoritative Building Model ${updatedModel.id} frozen & persisted across Firestore collections (building_models, verification_sessions, verification_logs, room_metadata, geometry_metadata).`);
    } catch (err) {
      console.error('Firestore Sync error:', err);
    } finally {
      setSavingToFirestore(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 ${
      isDarkMode ? 'text-slate-100' : 'text-slate-900'
    }`}>
      {/* Banner */}
      <div className={`p-6 rounded-sm border relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#0D111A] via-[#121824] to-[#0D0D0D] border-white/10' 
          : 'bg-slate-100 border-slate-200 shadow-sm'
      }`}>
        <div className="space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-sm bg-[#B59B6D]/20 text-[#B59B6D] text-[10px] font-bold uppercase tracking-[0.2em] border border-[#B59B6D]/30">
              Phase 4 AI Analysis Engine
            </span>
            <span className="text-xs text-white/50 font-mono">Drawing Verification & Building Model Extraction</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white">
            Architectural <span className="text-[#B59B6D]">Analysis & Verification Workspace</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-3xl">
            Inspect uploaded architectural drawings (IFC, DXF, DWG, PDF, PNG, JPG, Site Images), verify detected building elements, correct room spaces, and resolve missing documentation before Phase 5 3D model generation.
          </p>
        </div>

        {/* Sync / Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 z-10">
          <button
            onClick={loadSampleModel}
            disabled={parsing}
            className="px-3 py-2 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/15 text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reload Model</span>
          </button>

          <button
            onClick={handleFreezeAndSyncFirestore}
            disabled={savingToFirestore || !pipelineResult}
            className="px-4 py-2 rounded-sm bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/40 text-xs font-bold uppercase tracking-wider transition flex items-center space-x-1.5 shadow-lg disabled:opacity-50"
          >
            <Database className="w-4 h-4" />
            <span>{savingToFirestore ? 'Syncing...' : 'Approve & Lock Model (Firestore)'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner Notice */}
      {savedMessage && (
        <div className="p-3.5 rounded-sm bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedMessage}</span>
          </div>
          <button 
            onClick={() => setSavedMessage(null)}
            className="text-emerald-400 hover:text-white uppercase font-bold text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Parsing Progress Bar */}
      {parsing && (
        <div className="p-4 rounded-sm bg-[#0D0D0D] border border-[#B59B6D] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase">
            <span className="text-[#B59B6D] flex items-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span>{progressStep}</span>
            </span>
            <span className="font-mono text-white">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-[#B59B6D] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Standby State: No Building Model Loaded */}
      {!pipelineResult && !parsing && (
        <div className="p-8 sm:p-12 rounded-sm border border-dashed border-white/20 bg-[#0D111A] flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#B59B6D]/20 border border-[#B59B6D]/40 flex items-center justify-center text-[#B59B6D]">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="text-xl font-bold uppercase tracking-wide text-white">No Building Model Loaded</h2>
            <p className="text-xs text-slate-400">
              Upload your architectural drawing file (IFC, DWG, DXF, PDF, PNG, JPG, ZIP) to run the AI Verification Pipeline and generate your 2D schematic overlay.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <label className="px-5 py-2.5 rounded bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-widest cursor-pointer transition flex items-center space-x-2 shadow-lg shadow-[#B59B6D]/20">
              <Upload className="w-4 h-4" />
              <span>Upload Drawing File</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".ifc,.dwg,.dxf,.pdf,.png,.jpg,.jpeg,.zip"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
            <button
              onClick={loadSampleModel}
              className="px-5 py-2.5 rounded border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4 text-[#B59B6D]" />
              <span>Load Sample Demo</span>
            </button>
          </div>
          <div className="pt-4 border-t border-white/10 text-[10px] font-mono text-slate-500 flex flex-wrap justify-center gap-2">
            <span>Supported Formats:</span>
            <span className="text-[#B59B6D]">IFC</span> •
            <span className="text-[#B59B6D]">DWG</span> •
            <span className="text-[#B59B6D]">DXF</span> •
            <span className="text-[#B59B6D]">PDF</span> •
            <span className="text-[#B59B6D]">PNG/JPG</span> •
            <span className="text-[#B59B6D]">ZIP</span>
          </div>
        </div>
      )}

      {/* Main 3-Column Verification Dashboard Grid */}
      {pipelineResult && (
        <div className="space-y-6">
          {/* Main 3-Column Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Panel: Project Files & Missing Requirements (Col 3) */}
            <div className="lg:col-span-3">
              <ProjectFilesPanel
                files={projectFiles}
                validationReport={pipelineResult.validationReport}
                onFileUpload={handleFileUpload}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Center Panel: 2D Schematic Verification Canvas (Col 6) */}
            <div className="lg:col-span-6">
              <Schematic2DOverlay
                model={pipelineResult.buildingModel}
                selectedElementId={selectedElementId}
                onSelectElement={(id, type) => {
                  setSelectedElementId(id);
                  setSelectedElementType(type);
                }}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* Right Panel: Properties & Manual Verification Editor (Col 3) */}
            <div className="lg:col-span-3">
              <VerificationPropertiesPanel
                model={pipelineResult.buildingModel}
                selectedElementId={selectedElementId}
                selectedElementType={selectedElementType}
                onUpdateModel={handleUpdateModel}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* AI Analysis Summary Cards */}
          <ArchitecturalSummaryCard
            model={pipelineResult.buildingModel}
            isDarkMode={isDarkMode}
          />

          {/* AI Architectural Assistant Q&A Chat & Real-time Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ArchitecturalAssistantChat
                model={pipelineResult.buildingModel}
                isDarkMode={isDarkMode}
              />
            </div>

            <div className="lg:col-span-1">
              <ParserLogsConsole
                logs={logs.length > 0 ? logs : pipelineResult.parserLogs}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>

          {/* Building Data Inspector */}
          <BuildingDataInspector
            model={pipelineResult.buildingModel}
            isDarkMode={isDarkMode}
          />
        </div>
      )}
    </div>
  );
};
