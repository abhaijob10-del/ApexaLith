export type ArchitecturalStyle = 
  | 'Luxury'
  | 'Modern'
  | 'Minimalist'
  | 'Industrial'
  | 'Traditional'
  | 'Scandinavian'
  | 'Contemporary'
  | 'Japandi'
  | 'Mediterranean';

export type CameraViewMode = 'orbit' | 'top2d' | 'dollhouse' | 'firstperson';
export type TimeOfDay = 'sunrise' | 'day' | 'sunset' | 'evening' | 'night';

export type FileType = 'PDF' | 'PNG' | 'JPEG' | 'DWG' | 'DXF' | 'IFC' | 'Revit' | 'Video';

export interface UploadedFile {
  id: string;
  name: string;
  type: FileType;
  category: 'floorplan' | 'site_image' | 'property_photo' | 'cad' | 'dimensions' | 'interior_ref' | 'exterior_ref' | 'video';
  url: string;
  uploadedAt: string;
  sizeBytes: number;
}

export interface MissingInfoPrompt {
  id: string;
  title: string;
  description: string;
  requiredFileType: FileType[];
  impactOnModel: string;
  isMandatory: boolean;
}

export interface BimWall {
  id: string;
  start: [number, number]; // x, z coordinates in meters
  end: [number, number];
  height: number;
  thickness: number;
  isExterior: boolean;
  material: string; // e.g. 'Venetian Plaster', 'Concrete', 'Timber'
  colorHex: string;
}

export interface BimDoor {
  id: string;
  wallId: string;
  positionRatio: number; // 0.0 to 1.0 along wall
  width: number;
  height: number;
  style: 'Flush Wood' | 'Glass Sliding' | 'Pivot Timber' | 'Bronze Frame';
  frameColor: string;
}

export interface BimWindow {
  id: string;
  wallId: string;
  positionRatio: number;
  width: number;
  height: number;
  sillHeight: number;
  style: 'Floor-to-Ceiling' | 'Triple-Glazed' | 'Ribbon' | 'Double-Hung';
  frameMaterial: 'Anodized Bronze' | 'Black Steel' | 'Natural Oak' | 'Brushed Chrome';
}

export interface BimRoom {
  id: string;
  name: string;
  type: 'Living' | 'Kitchen' | 'Dining' | 'Master Bedroom' | 'Guest Bedroom' | 'Bathroom' | 'Balcony' | 'Utility';
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number };
  areaSqMeters: number;
  wallFinish: string;
  flooringMaterial: string; // e.g., 'Carrara Marble', 'Chevron Oak', 'Terrazzo'
  flooringColorHex: string;
  ceilingType: 'Coffered LED' | 'Recessed Spotlights' | 'Exposed Timber Beams' | 'Flat Venetian';
  ceilingColorHex: string;
  style: ArchitecturalStyle;
  furnitureItems: BimFurniture[];
}

export interface BimFurniture {
  id: string;
  name: string;
  category: 'seating' | 'table' | 'bed' | 'storage' | 'lighting' | 'decor' | 'appliance' | 'sanitary';
  position: [number, number, number]; // x, y, z
  rotationY: number; // radians
  scale: [number, number, number];
  material: string;
  colorHex: string;
}

export interface BimBuildingData {
  id: string;
  projectName: string;
  totalAreaSqFt: number;
  numberOfFloors: number;
  exteriorWalls: BimWall[];
  interiorWalls: BimWall[];
  doors: BimDoor[];
  windows: BimWindow[];
  rooms: BimRoom[];
  overallStyle: ArchitecturalStyle;
  parsingConfidence: number; // 0 to 100
  missingInfoPrompts: MissingInfoPrompt[];
}

export interface DesignVariant {
  id: string;
  name: string;
  style: ArchitecturalStyle;
  description: string;
  estimatedCostUsd: number;
  thumbnailUrl: string;
  buildingData: BimBuildingData;
  createdAt: string;
}

export interface CostBreakdown {
  structuralConcreteSteel: number;
  facadeAndGlazing: number;
  mepplumbingElectrical: number;
  interiorFinishesAndJoinery: number;
  furnitureAndDecor: number;
  contingencyAndPermits: number;
  totalEstimatedCostUsd: number;
}

export interface QuantityEstimate {
  concreteVolumeCubicMeters: number;
  structuralSteelTons: number;
  glazingGlassAreaSqMeters: number;
  flooringAreaSqMeters: number;
  drywallWallAreaSqMeters: number;
  paintAreaSqMeters: number;
}

export interface BimAnalytics {
  costBreakdown: CostBreakdown;
  quantityEstimates: QuantityEstimate;
  constructionTimelineMonths: number;
  sustainabilityScore: number; // 0 to 100
  energyEfficiencyGrade: 'A+' | 'A' | 'B' | 'C';
  naturalLightingIndex: number; // 0 to 100
  ventilationIndex: number; // 0 to 100
  sustainabilitySuggestions: string[];
  lightingVentilationAnalysis: string;
}

export interface DigitalTwinProject {
  id: string;
  ownerUserId: string;
  projectName: string;
  clientName: string;
  status: 'Draft' | 'Files Uploaded' | 'AI Parsed' | 'Twin Generated' | 'In Architect Review' | 'Approved';
  uploadedFiles: UploadedFile[];
  activeBuildingData: BimBuildingData;
  variants: DesignVariant[];
  activeVariantId: string;
  analytics: BimAnalytics;
  assignedArchitect?: string;
  assignedEngineer?: string;
  assignedDesigner?: string;
  createdAt: string;
  updatedAt: string;
}

// Firestore Collection Constants
export const FIRESTORE_COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  FLOOR_PLANS: 'floor_plans',
  PARSED_BUILDINGS: 'parsed_buildings',
  DIGITAL_TWINS: 'digital_twins',
  INTERIOR_DESIGNS: 'interior_designs',
  DESIGN_VARIANTS: 'design_variants',
  QUOTATIONS: 'quotations',
  APPOINTMENTS: 'appointments',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  MATERIALS: 'materials',
  COST_ESTIMATIONS: 'cost_estimations',
  PROJECT_UPDATES: 'project_updates'
} as const;

// Firebase Storage Folders
export const STORAGE_FOLDERS = {
  FLOORPLANS: '/uploads/floorplans/',
  CAD: '/uploads/cad/',
  SITE_IMAGES: '/uploads/site-images/',
  VIDEOS: '/uploads/videos/',
  RENDERS: '/renders/',
  GENERATED_DESIGNS: '/generated-designs/',
  CUSTOMER_FILES: '/customer-files/',
  GLTF_ASSETS: '/gltf-assets/'
} as const;
