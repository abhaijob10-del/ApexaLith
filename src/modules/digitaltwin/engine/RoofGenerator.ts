import * as THREE from 'three';
import { RoofData, ParserMetadata } from '../../bim/types/BuildingModel';
import { materialManager } from './MaterialManager';

export class RoofGenerator {
  /**
   * Generates a 3D roof structure (flat slab terrace or pitched roof)
   */
  public static generateRoofMesh(
    roofExtent: ParserMetadata['boundingExtent'],
    topElevation: number,
    roofType: string = 'Flat Slab Terrace',
    showWireframe: boolean = false
  ): THREE.Group {
    const roofGroup = new THREE.Group();
    roofGroup.name = 'Roof_Structure';

    const minX = roofExtent.min[0];
    const maxX = roofExtent.max[0];
    const minZ = roofExtent.min[2];
    const maxZ = roofExtent.max[2];

    const width = Math.max(maxX - minX + 0.6, 6.0);
    const depth = Math.max(maxZ - minZ + 0.6, 6.0);
    const thickness = 0.25;

    const slabGeo = new THREE.BoxGeometry(width, thickness, depth);
    const mat = materialManager.getMaterial('Concrete', { colorHex: '#475569', wireframe: showWireframe });

    const slabMesh = new THREE.Mesh(slabGeo, mat);
    slabMesh.position.set((minX + maxX) / 2, topElevation + thickness / 2, (minZ + maxZ) / 2);
    slabMesh.castShadow = true;
    slabMesh.receiveShadow = true;
    roofGroup.add(slabMesh);

    // Parapet Wall around perimeter for terrace roof
    const parapetHeight = 0.9;
    const parapetThickness = 0.2;
    const parapetMat = materialManager.getMaterial('Brick', { colorHex: '#94A3B8', wireframe: showWireframe });

    // Front & Back Parapet
    const frontGeo = new THREE.BoxGeometry(width, parapetHeight, parapetThickness);
    const frontParapet = new THREE.Mesh(frontGeo, parapetMat);
    frontParapet.position.set((minX + maxX) / 2, topElevation + thickness + parapetHeight / 2, (minZ + maxZ) / 2 + depth / 2 - parapetThickness / 2);
    roofGroup.add(frontParapet);

    const backParapet = new THREE.Mesh(frontGeo, parapetMat);
    backParapet.position.set((minX + maxX) / 2, topElevation + thickness + parapetHeight / 2, (minZ + maxZ) / 2 - depth / 2 + parapetThickness / 2);
    roofGroup.add(backParapet);

    roofGroup.userData = {
      id: 'roof_main',
      type: 'roof',
      roofType,
      topElevation,
      areaSqMeters: width * depth
    };

    return roofGroup;
  }
}
