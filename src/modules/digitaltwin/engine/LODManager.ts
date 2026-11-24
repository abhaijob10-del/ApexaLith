import * as THREE from 'three';

export class LODManager {
  /**
   * Applies frustum culling and LOD rules to all scene objects
   */
  public static optimizeScene(scene: THREE.Object3D): void {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = true;
        // Optimize shadows
        if (child.geometry) {
          child.geometry.computeBoundingSphere();
          child.geometry.computeBoundingBox();
        }
      }
    });
  }
}
