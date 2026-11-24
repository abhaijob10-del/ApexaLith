import { BuildingModel, ParserMetadata, WallData, RoomData, SupportedFileType } from '../types/BuildingModel';

export class MetadataExtractor {
  public static extractMetadata(
    fileName: string,
    fileSizeBytes: number,
    fileType: SupportedFileType,
    walls: WallData[],
    rooms: RoomData[],
    otherElementsCount: number
  ): ParserMetadata {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

    walls.forEach(w => {
      minX = Math.min(minX, w.start[0], w.end[0]);
      maxX = Math.max(maxX, w.start[0], w.end[0]);
      minZ = Math.min(minZ, w.start[2], w.end[2]);
      maxZ = Math.max(maxZ, w.start[2], w.end[2]);
      minY = Math.min(minY, w.start[1]);
      maxY = Math.max(maxY, w.start[1] + w.height);
    });

    rooms.forEach(r => {
      minX = Math.min(minX, r.bounds.minX);
      maxX = Math.max(maxX, r.bounds.maxX);
      minZ = Math.min(minZ, r.bounds.minZ);
      maxZ = Math.max(maxZ, r.bounds.maxZ);
    });

    if (minX === Infinity) {
      minX = 0; minY = 0; minZ = 0;
      maxX = 20; maxY = 3.5; maxZ = 15;
    }

    const dimX = Math.max(0.1, maxX - minX);
    const dimY = Math.max(0.1, maxY - minY);
    const dimZ = Math.max(0.1, maxZ - minZ);

    const totalElementsCount = walls.length + rooms.length + otherElementsCount;

    // Calculate preliminary parsing confidence based on completeness of geometry
    let confidence = 85;
    if (walls.length === 0) confidence -= 40;
    if (rooms.length === 0) confidence -= 20;
    if (totalElementsCount < 5) confidence -= 15;
    confidence = Math.max(10, Math.min(98, confidence));

    return {
      fileType,
      fileName,
      fileSizeBytes,
      parserVersion: 'v3.2.0-ApexaBIM',
      parsingConfidence: confidence,
      extractedAt: new Date().toISOString(),
      boundingExtent: {
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
        dimensions: [dimX, dimY, dimZ]
      },
      totalElementsCount
    };
  }

  public static calculateTotalArea(rooms: RoomData[], walls: WallData[]): number {
    const roomArea = rooms.reduce((acc, r) => acc + (r.areaSqMeters || 0), 0);
    if (roomArea > 0) return Math.round(roomArea * 10) / 10;

    // Fallback: estimate from bounding box
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
    walls.forEach(w => {
      minX = Math.min(minX, w.start[0], w.end[0]);
      maxX = Math.max(maxX, w.start[0], w.end[0]);
      minZ = Math.min(minZ, w.start[2], w.end[2]);
      maxZ = Math.max(maxZ, w.start[2], w.end[2]);
    });
    if (minX === Infinity) return 120;
    return Math.round((maxX - minX) * (maxZ - minZ) * 0.85 * 10) / 10;
  }
}
