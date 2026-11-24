import * as THREE from 'three';
import { DoorData } from '../../bim/types/BuildingModel';
import { materialManager } from './MaterialManager';

export class DoorGenerator {
  /**
   * Generates a detailed 3D Door assembly (frame, panel, handle, 2D/3D swing arc)
   */
  public static generateDoorMesh(
    door: DoorData,
    showWireframe: boolean = false
  ): THREE.Group {
    const doorGroup = new THREE.Group();
    doorGroup.name = `Door_${door.id}`;
    doorGroup.userData = {
      id: door.id,
      type: 'door',
      level: door.level,
      width: door.width,
      height: door.height,
      openingType: door.openingType || 'Single Swing'
    };

    const doorWidth = door.width || 0.9;
    const doorHeight = door.height || 2.1;
    const frameDepth = 0.15;
    const frameThickness = 0.05;

    const frameMat = materialManager.getMaterial('Wood', { colorHex: '#4A2E18', wireframe: showWireframe });
    const panelMat = materialManager.getMaterial('Wood', { colorHex: '#8B5A2B', wireframe: showWireframe });
    const handleMat = materialManager.getMaterial('Steel', { colorHex: '#94A3B8', wireframe: showWireframe });

    // 1. Outer Door Frame
    // Left Jamb
    const leftJambGeo = new THREE.BoxGeometry(frameThickness, doorHeight, frameDepth);
    const leftJamb = new THREE.Mesh(leftJambGeo, frameMat);
    leftJamb.position.set(-doorWidth / 2 + frameThickness / 2, doorHeight / 2, 0);
    leftJamb.castShadow = true;
    doorGroup.add(leftJamb);

    // Right Jamb
    const rightJamb = new THREE.Mesh(leftJambGeo, frameMat);
    rightJamb.position.set(doorWidth / 2 - frameThickness / 2, doorHeight / 2, 0);
    rightJamb.castShadow = true;
    doorGroup.add(rightJamb);

    // Top Head
    const headGeo = new THREE.BoxGeometry(doorWidth, frameThickness, frameDepth);
    const head = new THREE.Mesh(headGeo, frameMat);
    head.position.set(0, doorHeight - frameThickness / 2, 0);
    head.castShadow = true;
    doorGroup.add(head);

    // 2. Door Leaf Panel (Slightly open at 25 degrees for realistic BIM aesthetic)
    const panelWidth = doorWidth - frameThickness * 2;
    const panelHeight = doorHeight - frameThickness;
    const panelThickness = 0.04;

    const panelPivot = new THREE.Group();
    panelPivot.position.set(-doorWidth / 2 + frameThickness, 0, 0);

    const panelGeo = new THREE.BoxGeometry(panelWidth, panelHeight, panelThickness);
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    panelMesh.position.set(panelWidth / 2, panelHeight / 2, 0);
    panelMesh.castShadow = true;
    panelMesh.receiveShadow = true;
    panelPivot.add(panelMesh);

    // Door Handle
    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 16);
    const handleMesh = new THREE.Mesh(handleGeo, handleMat);
    handleMesh.rotation.z = Math.PI / 2;
    handleMesh.position.set(panelWidth - 0.08, panelHeight / 2, panelThickness / 2 + 0.03);
    panelPivot.add(handleMesh);

    // Slight realistic opening rotation
    panelPivot.rotation.y = Math.PI / 8; // ~22.5 degrees open
    doorGroup.add(panelPivot);

    // 3. 2D/3D Swing Arc Indicator Line
    const arcCurve = new THREE.EllipseCurve(
      0, 0,            // ax, aY
      panelWidth, panelWidth, // xRadius, yRadius
      0, Math.PI / 2,  // aStartAngle, aEndAngle
      false,           // aClockwise
      0                // aRotation
    );
    const points = arcCurve.getPoints(24);
    const arcGeo = new THREE.BufferGeometry().setFromPoints(
      points.map(p => new THREE.Vector3(p.x - doorWidth / 2 + frameThickness, 0.02, p.y))
    );
    const arcMat = new THREE.LineDashedMaterial({ color: 0x3b82f6, dashSize: 0.1, gapSize: 0.05 });
    const arcLine = new THREE.Line(arcGeo, arcMat);
    arcLine.computeLineDistances();
    doorGroup.add(arcLine);

    // Set position in world space
    doorGroup.position.set(door.position[0], door.position[1], door.position[2]);

    return doorGroup;
  }
}
