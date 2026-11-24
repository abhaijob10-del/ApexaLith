import * as THREE from 'three';

export type CameraPreset = 'perspective' | 'top' | 'front' | 'side' | 'isometric' | 'dollhouse';

export type CameraMode = 'orbit' | 'firstPerson' | 'walkthrough' | 'flyMode';

export type LightingPreset = 'studio' | 'architecturalDay' | 'sunset' | 'cyberpunkNight' | 'overcast';

export type EnvironmentMode = 'studio' | 'outdoorGrid' | 'darkLuxury' | 'cleanWhite';

export interface RenderStats {
  fps: number;
  triangles: number;
  drawCalls: number;
  geometries: number;
  textures: number;
  frameTimeMs: number;
  memoryMb: number;
}

export interface SelectedObjectInfo {
  id: string;
  name: string;
  type: string;
  materialName: string;
  polygonCount: number;
  dimensions: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface ViewportSettings {
  showGrid: boolean;
  showAxes: boolean;
  showWireframe: boolean;
  showShadows: boolean;
  showStats: boolean;
  enableBloom: boolean;
  enableAO: boolean;
  enableDOF: boolean;
  lightingPreset: LightingPreset;
  environmentMode: EnvironmentMode;
  cameraPreset: CameraPreset;
  cameraMode: CameraMode;
  autoRotate: boolean;
}

// Interfaces for Scene Managers (Phase 2 Architecture & Phase 3 Readiness)
export interface ISceneManager {
  scene: THREE.Scene;
  addObject(object: THREE.Object3D): void;
  removeObject(object: THREE.Object3D): void;
  clearScene(): void;
  dispose(): void;
}

export interface ICameraManager {
  camera: THREE.PerspectiveCamera;
  setPreset(preset: CameraPreset): void;
  setMode(mode: CameraMode): void;
  resetCamera(): void;
  updateAspect(aspect: number): void;
}

export interface ILightingManager {
  setPreset(preset: LightingPreset): void;
  toggleShadows(enabled: boolean): void;
  dispose(): void;
}

export interface IEnvironmentManager {
  setMode(mode: EnvironmentMode): void;
  toggleGrid(show: boolean): void;
  toggleAxes(show: boolean): void;
}

export interface IAssetManager {
  loadGLTF(url: string, onProgress?: (progress: number) => void): Promise<THREE.Group>;
  clearCache(): void;
  getCacheSize(): number;
}

export interface IRendererManager {
  renderer: THREE.WebGLRenderer;
  updateSize(width: number, height: number): void;
  setPixelRatio(ratio: number): void;
  dispose(): void;
}

// Future Managers (Interfaces/Placeholders for Phase 3+)
export interface IBIMManager {
  loadIFC(url: string): Promise<void>;
  parseBuildingElements(): void;
  getElementByGuid(guid: string): any;
}

export interface ICADManager {
  loadDXF(url: string): Promise<void>;
  parseCADLayers(): void;
  toggleLayer(layerName: string, visible: boolean): void;
}

export interface IAIManager {
  analyzeFloorPlanVector(vectorData: any): Promise<void>;
  generateRoomMesh(roomParams: any): THREE.Mesh;
}

export interface IDigitalTwinManager {
  connectIoTSensors(endpoint: string): void;
  updateTelemetry(sensorId: string, value: number): void;
}
