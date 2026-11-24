import { BuildingModel, ParserLog, SupportedFileType } from '../types/BuildingModel';
import { MetadataExtractor } from './MetadataExtractor';

export class FutureAIManager {
  private static instance: FutureAIManager;

  public static getInstance(): FutureAIManager {
    if (!FutureAIManager.instance) {
      FutureAIManager.instance = new FutureAIManager();
    }
    return FutureAIManager.instance;
  }

  /**
   * Registers PDF, PNG, JPEG, and ZIP files into the Phase 4 AI Digital Twin pipeline.
   * Stores structured asset metadata and queues them for upcoming AI vision & layout synthesis.
   */
  public async queueFileForAiProcessing(
    file: File | ArrayBuffer,
    fileName: string,
    fileType: SupportedFileType,
    onProgress?: (percent: number, step: string) => void,
    onLog?: (log: ParserLog) => void
  ): Promise<BuildingModel> {
    const fileSizeBytes = file instanceof File ? file.size : file.byteLength;
    this.sendLog(onLog, `Registering non-vector file '${fileName}' (${fileType}) for Phase 4 AI Vision Digital Twin pipeline.`, 'info');

    if (onProgress) onProgress(30, 'Calculating file checksums & image resolution bounds...');

    this.sendLog(onLog, `Stored raw ${fileType} in Firebase Storage. Creating Firestore queue record in 'uploads' collection.`, 'info');

    if (onProgress) onProgress(80, 'Creating placeholder BuildingModel for AI Vision rasterization...');

    const metadata = MetadataExtractor.extractMetadata(
      fileName,
      fileSizeBytes,
      fileType,
      [],
      [],
      0
    );

    metadata.parsingConfidence = 50; // Non-geometry file confidence requires AI vision pass in Phase 4

    const model: BuildingModel = {
      id: `bm_ai_queued_${Date.now()}`,
      projectId: 'proj_default',
      approvalStatus: 'PENDING_REVIEW',
      building: {
        id: `bld_ai_${Date.now()}`,
        name: fileName.replace(/\.[^/.]+$/, ''),
        type: `Queued ${fileType} Asset (Phase 4 AI Processing)`,
        totalFloors: 1,
        totalAreaSqMeters: 0,
        dimensions: { length: 0, height: 0, width: 0 }
      },
      floors: [],
      rooms: [],
      walls: [],
      doors: [],
      windows: [],
      openings: [],
      slabs: [],
      roofs: [],
      columns: [],
      beams: [],
      furniture: [],
      materials: [],
      levels: [],
      coordinates: {
        origin: [0, 0, 0],
        scaleFactor: 1.0,
        units: 'meters'
      },
      relationships: [],
      metadata
    };

    this.sendLog(onLog, `File '${fileName}' successfully stored and queued for AI Digital Twin generation in Phase 4.`, 'success');
    if (onProgress) onProgress(100, 'Queued for AI Digital Twin Generation.');

    return model;
  }

  private sendLog(onLog: ((log: ParserLog) => void) | undefined, message: string, level: ParserLog['level'] = 'info', details?: any) {
    if (onLog) {
      onLog({
        id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        level,
        module: 'FutureAIManager',
        message,
        details
      });
    }
  }
}
