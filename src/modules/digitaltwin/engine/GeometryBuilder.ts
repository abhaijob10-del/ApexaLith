import * as THREE from 'three';

export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
}

export class GeometryBuilder {
  /**
   * Calculates length, rotation angle, and center position for a 2D line segment (wall)
   */
  public static calculateLineTransform(
    start: [number, number, number],
    end: [number, number, number]
  ): {
    length: number;
    angleRad: number;
    center: [number, number, number];
  } {
    const dx = end[0] - start[0];
    const dz = end[2] - start[2]; // Using Z as depth in Three.js world coordinates
    const length = Math.sqrt(dx * dx + dz * dz);
    const angleRad = Math.atan2(dz, dx);
    const center: [number, number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    ];

    return { length, angleRad, center };
  }

  /**
   * Generates box geometry for a wall segment with exact thickness and height
   */
  public static createWallGeometry(
    length: number,
    height: number,
    thickness: number
  ): THREE.BufferGeometry {
    const geometry = new THREE.BoxGeometry(length, height, thickness);
    geometry.computeVertexNormals();
    return geometry;
  }

  /**
   * Creates a floor or ceiling slab geometry from a polygon or bounding box
   */
  public static createSlabGeometry(
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    thickness: number = 0.2
  ): THREE.BufferGeometry {
    const width = Math.max(maxX - minX, 1.0);
    const depth = Math.max(maxZ - minZ, 1.0);
    const geometry = new THREE.BoxGeometry(width, thickness, depth);
    geometry.computeVertexNormals();
    return geometry;
  }
}
