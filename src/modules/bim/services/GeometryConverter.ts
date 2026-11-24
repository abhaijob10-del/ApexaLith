import * as THREE from 'three';
import { BuildingModel, WallData, DoorData, WindowData, RoomData } from '../types/BuildingModel';

export interface WireframeGeometryData {
  wallLines: THREE.LineSegments;
  wallBoxes: THREE.LineSegments[];
  doorFrames: THREE.LineSegments[];
  windowFrames: THREE.LineSegments[];
  floorPlanes: THREE.LineSegments[];
  boundingBox: THREE.LineSegments;
  roomLabels: { id: string; name: string; position: [number, number, number]; areaSqM: number }[];
}

export class GeometryConverter {
  /**
   * Converts a BuildingModel JSON into pure Three.js Wireframe objects.
   * Strictly wireframes and bounding boxes as mandated for Phase 3 accuracy verification.
   */
  public static convertToWireframe(model: BuildingModel): WireframeGeometryData {
    const wallLinesPositions: number[] = [];
    const wallBoxes: THREE.LineSegments[] = [];
    const doorFrames: THREE.LineSegments[] = [];
    const windowFrames: THREE.LineSegments[] = [];
    const floorPlanes: THREE.LineSegments[] = [];
    const roomLabels: { id: string; name: string; position: [number, number, number]; areaSqM: number }[] = [];

    // 1. Process Walls into Wireframe Boxes
    model.walls.forEach(wall => {
      const dx = wall.end[0] - wall.start[0];
      const dz = wall.end[2] - wall.start[2];
      const length = Math.hypot(dx, dz) || 0.1;
      const angle = Math.atan2(dz, dx);

      const midX = (wall.start[0] + wall.end[0]) / 2;
      const midY = wall.start[1] + wall.height / 2;
      const midZ = (wall.start[2] + wall.end[2]) / 2;

      // Add center line
      wallLinesPositions.push(wall.start[0], wall.start[1], wall.start[2]);
      wallLinesPositions.push(wall.end[0], wall.end[1], wall.end[2]);

      // Box wireframe
      const boxGeo = new THREE.BoxGeometry(length, wall.height, wall.thickness);
      const wireframeGeo = new THREE.WireframeGeometry(boxGeo);
      const color = wall.type === 'exterior' ? 0xB59B6D : 0x64748B; // Gold exterior, Slate interior
      const mat = new THREE.LineBasicMaterial({ color, linewidth: 1.5 });
      const lineSegments = new THREE.LineSegments(wireframeGeo, mat);

      lineSegments.position.set(midX, midY, midZ);
      lineSegments.rotation.y = -angle;
      wallBoxes.push(lineSegments);
    });

    // 2. Centerline Segments Object
    const centerLinesGeo = new THREE.BufferGeometry();
    centerLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(wallLinesPositions, 3));
    const centerLinesMat = new THREE.LineBasicMaterial({ color: 0x38BDF8, linewidth: 2 });
    const wallLines = new THREE.LineSegments(centerLinesGeo, centerLinesMat);

    // 3. Process Doors into Cyan Wireframe Frames
    model.doors.forEach(door => {
      const doorGeo = new THREE.BoxGeometry(door.width, door.height, 0.15);
      const wireframeGeo = new THREE.WireframeGeometry(doorGeo);
      const mat = new THREE.LineBasicMaterial({ color: 0x06B6D4 }); // Cyan
      const frame = new THREE.LineSegments(wireframeGeo, mat);
      frame.position.set(door.position[0], door.position[1] + door.height / 2, door.position[2]);
      doorFrames.push(frame);
    });

    // 4. Process Windows into Amber Wireframe Frames
    model.windows.forEach(win => {
      const winGeo = new THREE.BoxGeometry(win.width, win.height, 0.15);
      const wireframeGeo = new THREE.WireframeGeometry(winGeo);
      const mat = new THREE.LineBasicMaterial({ color: 0xF59E0B }); // Amber
      const frame = new THREE.LineSegments(wireframeGeo, mat);
      frame.position.set(win.position[0], win.position[1] + win.sillHeight + win.height / 2, win.position[2]);
      windowFrames.push(frame);
    });

    // 5. Floor Level Wireframe Grid/Planes
    model.floors.forEach(floor => {
      const [dimX, , dimZ] = model.metadata.boundingExtent.dimensions;
      const planeGeo = new THREE.PlaneGeometry(dimX * 1.1, dimZ * 1.1, Math.ceil(dimX / 2), Math.ceil(dimZ / 2));
      const wireframeGeo = new THREE.WireframeGeometry(planeGeo);
      const mat = new THREE.LineBasicMaterial({ color: 0x334155, opacity: 0.4, transparent: true });
      const plane = new THREE.LineSegments(wireframeGeo, mat);
      plane.rotation.x = Math.PI / 2;
      plane.position.set(
        (model.metadata.boundingExtent.min[0] + model.metadata.boundingExtent.max[0]) / 2,
        floor.elevation,
        (model.metadata.boundingExtent.min[2] + model.metadata.boundingExtent.max[2]) / 2
      );
      floorPlanes.push(plane);
    });

    // 6. Overall Bounding Box
    const [min, max] = [model.metadata.boundingExtent.min, model.metadata.boundingExtent.max];
    const bboxGeo = new THREE.BoxGeometry(
      max[0] - min[0],
      max[1] - min[1],
      max[2] - min[2]
    );
    const bboxWireframe = new THREE.WireframeGeometry(bboxGeo);
    const bboxMat = new THREE.LineBasicMaterial({ color: 0x22C55E }); // Green Bounding Box
    const boundingBox = new THREE.LineSegments(bboxWireframe, bboxMat);
    boundingBox.position.set(
      (min[0] + max[0]) / 2,
      (min[1] + max[1]) / 2,
      (min[2] + max[2]) / 2
    );

    // 7. Room Labels
    model.rooms.forEach(room => {
      roomLabels.push({
        id: room.id,
        name: room.name,
        position: room.centerPoint,
        areaSqM: room.areaSqMeters
      });
    });

    return {
      wallLines,
      wallBoxes,
      doorFrames,
      windowFrames,
      floorPlanes,
      boundingBox,
      roomLabels
    };
  }
}
