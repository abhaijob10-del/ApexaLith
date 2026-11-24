import React, { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RenderStats } from '../types/renderingTypes';

interface PerformanceStatsProps {
  onUpdateStats: (stats: RenderStats) => void;
  enabled: boolean;
}

export const PerformanceStatsTracker: React.FC<PerformanceStatsProps> = ({ onUpdateStats, enabled }) => {
  const { gl } = useThree();
  const lastTimeRef = React.useRef(performance.now());
  const frameCountRef = React.useRef(0);

  useFrame(() => {
    if (!enabled) return;

    frameCountRef.current += 1;
    const now = performance.now();
    const delta = now - lastTimeRef.current;

    if (delta >= 500) { // Update every 500ms
      const fps = Math.round((frameCountRef.current * 1000) / delta);
      const info = gl.info;

      const stats: RenderStats = {
        fps,
        triangles: info.render.triangles,
        drawCalls: info.render.calls,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
        frameTimeMs: parseFloat((delta / frameCountRef.current).toFixed(1)),
        memoryMb: parseFloat((((window as any).performance?.memory?.usedJSHeapSize || 25000000) / (1024 * 1024)).toFixed(1))
      };

      onUpdateStats(stats);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  return null;
};
