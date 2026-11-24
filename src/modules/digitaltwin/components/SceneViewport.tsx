import React, { useState } from 'react';
import { ViewportSettings, RenderStats, SelectedObjectInfo } from '../../../components/3d/types/renderingTypes';
import { ViewportToolbar } from '../../../components/3d/ui/ViewportToolbar';
import { ViewportOverlay } from '../../../components/3d/ui/ViewportOverlay';
import { ThreeCanvas } from '../../../components/3d/ThreeCanvas';

interface SceneViewportProps {
  onOpenUploadCenter: () => void;
  onOpenCreateProject: () => void;
  onViewDemo: () => void;
  onSelectObject?: (info: SelectedObjectInfo | null) => void;
  activeModelUrl?: string | null;
  isDarkMode?: boolean;
}

export const SceneViewport: React.FC<SceneViewportProps> = ({
  onOpenUploadCenter,
  onOpenCreateProject,
  onViewDemo,
  onSelectObject,
  activeModelUrl,
  isDarkMode = true
}) => {
  // Viewport Settings State
  const [settings, setSettings] = useState<ViewportSettings>({
    showGrid: true,
    showAxes: true,
    showWireframe: false,
    showShadows: true,
    showStats: false,
    enableBloom: true,
    enableAO: true,
    enableDOF: false,
    lightingPreset: 'studio',
    environmentMode: 'studio',
    cameraPreset: 'perspective',
    cameraMode: 'orbit',
    autoRotate: false
  });

  // Scene Selection & Performance State
  const [selectedObject, setSelectedObject] = useState<SelectedObjectInfo | null>(null);
  const [stats, setStats] = useState<RenderStats | null>(null);
  const [loadingProgress, setLoadingProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleUpdateSettings = (newSettings: Partial<ViewportSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSelectObject = (info: SelectedObjectInfo | null) => {
    setSelectedObject(info);
    if (onSelectObject) {
      onSelectObject(info);
    }
  };

  const handleResetCamera = () => {
    setSettings((prev) => ({ ...prev, cameraPreset: 'perspective' }));
    setResetTrigger((prev) => prev + 1);
    onViewDemo();
  };

  return (
    <div className="relative flex-1 h-full flex flex-col overflow-hidden bg-[#070A11] border-r border-white/10">
      {/* 1. VIEWPORT CONTROLS HEADER TOOLBAR */}
      <ViewportToolbar
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetCamera={handleResetCamera}
        isDarkMode={isDarkMode}
      />

      {/* 2. CENTER 3D VIEWPORT CANVAS & OVERLAYS */}
      <div className="relative flex-1 h-full w-full">
        <ThreeCanvas
          settings={settings}
          activeModelUrl={activeModelUrl}
          onSelectObject={handleSelectObject}
          onUpdateStats={setStats}
          onLoadProgress={setLoadingProgress}
          onError={setErrorMessage}
          resetTrigger={resetTrigger}
        />

        {/* Floating Stats, Selected Object Badges & Loading Overlays */}
        <ViewportOverlay
          stats={stats}
          showStats={settings.showStats}
          selectedObject={selectedObject}
          onClearSelection={() => handleSelectObject(null)}
          loadingProgress={loadingProgress}
          errorMessage={errorMessage}
          onRetryLoading={() => {
            setErrorMessage(null);
            setLoadingProgress(0);
          }}
        />
      </div>
    </div>
  );
};
