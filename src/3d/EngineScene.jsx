import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';

import V8Engine from './V8Engine';
import InlineEngine from './InlineEngine';
import VEngine from './VEngine';
import BoxerEngine from './BoxerEngine';
import RadialEngine from './RadialEngine';
import WEngine from './WEngine';
import RotaryEngine from './RotaryEngine';
import SingleCylinderEngine from './SingleCylinderEngine';
import OpposedPistonEngine from './OpposedPistonEngine';
import EngineLabels from './EngineLabels';

// ── Preset Direction Vectors (Normalized) ───────────────────
const PRESET_DIRECTIONS = {
  Reset:      new THREE.Vector3(0.68, 0.48, 0.88).normalize(),
  Isometric:  new THREE.Vector3(1, 1, 1).normalize(),
  Front:      new THREE.Vector3(0, 0.12, 1).normalize(),
  Rear:       new THREE.Vector3(0, 0.12, -1).normalize(),
  Left:       new THREE.Vector3(-1, 0.12, 0).normalize(),
  Right:      new THREE.Vector3(1, 0.12, 0).normalize(),
  Top:        new THREE.Vector3(0, 1, 0.001).normalize(),
  Bottom:     new THREE.Vector3(0, -1, 0.001).normalize(),
};

// ── Dynamic Bounding-Box Auto-Fit Camera Controller ─────────
function AutoFitCameraController({ engineId, cameraView, resetSignal, engineGroupRef }) {
  const controlsRef = useRef();
  const { camera, size } = useThree();

  const fitCameraToEngine = () => {
    if (!engineGroupRef.current || !controlsRef.current) return;

    // 1. Calculate Bounding Box of active engine model group
    const box = new THREE.Box3().setFromObject(engineGroupRef.current);
    if (box.isEmpty()) return;

    // 2. Get Visual Center and Bounding Radius
    const center = new THREE.Vector3();
    box.getCenter(center);
    const boxSize = new THREE.Vector3();
    box.getSize(boxSize);

    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const radius = sphere.radius > 0 ? sphere.radius : Math.max(boxSize.x, boxSize.y, boxSize.z) / 2;

    // 3. Compute Distance based on Camera FOV and Aspect Ratio
    const fovRad = (camera.fov * Math.PI) / 180;
    const aspect = size.width / (size.height || 1);

    // Distance required vertically
    const distanceV = radius / Math.sin(fovRad / 2);
    // Distance required horizontally (crucial for vertical mobile screens aspect < 1.0)
    const distanceH = radius / Math.sin(Math.atan(Math.tan(fovRad / 2) * aspect));

    let distance = Math.max(distanceV, distanceH);

    // 4. Dynamic Responsive Screen Multipliers
    const isMobile = size.width <= 768;
    const isTablet = size.width > 768 && size.width <= 1024;
    const paddingFactor = isMobile ? 1.45 : isTablet ? 1.25 : 1.12;

    distance *= paddingFactor;

    // 5. Calculate Camera Target Position & Set Controls Target to Engine Center
    const dir = PRESET_DIRECTIONS[cameraView] || PRESET_DIRECTIONS.Reset;
    const targetPos = center.clone().add(dir.clone().multiplyScalar(distance));

    camera.position.copy(targetPos);
    controlsRef.current.target.copy(center);

    camera.near = Math.max(0.01, distance / 30);
    camera.far = distance * 30;
    camera.updateProjectionMatrix();

    controlsRef.current.update();
  };

  useEffect(() => {
    // Small timeout ensures 3D geometry hierarchy is mounted and populated
    const timer = setTimeout(() => {
      fitCameraToEngine();
    }, 50);
    return () => clearTimeout(timer);
  }, [engineId, cameraView, resetSignal, size.width, size.height]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.75}
      zoomSpeed={0.9}
      panSpeed={0.7}
      minDistance={1.2}
      maxDistance={40}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

// ── Scene Content ───────────────────────────────────────────
function SceneContent({
  engineId, explosion, selectedPartId, onSelectPart,
  isCutaway, isAnimated, animationSpeed, cameraView, showLabels,
  onCrankUpdate, resetSignal, theme,
}) {
  const engineGroupRef = useRef();

  const renderEngine = () => {
    const props = {
      explosion,
      selectedPartId,
      onSelectPart,
      isCutaway,
      isAnimated,
      animationSpeed,
      onCrankUpdate,
      resetSignal,
    };
    switch (engineId) {
      case 'inline-4':        return <InlineEngine {...props} />;
      case 'v6-dohc':         return <VEngine {...props} />;
      case 'boxer-4':         return <BoxerEngine {...props} />;
      case 'radial-7':        return <RadialEngine {...props} />;
      case 'w12':             return <WEngine {...props} />;
      case 'rotary-wankel':   return <RotaryEngine {...props} />;
      case 'single-cylinder': return <SingleCylinderEngine {...props} />;
      case 'opposed-piston':  return <OpposedPistonEngine {...props} />;
      case 'v8-ohv':
      default:                return <V8Engine {...props} />;
    }
  };

  const isLight = theme === 'light';
  const gridCellColor = isLight ? '#B0C0D0' : '#1E2B3A';
  const gridSectionColor = isLight ? '#8095AA' : '#2D3F54';
  const shadowColor = isLight ? '#475569' : '#080c18';

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="warehouse" />
      </Suspense>

      <ambientLight intensity={isLight ? 0.95 : 0.85} color={isLight ? '#ffffff' : '#e0e8f8'} />

      <directionalLight
        position={[6, 10, 6]}
        intensity={isLight ? 2.6 : 2.4}
        color="#fffff0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
      />

      <directionalLight position={[-5, 4, -4]} intensity={1.0} color="#b8d0f0" />
      <directionalLight position={[2, 3, -7]} intensity={1.2} color="#e0e8f8" />
      <directionalLight position={[0, -5, 0]} intensity={0.4} color="#8090a0" />
      <pointLight position={[0, -2.5, 0]} intensity={0.5} color="#506080" distance={9} decay={2} />

      <Grid
        position={[0, -2.3, 0]}
        args={[28, 28]}
        cellSize={0.4}
        cellThickness={0.5}
        cellColor={gridCellColor}
        sectionSize={2}
        sectionThickness={1.0}
        sectionColor={gridSectionColor}
        fadeDistance={20}
        fadeStrength={2.5}
        infiniteGrid
      />

      <ContactShadows
        position={[0, -2.28, 0]}
        opacity={isLight ? 0.35 : 0.55}
        scale={12}
        blur={3.0}
        far={3.5}
        color={shadowColor}
      />

      <AutoFitCameraController
        engineId={engineId}
        cameraView={cameraView}
        resetSignal={resetSignal}
        engineGroupRef={engineGroupRef}
      />

      <group ref={engineGroupRef}>
        {renderEngine()}
      </group>

      {showLabels && (
        <EngineLabels engineId={engineId} explosion={explosion} selectedPartId={selectedPartId} />
      )}
    </>
  );
}

