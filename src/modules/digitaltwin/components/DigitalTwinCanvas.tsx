import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BuildingModel } from '../../bim/types/BuildingModel';
import { digitalTwinManager } from '../engine/DigitalTwinManager';
import { SelectionManager } from '../engine/SelectionManager';
import { ComponentMetadata, MeasurementItem, TimeOfDay } from '../types/digitalTwinTypes';
import { LightingManager } from '../engine/LightingManager';
import { CameraControlsComponent } from '../../../components/3d/components/CameraControls';
import { ViewportSettings, RenderStats, SelectedObjectInfo } from '../../../components/3d/types/renderingTypes';
import { PerformanceStatsTracker } from '../../../components/3d/components/PerformanceStats';

interface DigitalTwinCanvasProps {
  buildingModel: BuildingModel | null;
  settings: ViewportSettings;
  timeOfDay: TimeOfDay;
  hideWalls: boolean;
  showRoof: boolean;
  showCeilings: boolean;
  showSectionCut: boolean;
  sectionCutAxis: 'X' | 'Y' | 'Z';
  sectionCutOffset: number;
  selectedMeasurementTool: 'none' | 'distance' | 'room_size';
  measurements: MeasurementItem[];
  onAddMeasurement: (item: MeasurementItem) => void;
  onSelectComponent: (metadata: ComponentMetadata | null) => void;
  onUpdateStats: (stats: RenderStats) => void;
  resetTrigger?: number;
}

// Sub-component rendering the generated Three.js Scene Group
const SceneGroupRenderer: React.FC<{
  buildingModel: BuildingModel;
  hideWalls: boolean;
  showWireframe: boolean;
  showRoof: boolean;
  showCeilings: boolean;
  showSectionCut: boolean;
  sectionCutAxis: 'X' | 'Y' | 'Z';
  sectionCutOffset: number;
  timeOfDay: TimeOfDay;
  onSelectComponent: (metadata: ComponentMetadata | null) => void;
  selectedMeasurementTool: 'none' | 'distance' | 'room_size';
  onAddMeasurement: (item: MeasurementItem) => void;
}> = ({
  buildingModel,
  hideWalls,
  showWireframe,
  showRoof,
  showCeilings,
  showSectionCut,
  sectionCutAxis,
  sectionCutOffset,
  timeOfDay,
  onSelectComponent,
  selectedMeasurementTool,
  onAddMeasurement
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, gl } = useThree();
  const [clickPoints, setClickPoints] = useState<[number, number, number][]>([]);

  // Configure clipping plane for Section Cut
  useEffect(() => {
    if (showSectionCut) {
      gl.localClippingEnabled = true;
      const normal = sectionCutAxis === 'X' ? new THREE.Vector3(-1, 0, 0)
        : sectionCutAxis === 'Y' ? new THREE.Vector3(0, -1, 0)
        : new THREE.Vector3(0, 0, -1);
      
      const clippingPlane = new THREE.Plane(normal, sectionCutOffset);
      gl.clippingPlanes = [clippingPlane];
    } else {
      gl.clippingPlanes = [];
      gl.localClippingEnabled = false;
    }
  }, [showSectionCut, sectionCutAxis, sectionCutOffset, gl]);

  // Generate 3D digital twin group from digitalTwinManager
  useEffect(() => {
    if (!buildingModel) return;

    try {
      const { threeGroup } = digitalTwinManager.generateDigitalTwin(buildingModel, {
        hideWalls,
        showWireframe,
        showRoof,
        showCeilings
      });

      if (groupRef.current) {
        groupRef.current.clear();
        groupRef.current.add(threeGroup);
      }
    } catch (err) {
      console.warn('Digital Twin Mesh generation notice:', err);
    }
  }, [buildingModel, hideWalls, showWireframe, showRoof, showCeilings]);

  // Handle raycast click selection and measurement tool
  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    const clickedPoint: [number, number, number] = [
      Math.round(e.point.x * 100) / 100,
      Math.round(e.point.y * 100) / 100,
      Math.round(e.point.z * 100) / 100
    ];

    if (selectedMeasurementTool === 'distance') {
      const newPoints = [...clickPoints, clickedPoint];
      if (newPoints.length === 2) {
        const dx = newPoints[1][0] - newPoints[0][0];
        const dy = newPoints[1][1] - newPoints[0][1];
        const dz = newPoints[1][2] - newPoints[0][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const newMeasurement: MeasurementItem = {
          id: `meas_${Date.now()}`,
          type: 'distance',
          startPoint: newPoints[0],
          endPoint: newPoints[1],
          valueFormatted: `${dist.toFixed(2)} m`,
          label: `Distance (${dist.toFixed(2)} m)`
        };

        onAddMeasurement(newMeasurement);
        setClickPoints([]);
      } else {
        setClickPoints(newPoints);
      }
      return;
    }

    // Standard Object Selection
    if (e.object) {
      const metadata = SelectionManager.selectObject(e.object);
      onSelectComponent(metadata);
    } else {
      onSelectComponent(null);
    }
  };

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown} />
  );
};

