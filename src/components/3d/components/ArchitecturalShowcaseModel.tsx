import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SelectedObjectInfo } from '../types/renderingTypes';

interface ShowcaseModelProps {
  onSelectObject?: (info: SelectedObjectInfo | null) => void;
  showWireframe?: boolean;
}

export const ArchitecturalShowcaseModel: React.FC<ShowcaseModelProps> = ({
  onSelectObject,
  showWireframe = false
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredMesh, setHoveredMesh] = useState<string | null>(null);

  // Subtle floating animation for high-end showcase effect
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    }
  });

  // Helper to handle object picking
  const handlePointerDown = (
    e: any,
    name: string,
    materialName: string,
    polyCount: number,
    dims: { x: number; y: number; z: number }
  ) => {
    e.stopPropagation();
    if (onSelectObject) {
      const point = e.point || new THREE.Vector3(0, 1, 0);
      onSelectObject({
        id: `obj_${name.toLowerCase().replace(/\s+/g, '_')}`,
        name,
        type: 'Architectural Element',
        materialName,
        polygonCount: polyCount,
        dimensions: dims,
        position: { x: parseFloat(point.x.toFixed(2)), y: parseFloat(point.y.toFixed(2)), z: parseFloat(point.z.toFixed(2)) },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 }
      });
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} dispose={null}>
      {/* 1. ARCHITECTURAL PEDESTAL BASE */}
      <mesh
        position={[0, 0.1, 0]}
        receiveShadow
        castShadow
        onPointerOver={() => setHoveredMesh('Pedestal')}
        onPointerOut={() => setHoveredMesh(null)}
        onPointerDown={(e) =>
          handlePointerDown(e, 'Low-Profile Architectural Pedestal', 'Monolithic Dark Concrete', 128, { x: 4.5, y: 0.2, z: 4.5 })
        }
      >
        <cylinderGeometry args={[2.5, 2.7, 0.2, 64]} />
        <meshStandardMaterial
          color={hoveredMesh === 'Pedestal' ? '#333e50' : '#141a26'}
          roughness={0.4}
          metalness={0.2}
          wireframe={showWireframe}
        />
      </mesh>

      {/* 2. LUXURY ITALIAN LEATHER LOUNGE ARMCHAIR */}
      <group position={[-0.8, 0.2, 0]}>
        {/* Chair Seat Cushion */}
        <mesh
          position={[0, 0.45, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => setHoveredMesh('Seat')}
          onPointerOut={() => setHoveredMesh(null)}
          onPointerDown={(e) =>
            handlePointerDown(e, 'Full-Grain Italian Leather Cushion', 'Cognac Tan Nappa Leather', 512, { x: 1.4, y: 0.3, z: 1.3 })
          }
        >
          <boxGeometry args={[1.4, 0.3, 1.3, 16, 8, 16]} />
          <meshStandardMaterial
            color={hoveredMesh === 'Seat' ? '#c89d62' : '#a8783e'}
            roughness={0.35}
            metalness={0.1}
            wireframe={showWireframe}
          />
        </mesh>

        {/* Chair Backrest */}
        <mesh
          position={[0, 0.95, -0.55]}
          rotation={[0.15, 0, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => setHoveredMesh('Backrest')}
          onPointerOut={() => setHoveredMesh(null)}
          onPointerDown={(e) =>
            handlePointerDown(e, 'Curved Backrest Panel', 'Cognac Tan Nappa Leather', 384, { x: 1.4, y: 0.8, z: 0.25 })
          }
        >
          <boxGeometry args={[1.4, 0.8, 0.25, 16, 16, 8]} />
          <meshStandardMaterial
            color={hoveredMesh === 'Backrest' ? '#c89d62' : '#966731'}
            roughness={0.38}
            metalness={0.1}
            wireframe={showWireframe}
          />
        </mesh>

        {/* Armrest Left */}
        <mesh
          position={[-0.72, 0.65, 0]}
          castShadow
          receiveShadow
          onPointerDown={(e) =>
            handlePointerDown(e, 'Left Armrest Pad', 'Cognac Tan Nappa Leather', 256, { x: 0.2, y: 0.45, z: 1.3 })
          }
        >
          <boxGeometry args={[0.2, 0.45, 1.3]} />
          <meshStandardMaterial color="#885b27" roughness={0.4} wireframe={showWireframe} />
        </mesh>

        {/* Armrest Right */}
        <mesh
          position={[0.72, 0.65, 0]}
          castShadow
          receiveShadow
          onPointerDown={(e) =>
            handlePointerDown(e, 'Right Armrest Pad', 'Cognac Tan Nappa Leather', 256, { x: 0.2, y: 0.45, z: 1.3 })
          }
        >
          <boxGeometry args={[0.2, 0.45, 1.3]} />
          <meshStandardMaterial color="#885b27" roughness={0.4} wireframe={showWireframe} />
        </mesh>

        {/* Chair Legs (Brushed Steel Frame) */}
        {[
          [-0.65, 0.15, 0.55],
          [0.65, 0.15, 0.55],
          [-0.65, 0.15, -0.55],
          [0.65, 0.15, -0.55],
        ].map((pos, idx) => (
          <mesh key={idx} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.03, 0.02, 0.3, 16]} />
            <meshStandardMaterial color="#2a2e38" metalness={0.9} roughness={0.2} wireframe={showWireframe} />
          </mesh>
        ))}
      </group>

      {/* 3. POLISHED CARRARA MARBLE COFFEE TABLE */}
      <group position={[1.0, 0.2, 0.2]}>
        {/* Table Marble Top */}
        <mesh
          position={[0, 0.42, 0]}
          castShadow
          receiveShadow
          onPointerOver={() => setHoveredMesh('TableTop')}
          onPointerOut={() => setHoveredMesh(null)}
          onPointerDown={(e) =>
            handlePointerDown(e, 'Polished Carrara Marble Slab', 'Calacatta White Polished Marble', 384, { x: 1.3, y: 0.08, z: 1.3 })
          }
        >
          <cylinderGeometry args={[0.75, 0.75, 0.08, 48]} />
          <meshStandardMaterial
            color={hoveredMesh === 'TableTop' ? '#ffffff' : '#f0f2f5'}
            roughness={0.12}
            metalness={0.05}
            envMapIntensity={2.0}
            wireframe={showWireframe}
          />
        </mesh>

        {/* Table Pedestal Leg */}
        <mesh
          position={[0, 0.2, 0]}
          castShadow
          onPointerDown={(e) =>
            handlePointerDown(e, 'Conical Table Base', 'Brushed Gold Anodized Aluminum', 256, { x: 0.6, y: 0.4, z: 0.6 })
          }
        >
          <coneGeometry args={[0.35, 0.4, 32]} />
          <meshStandardMaterial
            color="#b59b6d"
            metalness={0.85}
            roughness={0.25}
            wireframe={showWireframe}
          />
        </mesh>
      </group>

      {/* 4. MODERN ARCHITECTURAL BRASS FLOOR LAMP */}
      <group position={[1.4, 0.2, -1.0]}>
        {/* Lamp Base */}
        <mesh
          position={[0, 0.03, 0]}
          castShadow
          onPointerDown={(e) =>
            handlePointerDown(e, 'Heavy Brass Lamp Base', 'Brushed Champagne Gold', 128, { x: 0.5, y: 0.06, z: 0.5 })
          }
        >
          <cylinderGeometry args={[0.25, 0.25, 0.06, 32]} />
          <meshStandardMaterial color="#b59b6d" metalness={0.9} roughness={0.2} wireframe={showWireframe} />
        </mesh>

        {/* Vertical Lamp Stem */}
        <mesh
          position={[0, 1.2, 0]}
          castShadow
          onPointerDown={(e) =>
            handlePointerDown(e, 'Floor Lamp Shaft', 'Brushed Champagne Gold', 128, { x: 0.03, y: 2.3, z: 0.03 })
          }
        >
          <cylinderGeometry args={[0.015, 0.02, 2.3, 16]} />
          <meshStandardMaterial color="#b59b6d" metalness={0.9} roughness={0.2} wireframe={showWireframe} />
        </mesh>

        {/* Curved Arch Arc */}
        <mesh
          position={[-0.35, 2.3, 0.2]}
          rotation={[0, 0, Math.PI / 4]}
          castShadow
        >
          <torusGeometry args={[0.5, 0.015, 16, 32, Math.PI / 1.5]} />
          <meshStandardMaterial color="#b59b6d" metalness={0.9} roughness={0.2} wireframe={showWireframe} />
        </mesh>

        {/* Lamp Shade Dome */}
        <mesh
          position={[-0.6, 2.15, 0.4]}
          castShadow
          onPointerOver={() => setHoveredMesh('LampShade')}
          onPointerOut={() => setHoveredMesh(null)}
          onPointerDown={(e) =>
            handlePointerDown(e, 'Diffuser Shade Dome', 'Matte Black Anodized Aluminum', 256, { x: 0.35, y: 0.2, z: 0.35 })
          }
        >
          <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={hoveredMesh === 'LampShade' ? '#222d3d' : '#141822'}
            roughness={0.3}
            metalness={0.6}
            side={THREE.DoubleSide}
            wireframe={showWireframe}
          />
        </mesh>

        {/* Glowing Warm Light Bulb Point */}
        <mesh position={[-0.6, 2.1, 0.4]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#ffe8b3" />
        </mesh>
        <pointLight position={[-0.6, 2.05, 0.4]} intensity={4.0} color="#ffdfa3" distance={6} castShadow />
      </group>
    </group>
  );
};
