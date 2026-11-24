import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { IAssetManager } from '../types/renderingTypes';

export class AssetManager implements IAssetManager {
  private gltfLoader: GLTFLoader;
  private dracoLoader: DRACOLoader;
  private rgbeLoader: RGBELoader;
  private textureLoader: THREE.TextureLoader;
  private modelCache: Map<string, THREE.Group> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    this.gltfLoader.setDRACOLoader(this.dracoLoader);

    this.rgbeLoader = new RGBELoader();
    this.textureLoader = new THREE.TextureLoader();
  }

  public async loadGLTF(
    url: string, 
    onProgress?: (progress: number) => void
  ): Promise<THREE.Group> {
    if (this.modelCache.has(url)) {
      if (onProgress) onProgress(100);
      return this.modelCache.get(url)!.clone();
    }

    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        url,
        (gltf) => {
          this.modelCache.set(url, gltf.scene);
          if (onProgress) onProgress(100);
          resolve(gltf.scene);
        },
        (xhr) => {
          if (xhr.lengthComputable && onProgress) {
            const percent = (xhr.loaded / xhr.total) * 100;
            onProgress(Math.round(percent));
          }
        },
        (error) => {
          console.error(`[AssetManager] Error loading GLTF from ${url}:`, error);
          reject(error);
        }
      );
    });
  }

  public async loadTexture(url: string): Promise<THREE.Texture> {
    if (this.textureCache.has(url)) {
      return this.textureCache.get(url)!;
    }

    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        url,
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          this.textureCache.set(url, texture);
          resolve(texture);
        },
        undefined,
        (err) => reject(err)
      );
    });
  }

  public clearCache(): void {
    this.modelCache.clear();
    this.textureCache.forEach((tex) => tex.dispose());
    this.textureCache.clear();
  }

  public getCacheSize(): number {
    return this.modelCache.size + this.textureCache.size;
  }

  public dispose(): void {
    this.clearCache();
    this.dracoLoader.dispose();
  }
}
