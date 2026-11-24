import * as THREE from 'three';
import { BuildingModel } from '../../bim/types/BuildingModel';
import { WallGenerator } from './WallGenerator';
import { DoorGenerator } from './DoorGenerator';
import { WindowGenerator } from './WindowGenerator';
import { FloorGenerator } from './FloorGenerator';
import { CeilingGenerator } from './CeilingGenerator';
import { RoofGenerator } from './RoofGenerator';
import { StairGenerator } from './StairGenerator';
import { SceneNode, SceneGraphData } from '../types/digitalTwinTypes';

export class SceneBuilder {
  /**
   * Assembles the full Three.js Scene hierarchy and returns both the Three.js Group and SceneGraphData
   */
  public static buildSceneGraph(
    buildingModel: BuildingModel,
    visibilityState: {
      hideWalls?: boolean;
      showWireframe?: boolean;
      showRoof?: boolean;
      showCeilings?: boolean;
    } = {}
  ): {
    threeGroup: THREE.Group;
    sceneGraphData: SceneGraphData;
  } {
    const buildingGroup = new THREE.Group();
    buildingGroup.name = `Building_${buildingModel.building.id}`;

    const totalFloors = buildingModel.building.totalFloors || 1;
    const floorHeight = buildingModel.floors[0]?.height || 3.0;

    let componentCount = 0;

    const rootNode: SceneNode = {
      id: `node_root_${buildingModel.id}`,
      name: buildingModel.building.name || 'Building Digital Twin',
      type: 'building',
      children: [],
      visible: true,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1]
    };

    // 1. Build Each Floor / Level
    for (let f = 0; f < totalFloors; f++) {
      const levelElevation = f * floorHeight;
      const floorNode: SceneNode = {
        id: `node_floor_${f}`,
        name: `Floor Level ${f}`,
        type: 'floor',
        children: [],
        visible: true,
        position: [0, levelElevation, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      };

      const floorGroup = new THREE.Group();
      floorGroup.name = `Floor_Level_${f}`;
      floorGroup.position.set(0, levelElevation, 0);

      // Filter elements belonging to this floor level
      const roomsOnLevel = buildingModel.rooms.filter(r => r.level === f || totalFloors === 1);
      const wallsOnLevel = buildingModel.walls.filter(w => w.level === f || totalFloors === 1);
      const doorsOnLevel = buildingModel.doors.filter(d => d.level === f || totalFloors === 1);
      const windowsOnLevel = buildingModel.windows.filter(win => win.level === f || totalFloors === 1);

      // A. Room Floor & Ceiling Slabs
      for (const room of roomsOnLevel) {
        // Floor Slab Mesh
        const floorMesh = FloorGenerator.generateRoomFloorMesh(room, 0, visibilityState.showWireframe);
        floorGroup.add(floorMesh);
        componentCount++;

        // Ceiling Mesh
        if (visibilityState.showCeilings !== false) {
          const ceilingMesh = CeilingGenerator.generateRoomCeilingMesh(room, floorHeight, 0, visibilityState.showWireframe);
          floorGroup.add(ceilingMesh);
          componentCount++;
        }

        floorNode.children.push({
          id: `node_room_${room.id}`,
          name: `${room.name} (${room.category})`,
          type: 'room',
          children: [],
          visible: true,
          position: room.centerPoint || [0, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1]
        });
      }

      // B. Wall Meshes
      if (!visibilityState.hideWalls) {
        for (const wall of wallsOnLevel) {
          const doorsForWall = doorsOnLevel.filter(d => d.wallId === wall.id);
          const windowsForWall = windowsOnLevel.filter(w => w.wallId === wall.id);

          const wallMeshGroup = WallGenerator.generateWallMesh(wall, doorsForWall, windowsForWall, visibilityState.showWireframe);
          floorGroup.add(wallMeshGroup);
          componentCount++;
        }
      }

      // C. Door Meshes
      for (const door of doorsOnLevel) {
        const doorGroup = DoorGenerator.generateDoorMesh(door, visibilityState.showWireframe);
        floorGroup.add(doorGroup);
        componentCount++;
      }

      // D. Window Meshes
      for (const window of windowsOnLevel) {
        const windowGroup = WindowGenerator.generateWindowMesh(window, visibilityState.showWireframe);
        floorGroup.add(windowGroup);
        componentCount++;
      }

      // E. Staircase (if multi-floor)
      if (totalFloors > 1 && f < totalFloors - 1) {
        const stairGroup = StairGenerator.generateStairMesh([0, 0, 0], floorHeight, 1.2, visibilityState.showWireframe);
        floorGroup.add(stairGroup);
        componentCount++;
      }

      buildingGroup.add(floorGroup);
      rootNode.children.push(floorNode);
    }

    // 2. Building Roof
    if (visibilityState.showRoof !== false) {
      const topElevation = totalFloors * floorHeight;
      const roofMesh = RoofGenerator.generateRoofMesh(
        buildingModel.metadata.boundingExtent,
        topElevation,
        buildingModel.aiAnalysis?.roofType || 'Flat Terrace Roof',
        visibilityState.showWireframe
      );
      buildingGroup.add(roofMesh);
      componentCount++;
    }

    const sceneGraphData: SceneGraphData = {
      root: rootNode,
      buildingId: buildingModel.building.id,
      totalComponents: componentCount,
      updatedAt: new Date().toISOString()
    };

    return { threeGroup: buildingGroup, sceneGraphData };
  }
}
