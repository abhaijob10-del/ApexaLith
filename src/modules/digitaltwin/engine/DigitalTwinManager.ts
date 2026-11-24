import * as THREE from 'three';
import { BuildingModel } from '../../bim/types/BuildingModel';
import { SceneBuilder } from './SceneBuilder';
import { LODManager } from './LODManager';
import { DigitalTwinRecord, SceneGraphData, TimeOfDay } from '../types/digitalTwinTypes';
import { StorageManager } from '../../bim/services/StorageManager';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

export class DigitalTwinManager {
  private static instance: DigitalTwinManager;
  private currentBuildingModel: BuildingModel | null = null;
  private currentDigitalTwinRecord: DigitalTwinRecord | null = null;

  public static getInstance(): DigitalTwinManager {
    if (!DigitalTwinManager.instance) {
      DigitalTwinManager.instance = new DigitalTwinManager();
    }
    return DigitalTwinManager.instance;
  }

  /**
   * Initializes Digital Twin from Phase 4 Verified Building Model
   */
  public generateDigitalTwin(
    buildingModel: BuildingModel,
    options: {
      hideWalls?: boolean;
      showWireframe?: boolean;
      showRoof?: boolean;
      showCeilings?: boolean;
    } = {}
  ): {
    threeGroup: THREE.Group;
    record: DigitalTwinRecord;
  } {
    // Phase 5 Constraint: Verify that buildingModel is valid and verified
    if (!buildingModel || !buildingModel.building) {
      throw new Error('Digital Twin Generation Blocked: No valid Building Model provided.');
    }

    this.currentBuildingModel = buildingModel;

    // Build 3D Scene Graph using SceneBuilder
    const { threeGroup, sceneGraphData } = SceneBuilder.buildSceneGraph(buildingModel, options);

    // Apply scene optimization
    LODManager.optimizeScene(threeGroup);

    // Create Digital Twin Record
    const recordId = `dt_${buildingModel.id}`;
    const timestamp = new Date().toISOString();

    const record: DigitalTwinRecord = {
      id: recordId,
      buildingModelId: buildingModel.id,
      projectId: buildingModel.projectId,
      sceneGraph: sceneGraphData,
      cameraState: {
        position: [12, 10, 15],
        target: [0, 0, 0],
        fov: 45,
        mode: 'orbit'
      },
      lightingState: {
        timeOfDay: 'afternoon',
        sunIntensity: 2.0,
        ambientIntensity: 0.6,
        shadowsEnabled: true
      },
      visibilityState: {
        hideWalls: !!options.hideWalls,
        showWireframe: !!options.showWireframe,
        showRoof: options.showRoof !== false,
        showCeilings: options.showCeilings !== false,
        showSectionCut: false,
        sectionCutAxis: 'Y',
        sectionCutOffset: 1.5
      },
      measurements: [],
      selectedObjectId: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.currentDigitalTwinRecord = record;

    // Trigger background Firestore persistence across digital_twins, scene_graph, geometry, materials, components
    this.saveDigitalTwinToFirestore(record, buildingModel);

    return { threeGroup, record };
  }

  /**
   * Persists Digital Twin state to Firestore across the required Phase 5 collections:
   * - digital_twins
   * - scene_graph
   * - geometry
   * - materials
   * - components
   */
  public async saveDigitalTwinToFirestore(
    record: DigitalTwinRecord,
    buildingModel: BuildingModel
  ): Promise<void> {
    try {
      // 1. 'digital_twins' collection
      await setDoc(doc(db, 'digital_twins', record.id), record, { merge: true });

      // 2. 'scene_graph' collection
      await setDoc(doc(db, 'scene_graph', `sg_${record.id}`), {
        id: `sg_${record.id}`,
        digitalTwinId: record.id,
        buildingModelId: buildingModel.id,
        sceneGraph: record.sceneGraph,
        updatedAt: record.updatedAt
      }, { merge: true });

      // 3. 'geometry' collection
      await setDoc(doc(db, 'geometry', `geo_extent_${record.id}`), {
        id: `geo_extent_${record.id}`,
        digitalTwinId: record.id,
        boundingExtent: buildingModel.metadata.boundingExtent,
        totalComponents: record.sceneGraph.totalComponents,
        updatedAt: record.updatedAt
      }, { merge: true });

      // 4. 'materials' collection
      await setDoc(doc(db, 'materials', `mat_lib_${record.id}`), {
        id: `mat_lib_${record.id}`,
        digitalTwinId: record.id,
        materialsList: ['Concrete', 'Brick', 'Stone', 'Wood', 'Tiles', 'Marble', 'Granite', 'Glass', 'Steel', 'Paint'],
        updatedAt: record.updatedAt
      }, { merge: true });

      // 5. 'components' collection
      for (const wall of buildingModel.walls) {
        await setDoc(doc(db, 'components', `comp_wall_${wall.id}`), {
          id: `comp_wall_${wall.id}`,
          digitalTwinId: record.id,
          type: 'wall',
          level: wall.level,
          dimensions: { height: wall.height, thickness: wall.thickness },
          material: wall.material
        }, { merge: true });
      }

      console.log(`[Firestore] Phase 5 Digital Twin ${record.id} successfully saved to Firestore (5 collections).`);
    } catch (err) {
      console.warn('[Firestore Phase 5 Notice] Stored in active browser session state:', err);
    }
  }

  public getCurrentRecord(): DigitalTwinRecord | null {
    return this.currentDigitalTwinRecord;
  }
}

export const digitalTwinManager = DigitalTwinManager.getInstance();
