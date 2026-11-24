import * as THREE from 'three';
import { PBRMaterialType } from '../types/digitalTwinTypes';

export class MaterialManager {
  private static instance: MaterialManager;
  private materialCache: Map<string, THREE.Material> = new Map();
  private textureCache: Map<string, THREE.CanvasTexture> = new Map();

  public static getInstance(): MaterialManager {
    if (!MaterialManager.instance) {
      MaterialManager.instance = new MaterialManager();
    }
    return MaterialManager.instance;
  }

  /**
   * Get or create a PBR Material by category
   */
  public getMaterial(type: PBRMaterialType, options: { colorHex?: string; opacity?: number; wireframe?: boolean } = {}): THREE.Material {
    const key = `${type}_${options.colorHex || 'default'}_${options.opacity ?? 1}_${options.wireframe ? 'wf' : 'sol'}`;
    if (this.materialCache.has(key)) {
      return this.materialCache.get(key)!;
    }

    let mat: THREE.Material;

    switch (type) {
      case 'Concrete':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#8c929e',
          roughness: 0.85,
          metalness: 0.1,
          map: this.generateProceduralTexture('Concrete'),
          wireframe: options.wireframe
        });
        break;

      case 'Wood':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#A0522D',
          roughness: 0.4,
          metalness: 0.05,
          map: this.generateProceduralTexture('Wood'),
          wireframe: options.wireframe
        });
        break;

      case 'Tiles':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#E2E8F0',
          roughness: 0.2,
          metalness: 0.1,
          map: this.generateProceduralTexture('Tiles'),
          wireframe: options.wireframe
        });
        break;

      case 'Marble':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#F8FAFC',
          roughness: 0.1,
          metalness: 0.05,
          map: this.generateProceduralTexture('Marble'),
          wireframe: options.wireframe
        });
        break;

      case 'Granite':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#334155',
          roughness: 0.3,
          metalness: 0.2,
          map: this.generateProceduralTexture('Granite'),
          wireframe: options.wireframe
        });
        break;

      case 'Glass':
        mat = new THREE.MeshPhysicalMaterial({
          color: options.colorHex || '#BAE6FD',
          roughness: 0.05,
          metalness: 0.1,
          transmission: 0.85,
          transparent: true,
          opacity: options.opacity ?? 0.4,
          ior: 1.5,
          thickness: 0.1,
          wireframe: options.wireframe
        });
        break;

      case 'Steel':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#64748B',
          roughness: 0.25,
          metalness: 0.85,
          wireframe: options.wireframe
        });
        break;

      case 'Brick':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#B91C1C',
          roughness: 0.8,
          metalness: 0.05,
          map: this.generateProceduralTexture('Brick'),
          wireframe: options.wireframe
        });
        break;

      case 'Stone':
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#78716C',
          roughness: 0.75,
          metalness: 0.1,
          map: this.generateProceduralTexture('Stone'),
          wireframe: options.wireframe
        });
        break;

      case 'Paint':
      default:
        mat = new THREE.MeshStandardMaterial({
          color: options.colorHex || '#F1F5F9',
          roughness: 0.5,
          metalness: 0.0,
          wireframe: options.wireframe
        });
        break;
    }

    if (options.opacity !== undefined && options.opacity < 1 && type !== 'Glass') {
      mat.transparent = true;
      mat.opacity = options.opacity;
    }

    this.materialCache.set(key, mat);
    return mat;
  }

  /**
   * Generates procedural PBR textures on HTML Canvas
   */
  private generateProceduralTexture(type: PBRMaterialType): THREE.CanvasTexture {
    if (this.textureCache.has(type)) {
      return this.textureCache.get(type)!;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    if (type === 'Tiles') {
      ctx.fillStyle = '#CBD5E1';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#64748B';
      ctx.lineWidth = 4;
      for (let i = 0; i <= 256; i += 64) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 256);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(256, i);
        ctx.stroke();
      }
    } else if (type === 'Wood') {
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#8B4513';
      for (let i = 0; i < 256; i += 8) {
        ctx.fillRect(0, i, 256, 3 + Math.sin(i * 0.1) * 2);
      }
    } else if (type === 'Marble') {
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 10);
      ctx.bezierCurveTo(80, 120, 150, 40, 240, 240);
      ctx.stroke();
    } else if (type === 'Brick') {
      ctx.fillStyle = '#B91C1C';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      for (let y = 0; y < 256; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(256, y);
        ctx.stroke();
        const offset = (y / 32) % 2 === 0 ? 0 : 32;
        for (let x = offset; x < 256; x += 64) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 32);
          ctx.stroke();
        }
      }
    } else {
      // Noise texture for concrete/stone/granite
      ctx.fillStyle = '#94A3B8';
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        ctx.fillStyle = Math.random() > 0.5 ? '#64748B' : '#E2E8F0';
        ctx.fillRect(x, y, 2, 2);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);

    this.textureCache.set(type, texture);
    return texture;
  }
}

export const materialManager = MaterialManager.getInstance();
