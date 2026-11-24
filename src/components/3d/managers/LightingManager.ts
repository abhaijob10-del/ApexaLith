import * as THREE from 'three';
import { ILightingManager, LightingPreset } from '../types/renderingTypes';

export class LightingManager implements ILightingManager {
  private ambientLight: THREE.AmbientLight;
  private sunLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.PointLight;

  constructor(scene: THREE.Scene) {
    this.ambientLight = new THREE.AmbientLight('#ffffff', 0.6);
    scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight('#fff2db', 2.0);
    this.sunLight.position.set(12, 18, 10);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 50;
    this.sunLight.shadow.camera.left = -15;
    this.sunLight.shadow.camera.right = 15;
    this.sunLight.shadow.camera.top = 15;
    this.sunLight.shadow.camera.bottom = -15;
    this.sunLight.shadow.bias = -0.0001;
    scene.add(this.sunLight);

    this.fillLight = new THREE.DirectionalLight('#8eb2ff', 0.8);
    this.fillLight.position.set(-10, 8, -8);
    scene.add(this.fillLight);

    this.rimLight = new THREE.PointLight('#b59b6d', 2.5, 20);
    this.rimLight.position.set(0, 5, -5);
    scene.add(this.rimLight);
  }

  public setPreset(preset: LightingPreset): void {
    switch (preset) {
      case 'studio':
        this.ambientLight.intensity = 0.6;
        this.ambientLight.color.set('#ffffff');
        this.sunLight.intensity = 2.0;
        this.sunLight.color.set('#fff2db');
        this.sunLight.position.set(12, 18, 10);
        this.fillLight.intensity = 0.8;
        this.fillLight.color.set('#8eb2ff');
        break;

      case 'architecturalDay':
        this.ambientLight.intensity = 0.8;
        this.ambientLight.color.set('#e2eafc');
        this.sunLight.intensity = 3.0;
        this.sunLight.color.set('#fff8e7');
        this.sunLight.position.set(20, 25, 15);
        this.fillLight.intensity = 0.5;
        this.fillLight.color.set('#b0c4de');
        break;

      case 'sunset':
        this.ambientLight.intensity = 0.4;
        this.ambientLight.color.set('#ffcca3');
        this.sunLight.intensity = 3.5;
        this.sunLight.color.set('#ff7b00');
        this.sunLight.position.set(25, 6, 8);
        this.fillLight.intensity = 0.6;
        this.fillLight.color.set('#7a5299');
        break;

      case 'cyberpunkNight':
        this.ambientLight.intensity = 0.2;
        this.ambientLight.color.set('#1a102f');
        this.sunLight.intensity = 1.2;
        this.sunLight.color.set('#00f0ff');
        this.sunLight.position.set(-10, 15, 10);
        this.fillLight.intensity = 1.8;
        this.fillLight.color.set('#ff0055');
        break;

      case 'overcast':
        this.ambientLight.intensity = 1.2;
        this.ambientLight.color.set('#d0d7de');
        this.sunLight.intensity = 0.8;
        this.sunLight.color.set('#f0f3f6');
        this.sunLight.position.set(5, 20, 5);
        this.fillLight.intensity = 0.4;
        this.fillLight.color.set('#a0aab2');
        break;
    }
  }

  public toggleShadows(enabled: boolean): void {
    this.sunLight.castShadow = enabled;
  }

  public dispose(): void {
    this.ambientLight.dispose();
    this.sunLight.dispose();
    this.fillLight.dispose();
    this.rimLight.dispose();
  }
}
