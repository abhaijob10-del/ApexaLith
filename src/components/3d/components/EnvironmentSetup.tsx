import React from 'react';
import { ContactShadows, Sky } from '@react-three/drei';
import { ViewportSettings } from '../types/renderingTypes';

interface EnvironmentSetupProps {
  settings: ViewportSettings;
}

export const EnvironmentSetup: React.FC<EnvironmentSetupProps> = ({ settings }) => {
  return (
    <>
      {/* 1. LIGHTING ACCORDING TO PRESET */}
      {settings.lightingPreset === 'studio' && (
        <>
          <ambientLight intensity={0.6} color="#ffffff" />
          <directionalLight
            position={[12, 18, 10]}
            intensity={2.2}
            color="#fff2db"
            castShadow={settings.showShadows}
            shadow-mapSize={[2048, 2048]}
            shadow-bias={-0.0001}
          />
          <directionalLight position={[-10, 8, -8]} intensity={0.8} color="#8eb2ff" />
          <pointLight position={[0, 6, -6]} intensity={2.0} color="#b59b6d" />
        </>
      )}

      {settings.lightingPreset === 'architecturalDay' && (
        <>
          <ambientLight intensity={0.8} color="#e2eafc" />
          <directionalLight
            position={[20, 25, 15]}
            intensity={3.2}
            color="#fff8e7"
            castShadow={settings.showShadows}
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-12, 10, -10]} intensity={0.6} color="#b0c4de" />
          <Sky sunPosition={[100, 40, 100]} turbidity={0.5} rayleigh={0.5} />
        </>
      )}

      {settings.lightingPreset === 'sunset' && (
        <>
          <ambientLight intensity={0.4} color="#ffcca3" />
          <directionalLight
            position={[25, 6, 8]}
            intensity={3.8}
            color="#ff7b00"
            castShadow={settings.showShadows}
            shadow-mapSize={[2048, 2048]}
          />
          <directionalLight position={[-10, 12, -10]} intensity={0.6} color="#7a5299" />
          <Sky sunPosition={[100, 2, 50]} turbidity={8} rayleigh={4} />
        </>
      )}

      {settings.lightingPreset === 'cyberpunkNight' && (
        <>
          <ambientLight intensity={0.2} color="#1a102f" />
          <directionalLight position={[-10, 15, 10]} intensity={1.5} color="#00f0ff" castShadow={settings.showShadows} />
          <directionalLight position={[10, 8, -8]} intensity={2.0} color="#ff0055" />
          <pointLight position={[0, 4, 0]} intensity={4} color="#b59b6d" />
        </>
      )}

      {settings.lightingPreset === 'overcast' && (
        <>
          <ambientLight intensity={1.2} color="#d0d7de" />
          <directionalLight position={[5, 20, 5]} intensity={0.8} color="#f0f3f6" castShadow={settings.showShadows} />
        </>
      )}

      {/* 2. REALISTIC CONTACT SHADOWS AT GROUND LEVEL */}
      {settings.showShadows && (
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.65}
          scale={25}
          blur={1.8}
          far={10}
          resolution={1024}
          color="#000000"
        />
      )}

      {/* 3. STUDIO GROUND FLOOR */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial
          color={
            settings.environmentMode === 'cleanWhite'
              ? '#f4f5f8'
              : settings.environmentMode === 'darkLuxury'
                ? '#05070a'
                : settings.environmentMode === 'outdoorGrid'
                  ? '#1a2130'
                  : '#0d121d'
          }
          roughness={settings.environmentMode === 'darkLuxury' ? 0.15 : 0.25}
          metalness={settings.environmentMode === 'darkLuxury' ? 0.3 : 0.05}
        />
      </mesh>

      {/* 4. GRID HELPER */}
      {settings.showGrid && (
        <gridHelper args={[30, 30, '#b59b6d', '#222d3d']} position={[0, 0.001, 0]} />
      )}

      {/* 5. AXES HELPER */}
      {settings.showAxes && (
        <axesHelper args={[3]} position={[-8, 0.01, -8]} />
      )}
    </>
  );
};
