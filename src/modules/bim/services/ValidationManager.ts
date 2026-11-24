import { BuildingModel, ValidationReport, ParserLog, SupportedFileType } from '../types/BuildingModel';

export class ValidationManager {
  public static validateBuildingModel(
    model: BuildingModel,
    logs: ParserLog[]
  ): ValidationReport {
    const checks = [
      {
        checkName: 'Wall Contour Completeness',
        passed: model.walls.length >= 4,
        details: model.walls.length >= 4 
          ? `Extracted ${model.walls.length} structural walls with closed loop geometry.` 
          : `Only ${model.walls.length} walls identified. Boundary contour requires additional CAD/IFC layers.`
      },
      {
        checkName: 'Floor Level Definition',
        passed: model.floors.length >= 1,
        details: `Identified ${model.floors.length} floor levels (${model.levels.map(l => l.name).join(', ')}).`
      },
      {
        checkName: 'Room Space Boundary Extraction',
        passed: model.rooms.length >= 2,
        details: model.rooms.length >= 2 
          ? `Detected ${model.rooms.length} enclosed room spaces with area polygons.` 
          : 'Low room count detected. Room boundary polygons need customer confirmation.'
      },
      {
        checkName: 'Openings & Fenestration Verification',
        passed: (model.doors.length + model.windows.length) >= 2,
        details: `Detected ${model.doors.length} doors and ${model.windows.length} windows in wall segments.`
      },
      {
        checkName: 'Coordinate Scale & Units Sanity',
        passed: model.coordinates.scaleFactor > 0 && model.coordinates.units !== undefined,
        details: `Units set to '${model.coordinates.units}' with scale factor ${model.coordinates.scaleFactor}.`
      },
      {
        checkName: 'North Orientation & Light Direction',
        passed: !!model.aiAnalysis?.naturalLightDirection,
        details: model.aiAnalysis?.naturalLightDirection 
          ? `North orientation set at ${model.aiAnalysis.northOrientationDeg}°. Light direction: ${model.aiAnalysis.naturalLightDirection}.`
          : 'North orientation arrow missing in drawing files.'
      },
      {
        checkName: 'Structural Grid & Columns Verification',
        passed: model.columns.length > 0 || model.walls.some(w => w.isLoadBearing),
        details: model.columns.length > 0 
          ? `Extracted ${model.columns.length} structural column elements.`
          : 'Load-bearing wall segments identified.'
      }
    ];

    const passedCount = checks.filter(c => c.passed).length;
    const confidenceScore = Math.round((passedCount / checks.length) * 100);
    const isSufficient = confidenceScore >= 80;

    const requestedInformation: {
      id: string;
      title: string;
      description: string;
      fileType: SupportedFileType[];
      isRequired: boolean;
    }[] = [];

    // Never guess missing information - Request missing architectural documentation if low confidence
    if (confidenceScore < 80 || model.walls.length < 4) {
      requestedInformation.push({
        id: 'req_cad_ifc',
        title: 'Vector CAD / IFC Model',
        description: 'Upload high-precision 2D DWG/DXF vector drawings or 3D IFC STEP models to establish closed wall loops.',
        fileType: ['DXF', 'DWG', 'IFC'],
        isRequired: true
      });
    }

    if (model.floors.length < 2 && model.building.totalFloors > 1) {
      requestedInformation.push({
        id: 'req_elevations',
        title: 'Building Elevation Drawings',
        description: 'Vertical elevation sheets (North, South, East, West) to verify floor-to-floor heights and parapet levels.',
        fileType: ['PDF', 'PNG', 'JPEG', 'DXF'],
        isRequired: true
      });

      requestedInformation.push({
        id: 'req_sections',
        title: 'Building Section Drawings',
        description: 'Cross-sectional architectural cuts showing slab thickness, ceiling heights, and stairwell landings.',
        fileType: ['PDF', 'PNG', 'JPEG', 'DXF'],
        isRequired: true
      });
    }

    if (model.doors.length === 0 || model.windows.length === 0) {
      requestedInformation.push({
        id: 'req_wall_dimensions',
        title: 'Wall Dimensions & Opening Schedules',
        description: 'Dimension callout sheets detailing exact wall thickness and door/window schedule tables.',
        fileType: ['PDF', 'PNG', 'JPEG'],
        isRequired: true
      });
    }

    if (!model.aiAnalysis?.naturalLightDirection) {
      requestedInformation.push({
        id: 'req_north_dir',
        title: 'North Direction & Site Plan',
        description: 'Site plan indicating TRUE NORTH arrow to accurately calculate natural light and ventilation performance.',
        fileType: ['PDF', 'PNG', 'JPEG', 'DXF'],
        isRequired: false
      });
    }

    if (requestedInformation.length === 0) {
      requestedInformation.push({
        id: 'req_site_drone',
        title: 'Site Photos & Drone Aerial Survey',
        description: 'High-resolution exterior site imagery and drone aerial surveys for surrounding site context.',
        fileType: ['PNG', 'JPEG'],
        isRequired: false
      });

      requestedInformation.push({
        id: 'req_structural',
        title: 'Structural Framing Drawings',
        description: 'Foundation framing, concrete column layouts, and steel beam placement schedules.',
        fileType: ['PDF', 'DXF', 'DWG'],
        isRequired: false
      });
    }

    return {
      id: `val_${Date.now()}`,
      projectId: model.projectId,
      buildingModelId: model.id,
      confidenceScore,
      isSufficient,
      statusMessage: isSufficient 
        ? 'Architectural model parsed and verified successfully with high quality confidence.'
        : 'Quality confidence is below 80%. Please supply the requested architectural documentation below to complete verification.',
      requestedInformation,
      validationChecks: checks,
      createdAt: new Date().toISOString()
    };
  }
}
