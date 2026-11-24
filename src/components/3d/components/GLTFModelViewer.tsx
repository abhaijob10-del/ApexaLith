import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { SelectedObjectInfo } from '../types/renderingTypes';

interface GLTFModelViewerProps {
  url: string;
  onSelectObject?: (info: SelectedObjectInfo | null) => void;
  showWireframe?: boolean;
  onLoadProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export const GLTFModelViewer: React.FC<GLTFModelViewerProps> = ({
  url,
  onSelectObject,
  showWireframe = false,
  onLoadProgress,
  onError
}) => {
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      url,
      (gltf) => {
        if (!isMounted) return;

        // Auto-center and fit model bounds
        const box = new THREE.Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 5 / maxDim : 1;

        gltf.scene.position.sub(center.multiplyScalar(scale));
        gltf.scene.position.y += (size.y * scale) / 2;
        gltf.scene.scale.set(scale, scale, scale);

        // Enable shadows and wireframe toggle
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (showWireframe && (child as THREE.Mesh).material) {
              const mat = (child as THREE.Mesh).material;
              if (Array.isArray(mat)) {
                mat.forEach((m: any) => { if ('wireframe' in m) m.wireframe = showWireframe; });
              } else if ('wireframe' in mat) {
                (mat as any).wireframe = showWireframe;
              }
            }
          }
        });

        setModelScene(gltf.scene);
        if (onLoadProgress) onLoadProgress(100);
      },
      (xhr) => {
        if (xhr.lengthComputable && onLoadProgress) {
          const percent = Math.round((xhr.loaded / xhr.total) * 100);
          onLoadProgress(percent);
        }
      },
      (err: any) => {
        console.error(`[GLTFModelViewer] Error loading ${url}:`, err);
        if (onError) onError(`Failed to load 3D file: ${err?.message || 'Invalid format'}`);
      }
    );

    return () => {
      isMounted = false;
      dracoLoader.dispose();
      if (modelScene) {
        modelScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).geometry?.dispose();
            const mat = (child as THREE.Mesh).material;
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
            else mat?.dispose();
          }
        });
      }
    };
  }, [url, showWireframe]);

  if (!modelScene) return null;

  return (
    <primitive
      object={modelScene}
      onPointerDown={(e: any) => {
        e.stopPropagation();
        if (onSelectObject && e.object) {
          const mesh = e.object as THREE.Mesh;
          const box = new THREE.Box3().setFromObject(mesh);
          const size = box.getSize(new THREE.Vector3());

          let materialName = 'Standard Material';
          if (mesh.material) {
            materialName = Array.isArray(mesh.material)
              ? mesh.material.map((m) => m.name || 'Material').join(', ')
              : mesh.material.name || 'Standard Material';
          }

          onSelectObject({
            id: `mesh_${mesh.id}`,
            name: mesh.name || 'BIM Structural Element',
            type: 'BIM / CAD Component',
            materialName,
            polygonCount: mesh.geometry ? Math.round(mesh.geometry.attributes.position.count / 3) : 0,
            dimensions: {
              x: parseFloat(size.x.toFixed(2)),
              y: parseFloat(size.y.toFixed(2)),
              z: parseFloat(size.z.toFixed(2))
            },
            position: {
              x: parseFloat(mesh.position.x.toFixed(2)),
              y: parseFloat(mesh.position.y.toFixed(2)),
              z: parseFloat(mesh.position.z.toFixed(2))
            },
            rotation: {
              x: parseFloat(mesh.rotation.x.toFixed(2)),
              y: parseFloat(mesh.rotation.y.toFixed(2)),
              z: parseFloat(mesh.rotation.z.toFixed(2))
            },
            scale: {
              x: parseFloat(mesh.scale.x.toFixed(2)),
              y: parseFloat(mesh.scale.y.toFixed(2)),
              z: parseFloat(mesh.scale.z.toFixed(2))
            }
          });
        }
      }}
    />
  );
};
