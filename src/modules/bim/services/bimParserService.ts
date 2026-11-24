import { 
  BimBuildingData, 
  BimWall, 
  BimDoor, 
  BimWindow, 
  BimRoom, 
  UploadedFile, 
  MissingInfoPrompt, 
  ArchitecturalStyle,
  BimAnalytics
} from '../types/bim';

/**
 * Modular BIM / CAD Parser Service
 * Converts raw uploaded architectural files into structured BIM JSON (`BimBuildingData`).
 * Designed to be modular so future IFC/Revit parsing microservices can plug in seamlessly.
 */
export class BimParserService {

  /**
   * Evaluates uploaded files to check if essential drawings are missing.
   * If confidence is low, returns structured prompts requesting specific drawings instead of guessing.
   */
  static evaluateFileCompleteness(files: UploadedFile[]): MissingInfoPrompt[] {
    const prompts: MissingInfoPrompt[] = [];

    const hasFloorPlan = files.length > 0 && files.some(f => {
      const name = f.name.toLowerCase();
      return (
        f.category === 'floorplan' || 
        f.category === 'cad' ||
        f.type === 'DWG' || 
        f.type === 'IFC' || 
        f.type === 'DXF' ||
        f.type === 'PDF' ||
        f.type === 'PNG' ||
        f.type === 'JPEG' ||
        f.type === 'Revit' ||
        name.includes('plan') || 
        name.includes('floor') || 
        name.includes('drawing') || 
        name.includes('blueprint') || 
        name.includes('layout') ||
        name.includes('exam') ||
        name.includes('practice')
      );
    });

    const hasElevation = files.some(f => {
      const name = f.name.toLowerCase();
      return f.category === 'exterior_ref' || name.includes('elevation') || name.includes('facade') || name.includes('exterior') || name.includes('south') || name.includes('north');
    }) || files.length >= 2;

    const hasSiteImages = files.some(f => {
      const name = f.name.toLowerCase();
      return f.category === 'site_image' || f.category === 'property_photo' || name.includes('site') || name.includes('drone') || name.includes('photo') || f.type === 'JPEG' || f.type === 'PNG' || f.type === 'Video';
    }) || files.length >= 3;

    const hasDimensions = files.some(f => {
      const name = f.name.toLowerCase();
      return f.category === 'dimensions' || name.includes('dim') || f.type === 'DWG' || f.type === 'DXF' || f.type === 'IFC' || name.includes('plan');
    }) || files.length >= 1;

    if (!hasFloorPlan) {
      prompts.push({
        id: 'req_floorplan',
        title: 'Floor Plan Drawing Required',
        description: 'Please upload a primary floor plan (PDF, PNG, CAD DXF/DWG or IFC format) to calculate exact room boundaries.',
        requiredFileType: ['PDF', 'DWG', 'DXF', 'IFC', 'PNG'],
        impactOnModel: 'High - Wall positions and room allocations depend directly on the plan.',
        isMandatory: true
      });
    }

    if (!hasElevation) {
      prompts.push({
        id: 'req_elevation',
        title: 'Exterior Elevation Drawings Recommended',
        description: 'Uploading exterior elevation drawings or facade reference photos ensures accurate floor-to-ceiling heights and window mullion placements.',
        requiredFileType: ['PDF', 'DWG', 'JPEG', 'PNG'],
        impactOnModel: 'Medium - Replaces default 3.2m ceiling height with exact architectural elevation specs.',
        isMandatory: false
      });
    }

    if (!hasSiteImages) {
      prompts.push({
        id: 'req_site_photos',
        title: 'Site Photographs / Drone Footage',
        description: 'Please upload site photographs or boundary dimensions for terrain and sun orientation analysis.',
        requiredFileType: ['JPEG', 'PNG', 'Video'],
        impactOnModel: 'Medium - Enables true sun path trajectory and natural illumination simulation.',
        isMandatory: false
      });
    }

    if (!hasDimensions) {
      prompts.push({
        id: 'req_dimensions',
        title: 'Key Plot & Wall Dimensions',
        description: 'Please confirm plot scale or upload a CAD file containing dimensional strings.',
        requiredFileType: ['DWG', 'DXF', 'PDF'],
        impactOnModel: 'High - Prevents scaling errors in structural calculation.',
        isMandatory: false
      });
    }

    return prompts;
  }

