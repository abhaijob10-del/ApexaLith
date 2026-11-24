import * as THREE from 'three';
import { IEnvironmentManager, EnvironmentMode } from '../types/renderingTypes';

export class EnvironmentManager implements IEnvironmentManager {
  private gridHelper: THREE.GridHelper;
  private axesHelper: THREE.AxesHelper;
  private studioFloor: THREE.Mesh;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;

    // Grid Helper
    this.gridHelper = new THREE.GridHelper(30, 30, '#b59b6d', '#222d3d');
    this.gridHelper.position.y = 0.001;
    this.scene.add(this.gridHelper);

    // Axes Helper
    this.axesHelper = new THREE.AxesHelper(3);
    this.axesHelper.position.set(-10, 0.01, -10);
    this.scene.add(this.axesHelper);

    // Architectural Studio Ground Floor
    const floorGeo = new THREE.PlaneGeometry(60, 60, 64, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0d121d',
      roughness: 0.25,
      metalness: 0.1,
      envMapIntensity: 1.2,
    });
    this.studioFloor = new THREE.Mesh(floorGeo, floorMat);
    this.studioFloor.rotation.x = -Math.PI / 2;
    this.studioFloor.receiveShadow = true;
    this.scene.add(this.studioFloor);
  }

  public setMode(mode: EnvironmentMode): void {
    const mat = this.studioFloor.material as THREE.MeshStandardMaterial;
    switch (mode) {
      case 'studio':
        mat.color.set('#0d121d');
        mat.roughness = 0.25;
        mat.metalness = 0.1;
        break;
      case 'outdoorGrid':
        mat.color.set('#1a2130');
        mat.roughness = 0.5;
        mat.metalness = 0.0;
        break;
      case 'darkLuxury':
        mat.color.set('#05070a');
        mat.roughness = 0.15;
        mat.metalness = 0.4;
        break;
      case 'cleanWhite':
        mat.color.set('#f4f5f8');
        mat.roughness = 0.3;
        mat.metalness = 0.0;
        break;
    }
  }

  public toggleGrid(show: boolean): void {
    this.gridHelper.visible = show;
  }

  public toggleAxes(show: boolean): void {
    this.axesHelper.visible = show;
  }

  public dispose(): void {
    this.gridHelper.geometry.dispose();
    this.axesHelper.geometry.dispose();
    this.studioFloor.geometry.dispose();
    (this.studioFloor.material as THREE.Material).dispose();
  }
}