// ── Main Export ─────────────────────────────────────────────
export default function EngineScene({
  engineId = 'v8-ohv',
  explosion = 0,
  selectedPartId = null,
  onSelectPart,
  isCutaway = false,
  isAnimated = false,
  animationSpeed = 1.0,
  cameraView = 'Reset',
  showLabels = false,
  onCrankUpdate = null,
  resetSignal = 0,
}) {
  const { theme } = useTheme();
  const wrapperRef = useRef();
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Container ResizeObserver for responsive WebGL canvas refitting
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          });
        }
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="engine-scene-wrapper"
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'var(--viewport-bg)', 
        position: 'relative',
        touchAction: 'none', // Capture 3D gestures without breaking page scrolling
        transition: 'background-color 0.25s ease'
      }}
    >
      <Canvas
        camera={{ position: [3.5, 2.8, 4.5], fov: 44, near: 0.05, far: 120 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === 'light' ? 1.15 : 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows="soft"
        onPointerMissed={() => onSelectPart && onSelectPart(null, null)}
      >
        <Suspense fallback={null}>
          <SceneContent
            engineId={engineId}
            explosion={explosion}
            selectedPartId={selectedPartId}
            onSelectPart={onSelectPart}
            isCutaway={isCutaway}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
            cameraView={cameraView}
            showLabels={showLabels}
            onCrankUpdate={onCrankUpdate}
            resetSignal={resetSignal}
            theme={theme}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
