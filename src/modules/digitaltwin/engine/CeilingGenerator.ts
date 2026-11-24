import * as THREE from 'three';
import { RoomData } from '../../bim/types/BuildingModel';
import { materialManager } from './MaterialManager';

export class CeilingGenerator {
  /**
   * Generates a room ceiling slab/gypsum soffit mesh at floor top height
   */
  public static generateRoomCeilingMesh(
    room: RoomData,
    ceilingHeight: number = 3.0,
    levelElevation: number = 0,
    showWireframe: boolean = false
  ): THREE.Group {
    const ceilingGroup = new THREE.Group();
    ceilingGroup.name = `Ceiling_${room.id}`;

    const minX = room.bounds.minX;
    const maxX = room.bounds.maxX;
    const minZ = room.bounds.minZ;
    const maxZ = room.bounds.maxZ;

    const width = Math.max(maxX - minX, 1.2);
    const depth = Math.max(maxZ - minZ, 1.2);
    const thickness = 0.12;

    const geo = new THREE.BoxGeometry(width, thickness, depth);
    const mat = materialManager.getMaterial('Paint', { colorHex: '#F8FAFC', wireframe: showWireframe });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (minX + maxX) / 2,
      levelElevation + ceilingHeight + thickness / 2,
      (minZ + maxZ) / 2
    );
    mesh.receiveShadow = true;
    ceilingGroup.add(mesh);

    ceilingGroup.userData = {
      id: `ceiling_${room.id}`,
      type: 'ceiling',
      roomId: room.id,
      roomName: room.name,
      level: room.level,
      height: ceilingHeight
    };

    return ceilingGroup;
  }
}
