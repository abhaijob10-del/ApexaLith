import * as THREE from 'three';

export type CameraPresetView = 'isometric' | 'top2d' | 'front_elevation' | 'side_elevation' | 'perspective';

export class CameraManager {
  /**
   * Calculates camera position and target for standard architectural presets
   */
  public static getCameraPreset(
    preset: CameraPresetView,
    extent: { dimensions: [number, number, number]; center?: [number, number, number] }
  ): { position: [number, number, number]; target: [number, number, number] } {
    const center = extent.center || [0, 0, 0];
    const maxDim = Math.max(extent.dimensions[0], extent.dimensions[1], extent.dimensions[2], 10);

    switch (preset) {
      case 'top2d':
        return {
          position: [center[0], center[1] + maxDim * 2.2, center[2] + 0.01],
          target: [center[0], center[1], center[2]]
        };
      case 'front_elevation':
        return {
          position: [center[0], center[1] + maxDim * 0.4, center[2] + maxDim * 2.2],
          target: [center[0], center[1], center[2]]
        };
      case 'side_elevation':
        return {
          position: [center[0] + maxDim * 2.2, center[1] + maxDim * 0.4, center[2]],
          target: [center[0], center[1], center[2]]
        };
      case 'isometric':
        return {
          position: [center[0] + maxDim * 1.5, center[1] + maxDim * 1.5, center[2] + maxDim * 1.5],
          target: [center[0], center[1], center[2]]
        };
      case 'perspective':
      default:
        return {
          position: [center[0] + maxDim * 1.2, center[1] + maxDim * 0.9, center[2] + maxDim * 1.4],
          target: [center[0], center[1], center[2]]
        };
    }
  }
}
