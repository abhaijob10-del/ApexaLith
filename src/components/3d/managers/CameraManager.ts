import * as THREE from 'three';
import { ICameraManager, CameraPreset, CameraMode } from '../types/renderingTypes';

export class CameraManager implements ICameraManager {
  public camera: THREE.PerspectiveCamera;
  private defaultPosition: THREE.Vector3 = new THREE.Vector3(8, 6, 10);
  private defaultTarget: THREE.Vector3 = new THREE.Vector3(0, 1, 0);

  constructor(aspect: number = 16 / 9) {
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.resetCamera();
  }

  public resetCamera(): void {
    this.camera.position.copy(this.defaultPosition);
    this.camera.lookAt(this.defaultTarget);
  }

  public updateAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  public setPreset(preset: CameraPreset): void {
    switch (preset) {
      case 'perspective':
        this.camera.position.set(8, 6, 10);
        break;
      case 'top':
        this.camera.position.set(0, 18, 0.001);
        break;
      case 'front':
        this.camera.position.set(0, 2, 14);
        break;
      case 'side':
        this.camera.position.set(14, 2, 0);
        break;
      case 'isometric':
        this.camera.position.set(12, 12, 12);
        break;
      case 'dollhouse':
        this.camera.position.set(10, 14, 10);
        break;
    }
    this.camera.lookAt(this.defaultTarget);
    this.camera.updateProjectionMatrix();
  }

  public setMode(mode: CameraMode): void {
    // Architecture hook for First Person, Walkthrough, FlyMode in Phase 3
    console.log(`[CameraManager] Prepared camera mode transition: ${mode}`);
  }
}
