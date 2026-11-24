import React, { useRef, useEffect } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraPreset, ViewportSettings } from '../types/renderingTypes';

interface CameraControlsProps {
  settings: ViewportSettings;
  resetTrigger?: number;
}

export const CameraControlsComponent: React.FC<CameraControlsProps> = ({ settings, resetTrigger = 0 }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Handle Preset Changes
  useEffect(() => {
    if (!controlsRef.current) return;

    const target = new THREE.Vector3(0, 0.8, 0);

    switch (settings.cameraPreset) {
      case 'perspective':
        camera.position.set(7, 5, 8);
        break;
      case 'top':
        camera.position.set(0, 15, 0.001);
        break;
      case 'front':
        camera.position.set(0, 2.5, 10);
        break;
      case 'side':
        camera.position.set(10, 2.5, 0);
        break;
      case 'isometric':
        camera.position.set(9, 9, 9);
        break;
      case 'dollhouse':
        camera.position.set(8, 12, 8);
        break;
    }

    controlsRef.current.target.copy(target);
    camera.lookAt(target);
    controlsRef.current.update();
  }, [settings.cameraPreset, camera]);

  // Handle Manual Reset Trigger
  useEffect(() => {
    if (resetTrigger > 0 && controlsRef.current) {
      camera.position.set(7, 5, 8);
      controlsRef.current.target.set(0, 0.8, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={1.5}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2 + 0.05} // Prevent camera from going under ground plane
      autoRotate={settings.autoRotate}
      autoRotateSpeed={1.0}
    />
  );
};
