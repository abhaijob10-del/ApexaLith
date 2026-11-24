import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Box, 
  Sun, 
  Moon, 
  RotateCw, 
  Lock,
  Compass,
  Play,
  Eye,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onOpenEstimator: () => void;
  onOpenAuth: () => void;
  onNavigateTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onOpenEstimator,
  onOpenAuth,
  onNavigateTab,
  isDarkMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // 3D Scene Interactive Controls State
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [lightingMode, setLightingMode] = useState<'sunset' | 'night' | 'day'>('sunset');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Three.js object refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const villaGroupRef = useRef<THREE.Group | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro Text Fade Up
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', delay: 0.1 }
      );

      gsap.fromTo(
        subheadRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 }
      );

      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      );

      // GSAP ScrollTrigger 3D Camera & Construction Assembly Scrub Effect
      if (sectionRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
          onUpdate: (self) => {
            const p = self.progress;
            if (cameraRef.current && villaGroupRef.current) {
              // Smooth camera orbit & zoom into villa cantilever master wing
              cameraRef.current.position.x = Math.sin(p * Math.PI * 0.4) * 16;
              cameraRef.current.position.z = Math.cos(p * Math.PI * 0.4) * 20 - p * 4;
              cameraRef.current.position.y = 8 - p * 3;
              cameraRef.current.lookAt(0, 3, 0);

              // Subtle structural assembly expansion animation on scroll
              villaGroupRef.current.children.forEach((child, idx) => {
                if (child.userData?.initialY !== undefined) {
                  const delayFactor = (idx % 5) * 0.1;
                  const stepP = Math.min(1, Math.max(0, (p - delayFactor) / 0.5));
                  child.position.y = child.userData.initialY + (1 - stepP) * (5 + idx * 0.5);
                }
              });
            }
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Initialize Three.js 3D Realistic Villa Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 650;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgColor = isDarkMode 
      ? (lightingMode === 'night' ? 0x04060b : lightingMode === 'sunset' ? 0x090d16 : 0x0d121d) 
      : (lightingMode === 'night' ? 0x1e293b : 0xf1f5f9);

    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 2.5, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambLight = new THREE.AmbientLight(
      lightingMode === 'night' ? 0x38bdf8 : lightingMode === 'sunset' ? 0xffedd5 : 0xffffff, 
      lightingMode === 'night' ? 0.4 : 0.9
    );
    scene.add(ambLight);

    const sunLight = new THREE.DirectionalLight(
      lightingMode === 'night' ? 0x60a5fa : lightingMode === 'sunset' ? 0xf59e0b : 0xffffff, 
      lightingMode === 'night' ? 0.8 : 2.2
    );
    sunLight.position.set(18, 28, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Warm Interior Point Lights (Pours soft golden light through glass windows)
    const interiorLight1 = new THREE.PointLight(0xfbbf24, 3, 12);
    interiorLight1.position.set(0, 2.5, 0);
    scene.add(interiorLight1);

    const interiorLight2 = new THREE.PointLight(0xf59e0b, 2.5, 10);
    interiorLight2.position.set(-2, 5.5, 1);
    scene.add(interiorLight2);

    // Pool Blue Reflection Light
    const poolLight = new THREE.PointLight(0x0284c7, 2, 10);
    poolLight.position.set(4, 0.8, 5);
    scene.add(poolLight);

    // 5. Grid Foundation Base
    const gridHelper = new THREE.GridHelper(50, 50, 0xb59b6d, isDarkMode ? 0x1e293b : 0xcb2e6);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 6. Villa Group Construction
    const villaGroup = new THREE.Group();
    villaGroupRef.current = villaGroup;

    // Materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: isDarkMode ? 0x1e293b : 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.1,
      wireframe: wireframeMode
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xb59b6d,
      roughness: 0.2,
      metalness: 0.85,
      wireframe: wireframeMode
    });

    const timberMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.6,
      metalness: 0.05,
      wireframe: wireframeMode
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.9,
      reflectivity: 0.9
    });

    const poolWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transmission: 0.8,
      opacity: 0.85,
      transparent: true,
      roughness: 0.05,
      metalness: 0.3
    });

    // A. Main Site Concrete Podium Base Slab (18m x 0.6m x 14m)
    const basePodium = new THREE.Mesh(new THREE.BoxGeometry(18, 0.6, 14), concreteMat);
    basePodium.position.set(0, 0.3, 0);
    basePodium.userData = { initialY: 0.3 };
    basePodium.receiveShadow = true;
    basePodium.castShadow = true;
    villaGroup.add(basePodium);

    // B. Infinity Reflecting Pool Cutout
    const poolMesh = new THREE.Mesh(new THREE.BoxGeometry(8, 0.4, 4.5), poolWaterMat);
    poolMesh.position.set(4, 0.5, 4.5);
    poolMesh.userData = { initialY: 0.5 };
    villaGroup.add(poolMesh);

    // C. Structural Steel I-Beam Columns Grid
    const colLocations = [
      [-7, -4], [-7, 2], [1, -4], [1, 2], [7, -4], [7, 2]
    ];
    colLocations.forEach(([cx, cz], i) => {
      const column = new THREE.Mesh(new THREE.BoxGeometry(0.35, 6.5, 0.35), bronzeMat);
      column.position.set(cx, 3.55, cz);
      column.userData = { initialY: 3.55 };
      column.castShadow = true;
      villaGroup.add(column);
    });

    // D. Ground Floor Living Pavilion - Concrete Floor Slab & Glass Curtain Walls
    const gfFloorSlab = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 10), concreteMat);
    gfFloorSlab.position.set(-1, 0.8, -1);
    gfFloorSlab.userData = { initialY: 0.8 };
    gfFloorSlab.receiveShadow = true;
    gfFloorSlab.castShadow = true;
    villaGroup.add(gfFloorSlab);

    // Glass Curtain Wall Enclosure
    const glassWalls = new THREE.Mesh(new THREE.BoxGeometry(11, 2.8, 8), glassMat);
    glassWalls.position.set(-1, 2.4, -1);
    glassWalls.userData = { initialY: 2.4 };
    villaGroup.add(glassWalls);

    // Window Mullion Frame Grids (Horizontal & Vertical Bronze Trims)
    for (let offset of [-3.5, 0, 3.5]) {
      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.8, 0.1), bronzeMat);
      mullion.position.set(-1 + offset, 2.4, 3.05);
      mullion.userData = { initialY: 2.4 };
      villaGroup.add(mullion);
    }

    // E. Level 2 Cantilever Master Wing Pod (Overhanging forward over pool)
    const upperWing = new THREE.Mesh(new THREE.BoxGeometry(12, 2.6, 8), concreteMat);
    upperWing.position.set(1, 5.1, 1);
    upperWing.userData = { initialY: 5.1 };
    upperWing.castShadow = true;
    upperWing.receiveShadow = true;
    villaGroup.add(upperWing);

    // Timber Louver Facade Screen Array on Upper Wing
    const louverGroup = new THREE.Group();
    for (let lx = -4.5; lx <= 4.5; lx += 0.4) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.4, 0.25), timberMat);
      slat.position.set(lx, 0, 0);
      slat.castShadow = true;
      louverGroup.add(slat);
    }
    louverGroup.position.set(1, 5.1, 5.05);
    louverGroup.userData = { initialY: 5.1 };
    villaGroup.add(louverGroup);

    // F. Cantilever Roof Overhang & Soffit
    const roofCanopy = new THREE.Mesh(new THREE.BoxGeometry(15, 0.35, 11), concreteMat);
    roofCanopy.position.set(0.5, 6.5, 0.5);
    roofCanopy.userData = { initialY: 6.5 };
    roofCanopy.castShadow = true;
    villaGroup.add(roofCanopy);

    // Bronze Trim Edge Cap along Roof Canopy
    const roofTrim = new THREE.Mesh(new THREE.BoxGeometry(15.2, 0.1, 11.2), bronzeMat);
    roofTrim.position.set(0.5, 6.68, 0.5);
    roofTrim.userData = { initialY: 6.68 };
    villaGroup.add(roofTrim);

    scene.add(villaGroup);

    // Mouse Parallax movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = mountRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current.targetX = x * 0.8;
      mouseRef.current.targetY = y * 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Render Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth Mouse Parallax Interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (villaGroupRef.current) {
        if (autoRotate) {
          villaGroupRef.current.rotation.y += 0.0025;
        }
        villaGroupRef.current.rotation.x = mouseRef.current.y * 0.1;
        villaGroupRef.current.rotation.z = mouseRef.current.x * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Window Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 650;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, [isDarkMode, lightingMode, wireframeMode]);

  return (
    <section 
      ref={sectionRef} 
      className={`relative min-h-[90vh] flex flex-col justify-between overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-[#07090e] text-[#F5F5F0]' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 3D WebGL Background Canvas Mount */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" 
      />

      {/* Subtle Vignette Overlay */}
      <div className={`absolute inset-0 pointer-events-none z-10 ${
        isDarkMode 
          ? 'bg-gradient-to-t from-[#07090e] via-transparent to-[#07090e]/80' 
          : 'bg-gradient-to-t from-slate-50 via-transparent to-slate-100/60'
      }`} />

      {/* Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 w-full flex-1 flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-sm border border-[#B59B6D]/40 bg-[#07090e]/80 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#B59B6D] animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#B59B6D]">
              Next-Gen Architectural Engineering
            </span>
          </div>

          {/* Interactive 3D Controls Bar */}
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-sm border backdrop-blur-md ${
            isDarkMode ? 'bg-black/60 border-white/10' : 'bg-white/80 border-slate-300 shadow-sm'
          }`}>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#B59B6D] font-bold mr-1">3D Controls:</span>
            
            <button
              onClick={() => setLightingMode(lightingMode === 'sunset' ? 'night' : lightingMode === 'night' ? 'day' : 'sunset')}
              className={`p-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1 border ${
                lightingMode === 'sunset' ? 'border-[#B59B6D] text-[#B59B6D]' : 'border-white/10 text-slate-400'
              }`}
              title="Toggle Day / Sunset / Night Lighting"
            >
              <Sun className="w-3.5 h-3.5 text-[#B59B6D]" />
              <span className="hidden sm:inline capitalize">{lightingMode}</span>
            </button>

            <button
              onClick={() => setWireframeMode(!wireframeMode)}
              className={`p-1.5 rounded-sm text-xs font-bold uppercase flex items-center space-x-1 border ${
                wireframeMode ? 'border-[#B59B6D] bg-[#B59B6D] text-black' : 'border-white/20 text-slate-400'
              }`}
              title="Toggle Wireframe Structural Mesh"
            >
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wireframe</span>
            </button>

            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-1.5 rounded-sm text-xs font-bold flex items-center space-x-1 border ${
                autoRotate ? 'border-[#B59B6D] text-[#B59B6D]' : 'border-white/20 text-slate-400'
              }`}
              title="Toggle Auto Rotation"
            >
              <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Hero Title & Main Call to Action */}
        <div className="max-w-3xl my-auto py-10 space-y-6">
          <h1 
            ref={headlineRef}
            className={`font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            Sculpting <span className="italic font-normal text-[#B59B6D]">Monolithic</span> Precision Architecture.
          </h1>

          <p 
            ref={subheadRef}
            className={`text-base sm:text-lg max-w-2xl leading-relaxed font-normal ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            ApexaLith integrates AI structural calculation, post-tensioned cantilever engineering, and bespoke luxury fabrication into an uncompromised architectural workflow.
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3.5 rounded-sm bg-[#B59B6D] hover:bg-[#c4ab7d] text-black font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center space-x-2 shadow-xl hover:scale-105"
            >
              <span>Schedule VIP Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('walkthrough')}
              className={`px-6 py-3.5 rounded-sm border text-xs uppercase tracking-[0.2em] font-bold transition-all duration-300 flex items-center space-x-2 backdrop-blur-md ${
                isDarkMode 
                  ? 'border-white/30 text-white hover:bg-white/10 hover:border-[#B59B6D]' 
                  : 'border-slate-400 text-slate-800 hover:bg-slate-200/80 hover:border-[#B59B6D]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#B59B6D]" />
              <span>Explore 3D Studio</span>
            </button>

            <button
              onClick={onOpenEstimator}
              className={`px-5 py-3.5 rounded-sm border border-[#B59B6D]/40 text-[#B59B6D] hover:bg-[#B59B6D]/10 text-xs uppercase tracking-[0.2em] font-bold transition-all backdrop-blur-md`}
            >
              <span>Cost Estimator</span>
            </button>
          </div>
        </div>

        {/* Bottom Feature Metrics Bar */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-sm border backdrop-blur-md z-20 ${
          isDarkMode ? 'bg-[#0D0D0D]/80 border-white/10 text-white' : 'bg-white/90 border-slate-300 text-slate-900 shadow-lg'
        }`}>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B59B6D]">Completed Estates</span>
            <div className="text-xl font-serif font-bold text-[#B59B6D]">140+ Luxury Units</div>
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Zero Delay Track Record</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B59B6D]">Structural Engineering</span>
            <div className="text-xl font-serif font-bold">Post-Tension Cantilevers</div>
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Up to 12m Free Spans</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B59B6D]">3D BIM & Digital Twin</span>
            <div className="text-xl font-serif font-bold">100% Real-Time Twin</div>
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Millimeter Precision CAD</span>
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-[#B59B6D]">Vault Security</span>
            <div className="text-xl font-serif font-bold">Role-Based Access</div>
            <span className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Encrypted Financials</span>
          </div>
        </div>
      </div>
    </section>
  );
};
