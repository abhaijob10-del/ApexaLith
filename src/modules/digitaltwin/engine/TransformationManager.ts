import * as THREE from 'three';
import { PBRMaterialType } from '../types/digitalTwinTypes';
import { materialManager } from './MaterialManager';

export class TransformationManager {
  /**
   * Assigns new PBR material to target 3D object in scene
   */
  public static applyMaterialToObject(
    targetObject: THREE.Object3D,
    materialType: PBRMaterialType,
    colorHex?: string
  ): void {
    const newMaterial = materialManager.getMaterial(materialType, { colorHex });

    targetObject.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = newMaterial;
        child.userData.materialType = materialType;
        if (colorHex) child.userData.colorHex = colorHex;
      }
    });
  }
}
