import { FurnitureCategory, FurnitureItem, InteriorStyle } from '../types/interiorTypes';

export interface CatalogFurnitureTemplate {
  catalogId: string;
  name: string;
  category: FurnitureCategory;
  style: InteriorStyle;
  dimensions: { length: number; width: number; height: number };
  defaultMaterial: string;
  defaultColorHex: string;
  description: string;
  meshType: FurnitureItem['meshType'];
}

export const FURNITURE_CATALOG: CatalogFurnitureTemplate[] = [
  // Sofas & Seating
  {
    catalogId: 'sofa_01',
    name: 'Apexa Italian Modular Velvet Sofa',
    category: 'Sofas & Seating',
    style: 'Luxury',
    dimensions: { length: 2.8, width: 1.1, height: 0.8 },
    defaultMaterial: 'Velvet',
    defaultColorHex: '#2C3E35',
    description: 'Ultra-plush modular sectional sofa with brushed brass accent feet.',
    meshType: 'sofa'
  },
  {
    catalogId: 'sofa_02',
    name: 'Nordic Bleached Linen Sectional',
    category: 'Sofas & Seating',
    style: 'Scandinavian',
    dimensions: { length: 2.5, width: 1.0, height: 0.75 },
    defaultMaterial: 'Linen Fabric',
    defaultColorHex: '#EAE6E1',
    description: 'Clean organic minimalist linen sofa with solid ash legs.',
    meshType: 'sofa'
  },
  {
    catalogId: 'chair_01',
    name: 'Eames Style Lounge Chair & Ottoman',
    category: 'Sofas & Seating',
    style: 'Contemporary',
    dimensions: { length: 0.9, width: 0.85, height: 0.85 },
    defaultMaterial: 'Aniline Leather',
    defaultColorHex: '#3D2817',
    description: 'Iconic ergonomic leather lounge chair with bent walnut shell.',
    meshType: 'armchair'
  },

  // Beds & Sleep
  {
    catalogId: 'bed_01',
    name: 'Grand Emperor Floating King Bed',
    category: 'Beds & Sleep',
    style: 'Luxury',
    dimensions: { length: 2.2, width: 2.0, height: 1.2 },
    defaultMaterial: 'Bouclé Fabric',
    defaultColorHex: '#D9D2C9',
    description: 'Upholstered king bed with integrated warm LED headboard lighting.',
    meshType: 'bed'
  },
  {
    catalogId: 'bed_02',
    name: 'Japandi Low Low-Profile Platform Bed',
    category: 'Beds & Sleep',
    style: 'Japandi',
    dimensions: { length: 2.1, width: 1.9, height: 0.6 },
    defaultMaterial: 'Natural White Oak',
    defaultColorHex: '#C5B299',
    description: 'Low ground platform bed with tatami mat side extensions.',
    meshType: 'bed'
  },

  // Tables & Dining
  {
    catalogId: 'table_01',
    name: 'Calacatta Marble Dining Table',
    category: 'Tables & Dining',
    style: 'Luxury',
    dimensions: { length: 2.4, width: 1.1, height: 0.76 },
    defaultMaterial: 'Calacatta Marble Slabs',
    defaultColorHex: '#F0F2F5',
    description: '8-seater polished marble table with fluted pedestal legs.',
    meshType: 'table'
  },
  {
    catalogId: 'table_02',
    name: 'Live-Edge Walnut Dining Table',
    category: 'Tables & Dining',
    style: 'Modern',
    dimensions: { length: 2.2, width: 1.0, height: 0.75 },
    defaultMaterial: 'American Walnut Wood',
    defaultColorHex: '#4A3525',
    description: 'Solid live-edge walnut dining table with matte black steel legs.',
    meshType: 'table'
  },
  {
    catalogId: 'table_03',
    name: 'Minimalist Monolithic Coffee Table',
    category: 'Tables & Dining',
    style: 'Minimalist',
    dimensions: { length: 1.3, width: 0.8, height: 0.38 },
    defaultMaterial: 'Travertine Stone',
    defaultColorHex: '#D1C7BD',
    description: 'Honed travertine slab low coffee table.',
    meshType: 'table'
  },

  // Storage & Cabinets
  {
    catalogId: 'cab_01',
    name: 'Bespoke Fluted Oak Media Console',
    category: 'Storage & Cabinets',
    style: 'Modern',
    dimensions: { length: 2.2, width: 0.45, height: 0.55 },
    defaultMaterial: 'Fluted Oak',
    defaultColorHex: '#8C6F56',
    description: 'Floating media unit with acoustic fabric doors and wire management.',
    meshType: 'tv_unit'
  },
  {
    catalogId: 'cab_02',
    name: 'Executive Glass Display Bookshelf',
    category: 'Storage & Cabinets',
    style: 'Luxury',
    dimensions: { length: 1.8, width: 0.4, height: 2.2 },
    defaultMaterial: 'Bronze Glass & Steel',
    defaultColorHex: '#1A1C20',
    description: 'Floor-to-ceiling illuminated glass display cabinet.',
    meshType: 'cabinet'
  },

  // Lighting Fixtures
  {
    catalogId: 'light_01',
    name: 'Sculptural Brass Branch Chandelier',
    category: 'Lighting Fixtures',
    style: 'Luxury',
    dimensions: { length: 1.2, width: 1.2, height: 0.9 },
    defaultMaterial: 'Brushed Brass & Frosted Glass',
    defaultColorHex: '#D4AF37',
    description: 'Statement warm pendant chandelier for living and dining spaces.',
    meshType: 'lamp'
  },
  {
    catalogId: 'light_02',
    name: 'Minimalist Arco Floor Lamp',
    category: 'Lighting Fixtures',
    style: 'Modern',
    dimensions: { length: 0.6, width: 0.4, height: 2.1 },
    defaultMaterial: 'Carrara Marble Base & Chrome',
    defaultColorHex: '#E2E8F0',
    description: 'Arched stainless steel floor lamp with heavy marble base.',
    meshType: 'lamp'
  },

  // Decor & Artwork
  {
    catalogId: 'decor_01',
    name: 'Large Format Abstract Canvas Painting',
    category: 'Decor & Artwork',
    style: 'Contemporary',
    dimensions: { length: 1.8, width: 0.05, height: 1.4 },
    defaultMaterial: 'Oil Canvas',
    defaultColorHex: '#8B9DA3',
    description: 'Textured gallery-wrapped abstract oil painting in muted earth tones.',
    meshType: 'artwork'
  },
  {
    catalogId: 'decor_02',
    name: 'Ficus Lyrata Fiddle Leaf Fig Plant',
    category: 'Outdoor & Plants',
    style: 'Scandinavian',
    dimensions: { length: 0.6, width: 0.6, height: 1.6 },
    defaultMaterial: 'Ceramic Planter & Foliage',
    defaultColorHex: '#385E38',
    description: 'Tall indoor fiddle leaf fig plant in matte ceramic planter.',
    meshType: 'plant'
  },

  // Office & Desks
  {
    catalogId: 'office_01',
    name: 'Executive Dark Oak Leather Desk',
    category: 'Office & Desks',
    style: 'Luxury',
    dimensions: { length: 2.0, width: 0.9, height: 0.76 },
    defaultMaterial: 'Oak & Saddle Leather',
    defaultColorHex: '#2A1F17',
    description: 'Executive writing desk with inlaid leather pad and wireless charging.',
    meshType: 'desk'
  },

  // Bathroom Fixtures
  {
    catalogId: 'bath_01',
    name: 'Freestanding Monolithic Soaking Tub',
    category: 'Bathroom Fixtures',
    style: 'Luxury',
    dimensions: { length: 1.8, width: 0.85, height: 0.6 },
    defaultMaterial: 'Composite Resin Stone',
    defaultColorHex: '#F8FAFC',
    description: 'Matte white oval freestanding luxury bathtub.',
    meshType: 'tub'
  }
];

export class FurnitureLibraryService {
  static getCatalog(): CatalogFurnitureTemplate[] {
    return FURNITURE_CATALOG;
  }

  static getByCategory(cat: FurnitureCategory): CatalogFurnitureTemplate[] {
    return FURNITURE_CATALOG.filter(item => item.category === cat);
  }

  static createFurnitureInstance(catalogId: string, roomId: string, spawnPos?: [number, number, number]): FurnitureItem {
    const template = FURNITURE_CATALOG.find(i => i.catalogId === catalogId) || FURNITURE_CATALOG[0];
    const instanceId = `furn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    return {
      id: instanceId,
      catalogId: template.catalogId,
      name: template.name,
      category: template.category,
      style: template.style,
      dimensions: { ...template.dimensions },
      position: spawnPos || [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      material: template.defaultMaterial,
      colorHex: template.defaultColorHex,
      isLocked: false,
      roomId,
      description: template.description,
      meshType: template.meshType
    };
  }
}
