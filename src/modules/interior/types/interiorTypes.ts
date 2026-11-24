export type InteriorStyle = 
  | 'Luxury'
  | 'Modern'
  | 'Minimalist'
  | 'Scandinavian'
  | 'Japandi'
  | 'Industrial'
  | 'Traditional'
  | 'Contemporary'
  | 'Mediterranean'
  | 'Bohemian'
  | 'Farmhouse'
  | 'Classic'
  | 'Coastal'
  | 'Custom';

export type RoomCategory = 
  | 'Living Room'
  | 'Kitchen'
  | 'Bedroom'
  | 'Bathroom'
  | 'Dining Room'
  | 'Office'
  | 'Balcony'
  | 'Terrace'
  | 'Home Theatre'
  | 'Gym'
  | 'Study'
  | 'Utility Room';

export type FurnitureCategory = 
  | 'Sofas & Seating'
  | 'Beds & Sleep'
  | 'Tables & Dining'
  | 'Storage & Cabinets'
  | 'Lighting Fixtures'
  | 'Decor & Artwork'
  | 'Office & Desks'
  | 'Bathroom Fixtures'
  | 'Outdoor & Plants';

export interface FurnitureItem {
  id: string;
  catalogId: string;
  name: string;
  category: FurnitureCategory;
  style: InteriorStyle;
  dimensions: { length: number; width: number; height: number }; // meters
  position: [number, number, number];
  rotation: [number, number, number]; // radians or degrees
  scale: [number, number, number];
  material: string;
  colorHex: string;
  isLocked?: boolean;
  roomId: string;
  description?: string;
  meshType?: 'sofa' | 'armchair' | 'bed' | 'table' | 'chair' | 'cabinet' | 'tv_unit' | 'lamp' | 'plant' | 'artwork' | 'desk' | 'vanity' | 'tub' | 'rug';
}

export type LightingPresetMode = 'daylight' | 'golden_hour' | 'warm_cozy' | 'night_ambient' | 'studio';

export interface RoomDesignState {
  roomId: string;
  roomName: string;
  category: RoomCategory;
  style: InteriorStyle;
  dimensions: { length: number; width: number; height: number; areaSqMeters: number };
  wallMaterial: string;
  wallColorHex: string;
  floorMaterial: string;
  floorColorHex: string;
  ceilingMaterial: string;
  ceilingColorHex: string;
  lightingPreset: LightingPresetMode;
  furniture: FurnitureItem[];
}

export interface DesignConcept {
  id: 'concept_a' | 'concept_b' | 'concept_c' | 'concept_d';
  name: string;
  style: InteriorStyle;
  description: string;
  colorPalette: {
    walls: string;
    floor: string;
    accents: string[];
  };
  rationale: {
    whyFurnitureSelected: string;
    colorRationale: string;
    circulationImprovement: string;
    lightingOptimization: string;
    maintenanceAndDurability: string;
  };
  furniture: FurnitureItem[];
}

export interface DesignComment {
  id: string;
  roomId: string;
  userRole: 'Architect' | 'Interior Designer' | 'Customer' | 'Admin';
  userName: string;
  text: string;
  timestamp: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface VersionRecord {
  id: string;
  versionNumber: number;
  title: string;
  createdAt: string;
  roomState: RoomDesignState;
  changeSummary: string;
}

export interface FavoriteDesignRecord {
  id: string;
  designName: string;
  roomId: string;
  roomName: string;
  style: InteriorStyle;
  savedAt: string;
  previewColor: string;
}
