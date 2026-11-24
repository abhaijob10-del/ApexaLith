import { BuildingModel, RoomData, WallData, DoorData, WindowData, RoofData, SlabData, ColumnData } from '../../bim/types/BuildingModel';

export type ComponentType = 'wall' | 'door' | 'window' | 'floor' | 'ceiling' | 'roof' | 'column' | 'stair' | 'room_zone';

export type PBRMaterialType = 
  | 'Concrete' 
  | 'Brick' 
  | 'Stone' 
  | 'Wood' 
  | 'Tiles' 
  | 'Marble' 
  | 'Granite' 
  | 'Glass' 
  | 'Steel' 
  | 'Paint';

export interface ComponentMetadata {
  id: string;
  name: string;
  type: ComponentType;
  roomId?: string;
  roomName?: string;
  level: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    thickness?: number;
    areaSqMeters?: number;
    volumeCuMeters?: number;
  };
  materialType: PBRMaterialType;
  materialName: string;
  colorHex?: string;
  roughness?: number;
  metalness?: number;
  isLoadBearing?: boolean;
  constructionNotes?: string;
  futureCostEstimate?: number; // Phase 6 preview
  futureAiSuggestions?: string[]; // Phase 6 preview
}

export interface SceneNode {
  id: string;
  name: string;
  type: 'scene' | 'building' | 'floor' | 'room' | 'component';
  componentType?: ComponentType;
  parentId?: string;
  children: SceneNode[];
  metadata?: ComponentMetadata;
  visible: boolean;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface SceneGraphData {
  root: SceneNode;
  buildingId: string;
  totalComponents: number;
  updatedAt: string;
}

export interface DigitalTwinRecord {
  id: string;
  buildingModelId: string;
  projectId: string;
  sceneGraph: SceneGraphData;
  cameraState: {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
    mode: 'orbit' | 'fly' | 'top2d' | 'elevation';
  };
  lightingState: {
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    sunIntensity: number;
    ambientIntensity: number;
    shadowsEnabled: boolean;
  };
  visibilityState: {
    hideWalls: boolean;
    showWireframe: boolean;
    showRoof: boolean;
    showCeilings: boolean;
    showSectionCut: boolean;
    sectionCutAxis: 'X' | 'Y' | 'Z';
    sectionCutOffset: number;
  };
  measurements: MeasurementItem[];
  selectedObjectId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MeasurementItem {
  id: string;
  type: 'distance' | 'room_size';
  startPoint: [number, number, number];
  endPoint: [number, number, number];
  valueFormatted: string; // e.g. "4.25 m" or "28.5 m²"
  label: string;
}

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
