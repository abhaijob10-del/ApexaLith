import * as THREE from 'three';

export class CollisionManager {
  /**
   * Raycast intersection test for user object selection
   */
  public static raycastObjects(
    mousePosition: { x: number; y: number },
    camera: THREE.Camera,
    objectsToTest: THREE.Object3D[]
  ): THREE.Intersection[] {
    const raycaster = new THREE.Raycaster();
    const coords = new THREE.Vector2(mousePosition.x, mousePosition.y);
    raycaster.setFromCamera(coords, camera);
    return raycaster.intersectObjects(objectsToTest, true);
  }

  /**
   * Calculates world bounding box for an object or group
   */
  public static getObjectBounds(object: THREE.Object3D): THREE.Box3 {
    const box = new THREE.Box3();
    box.setFromObject(object);
    return box;
  }
}
