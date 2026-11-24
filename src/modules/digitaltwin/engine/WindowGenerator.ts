import * as THREE from 'three';
import { WindowData } from '../../bim/types/BuildingModel';
import { materialManager } from './MaterialManager';

export class WindowGenerator {
  /**
   * Generates a 3D Window assembly with frame, mullions, glass pane, and window sill
   */
  public static generateWindowMesh(
    window: WindowData,
    showWireframe: boolean = false
  ): THREE.Group {
    const windowGroup = new THREE.Group();
    windowGroup.name = `Window_${window.id}`;
    windowGroup.userData = {
      id: window.id,
      type: 'window',
      level: window.level,
      width: window.width,
      height: window.height,
      sillHeight: window.sillHeight
    };

    const winWidth = window.width || 1.2;
    const winHeight = window.height || 1.4;
    const sillHeight = window.sillHeight || 0.9;
    const frameDepth = 0.12;
    const frameThickness = 0.04;

    const frameMat = materialManager.getMaterial('Steel', { colorHex: '#1E293B', wireframe: showWireframe });
    const glassMat = materialManager.getMaterial('Glass', { wireframe: showWireframe });
    const sillMat = materialManager.getMaterial('Stone', { colorHex: '#CBD5E1', wireframe: showWireframe });

    // 1. Outer Frame Box
    // Top
    const topGeo = new THREE.BoxGeometry(winWidth, frameThickness, frameDepth);
    const topMesh = new THREE.Mesh(topGeo, frameMat);
    topMesh.position.set(0, winHeight / 2 - frameThickness / 2, 0);
    topMesh.castShadow = true;
    windowGroup.add(topMesh);

    // Bottom
    const bottomMesh = new THREE.Mesh(topGeo, frameMat);
    bottomMesh.position.set(0, -winHeight / 2 + frameThickness / 2, 0);
    bottomMesh.castShadow = true;
    windowGroup.add(bottomMesh);

    // Left Jamb
    const sideGeo = new THREE.BoxGeometry(frameThickness, winHeight, frameDepth);
    const leftMesh = new THREE.Mesh(sideGeo, frameMat);
    leftMesh.position.set(-winWidth / 2 + frameThickness / 2, 0, 0);
    leftMesh.castShadow = true;
    windowGroup.add(leftMesh);

    // Right Jamb
    const rightMesh = new THREE.Mesh(sideGeo, frameMat);
    rightMesh.position.set(winWidth / 2 - frameThickness / 2, 0, 0);
    rightMesh.castShadow = true;
    windowGroup.add(rightMesh);

    // 2. Central Mullion Bar (Vertical Splitter)
    if (winWidth > 1.0) {
      const mullionGeo = new THREE.BoxGeometry(frameThickness * 0.8, winHeight - frameThickness * 2, frameDepth * 0.8);
      const mullion = new THREE.Mesh(mullionGeo, frameMat);
      mullion.position.set(0, 0, 0);
      windowGroup.add(mullion);
    }

    // 3. Double-Glazed Glass Pane
    const glassGeo = new THREE.BoxGeometry(winWidth - frameThickness * 2, winHeight - frameThickness * 2, 0.012);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(0, 0, 0);
    windowGroup.add(glassMesh);

    // 4. Exterior Window Sill Projection
    const sillGeo = new THREE.BoxGeometry(winWidth + 0.1, 0.04, frameDepth + 0.1);
    const sillMesh = new THREE.Mesh(sillGeo, sillMat);
    sillMesh.position.set(0, -winHeight / 2 - 0.02, 0.03);
    sillMesh.castShadow = true;
    sillMesh.receiveShadow = true;
    windowGroup.add(sillMesh);

    // World position (including sill height)
    windowGroup.position.set(window.position[0], window.position[1] + sillHeight, window.position[2]);

    return windowGroup;
  }
}
