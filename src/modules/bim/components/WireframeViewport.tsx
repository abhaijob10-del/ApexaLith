import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BuildingModel } from '../types/BuildingModel';
import { GeometryConverter, WireframeGeometryData } from '../services/GeometryConverter';
import { Eye, Layers, Box, Tag, Maximize2, RefreshCw } from 'lucide-react';

interface WireframeViewportProps {
  buildingModel: BuildingModel;
  isDarkMode?: boolean;
}

export const WireframeViewport: React.FC<WireframeViewportProps> = ({
  buildingModel,
  isDarkMode = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Toggle Visibility States
  const [showWalls, setShowWalls] = useState(true);
  const [showDoorsWindows, setShowDoorsWindows] = useState(true);
  const [showBoundingBox, setShowBoundingBox] = useState(true);
  const [showFloors, setShowFloors] = useState(true);
  const [showRoomLabels, setShowRoomLabels] = useState(true);
  const [wireframeData, setWireframeData] = useState<WireframeGeometryData | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDarkMode ? 0x0A0D14 : 0xF8FAFC);
    sceneRef.current = scene;

    // Grid Helper
    const gridHelper = new THREE.GridHelper(50, 50, 0xB59B6D, isDarkMode ? 0x1E293B : 0xCBD5E1);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(25, 20, 25);
    cameraRef.current = camera;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // 5. Convert & Render Geometry
    const data = GeometryConverter.convertToWireframe(buildingModel);
    setWireframeData(data);

    // Group for building content
    const buildingGroup = new THREE.Group();
    buildingGroup.name = 'building_wireframe_group';

    // Add Wireframe Wall Boxes
    data.wallBoxes.forEach(box => buildingGroup.add(box));

    // Add Centerlines
    buildingGroup.add(data.wallLines);

    // Add Doors & Windows
    data.doorFrames.forEach(df => buildingGroup.add(df));
    data.windowFrames.forEach(wf => buildingGroup.add(wf));

    // Add Floor Level Grids
    data.floorPlanes.forEach(fp => buildingGroup.add(fp));

    // Add Bounding Box
    buildingGroup.add(data.boundingBox);

    scene.add(buildingGroup);

    // Center camera on building extents
    const [dimX, dimY, dimZ] = buildingModel.metadata.boundingExtent.dimensions;
    const maxDim = Math.max(dimX, dimY, dimZ, 10);
    camera.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 1.5);
    controls.target.set(
      (buildingModel.metadata.boundingExtent.min[0] + buildingModel.metadata.boundingExtent.max[0]) / 2,
      dimY / 2,
      (buildingModel.metadata.boundingExtent.min[2] + buildingModel.metadata.boundingExtent.max[2]) / 2
    );
    controls.update();

    // 6. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 500;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [buildingModel, isDarkMode]);

  // Update object visibility on state toggle
  useEffect(() => {
    if (!sceneRef.current) return;
    const group = sceneRef.current.getObjectByName('building_wireframe_group');
    if (!group) return;

    if (wireframeData) {
      wireframeData.wallBoxes.forEach(b => b.visible = showWalls);
      wireframeData.wallLines.visible = showWalls;
      wireframeData.doorFrames.forEach(d => d.visible = showDoorsWindows);
      wireframeData.windowFrames.forEach(w => w.visible = showDoorsWindows);
      wireframeData.floorPlanes.forEach(f => f.visible = showFloors);
      wireframeData.boundingBox.visible = showBoundingBox;
    }
  }, [showWalls, showDoorsWindows, showBoundingBox, showFloors, wireframeData]);

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const [dimX, dimY, dimZ] = buildingModel.metadata.boundingExtent.dimensions;
    const maxDim = Math.max(dimX, dimY, dimZ, 10);
    cameraRef.current.position.set(maxDim * 1.5, maxDim * 1.2, maxDim * 1.5);
    controlsRef.current.target.set(
      (buildingModel.metadata.boundingExtent.min[0] + buildingModel.metadata.boundingExtent.max[0]) / 2,
      dimY / 2,
      (buildingModel.metadata.boundingExtent.min[2] + buildingModel.metadata.boundingExtent.max[2]) / 2
    );
    controlsRef.current.update();
  };

  return (
    <div className={`relative w-full h-[520px] rounded-sm border overflow-hidden flex flex-col ${
      isDarkMode ? 'bg-[#0A0D14] border-white/10 text-white' : 'bg-slate-900 border-slate-700 text-slate-100'
    }`}>
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-sm bg-black/60 backdrop-blur-md border border-white/10 text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-widest bg-[#B59B6D]/20 text-[#B59B6D] border border-[#B59B6D]/30">
            Phase 3 Wireframe Preview
          </span>
          <span className="hidden sm:inline-block text-white/60">
            {buildingModel.building.name} ({buildingModel.walls.length} Walls, {buildingModel.doors.length} Doors, {buildingModel.windows.length} Windows)
          </span>
        </div>

        {/* View Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setShowWalls(!showWalls)}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 border transition ${
              showWalls ? 'bg-[#B59B6D] text-black border-[#B59B6D]' : 'bg-black/40 text-white/60 border-white/10'
            }`}
          >
            <Box className="w-3 h-3" />
            <span>Walls</span>
          </button>

          <button
            onClick={() => setShowDoorsWindows(!showDoorsWindows)}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 border transition ${
              showDoorsWindows ? 'bg-[#06B6D4] text-black border-[#06B6D4]' : 'bg-black/40 text-white/60 border-white/10'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Openings</span>
          </button>

          <button
            onClick={() => setShowFloors(!showFloors)}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 border transition ${
              showFloors ? 'bg-[#3B82F6] text-white border-[#3B82F6]' : 'bg-black/40 text-white/60 border-white/10'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Levels</span>
          </button>

          <button
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 border transition ${
              showBoundingBox ? 'bg-[#22C55E] text-black border-[#22C55E]' : 'bg-black/40 text-white/60 border-white/10'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span>BBox</span>
          </button>

          <button
            onClick={() => setShowRoomLabels(!showRoomLabels)}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1 border transition ${
              showRoomLabels ? 'bg-amber-500 text-black border-amber-500' : 'bg-black/40 text-white/60 border-white/10'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Labels</span>
          </button>

          <button
            onClick={handleResetCamera}
            className="p-1.5 rounded-sm bg-white/10 hover:bg-white/20 text-white border border-white/10 transition"
            title="Reset Orbit View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Canvas Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Room Label Badges */}
      {showRoomLabels && wireframeData && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {wireframeData.roomLabels.map((lbl, i) => (
            <div
              key={lbl.id || i}
              className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded bg-black/80 backdrop-blur-md border border-[#B59B6D] text-[10px] font-mono text-[#B59B6D] shadow-lg"
              style={{
                left: `${25 + (i % 3) * 28}%`,
                top: `${35 + Math.floor(i / 3) * 25}%`
              }}
            >
              <div className="font-bold uppercase tracking-wider">{lbl.name}</div>
              <div className="text-white/80">{lbl.areaSqM} m² ({Math.round(lbl.areaSqM * 10.764)} sq ft)</div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Legend */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between px-3 py-1.5 rounded-sm bg-black/70 backdrop-blur-md border border-white/10 text-[10px] text-white/70">
        <div className="flex items-center space-x-4 font-mono">
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#B59B6D] mr-1.5 inline-block" />Exterior Walls</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#64748B] mr-1.5 inline-block" />Interior Partitions</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] mr-1.5 inline-block" />Doors</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] mr-1.5 inline-block" />Windows</span>
          <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] mr-1.5 inline-block" />Bounding Box</span>
        </div>
        <div className="text-[#B59B6D] font-bold">
          Strict Wireframe Verification Mode
        </div>
      </div>
    </div>
  );
};