// Main Canvas Wrapper
export const DigitalTwinCanvas: React.FC<DigitalTwinCanvasProps> = ({
  buildingModel,
  settings,
  timeOfDay,
  hideWalls,
  showRoof,
  showCeilings,
  showSectionCut,
  sectionCutAxis,
  sectionCutOffset,
  selectedMeasurementTool,
  measurements,
  onAddMeasurement,
  onSelectComponent,
  onUpdateStats,
  resetTrigger = 0
}) => {
  const lighting = LightingManager.getTimeOfDayPreset(timeOfDay);

  return (
    <div className="relative w-full h-full bg-[#070A11] overflow-hidden select-none">
      <Canvas
        shadows={settings.showShadows}
        camera={{ position: [14, 12, 16], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            onSelectComponent(null);
          }
        }}
      >
        {/* Dynamic Sky & Lighting */}
        <color attach="background" args={[lighting.skyColor]} />
        <ambientLight color={lighting.ambientColor} intensity={lighting.ambientIntensity} />
        
        <directionalLight
          position={lighting.sunPosition}
          color={lighting.sunColor}
          intensity={lighting.sunIntensity}
          castShadow={settings.showShadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={100}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
        />

        {/* Ground Floor Plane Grid */}
        {settings.showGrid && (
          <gridHelper args={[60, 60, '#334155', '#1E293B']} position={[0, -0.01, 0]} />
        )}

        {/* Camera Controls */}
        <CameraControlsComponent settings={settings} resetTrigger={resetTrigger} />

        {/* Performance Tracker */}
        <PerformanceStatsTracker onUpdateStats={onUpdateStats} enabled={settings.showStats} />

        {/* Scene Model Group */}
        <Suspense fallback={null}>
          {buildingModel ? (
            <SceneGroupRenderer
              buildingModel={buildingModel}
              hideWalls={hideWalls}
              showWireframe={settings.showWireframe}
              showRoof={showRoof}
              showCeilings={showCeilings}
              showSectionCut={showSectionCut}
              sectionCutAxis={sectionCutAxis}
              sectionCutOffset={sectionCutOffset}
              timeOfDay={timeOfDay}
              onSelectComponent={onSelectComponent}
              selectedMeasurementTool={selectedMeasurementTool}
              onAddMeasurement={onAddMeasurement}
            />
          ) : (
            <group>
              {/* Empty state ground floor representation */}
              <gridHelper args={[40, 40, '#475569', '#1E293B']} position={[0, 0, 0]} />
            </group>
          )}
        </Suspense>

        {/* 3D Rendered Measurements Overlay Lines */}
        {measurements.map((m) => (
          <line key={m.id}>
            <bufferGeometry
              attach="geometry"
              onUpdate={(geo) => {
                geo.setFromPoints([
                  new THREE.Vector3(...m.startPoint),
                  new THREE.Vector3(...m.endPoint)
                ]);
              }}
            />
            <lineBasicMaterial attach="material" color="#3B82F6" linewidth={3} />
          </line>
        ))}
      </Canvas>
    </div>
  );
};
