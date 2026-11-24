import * as THREE from 'three';
import { RoomData, SlabData } from '../../bim/types/BuildingModel';
import { materialManager } from './MaterialManager';
import { PBRMaterialType } from '../types/digitalTwinTypes';

export class FloorGenerator {
  /**
   * Generates a floor slab mesh for a room with category-appropriate PBR material
   */
  public static generateRoomFloorMesh(
    room: RoomData,
    levelElevation: number = 0,
    showWireframe: boolean = false
  ): THREE.Mesh {
    const minX = room.bounds.minX;
    const maxX = room.bounds.maxX;
    const minZ = room.bounds.minZ;
    const maxZ = room.bounds.maxZ;

    const width = Math.max(maxX - minX, 1.2);
    const depth = Math.max(maxZ - minZ, 1.2);
    const thickness = 0.2;

    const geo = new THREE.BoxGeometry(width, thickness, depth);
    geo.computeVertexNormals();

    // Map room category to architectural floor material
    let matType: PBRMaterialType = 'Tiles';
    switch (room.category) {
      case 'Living Room':
      case 'Bedroom':
        matType = 'Wood';
        break;
      case 'Bathroom':
      case 'Kitchen':
      case 'Utility Room':
        matType = 'Tiles';
        break;
      case 'Dining Room':
      case 'Hallway':
        matType = 'Marble';
        break;
      case 'Balcony':
      case 'Garage':
        matType = 'Concrete';
        break;
      default:
        matType = 'Tiles';
        break;
    }

    const material = materialManager.getMaterial(matType, { wireframe: showWireframe });
    const mesh = new THREE.Mesh(geo, material);
    mesh.name = `Floor_Slab_${room.id}`;
    mesh.userData = {
      id: `floor_${room.id}`,
      type: 'floor',
      roomId: room.id,
      roomName: room.name,
      level: room.level,
      areaSqMeters: room.areaSqMeters,
      materialType: matType
    };

    mesh.position.set(
      (minX + maxX) / 2,
      levelElevation - thickness / 2,
      (minZ + maxZ) / 2
    );
    mesh.receiveShadow = true;

    return mesh;
  }
}
