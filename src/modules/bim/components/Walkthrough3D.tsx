import React from 'react';
import { DigitalTwinStudio } from '../../digitaltwin/components/DigitalTwinStudio';

export interface Walkthrough3DProps {
  isDarkMode: boolean;
}

export const Walkthrough3D: React.FC<Walkthrough3DProps> = ({ isDarkMode }) => {
  return <DigitalTwinStudio isDarkMode={isDarkMode} />;
};

export default Walkthrough3D;
