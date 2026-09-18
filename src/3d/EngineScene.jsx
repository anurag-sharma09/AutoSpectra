import React, { useRef, useEffect, Suspense } from 'react';
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

// ── Camera presets ──────────────────────────────────────────
const CAMERA_PRESETS = {
  Reset:      [3.5, 2.8, 4.5],
  Front:      [0, 0.5, 7],
  Rear:       [0, 0.5, -7],
  Left:       [-7, 0.5, 0],
  Right:      [7, 0.5, 0],
  Top:        [0, 8, 0.01],
  Bottom:     [0, -6, 0.01],
  Isometric:  [4, 4, 4],
};

// ── Camera controller ───────────────────────────────────────
function CameraController({ cameraView }) {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    if (!controlsRef.current) return;
    const pos = CAMERA_PRESETS[cameraView] || CAMERA_PRESETS.Reset;
    camera.position.set(...pos);
    controlsRef.current.target.set(0, 0.3, 0);
    controlsRef.current.update();
  }, [cameraView, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.75}
      zoomSpeed={0.9}
      panSpeed={0.7}
      minDistance={1.8}
      maxDistance={16}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

// ── Scene content ───────────────────────────────────────────
function SceneContent({
  engineId, explosion, selectedPartId, onSelectPart,
  isCutaway, isAnimated, animationSpeed, cameraView, showLabels,
  onCrankUpdate, resetSignal, theme,
}) {
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

      <CameraController cameraView={cameraView} />

      {renderEngine()}

      {showLabels && (
        <EngineLabels engineId={engineId} explosion={explosion} selectedPartId={selectedPartId} />
      )}
    </>
  );
}

// ── Main export ─────────────────────────────────────────────
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

  return (
    <div 
      className="engine-scene-wrapper"
      style={{ 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'var(--viewport-bg)', 
        position: 'relative',
        transition: 'background-color 0.25s ease'
      }}
    >
      <Canvas
        camera={{ position: CAMERA_PRESETS.Reset, fov: 44, near: 0.05, far: 120 }}
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
