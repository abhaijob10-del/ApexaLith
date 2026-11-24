import * as THREE from 'three';
import { IRendererManager } from '../types/renderingTypes';

export class RendererManager implements IRendererManager {
  public renderer: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  public updateSize(width: number, height: number): void {
    this.renderer.setSize(width, height, false);
  }

  public setPixelRatio(ratio: number): void {
    this.renderer.setPixelRatio(ratio);
  }

  public dispose(): void {
    this.renderer.dispose();
  }
}
