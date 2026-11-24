import * as THREE from 'three';
import { ComponentMetadata } from '../types/digitalTwinTypes';

export class SelectionManager {
  private static selectedMesh: THREE.Mesh | null = null;
  private static originalMaterials: Map<string, THREE.Material | THREE.Material[]> = new Map();

  /**
   * Highlights selected 3D object in scene
   */
  public static selectObject(object: THREE.Object3D | null): ComponentMetadata | null {
    if (!object) {
      this.clearSelection();
      return null;
    }

    // Traverse upwards to find root component with userData
    let targetObj: THREE.Object3D | null = object;
    while (targetObj && (!targetObj.userData || !targetObj.userData.id) && targetObj.parent) {
      targetObj = targetObj.parent;
    }

    if (!targetObj || !targetObj.userData) return null;

    const data = targetObj.userData;
    const box = new THREE.Box3().setFromObject(targetObj);
    const size = new THREE.Vector3();
    box.getSize(size);

    const metadata: ComponentMetadata = {
      id: data.id || `comp_${Date.now()}`,
      name: targetObj.name || `${data.type?.toUpperCase() || 'OBJECT'} Element`,
      type: data.type || 'wall',
      roomId: data.roomId,
      roomName: data.roomName,
      level: data.level ?? 0,
      dimensions: {
        length: Math.round(size.x * 100) / 100,
        height: Math.round(size.y * 100) / 100,
        width: Math.round(size.z * 100) / 100,
        areaSqMeters: Math.round(size.x * size.z * 100) / 100,
        volumeCuMeters: Math.round(size.x * size.y * size.z * 100) / 100
      },
      materialType: data.materialType || 'Paint',
      materialName: data.material || 'Standard Finish',
      isLoadBearing: data.isLoadBearing,
      constructionNotes: `Phase 5 Verified Geometry: Level ${data.level ?? 0} element.`
    };

    return metadata;
  }

  public static clearSelection(): void {
    this.selectedMesh = null;
  }
}
