import * as THREE from 'three';
import { ISceneManager } from '../types/renderingTypes';

export class SceneManager implements ISceneManager {
  public scene: THREE.Scene;

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#070A11');
    this.scene.fog = new THREE.FogExp2('#070A11', 0.015);
  }

  public addObject(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
    this.disposeObject(object);
  }

  public clearScene(): void {
    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0];
      this.scene.remove(obj);
      this.disposeObject(obj);
    }
  }

  public setBackgroundColor(color: string): void {
    this.scene.background = new THREE.Color(color);
    if (this.scene.fog) {
      this.scene.fog.color = new THREE.Color(color);
    }
  }

  public disposeObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => this.disposeMaterial(mat));
          } else {
            this.disposeMaterial(mesh.material);
          }
        }
      }
    });
  }

  private disposeMaterial(material: THREE.Material): void {
    material.dispose();
    for (const key of Object.keys(material)) {
      const value = (material as any)[key];
      if (value && typeof value === 'object' && 'isTexture' in value) {
        (value as THREE.Texture).dispose();
      }
    }
  }

  public dispose(): void {
    this.clearScene();
  }
}
