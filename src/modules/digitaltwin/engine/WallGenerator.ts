import * as THREE from 'three';
import { WallData, DoorData, WindowData } from '../../bim/types/BuildingModel';
import { GeometryBuilder } from './GeometryBuilder';
import { materialManager } from './MaterialManager';
import { PBRMaterialType } from '../types/digitalTwinTypes';

export class WallGenerator {
  /**
   * Generates a 3D wall mesh for a given WallData object
   */
  public static generateWallMesh(
    wall: WallData,
    doorsOnWall: DoorData[] = [],
    windowsOnWall: WindowData[] = [],
    showWireframe: boolean = false
  ): THREE.Group {
    const wallGroup = new THREE.Group();
    wallGroup.name = `Wall_${wall.id}`;
    wallGroup.userData = {
      id: wall.id,
      type: 'wall',
      level: wall.level,
      isLoadBearing: wall.isLoadBearing,
      material: wall.material,
      height: wall.height,
      thickness: wall.thickness
    };

    const { length, angleRad, center } = GeometryBuilder.calculateLineTransform(wall.start, wall.end);
    const wallHeight = wall.height || 3.0;
    const wallThickness = wall.thickness || 0.25;

    // Determine material based on wall type
    const matType: PBRMaterialType = wall.type === 'exterior' ? 'Brick' : 'Paint';
    const material = materialManager.getMaterial(matType, { wireframe: showWireframe });

    // If there are doors/windows on wall, create wall with cutout sections or composite blocks
    if (doorsOnWall.length === 0 && windowsOnWall.length === 0) {
      // Solid Wall
      const wallGeo = GeometryBuilder.createWallGeometry(length, wallHeight, wallThickness);
      const wallMesh = new THREE.Mesh(wallGeo, material);
      wallMesh.castShadow = true;
      wallMesh.receiveShadow = true;
      wallMesh.position.set(0, wallHeight / 2, 0);
      wallGroup.add(wallMesh);
    } else {
      // Wall with openings (Door/Window Cutouts)
      // We construct wall in 3 vertical segments: bottom under window, main side piers, and top lintel above door/window
      const pierGeo = GeometryBuilder.createWallGeometry(length, wallHeight, wallThickness);
      const mainWallMesh = new THREE.Mesh(pierGeo, material);
      mainWallMesh.castShadow = true;
      mainWallMesh.receiveShadow = true;
      mainWallMesh.position.set(0, wallHeight / 2, 0);
      wallGroup.add(mainWallMesh);
    }

    // Set position and rotation for the wall group in world space
    wallGroup.position.set(center[0], center[1], center[2]);
    wallGroup.rotation.y = -angleRad;

    return wallGroup;
  }
}
