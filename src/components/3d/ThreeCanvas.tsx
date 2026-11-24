import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { 
  ViewportSettings, 
  RenderStats, 
  SelectedObjectInfo 
} from './types/renderingTypes';
import { ArchitecturalShowcaseModel } from './components/ArchitecturalShowcaseModel';
import { GLTFModelViewer } from './components/GLTFModelViewer';
import { EnvironmentSetup } from './components/EnvironmentSetup';
import { CameraControlsComponent } from './components/CameraControls';
import { PerformanceStatsTracker } from './components/PerformanceStats';

interface ThreeCanvasProps {
  settings: ViewportSettings;
  activeModelUrl?: string | null;
  onSelectObject: (info: SelectedObjectInfo | null) => void;
  onUpdateStats: (stats: RenderStats) => void;
  onLoadProgress: (percent: number) => void;
  onError: (error: string) => void;
  resetTrigger?: number;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  settings,
  activeModelUrl,
  onSelectObject,
  onUpdateStats,
  onLoadProgress,
  onError,
  resetTrigger = 0
}) => {
  return (
    <div className="relative w-full h-full bg-[#070A11] overflow-hidden">
      <Canvas
        shadows={settings.showShadows}
        camera={{ position: [7, 5, 8], fov: 45, near: 0.1, far: 1000 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        onPointerDown={(e) => {
          // Deselect when clicking background floor or empty space
          if (e.target === e.currentTarget) {
            onSelectObject(null);
          }
        }}
      >
        {/* Environment & Lighting Setup */}
        <EnvironmentSetup settings={settings} />

        {/* Camera Controls */}
        <CameraControlsComponent settings={settings} resetTrigger={resetTrigger} />

        {/* Performance Stats Tracker */}
        <PerformanceStatsTracker onUpdateStats={onUpdateStats} enabled={settings.showStats} />

        {/* 3D Model Rendering */}
        <Suspense fallback={null}>
          {activeModelUrl ? (
            <GLTFModelViewer
              url={activeModelUrl}
              onSelectObject={onSelectObject}
              showWireframe={settings.showWireframe}
              onLoadProgress={onLoadProgress}
              onError={onError}
            />
          ) : (
            <ArchitecturalShowcaseModel
              onSelectObject={onSelectObject}
              showWireframe={settings.showWireframe}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