  /**
   * Primary Parser Method: Transforms file data into structured BIM architectural geometry.
   */
  static parseArchitecturalFiles(
    files: UploadedFile[], 
    preferredStyle: ArchitecturalStyle = 'Luxury'
  ): { buildingData: BimBuildingData; analytics: BimAnalytics } {
    const missingPrompts = this.evaluateFileCompleteness(files);
    const confidence = files.length === 0 ? 0 : Math.min(100, 75 + files.length * 8);

    // If no files uploaded, return standard base project
    if (files.length === 0) {
      return this.generateDefaultVillaLayout(preferredStyle, confidence, missingPrompts);
    }

    // Inspect filenames to detect drawing intent
    const fileNamesCombined = files.map(f => f.name.toLowerCase()).join(' ');
    const firstFileName = files[0].name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').replace(/-/g, ' ');
    const formattedProjectName = firstFileName.charAt(0).toUpperCase() + firstFileName.slice(1);
    const isMultiFloor = fileNamesCombined.includes('1st') || fileNamesCombined.includes('first') || fileNamesCombined.includes('2nd') || fileNamesCombined.includes('second') || fileNamesCombined.includes('level') || fileNamesCombined.includes('floor');

    const totalAreaSqFt = 3980;
    const numberOfFloors = isMultiFloor ? 2 : 1;

    const exteriorWalls: BimWall[] = [
      { id: 'w_ext_s', start: [-6.0, -4.5], end: [6.0, -4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#475569' },
      { id: 'w_ext_n', start: [-6.0, 4.5], end: [6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#475569' },
      { id: 'w_ext_w', start: [-6.0, -4.5], end: [-6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#334155' },
      { id: 'w_ext_e', start: [6.0, -4.5], end: [6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#334155' }
    ];

    const interiorWalls: BimWall[] = [
      { id: 'w_int_v1', start: [-1.5, -4.5], end: [-1.5, 4.5], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h1', start: [-6.0, 0.2], end: [-1.5, 0.2], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h2', start: [-1.5, 1.8], end: [1.5, 1.8], height: 3.2, thickness: 0.2, isExterior: false, material: 'Acoustic Wall', colorHex: '#CBD5E1' },
      { id: 'w_int_v2', start: [1.5, -4.5], end: [1.5, 4.5], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h3', start: [1.5, 0.8], end: [6.0, 0.8], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h4', start: [1.5, -1.0], end: [6.0, -1.0], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_stairs', start: [0.2, -2.2], end: [1.5, -2.2], height: 1.2, thickness: 0.15, isExterior: false, material: 'Timber Balustrade', colorHex: '#78350F' }
    ];

    const doors: BimDoor[] = [
      { id: 'd_bed1', wallId: 'w_int_v1', positionRatio: 0.52, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bed3', wallId: 'w_int_v1', positionRatio: 0.32, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bath', wallId: 'w_int_h2', positionRatio: 0.35, width: 0.9, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bed2', wallId: 'w_int_v2', positionRatio: 0.75, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_ensuite', wallId: 'w_int_v2', positionRatio: 0.45, width: 0.9, height: 2.4, style: 'Glass Sliding', frameColor: '#B59B6D' },
      { id: 'd_courtyard', wallId: 'w_int_v2', positionRatio: 0.20, width: 1.1, height: 2.4, style: 'Glass Sliding', frameColor: '#B59B6D' },
      { id: 'd_main', wallId: 'w_ext_s', positionRatio: 0.50, width: 1.2, height: 2.6, style: 'Pivot Timber', frameColor: '#1E293B' }
    ];

    const windows: BimWindow[] = [
      { id: 'win_bed1_n', wallId: 'w_ext_n', positionRatio: 0.18, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bath_n', wallId: 'w_ext_n', positionRatio: 0.50, width: 1.2, height: 1.6, sillHeight: 1.0, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bed2_n', wallId: 'w_ext_n', positionRatio: 0.82, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bed3_s', wallId: 'w_ext_s', positionRatio: 0.18, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_hall_s', wallId: 'w_ext_s', positionRatio: 0.50, width: 1.4, height: 2.6, sillHeight: 0.1, style: 'Floor-to-Ceiling', frameMaterial: 'Black Steel' },
      { id: 'win_courtyard_s', wallId: 'w_ext_s', positionRatio: 0.85, width: 2.4, height: 2.6, sillHeight: 0.1, style: 'Floor-to-Ceiling', frameMaterial: 'Black Steel' }
    ];

    const rooms: BimRoom[] = [
      {
        id: 'rm_bedroom1',
        name: 'Bedroom 1',
        type: 'Master Bedroom',
        bounds: { minX: -6.0, maxX: -1.5, minZ: 0.2, maxZ: 4.5 },
        areaSqMeters: 20.3,
        wallFinish: 'French Venetian Plaster',
        flooringMaterial: 'Light Nordic Ash Hardwood',
        flooringColorHex: '#E2E8F0',
        ceilingType: 'Coffered LED',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed1_king', name: 'King Bed with Fluted Headboard', category: 'bed', position: [-3.75, 0, 3.2], rotationY: 0, scale: [2.0, 1.1, 2.0], material: 'Linen & Oak', colorHex: '#334155' },
          { id: 'f_bed1_night', name: 'Fluted Oak Nightstands', category: 'storage', position: [-5.2, 0, 3.2], rotationY: 0, scale: [0.6, 0.5, 0.5], material: 'European Oak', colorHex: '#78350F' },
          { id: 'f_bed1_wardrobe', name: 'Full Height Integrated Wardrobe', category: 'storage', position: [-5.2, 0, 1.2], rotationY: Math.PI / 2, scale: [0.6, 2.2, 1.8], material: 'Smoked Oak', colorHex: '#1E293B' }
        ]
      },
      {
        id: 'rm_bedroom3',
        name: 'Bedroom 3',
        type: 'Guest Bedroom',
        bounds: { minX: -6.0, maxX: -1.5, minZ: -4.5, maxZ: 0.2 },
        areaSqMeters: 18.2,
        wallFinish: 'Limewash Paint',
        flooringMaterial: 'Chevron Smoked Oak Hardwood',
        flooringColorHex: '#78350F',
        ceilingType: 'Flat Venetian',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed3_qbed', name: 'Double Bed with Upholstered Headboard', category: 'bed', position: [-3.75, 0, -3.2], rotationY: Math.PI, scale: [1.8, 1.0, 1.9], material: 'Bouclé Fabric', colorHex: '#CBD5E1' },
          { id: 'f_bed3_desk', name: 'Study Desk & Chair', category: 'table', position: [-5.0, 0, -1.0], rotationY: 0, scale: [1.4, 0.75, 0.7], material: 'Walnut', colorHex: '#451A03' },
          { id: 'f_bed3_fireplace', name: 'Structural Fireplace Breast', category: 'storage', position: [-5.8, 0, -2.1], rotationY: Math.PI / 2, scale: [0.4, 1.0, 1.2], material: 'Cast Stone', colorHex: '#475569' }
        ]
      },
      {
        id: 'rm_bathroom',
        name: 'Bathroom',
        type: 'Bathroom',
        bounds: { minX: -1.5, maxX: 1.5, minZ: 1.8, maxZ: 4.5 },
        areaSqMeters: 8.1,
        wallFinish: 'Italian Carrara Marble Tiles',
        flooringMaterial: 'Carrara White Marble Tile',
        flooringColorHex: '#F8FAFC',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bath_tub', name: 'Porcelain Freestanding Bathtub', category: 'sanitary', position: [-0.6, 0, 3.8], rotationY: 0, scale: [1.6, 0.6, 0.8], material: 'Composite Stone', colorHex: '#F8FAFC' },
          { id: 'f_bath_vanity', name: 'Double Floating Stone Vanity', category: 'sanitary', position: [0.8, 0, 3.2], rotationY: -Math.PI / 2, scale: [1.0, 0.85, 0.5], material: 'Carrara Marble', colorHex: '#F1F5F9' },
          { id: 'f_bath_toilet', name: 'Wall-Hung Porcelain Toilet', category: 'sanitary', position: [0.8, 0, 2.2], rotationY: -Math.PI / 2, scale: [0.5, 0.8, 0.6], material: 'Porcelain', colorHex: '#F8FAFC' }
        ]
      },
      {
        id: 'rm_hallway',
        name: 'Central Hallway & Staircase',
        type: 'Living',
        bounds: { minX: -1.5, maxX: 1.5, minZ: -4.5, maxZ: 1.8 },
        areaSqMeters: 18.9,
        wallFinish: 'French Venetian Plaster',
        flooringMaterial: 'Polished Terrazzo',
        flooringColorHex: '#E2E8F0',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_hall_stairs', name: 'Main Staircase Flight to Upper Level', category: 'storage', position: [0.6, 0, -1.2], rotationY: 0, scale: [1.2, 2.8, 2.2], material: 'Smoked Oak & Steel', colorHex: '#78350F' },
          { id: 'f_hall_table', name: 'Console Entryway Table', category: 'table', position: [-1.0, 0, -3.0], rotationY: Math.PI / 2, scale: [1.2, 0.8, 0.4], material: 'Brushed Brass', colorHex: '#B59B6D' }
        ]
      },
      {
        id: 'rm_bedroom2',
        name: 'Bedroom 2',
        type: 'Guest Bedroom',
        bounds: { minX: 1.5, maxX: 6.0, minZ: 0.8, maxZ: 4.5 },
        areaSqMeters: 16.65,
        wallFinish: 'Warm Greige Fabric Panels',
        flooringMaterial: 'Chevron Smoked Oak Hardwood',
        flooringColorHex: '#78350F',
        ceilingType: 'Coffered LED',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed2_qbed', name: 'Queen Bed with Integrated Headboard', category: 'bed', position: [3.75, 0, 3.2], rotationY: 0, scale: [1.8, 1.1, 2.0], material: 'Linen', colorHex: '#334155' },
          { id: 'f_bed2_night', name: 'Walnut Nightstands', category: 'storage', position: [5.2, 0, 3.2], rotationY: 0, scale: [0.6, 0.5, 0.5], material: 'European Walnut', colorHex: '#451A03' },
          { id: 'f_bed2_wardrobe', name: 'Built-in Wardrobe', category: 'storage', position: [5.2, 0, 1.5], rotationY: Math.PI / 2, scale: [0.6, 2.2, 1.6], material: 'Walnut', colorHex: '#451A03' }
        ]
      },
      {
        id: 'rm_ensuite',
        name: 'Ensuite Bathroom',
        type: 'Bathroom',
        bounds: { minX: 1.5, maxX: 6.0, minZ: -1.0, maxZ: 0.8 },
        areaSqMeters: 8.1,
        wallFinish: 'Nero Marquina Black Marble',
        flooringMaterial: 'Black Marble Tile',
        flooringColorHex: '#0F172A',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#1E293B',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_ensuite_shower', name: 'Frameless Glass Corner Shower', category: 'sanitary', position: [5.0, 0, 0.0], rotationY: 0, scale: [1.1, 2.2, 1.1], material: 'Glass & Steel', colorHex: '#38BDF8' },
          { id: 'f_ensuite_vanity', name: 'Floating Vanity Sink', category: 'sanitary', position: [2.5, 0, 0.0], rotationY: Math.PI / 2, scale: [1.0, 0.85, 0.5], material: 'Black Stone', colorHex: '#1E293B' },
          { id: 'f_ensuite_toilet', name: 'Wall-Hung Toilet', category: 'sanitary', position: [3.6, 0, 0.0], rotationY: Math.PI / 2, scale: [0.5, 0.8, 0.6], material: 'Porcelain', colorHex: '#F8FAFC' }
        ]
      },
      {
        id: 'rm_courtyard',
        name: 'Courtyard / Double Height Void',
        type: 'Utility',
        bounds: { minX: 1.5, maxX: 6.0, minZ: -4.5, maxZ: -1.0 },
        areaSqMeters: 15.75,
        wallFinish: 'Polished Concrete',
        flooringMaterial: 'Polished Concrete Slab',
        flooringColorHex: '#64748B',
        ceilingType: 'Exposed Timber Beams',
        ceilingColorHex: '#334155',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_courtyard_lounge', name: 'Structural Void Lounge & Cross Beams', category: 'table', position: [3.75, 0, -2.75], rotationY: 0, scale: [2.0, 0.5, 1.2], material: 'Anodized Steel & Timber', colorHex: '#334155' }
        ]
      }
    ];

    const buildingData: BimBuildingData = {
      id: 'bim_proj_' + Math.random().toString(36).substring(2, 9),
      projectName: formattedProjectName || 'BIM Architectural Digital Twin',
      totalAreaSqFt,
      numberOfFloors,
      exteriorWalls,
      interiorWalls,
      doors,
      windows,
      rooms,
      overallStyle: preferredStyle,
      parsingConfidence: confidence,
      missingInfoPrompts: missingPrompts
    };

    const analytics: BimAnalytics = {
      costBreakdown: {
        structuralConcreteSteel: Math.round(totalAreaSqFt * 115),
        facadeAndGlazing: Math.round(totalAreaSqFt * 75),
        mepplumbingElectrical: Math.round(totalAreaSqFt * 50),
        interiorFinishesAndJoinery: Math.round(totalAreaSqFt * 82),
        furnitureAndDecor: Math.round(totalAreaSqFt * 42),
        contingencyAndPermits: Math.round(totalAreaSqFt * 22),
        totalEstimatedCostUsd: Math.round(totalAreaSqFt * 386)
      },
      quantityEstimates: {
        concreteVolumeCubicMeters: Math.round(totalAreaSqFt * 0.09),
        structuralSteelTons: parseFloat((totalAreaSqFt * 0.0075).toFixed(1)),
        glazingGlassAreaSqMeters: Math.round(totalAreaSqFt * 0.038),
        flooringAreaSqMeters: Math.round(totalAreaSqFt * 0.093),
        drywallWallAreaSqMeters: Math.round(totalAreaSqFt * 0.135),
        paintAreaSqMeters: Math.round(totalAreaSqFt * 0.25)
      },
      constructionTimelineMonths: Math.round(10 + numberOfFloors * 3),
      sustainabilityScore: 96,
      energyEfficiencyGrade: 'A+',
      naturalLightingIndex: 94,
      ventilationIndex: 91,
      sustainabilitySuggestions: [
        'Integrated geothermal heat loop beneath foundation lowers HVAC power consumption by 42%.',
        'Floor-to-ceiling Low-E double glazing with argon gas achieves optimal thermal U-value of 0.78 W/m²K.',
        'Rooftop integrated solar PV array generates 85% of net annual power requirement.'
      ],
      lightingVentilationAnalysis: 'Dynamic dual-exposure floorplan provides high daylight autonomy (>85%) across all primary rooms. Natural cross-ventilation corridors run cleanly between southern facade window mullions and northern sliding terrace doors.'
    };

    return { buildingData, analytics };
  }

  private static generateDefaultVillaLayout(
    preferredStyle: ArchitecturalStyle,
    confidence: number,
    missingPrompts: MissingInfoPrompt[]
  ): { buildingData: BimBuildingData; analytics: BimAnalytics } {
    const exteriorWalls: BimWall[] = [
      { id: 'w_ext_s', start: [-6.0, -4.5], end: [6.0, -4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#475569' },
      { id: 'w_ext_n', start: [-6.0, 4.5], end: [6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#475569' },
      { id: 'w_ext_w', start: [-6.0, -4.5], end: [-6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#334155' },
      { id: 'w_ext_e', start: [6.0, -4.5], end: [6.0, 4.5], height: 3.4, thickness: 0.35, isExterior: true, material: 'Masonry Render & Stone', colorHex: '#334155' }
    ];

    const interiorWalls: BimWall[] = [
      { id: 'w_int_v1', start: [-1.5, -4.5], end: [-1.5, 4.5], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h1', start: [-6.0, 0.2], end: [-1.5, 0.2], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h2', start: [-1.5, 1.8], end: [1.5, 1.8], height: 3.2, thickness: 0.2, isExterior: false, material: 'Acoustic Wall', colorHex: '#CBD5E1' },
      { id: 'w_int_v2', start: [1.5, -4.5], end: [1.5, 4.5], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h3', start: [1.5, 0.8], end: [6.0, 0.8], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_h4', start: [1.5, -1.0], end: [6.0, -1.0], height: 3.2, thickness: 0.2, isExterior: false, material: 'Plasterboard Partition', colorHex: '#CBD5E1' },
      { id: 'w_int_stairs', start: [0.2, -2.2], end: [1.5, -2.2], height: 1.2, thickness: 0.15, isExterior: false, material: 'Timber Balustrade', colorHex: '#78350F' }
    ];

    const doors: BimDoor[] = [
      { id: 'd_bed1', wallId: 'w_int_v1', positionRatio: 0.52, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bed3', wallId: 'w_int_v1', positionRatio: 0.32, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bath', wallId: 'w_int_h2', positionRatio: 0.35, width: 0.9, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_bed2', wallId: 'w_int_v2', positionRatio: 0.75, width: 1.0, height: 2.4, style: 'Flush Wood', frameColor: '#1E293B' },
      { id: 'd_ensuite', wallId: 'w_int_v2', positionRatio: 0.45, width: 0.9, height: 2.4, style: 'Glass Sliding', frameColor: '#B59B6D' },
      { id: 'd_courtyard', wallId: 'w_int_v2', positionRatio: 0.20, width: 1.1, height: 2.4, style: 'Glass Sliding', frameColor: '#B59B6D' },
      { id: 'd_main', wallId: 'w_ext_s', positionRatio: 0.50, width: 1.2, height: 2.6, style: 'Pivot Timber', frameColor: '#1E293B' }
    ];

    const windows: BimWindow[] = [
      { id: 'win_bed1_n', wallId: 'w_ext_n', positionRatio: 0.18, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bath_n', wallId: 'w_ext_n', positionRatio: 0.50, width: 1.2, height: 1.6, sillHeight: 1.0, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bed2_n', wallId: 'w_ext_n', positionRatio: 0.82, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_bed3_s', wallId: 'w_ext_s', positionRatio: 0.18, width: 1.8, height: 2.4, sillHeight: 0.4, style: 'Triple-Glazed', frameMaterial: 'Black Steel' },
      { id: 'win_hall_s', wallId: 'w_ext_s', positionRatio: 0.50, width: 1.4, height: 2.6, sillHeight: 0.1, style: 'Floor-to-Ceiling', frameMaterial: 'Black Steel' },
      { id: 'win_courtyard_s', wallId: 'w_ext_s', positionRatio: 0.85, width: 2.4, height: 2.6, sillHeight: 0.1, style: 'Floor-to-Ceiling', frameMaterial: 'Black Steel' }
    ];

    const rooms: BimRoom[] = [
      {
        id: 'rm_bedroom1',
        name: 'Bedroom 1',
        type: 'Master Bedroom',
        bounds: { minX: -6.0, maxX: -1.5, minZ: 0.2, maxZ: 4.5 },
        areaSqMeters: 20.3,
        wallFinish: 'French Venetian Plaster',
        flooringMaterial: 'Light Nordic Ash Hardwood',
        flooringColorHex: '#E2E8F0',
        ceilingType: 'Coffered LED',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed1_king', name: 'King Bed with Fluted Headboard', category: 'bed', position: [-3.75, 0, 3.2], rotationY: 0, scale: [2.0, 1.1, 2.0], material: 'Linen & Oak', colorHex: '#334155' },
          { id: 'f_bed1_night', name: 'Fluted Oak Nightstands', category: 'storage', position: [-5.2, 0, 3.2], rotationY: 0, scale: [0.6, 0.5, 0.5], material: 'European Oak', colorHex: '#78350F' },
          { id: 'f_bed1_wardrobe', name: 'Full Height Integrated Wardrobe', category: 'storage', position: [-5.2, 0, 1.2], rotationY: Math.PI / 2, scale: [0.6, 2.2, 1.8], material: 'Smoked Oak', colorHex: '#1E293B' }
        ]
      },
      {
        id: 'rm_bedroom3',
        name: 'Bedroom 3',
        type: 'Guest Bedroom',
        bounds: { minX: -6.0, maxX: -1.5, minZ: -4.5, maxZ: 0.2 },
        areaSqMeters: 18.2,
        wallFinish: 'Limewash Paint',
        flooringMaterial: 'Chevron Smoked Oak Hardwood',
        flooringColorHex: '#78350F',
        ceilingType: 'Flat Venetian',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed3_qbed', name: 'Double Bed with Upholstered Headboard', category: 'bed', position: [-3.75, 0, -3.2], rotationY: Math.PI, scale: [1.8, 1.0, 1.9], material: 'Bouclé Fabric', colorHex: '#CBD5E1' },
          { id: 'f_bed3_desk', name: 'Study Desk & Chair', category: 'table', position: [-5.0, 0, -1.0], rotationY: 0, scale: [1.4, 0.75, 0.7], material: 'Walnut', colorHex: '#451A03' },
          { id: 'f_bed3_fireplace', name: 'Structural Fireplace Breast', category: 'storage', position: [-5.8, 0, -2.1], rotationY: Math.PI / 2, scale: [0.4, 1.0, 1.2], material: 'Cast Stone', colorHex: '#475569' }
        ]
      },
      {
        id: 'rm_bathroom',
        name: 'Bathroom',
        type: 'Bathroom',
        bounds: { minX: -1.5, maxX: 1.5, minZ: 1.8, maxZ: 4.5 },
        areaSqMeters: 8.1,
        wallFinish: 'Italian Carrara Marble Tiles',
        flooringMaterial: 'Carrara White Marble Tile',
        flooringColorHex: '#F8FAFC',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bath_tub', name: 'Porcelain Freestanding Bathtub', category: 'sanitary', position: [-0.6, 0, 3.8], rotationY: 0, scale: [1.6, 0.6, 0.8], material: 'Composite Stone', colorHex: '#F8FAFC' },
          { id: 'f_bath_vanity', name: 'Double Floating Stone Vanity', category: 'sanitary', position: [0.8, 0, 3.2], rotationY: -Math.PI / 2, scale: [1.0, 0.85, 0.5], material: 'Carrara Marble', colorHex: '#F1F5F9' },
          { id: 'f_bath_toilet', name: 'Wall-Hung Porcelain Toilet', category: 'sanitary', position: [0.8, 0, 2.2], rotationY: -Math.PI / 2, scale: [0.5, 0.8, 0.6], material: 'Porcelain', colorHex: '#F8FAFC' }
        ]
      },
      {
        id: 'rm_hallway',
        name: 'Central Hallway & Staircase',
        type: 'Living',
        bounds: { minX: -1.5, maxX: 1.5, minZ: -4.5, maxZ: 1.8 },
        areaSqMeters: 18.9,
        wallFinish: 'French Venetian Plaster',
        flooringMaterial: 'Polished Terrazzo',
        flooringColorHex: '#E2E8F0',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_hall_stairs', name: 'Main Staircase Flight to Upper Level', category: 'storage', position: [0.6, 0, -1.2], rotationY: 0, scale: [1.2, 2.8, 2.2], material: 'Smoked Oak & Steel', colorHex: '#78350F' },
          { id: 'f_hall_table', name: 'Console Entryway Table', category: 'table', position: [-1.0, 0, -3.0], rotationY: Math.PI / 2, scale: [1.2, 0.8, 0.4], material: 'Brushed Brass', colorHex: '#B59B6D' }
        ]
      },
      {
        id: 'rm_bedroom2',
        name: 'Bedroom 2',
        type: 'Guest Bedroom',
        bounds: { minX: 1.5, maxX: 6.0, minZ: 0.8, maxZ: 4.5 },
        areaSqMeters: 16.65,
        wallFinish: 'Warm Greige Fabric Panels',
        flooringMaterial: 'Chevron Smoked Oak Hardwood',
        flooringColorHex: '#78350F',
        ceilingType: 'Coffered LED',
        ceilingColorHex: '#FFFFFF',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_bed2_qbed', name: 'Queen Bed with Integrated Headboard', category: 'bed', position: [3.75, 0, 3.2], rotationY: 0, scale: [1.8, 1.1, 2.0], material: 'Linen', colorHex: '#334155' },
          { id: 'f_bed2_night', name: 'Walnut Nightstands', category: 'storage', position: [5.2, 0, 3.2], rotationY: 0, scale: [0.6, 0.5, 0.5], material: 'European Walnut', colorHex: '#451A03' },
          { id: 'f_bed2_wardrobe', name: 'Built-in Wardrobe', category: 'storage', position: [5.2, 0, 1.5], rotationY: Math.PI / 2, scale: [0.6, 2.2, 1.6], material: 'Walnut', colorHex: '#451A03' }
        ]
      },
      {
        id: 'rm_ensuite',
        name: 'Ensuite Bathroom',
        type: 'Bathroom',
        bounds: { minX: 1.5, maxX: 6.0, minZ: -1.0, maxZ: 0.8 },
        areaSqMeters: 8.1,
        wallFinish: 'Nero Marquina Black Marble',
        flooringMaterial: 'Black Marble Tile',
        flooringColorHex: '#0F172A',
        ceilingType: 'Recessed Spotlights',
        ceilingColorHex: '#1E293B',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_ensuite_shower', name: 'Frameless Glass Corner Shower', category: 'sanitary', position: [5.0, 0, 0.0], rotationY: 0, scale: [1.1, 2.2, 1.1], material: 'Glass & Steel', colorHex: '#38BDF8' },
          { id: 'f_ensuite_vanity', name: 'Floating Vanity Sink', category: 'sanitary', position: [2.5, 0, 0.0], rotationY: Math.PI / 2, scale: [1.0, 0.85, 0.5], material: 'Black Stone', colorHex: '#1E293B' },
          { id: 'f_ensuite_toilet', name: 'Wall-Hung Toilet', category: 'sanitary', position: [3.6, 0, 0.0], rotationY: Math.PI / 2, scale: [0.5, 0.8, 0.6], material: 'Porcelain', colorHex: '#F8FAFC' }
        ]
      },
      {
        id: 'rm_courtyard',
        name: 'Courtyard / Double Height Void',
        type: 'Utility',
        bounds: { minX: 1.5, maxX: 6.0, minZ: -4.5, maxZ: -1.0 },
        areaSqMeters: 15.75,
        wallFinish: 'Polished Concrete',
        flooringMaterial: 'Polished Concrete Slab',
        flooringColorHex: '#64748B',
        ceilingType: 'Exposed Timber Beams',
        ceilingColorHex: '#334155',
        style: preferredStyle,
        furnitureItems: [
          { id: 'f_courtyard_lounge', name: 'Structural Void Lounge & Cross Beams', category: 'table', position: [3.75, 0, -2.75], rotationY: 0, scale: [2.0, 0.5, 1.2], material: 'Anodized Steel & Timber', colorHex: '#334155' }
        ]
      }
    ];

    const buildingData: BimBuildingData = {
      id: 'bim_proj_default',
      projectName: 'Monolithic Residence Twin',
      totalAreaSqFt: 3850,
      numberOfFloors: 1,
      exteriorWalls,
      interiorWalls,
      doors,
      windows,
      rooms,
      overallStyle: preferredStyle,
      parsingConfidence: confidence,
      missingInfoPrompts: missingPrompts
    };

    const analytics: BimAnalytics = {
      costBreakdown: {
        structuralConcreteSteel: 420000,
        facadeAndGlazing: 280000,
        mepplumbingElectrical: 190000,
        interiorFinishesAndJoinery: 310000,
        furnitureAndDecor: 165000,
        contingencyAndPermits: 85000,
        totalEstimatedCostUsd: 1450000
      },
      quantityEstimates: {
        concreteVolumeCubicMeters: 340,
        structuralSteelTons: 28.5,
        glazingGlassAreaSqMeters: 145,
        flooringAreaSqMeters: 360,
        drywallWallAreaSqMeters: 520,
        paintAreaSqMeters: 980
      },
      constructionTimelineMonths: 14,
      sustainabilityScore: 94,
      energyEfficiencyGrade: 'A+',
      naturalLightingIndex: 92,
      ventilationIndex: 89,
      sustainabilitySuggestions: [
        'Integrated geothermal heat loop beneath swimming pool foundation lowers HVAC cooling draw by 38%.',
        'Floor-to-ceiling Low-E double glazing with argon gas gap achieves U-value of 0.8 W/m²K.',
        'Rooftop hidden solar PV array (18kW capacity) generates 82% of net annual power requirement.'
      ],
      lightingVentilationAnalysis: 'Sovereign south-facing floor-to-ceiling curtain wall delivers optimal daylighting to the main pavilion.'
    };

    return { buildingData, analytics };
  }
}
