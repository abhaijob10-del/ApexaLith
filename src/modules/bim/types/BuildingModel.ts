export type SupportedFileType = 'IFC' | 'DXF' | 'DWG' | 'PDF' | 'PNG' | 'JPEG' | 'ZIP';

export interface CoordinateData {
  origin: [number, number, number];
  crs?: string;
  scaleFactor: number;
  units: 'meters' | 'millimeters' | 'feet' | 'inches';
}

export interface LevelData {
  id: string;
  name: string;
  elevation: number; // meters
  height: number;    // meters
}

export interface FloorData {
  id: string;
  level: number;
  name: string;
  elevation: number;
  height: number;
  areaSqMeters: number;
}

export interface OpeningData {
  id: string;
  wallId?: string;
  level: number;
  type: 'door_opening' | 'window_opening' | 'passage' | 'duct_penetration';
  bounds: { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number };
}

export interface SlabData {
  id: string;
  level: number;
  thickness: number;
  boundaryPolygon: [number, number][];
  material: string;
  elevation: number;
}

export interface RoofData {
  id: string;
  level: number;
  type: string;
  thickness: number;
  boundaryPolygon: [number, number][];
  material: string;
}

export interface ColumnData {
  id: string;
  level: number;
  position: [number, number, number];
  height: number;
  sectionProfile: string;
  material: string;
}

export interface BeamData {
  id: string;
  level: number;
  start: [number, number, number];
  end: [number, number, number];
  profile: string;
  material: string;
}

export interface FurnitureData {
  id: string;
  name: string;
  category: string;
  position: [number, number, number];
  rotation: number;
  dimensions: [number, number, number];
}

export interface MaterialData {
  id: string;
  name: string;
  category: string;
  colorHex?: string;
  densityKgM3?: number;
  thermalConductivity?: number;
}

export interface RelationshipData {
  parentId: string;
  childId: string;
  relationshipType: 'contains' | 'bounds' | 'hosts' | 'connects';
}

export interface DetectionMetadata {
  confidenceScore: number; // 0 to 100%
  sourceFile: string;
  detectionMethod: 'IFC STEP Entity Parser' | 'DXF Polyline Vector Stream' | 'DWG Binary Line Converter' | 'Gemini Vision AI Analysis' | 'Architectural Heuristic Engine' | 'Manual User Verification';
  isApproved?: boolean;
  isUserEdited?: boolean;
  userNotes?: string;
  isUnknownArea?: boolean;
}

export interface RoomData {
  id: string;
  name: string;
  level: number;
  category: 'Bedroom' | 'Bathroom' | 'Living Room' | 'Dining Room' | 'Kitchen' | 'Balcony' | 'Utility Room' | 'Garage' | 'Staircase' | 'Hallway' | 'Open Space' | 'Custom';
  areaSqMeters: number;
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  perimeterMeters: number;
  centerPoint: [number, number, number];
  detection?: DetectionMetadata;
}

export interface WallData {
  id: string;
  level: number;
  type: 'exterior' | 'interior' | 'curtain' | 'partition';
  start: [number, number, number];
  end: [number, number, number];
  thickness: number;
  height: number;
  material: string;
  profile?: string;
  isLoadBearing?: boolean;
  detection?: DetectionMetadata;
}

export interface DoorData {
  id: string;
  wallId?: string;
  level: number;
  position: [number, number, number];
  width: number;
  height: number;
  openingType?: string;
  style?: string;
  detection?: DetectionMetadata;
}

export interface WindowData {
  id: string;
  wallId?: string;
  level: number;
  position: [number, number, number];
  width: number;
  height: number;
  sillHeight: number;
  style?: string;
  detection?: DetectionMetadata;
}

