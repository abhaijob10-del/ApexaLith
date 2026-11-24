import { BIMManager } from './BIMManager';
import { CADManager } from './CADManager';
import { FutureAIManager } from './FutureAIManager';
import { ValidationManager } from './ValidationManager';
import { GeometryConverter, WireframeGeometryData } from './GeometryConverter';
import { StorageManager } from './StorageManager';
import { BuildingModel, ValidationReport, ParserLog, SupportedFileType } from '../types/BuildingModel';

export interface ParsePipelineResult {
  fileUrl: string;
  buildingModel: BuildingModel;
  validationReport: ValidationReport;
  wireframeData: WireframeGeometryData;
  parserLogs: ParserLog[];
}

export class ParserManager {
  private static instance: ParserManager;

  public static getInstance(): ParserManager {
    if (!ParserManager.instance) {
      ParserManager.instance = new ParserManager();
    }
    return ParserManager.instance;
  }

  /**
   * Identifies file format, executes the appropriate manager parser, validates model,
   * generates wireframe 3D geometry, and saves results to Firebase.
   */
  public async processFile(
    file: File,
    onProgress?: (percent: number, step: string) => void,
    onLog?: (log: ParserLog) => void
  ): Promise<ParsePipelineResult> {
    const logs: ParserLog[] = [];

    const logHandler = (log: ParserLog) => {
      logs.push(log);
      if (onLog) onLog(log);
    };

    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toUpperCase() || '';
    let fileType: SupportedFileType = 'IFC';

    if (ext === 'IFC') fileType = 'IFC';
    else if (ext === 'DXF') fileType = 'DXF';
    else if (ext === 'DWG') fileType = 'DWG';
    else if (ext === 'PDF') fileType = 'PDF';
    else if (ext === 'PNG') fileType = 'PNG';
    else if (ext === 'JPG' || ext === 'JPEG') fileType = 'JPEG';
    else if (ext === 'ZIP') fileType = 'ZIP';

    logHandler({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'ParserManager',
      message: `Received upload '${fileName}' (${fileType}). Initiating parsing pipeline.`
    });

    if (onProgress) onProgress(5, 'Validating file format and uploading to Firebase Storage...');

    // 1. Upload Original File
    const storageManager = StorageManager.getInstance();
    const fileUrl = await storageManager.uploadOriginalFile(file, fileName, fileType);

    logHandler({
      id: `log_${Date.now()}_st`,
      timestamp: new Date().toISOString(),
      level: 'info',
      module: 'StorageManager',
      message: `Original file stored successfully in Firebase Storage at ${fileUrl.substring(0, 45)}...`
    });

    // 2. Dispatch to specialized manager
    let buildingModel: BuildingModel;

    if (fileType === 'IFC') {
      const bimManager = BIMManager.getInstance();
      buildingModel = await bimManager.parseIFC(file, fileName, onProgress, logHandler);
    } else if (fileType === 'DXF' || fileType === 'DWG') {
      const cadManager = CADManager.getInstance();
      buildingModel = await cadManager.parseCAD(file, fileName, fileType, onProgress, logHandler);
    } else {
      const aiManager = FutureAIManager.getInstance();
      buildingModel = await aiManager.queueFileForAiProcessing(file, fileName, fileType, onProgress, logHandler);
    }

    if (onProgress) onProgress(85, 'Running Validation Manager & Quality Audits...');

    // 3. Validate Building Model
    const validationReport = ValidationManager.validateBuildingModel(buildingModel, logs);

    logHandler({
      id: `log_${Date.now()}_val`,
      timestamp: new Date().toISOString(),
      level: validationReport.isSufficient ? 'success' : 'warn',
      module: 'ValidationManager',
      message: `Validation Audit Complete: Confidence Score = ${validationReport.confidenceScore}%. Status: '${validationReport.statusMessage}'`
    });

    // 4. Generate Wireframe 3D Geometry
    if (onProgress) onProgress(92, 'Generating Wireframe Outlines & Spatial Bounding Boxes...');
    const wireframeData = GeometryConverter.convertToWireframe(buildingModel);

    // 5. Persist across Firestore collections
    if (onProgress) onProgress(98, 'Persisting structured JSON & logs in Firestore...');
    await storageManager.saveParsingResult(
      fileUrl,
      fileName,
      file.size,
      fileType,
      buildingModel,
      validationReport,
      logs
    );

    if (onProgress) onProgress(100, 'Parsing Complete.');

    return {
      fileUrl,
      buildingModel,
      validationReport,
      wireframeData,
      parserLogs: logs
    };
  }
}
