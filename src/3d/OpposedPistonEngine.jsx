/**
 * OpposedPistonEngine.jsx
 * Opposed-Piston 2-Stroke Diesel (Junkers Jumo / Achates Power style)
 * Full Imperative Kinematics with direct Three.js ref mutation inside useFrame.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, sliderCrankY } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.35, 0.62);
const CRANK_R = 0.28;
const ROD_L   = 0.80;
const Z_OFFSETS = [-0.90, 0.0, 0.90];

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function OpposedPistonEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
  const thetaRef = useRef(0);
  const crankTopRef = useRef();
  const crankBottomRef = useRef();
  const pistonsRef = useRef({});

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 5.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (crankTopRef.current) crankTopRef.current.rotation.z = theta;
    if (crankBottomRef.current) crankBottomRef.current.rotation.z = -theta;

    Z_OFFSETS.forEach((z, i) => {
      const crankAng = theta + (i / Z_OFFSETS.length) * Math.PI * 2;
      const pDisp = sliderCrankY(CRANK_R, ROD_L, crankAng) - ROD_L;

      ['left', 'right'].forEach(side => {
        const sx = side === 'left' ? -1 : 1;
        const key = `${side}-${i}`;
        if (pistonsRef.current[key]) {
          pistonsRef.current[key].position.set(
            sx * (0.88 + explosion * 1.6 + pDisp * 0.4),
            0,
            z
          );
        }
      });
    });
  });

  return (
    <group position={[0, 0, 0]}>

      {/* ── Cylinder Block (horizontal tubes) ── */}
      <EnginePart {...pp('op-block', 'Opposed-Piston Cylinder Block — 3 Horizontal Bores', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Main block body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.88, 2.55]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* 3 cylinder bore tubes */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`bore-${i}`} position={[0, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.358, 0.358, 2.58, 28, 1, true]} />
            <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
          </mesh>
        ))}

        {/* Port windows */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`port-${i}`} position={[0.40, 0, z]} castShadow>
            <boxGeometry args={[0.90, 0.58, 0.55]} />
            <meshStandardMaterial color="#28323e" metalness={0.78} roughness={0.42} />
          </mesh>
        ))}

        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[2.58, 0.16, 2.52]} />
          <meshStandardMaterial color="#38445a" metalness={0.82} roughness={0.28} />
        </mesh>

        <mesh position={[0, -0.52, 0]} castShadow>
          <boxGeometry args={[2.58, 0.16, 2.52]} />
          <meshStandardMaterial color="#38445a" metalness={0.82} roughness={0.28} />
        </mesh>
      </EnginePart>

      {/* ── Top Crankshaft ── */}
      <group ref={crankTopRef} position={[0, 0.72 + 1.4 * explosion, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <EnginePart {...pp('op-crank-top', 'Top Crankshaft — Forged Steel', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh castShadow>
            <cylinderGeometry args={[0.10, 0.10, 2.72, 20]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {[-0.9, -0.3, 0.3, 0.9].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.18, 18]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}
        </EnginePart>
      </group>

      {/* ── Bottom Crankshaft ── */}
      <group ref={crankBottomRef} position={[0, -0.72 - 1.4 * explosion, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <EnginePart {...pp('op-crank-bottom', 'Bottom Crankshaft — Forged Steel', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh castShadow>
            <cylinderGeometry args={[0.10, 0.10, 2.72, 20]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {[-0.9, -0.3, 0.3, 0.9].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.18, 18]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}
        </EnginePart>
      </group>

      {/* ── 6 Pistons (3 left + 3 right) ── */}
      {Z_OFFSETS.flatMap((z, i) =>
        ['left', 'right'].map(({ side, sx } = { side: 'left', sx: -1 }) => {
          const actualSx = side === 'left' ? -1 : 1;
          const key = `${side}-${i}`;
          return (
            <group key={`op-piston-grp-${side}-${i}`}
              ref={node => pistonsRef.current[key] = node}
              position={[actualSx * (0.88 + explosion * 1.6), 0, z]}
              rotation={[0, 0, Math.PI / 2]}>
              <EnginePart {...pp(`op-piston-${side}-${i}`, `Opposed Piston — ${side} #${i + 1}`, selectedPartId, onSelectPart)}
                defaultMaterial={MATERIALS.piston} isCutaway={isCutaway}>

                <mesh geometry={PISTON_GEO} castShadow>
                  <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                </mesh>
                <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.038, 0.038, 0.50, 12]} />
                  <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[0, -0.42, 0]} castShadow>
                  <boxGeometry args={[0.075, 0.70, 0.105]} />
                  <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                </mesh>
              </EnginePart>
            </group>
          );
        })
      )}

      {/* ── Supercharger / Scavenge Blower ── */}
      <EnginePart {...pp('op-blower', 'Roots-Type Scavenge Blower / Supercharger', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.intake}
        position={[0, 0, -1.62 - 1.5 * explosion]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.52, 0.52, 0.60, 28]} />
          <meshStandardMaterial color="#303848" metalness={0.55} roughness={0.52} />
        </mesh>
      </EnginePart>

      {/* ── Exhaust Manifold ── */}
      <EnginePart {...pp('op-exhaust', 'Opposed-Piston Exhaust Collector', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.exhaust}
        position={[1.45 + 2.2 * explosion, 0.12, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 2.45, 16]} />
          <meshStandardMaterial color="#c07848" metalness={0.86} roughness={0.26} />
        </mesh>
      </EnginePart>

    </group>
  );
}
