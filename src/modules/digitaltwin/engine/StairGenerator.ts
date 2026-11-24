import * as THREE from 'three';
import { materialManager } from './MaterialManager';

export class StairGenerator {
  /**
   * Generates a 3D staircase linking two floor levels (risers, treads, stainless steel/glass handrails)
   */
  public static generateStairMesh(
    position: [number, number, number],
    floorHeight: number = 3.0,
    stairWidth: number = 1.2,
    showWireframe: boolean = false
  ): THREE.Group {
    const stairGroup = new THREE.Group();
    stairGroup.name = 'Staircase_Level_Transition';

    const numSteps = 16;
    const riserHeight = floorHeight / numSteps;
    const treadDepth = 0.28;

    const treadMat = materialManager.getMaterial('Wood', { colorHex: '#78350F', wireframe: showWireframe });
    const riserMat = materialManager.getMaterial('Paint', { colorHex: '#E2E8F0', wireframe: showWireframe });
    const railMat = materialManager.getMaterial('Steel', { colorHex: '#94A3B8', wireframe: showWireframe });

    for (let i = 0; i < numSteps; i++) {
      const stepY = i * riserHeight;
      const stepZ = i * treadDepth;

      // Tread
      const treadGeo = new THREE.BoxGeometry(stairWidth, 0.04, treadDepth);
      const treadMesh = new THREE.Mesh(treadGeo, treadMat);
      treadMesh.position.set(0, stepY + riserHeight, stepZ + treadDepth / 2);
      treadMesh.castShadow = true;
      stairGroup.add(treadMesh);

      // Riser
      const riserGeo = new THREE.BoxGeometry(stairWidth, riserHeight, 0.03);
      const riserMesh = new THREE.Mesh(riserGeo, riserMat);
      riserMesh.position.set(0, stepY + riserHeight / 2, stepZ);
      riserMesh.castShadow = true;
      stairGroup.add(riserMesh);
    }

    // Handrail Posts
    const postGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.9, 12);
    for (let i = 0; i <= numSteps; i += 4) {
      const postY = i * riserHeight + 0.45;
      const postZ = i * treadDepth;

      const leftPost = new THREE.Mesh(postGeo, railMat);
      leftPost.position.set(-stairWidth / 2 + 0.05, postY, postZ);
      stairGroup.add(leftPost);

      const rightPost = new THREE.Mesh(postGeo, railMat);
      rightPost.position.set(stairWidth / 2 - 0.05, postY, postZ);
      stairGroup.add(rightPost);
    }

    stairGroup.position.set(position[0], position[1], position[2]);
    stairGroup.userData = {
      id: `stair_${Date.now()}`,
      type: 'stair',
      height: floorHeight,
      width: stairWidth
    };

    return stairGroup;
  }
}
