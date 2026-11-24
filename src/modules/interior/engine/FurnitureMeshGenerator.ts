import * as THREE from 'three';
import { FurnitureItem } from '../types/interiorTypes';

export class FurnitureMeshGenerator {
  /**
   * Generates a Three.js Group representing a realistic procedural 3D furniture piece
   */
  static createFurnitureGroup(item: FurnitureItem): THREE.Group {
    const group = new THREE.Group();
    group.name = `furniture_${item.id}`;
    group.userData = {
      isFurniture: true,
      id: item.id,
      name: item.name,
      category: item.category,
      material: item.material,
      colorHex: item.colorHex,
      meshType: item.meshType,
      isLocked: item.isLocked
    };

    const color = new THREE.Color(item.colorHex || '#B59B6D');
    const primaryMat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.1
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#4A3525'),
      roughness: 0.6,
      metalness: 0.05
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C0C0C0'),
      roughness: 0.2,
      metalness: 0.8
    });

    const brassMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      roughness: 0.3,
      metalness: 0.7
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1A1C20'),
      roughness: 0.8
    });

    const { length: l, width: w, height: h } = item.dimensions;

    switch (item.meshType) {
      case 'sofa': {
        // Base frame
        const baseGeo = new THREE.BoxGeometry(l, h * 0.25, w);
        const baseMesh = new THREE.Mesh(baseGeo, primaryMat);
        baseMesh.position.y = h * 0.125;
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);

        // Seat Cushions
        const seatGeo = new THREE.BoxGeometry(l * 0.95, h * 0.25, w * 0.75);
        const seatMesh = new THREE.Mesh(seatGeo, primaryMat);
        seatMesh.position.set(0, h * 0.375, -w * 0.05);
        seatMesh.castShadow = true;
        group.add(seatMesh);

        // Backrest
        const backGeo = new THREE.BoxGeometry(l, h * 0.6, w * 0.25);
        const backMesh = new THREE.Mesh(backGeo, primaryMat);
        backMesh.position.set(0, h * 0.6, -w * 0.375);
        backMesh.castShadow = true;
        group.add(backMesh);

        // Armrests
        const armGeo = new THREE.BoxGeometry(l * 0.15, h * 0.5, w);
        const leftArm = new THREE.Mesh(armGeo, primaryMat);
        leftArm.position.set(-l * 0.425, h * 0.4, 0);
        leftArm.castShadow = true;
        group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeo, primaryMat);
        rightArm.position.set(l * 0.425, h * 0.4, 0);
        rightArm.castShadow = true;
        group.add(rightArm);

        // Feet
        const legGeo = new THREE.CylinderGeometry(0.03, 0.02, h * 0.15);
        const legPositions = [
          [-l * 0.45, h * 0.075, w * 0.4],
          [l * 0.45, h * 0.075, w * 0.4],
          [-l * 0.45, h * 0.075, -w * 0.4],
          [l * 0.45, h * 0.075, -w * 0.4]
        ];
        legPositions.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, brassMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          group.add(leg);
        });
        break;
      }

      case 'bed': {
        // Platform Frame
        const frameGeo = new THREE.BoxGeometry(l * 1.05, h * 0.25, w * 1.05);
        const frame = new THREE.Mesh(frameGeo, woodMat);
        frame.position.y = h * 0.125;
        frame.castShadow = true;
        group.add(frame);

        // Mattress
        const matGeo = new THREE.BoxGeometry(l, h * 0.3, w);
        const mattress = new THREE.Mesh(matGeo, primaryMat);
        mattress.position.y = h * 0.4;
        mattress.castShadow = true;
        group.add(mattress);

        // Headboard
        const headGeo = new THREE.BoxGeometry(l * 1.1, h * 0.7, w * 0.1);
        const headboard = new THREE.Mesh(headGeo, primaryMat);
        headboard.position.set(0, h * 0.65, -w * 0.5);
        headboard.castShadow = true;
        group.add(headboard);

        // Pillows
        const pillowGeo = new THREE.BoxGeometry(l * 0.38, 0.12, w * 0.25);
        const pillow1 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        pillow1.position.set(-l * 0.22, h * 0.6, -w * 0.35);
        const pillow2 = new THREE.Mesh(pillowGeo, new THREE.MeshStandardMaterial({ color: 0xffffff }));
        pillow2.position.set(l * 0.22, h * 0.6, -w * 0.35);
        group.add(pillow1);
        group.add(pillow2);
        break;
      }

      case 'table': {
        // Tabletop
        const topGeo = new THREE.BoxGeometry(l, 0.08, w);
        const top = new THREE.Mesh(topGeo, primaryMat);
        top.position.y = h - 0.04;
        top.castShadow = true;
        group.add(top);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.04, 0.03, h - 0.08);
        const offsets = [
          [-l * 0.42, (h - 0.08) / 2, w * 0.4],
          [l * 0.42, (h - 0.08) / 2, w * 0.4],
          [-l * 0.42, (h - 0.08) / 2, -w * 0.4],
          [l * 0.42, (h - 0.08) / 2, -w * 0.4]
        ];
        offsets.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, woodMat);
          leg.position.set(pos[0], pos[1], pos[2]);
          leg.castShadow = true;
          group.add(leg);
        });
        break;
      }

      case 'lamp': {
        // Base
        const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.05);
        const base = new THREE.Mesh(baseGeo, brassMat);
        base.position.y = 0.025;
        group.add(base);

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, h * 0.85);
        const stem = new THREE.Mesh(stemGeo, brassMat);
        stem.position.y = h * 0.45;
        group.add(stem);

        // Shade
        const shadeGeo = new THREE.CylinderGeometry(0.25, 0.35, h * 0.25, 32, 1, true);
        const shadeMat = new THREE.MeshStandardMaterial({ color: 0xfff8dc, side: THREE.DoubleSide });
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.y = h * 0.85;
        group.add(shade);

        // Light Source
        const pointLight = new THREE.PointLight(0xffaa44, 1.5, 5);
        pointLight.position.y = h * 0.8;
        group.add(pointLight);
        break;
      }

      case 'plant': {
        // Pot
        const potGeo = new THREE.CylinderGeometry(0.25, 0.2, h * 0.3, 16);
        const pot = new THREE.Mesh(potGeo, darkMat);
        pot.position.y = h * 0.15;
        group.add(pot);

        // Foliage spheres
        const folMat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#2E5A27'), roughness: 0.7 });
        for (let i = 0; i < 5; i++) {
          const folGeo = new THREE.SphereGeometry(0.2 + (i * 0.05), 12, 12);
          const fol = new THREE.Mesh(folGeo, folMat);
          fol.position.set(
            (Math.sin(i * 1.5) * 0.15),
            h * 0.35 + (i * 0.18),
            (Math.cos(i * 1.5) * 0.15)
          );
          fol.castShadow = true;
          group.add(fol);
        }
        break;
      }

      case 'artwork': {
        // Frame
        const frameGeo = new THREE.BoxGeometry(l, h, 0.04);
        const frame = new THREE.Mesh(frameGeo, brassMat);
        frame.position.y = h / 2;
        group.add(frame);

        // Canvas
        const canvasGeo = new THREE.BoxGeometry(l * 0.92, h * 0.92, 0.05);
        const canvas = new THREE.Mesh(canvasGeo, primaryMat);
        canvas.position.y = h / 2;
        group.add(canvas);
        break;
      }

      default: {
        // General Parametric Box with Rounded Bevel
        const boxGeo = new THREE.BoxGeometry(l, h, w);
        const box = new THREE.Mesh(boxGeo, primaryMat);
        box.position.y = h / 2;
        box.castShadow = true;
        box.receiveShadow = true;
        group.add(box);
        break;
      }
    }

    // Set position, rotation, scale
    group.position.set(...item.position);
    group.rotation.set(...item.rotation);
    group.scale.set(...item.scale);

    return group;
  }
}
