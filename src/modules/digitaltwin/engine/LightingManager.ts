import * as THREE from 'three';
import { TimeOfDay } from '../types/digitalTwinTypes';

export class LightingManager {
  /**
   * Applies lighting and background parameters for time of day
   */
  public static getTimeOfDayPreset(time: TimeOfDay): {
    sunPosition: [number, number, number];
    sunColor: string;
    sunIntensity: number;
    ambientColor: string;
    ambientIntensity: number;
    skyColor: string;
    groundColor: string;
  } {
    switch (time) {
      case 'morning':
        return {
          sunPosition: [25, 12, 18],
          sunColor: '#FFD1A4',
          sunIntensity: 1.8,
          ambientColor: '#E2E8F0',
          ambientIntensity: 0.6,
          skyColor: '#93C5FD',
          groundColor: '#475569'
        };
      case 'afternoon':
        return {
          sunPosition: [10, 35, 15],
          sunColor: '#FFFDF0',
          sunIntensity: 2.2,
          ambientColor: '#F8FAFC',
          ambientIntensity: 0.7,
          skyColor: '#60A5FA',
          groundColor: '#334155'
        };
      case 'evening':
        return {
          sunPosition: [-30, 8, -12],
          sunColor: '#FF7E47',
          sunIntensity: 1.5,
          ambientColor: '#FED7AA',
          ambientIntensity: 0.5,
          skyColor: '#3B82F6',
          groundColor: '#1E293B'
        };
      case 'night':
      default:
        return {
          sunPosition: [-10, 2, -20],
          sunColor: '#38BDF8',
          sunIntensity: 0.4,
          ambientColor: '#1E293B',
          ambientIntensity: 0.2,
          skyColor: '#0F172A',
          groundColor: '#020617'
        };
    }
  }
}