export interface ArchitecturalAnalysisData {
  buildingType: string;
  totalFloors: number;
  roomSummary: {
    bedrooms: number;
    bathrooms: number;
    livingRooms: number;
    diningRooms: number;
    kitchens: number;
    balconies: number;
    utilityRooms: number;
    garages: number;
    staircases: number;
    openSpaces: number;
  };
  roofType: string;
  ceilingHeights: { minMeters: number; maxMeters: number; averageMeters: number };
  wallThicknessSummary: { exteriorMm: number; interiorMm: number };
  roomRelationships: { fromRoom: string; toRoom: string; connectionType: string }[];
  naturalLightDirection: 'North-East' | 'South-West' | 'South' | 'North' | 'East' | 'West' | 'Omnidirectional';
  potentialEntrances: string[];
  potentialVentilation: 'High Natural Cross-Ventilation' | 'Moderate Ventilation' | 'Requires Mechanical HVAC Supplement';
  northOrientationDeg: number;
  buildingSymmetry: 'Bilateral Symmetric' | 'Asymmetric Contemporary' | 'Radial Radial-Symmetric';
  overallConfidenceScore: number;
}

export interface ParserMetadata {
  fileType: SupportedFileType;
  fileName: string;
  fileSizeBytes: number;
  parserVersion: string;
  parsingConfidence: number; // 0 to 100
  extractedAt: string;
  boundingExtent: {
    min: [number, number, number];
    max: [number, number, number];
    dimensions: [number, number, number];
  };
  totalElementsCount: number;
  sourceLayersCount?: number;
  aiModelVersion?: string;
}

export interface BuildingModel {
  id: string;
  projectId: string;
  building: {
    id: string;
    name: string;
    type: string;
    totalFloors: number;
    totalAreaSqMeters: number;
    dimensions: { length: number; width: number; height: number };
  };
  floors: FloorData[];
  rooms: RoomData[];
  walls: WallData[];
  doors: DoorData[];
  windows: WindowData[];
  openings: OpeningData[];
  slabs: SlabData[];
  roofs: RoofData[];
  columns: ColumnData[];
  beams: BeamData[];
  furniture: FurnitureData[];
  materials: MaterialData[];
  levels: LevelData[];
  coordinates: CoordinateData;
  relationships: RelationshipData[];
  metadata: ParserMetadata;
  aiAnalysis?: ArchitecturalAnalysisData;
  approvalStatus: 'PENDING_REVIEW' | 'VERIFIED' | 'REJECTED' | 'NEEDS_MORE_DATA';
}

export interface VerificationSession {
  id: string;
  buildingModelId: string;
  projectId: string;
  status: 'Draft' | 'InReview' | 'Approved' | 'Rejected';
  overallConfidenceScore: number;
  totalElementsDetected: number;
  verifiedCount: number;
  pendingCount: number;
  requiredFilesList: string[];
  createdAt: string;
  updatedAt: string;
}

export interface VerificationLog {
  id: string;
  sessionId: string;
  timestamp: string;
  actionType: 'rename_room' | 'merge_rooms' | 'split_room' | 'correct_wall' | 'correct_door' | 'correct_window' | 'approve' | 'reject' | 'edit_dimension' | 'mark_unknown';
  user: string;
  details: string;
  previousValue?: any;
  newValue?: any;
}

export interface RoomMetadataRecord {
  id: string;
  buildingModelId: string;
  roomId: string;
  name: string;
  category: string;
  areaSqMeters: number;
  confidenceScore: number;
  sourceFile: string;
  detectionMethod: string;
  isApproved: boolean;
  isUserEdited: boolean;
  userNotes?: string;
}

export interface GeometryMetadataRecord {
  id: string;
  buildingModelId: string;
  elementId: string;
  elementType: 'wall' | 'door' | 'window' | 'opening' | 'column' | 'level';
  bounds: any;
  coordinates: any;
  confidenceScore: number;
  sourceFile: string;
  detectionMethod: string;
}

export interface ParserLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  module: 'BIMManager' | 'CADManager' | 'ParserManager' | 'MetadataExtractor' | 'ValidationManager' | 'StorageManager' | 'FutureAIManager';
  message: string;
  details?: any;
}

export interface ValidationReport {
  id: string;
  projectId: string;
  buildingModelId: string;
  confidenceScore: number; // 0 to 100
  isSufficient: boolean;
  statusMessage: string; // e.g. "We need additional architectural information."
  requestedInformation: {
    id: string;
    title: string;
    description: string;
    fileType: SupportedFileType[];
    isRequired: boolean;
  }[];
  validationChecks: {
    checkName: string;
    passed: boolean;
    details: string;
  }[];
  createdAt: string;
}
