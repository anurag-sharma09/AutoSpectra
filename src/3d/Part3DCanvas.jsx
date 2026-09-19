import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, ContactShadows, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../context/ThemeContext';
import PartModelSwitcher from './PartModels';

function PartSceneContent({
  partId,
  explosion = 0,
  autoRotate = false,
  showLabels = false,
  cameraView = 'Reset',
  partName = '',
  theme = 'dark'
}) {
  const groupRef = useRef();
  const controlsRef = useRef();
  const { camera } = useThree();

  // Handle camera view preset changes
  useEffect(() => {
    if (!controlsRef.current) return;
    const presets = {
      Reset: [2.5, 2.0, 3.2],
      Front: [0, 0.2, 4.2],
      Rear: [0, 0.2, -4.2],
      Left: [-4.2, 0.2, 0],
      Right: [4.2, 0.2, 0],
      Top: [0, 4.5, 0.01],
      Bottom: [0, -4.5, 0.01],
      Isometric: [2.8, 2.8, 2.8],
    };
    const pos = presets[cameraView] || presets.Reset;
    camera.position.set(...pos);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [cameraView, camera]);

  // Continuous gentle rotation when autoRotate is enabled
  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.6;
    }
  });

  const isLight = theme === 'light';
  const gridCellColor = isLight ? '#BAC7D5' : '#1E2D40';
  const gridSectionColor = isLight ? '#8DA2B5' : '#324760';
  const shadowColor = isLight ? '#475569' : '#080c18';

  return (
    <>
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>

      <ambientLight intensity={isLight ? 0.95 : 0.85} color={isLight ? '#ffffff' : '#e0e8f8'} />
      <directionalLight position={[5, 8, 5]} intensity={isLight ? 2.5 : 2.2} color="#ffffff" castShadow />
      <directionalLight position={[-4, 3, -4]} intensity={1.0} color="#b0c8e8" />
      <directionalLight position={[0, -4, 0]} intensity={0.4} color="#708090" />

      <Grid
        position={[0, -1.2, 0]}
        args={[16, 16]}
        cellSize={0.3}
        cellThickness={0.5}
        cellColor={gridCellColor}
        sectionSize={1.5}
        sectionThickness={1.0}
        sectionColor={gridSectionColor}
        fadeDistance={12}
        fadeStrength={2.0}
        infiniteGrid
      />

      <ContactShadows
        position={[0, -1.19, 0]}
        opacity={isLight ? 0.35 : 0.55}
        scale={8}
        blur={2.5}
        far={3.0}
        color={shadowColor}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.8}
        zoomSpeed={0.9}
        panSpeed={0.8}
        minDistance={1.0}
        maxDistance={12.0}
      />

      <group ref={groupRef} position={[0, 0, 0]}>
        <PartModelSwitcher partId={partId} explosion={explosion} />

        {showLabels && (
          <Html position={[0, 1.1, 0]} center distanceFactor={6}>
            <div style={{
              background: 'var(--surface-card)',
              border: '1px solid var(--accent-primary)',
              color: 'var(--text-primary)',
              padding: '4px 10px',
              borderRadius: '4px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-card)',
              pointerEvents: 'none'
            }}>
              {partName || partId.toUpperCase()}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}

export default function Part3DCanvas({
  partId,
  explosion = 0,
  autoRotate = false,
  showLabels = false,
  cameraView = 'Reset',
  partName = '',
}) {
  const { theme } = useTheme();

  return (
    <div
      className="part-3d-canvas-wrapper"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--viewport-bg)',
        position: 'relative',
        touchAction: 'none', // Prevent background scrolling on touch screens
        transition: 'background-color 0.25s ease'
      }}
    >
      <Canvas
        camera={{ position: [2.5, 2.0, 3.2], fov: 44, near: 0.05, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === 'light' ? 1.15 : 1.05,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        shadows="soft"
      >
        <Suspense fallback={null}>
          <PartSceneContent
            partId={partId}
            explosion={explosion}
            autoRotate={autoRotate}
            showLabels={showLabels}
            cameraView={cameraView}
            partName={partName}
            theme={theme}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
