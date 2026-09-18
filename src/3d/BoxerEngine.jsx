/**
 * BoxerEngine.jsx
 * Flat-4 Boxer / Horizontally Opposed (Subaru EJ/FA style)
 * Full Imperative Kinematics with direct Three.js ref mutation inside useFrame.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, sliderCrankY } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.33, 0.58);
const CRANK_R = 0.24;
const ROD_L   = 0.74;
const Z_OFFSETS = [-0.60, 0.60];
const CRANK_ANGLES = [0, Math.PI];  // opposing cylinders 180° apart

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function BoxerEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
  const thetaRef = useRef(0);
  const crankRef = useRef();
  const pistonsRef = useRef({});

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 5.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (crankRef.current) {
      crankRef.current.rotation.z = theta;
    }

    Z_OFFSETS.forEach((z, i) => {
      const ang = CRANK_ANGLES[i] + theta;
      ['left', 'right'].forEach(side => {
        const sx = side === 'left' ? -1 : 1;
        const sideAng = side === 'left' ? ang : ang + Math.PI;
        const pDisp = sliderCrankY(CRANK_R, ROD_L, sideAng) - ROD_L;

        const key = `${side}-${i}`;
        if (pistonsRef.current[key]) {
          pistonsRef.current[key].position.set(
            sx * (0.80 + explosion * 1.0) + sx * pDisp,
            0,
            z
          );
        }
      });
    });
  });

  return (
    <group position={[0, -0.15, 0]}>

      {/* ── Central Short Block ── */}
      <EnginePart {...pp('boxer-block', 'Flat-4 Aluminium Engine Block', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Central crankcase tunnel */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.65, 0.65, 2.30]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Left cylinder barrels × 2 (pointing left / -X) */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`left-barrel-${i}`} position={[-0.88, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.345, 0.345, 0.68, 26]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
        ))}

        {/* Right cylinder barrels × 2 */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`right-barrel-${i}`} position={[0.88, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.345, 0.345, 0.68, 26]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
        ))}

        {/* Cylinder bore openings */}
        {Z_OFFSETS.flatMap((z, i) => (
          [-1, 1].map((sx) => (
            <mesh key={`bore-${sx}-${i}`} position={[sx * 0.88, 0, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.338, 0.338, 0.70, 26, 1, true]} />
              <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
            </mesh>
          ))
        ))}
      </EnginePart>

      {/* ── Crankshaft ── */}
      <group ref={crankRef} position={[0, -1.3 * explosion, 0]}>
        <EnginePart {...pp('boxer-crank', 'Flat-4 Crankshaft — 180° Throws', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.10, 2.45, 22]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* 3 main journals */}
          {[-0.85, 0, 0.85].map((z, i) => (
            <mesh key={`mj-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.185, 0.185, 0.18, 20]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}

          {/* 4 rod throws */}
          {Z_OFFSETS.map((z, i) => {
            const ang = CRANK_ANGLES[i];
            const cx = CRANK_R * Math.cos(ang);
            const cy = CRANK_R * Math.sin(ang);
            return (
              <group key={`throw-${i}`} position={[0, 0, z]}>
                <mesh position={[cx, cy, -0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.150, 0.150, 0.18, 18]} />
                  <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
                </mesh>
                <mesh position={[-cx, -cy, 0.16]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.150, 0.150, 0.18, 18]} />
                  <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
                </mesh>
              </group>
            );
          })}
        </EnginePart>
      </group>

      {/* ── Pistons × 4 ── */}
      {Z_OFFSETS.flatMap((z, i) =>
        ['left', 'right'].map((side) => {
          const sx = side === 'left' ? -1 : 1;
          const key = `${side}-${i}`;
          return (
            <group key={`boxer-piston-grp-${side}-${i}`}
              ref={node => pistonsRef.current[key] = node}
              position={[sx * (0.80 + explosion * 1.0), 0, z]}
              rotation={[0, 0, sx === -1 ? Math.PI / 2 : -Math.PI / 2]}>
              <EnginePart {...pp(`boxer-piston-${side}-${i}`, `Boxer Piston — ${side} Cyl ${i + 1}`, selectedPartId, onSelectPart)}
                defaultMaterial={MATERIALS.piston}
                isCutaway={isCutaway}>

                <mesh geometry={PISTON_GEO} castShadow>
                  <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                </mesh>
                <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 0.44, 10]} />
                  <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[0, -0.38, 0]} castShadow>
                  <boxGeometry args={[0.065, 0.62, 0.095]} />
                  <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                </mesh>
              </EnginePart>
            </group>
          );
        })
      )}

      {/* ── Cylinder Heads (L + R) ── */}
      {[
        { side: 'left',  sx: -1, key: 'boxer-head-left',  name: 'Left Cylinder Head — DOHC' },
        { side: 'right', sx:  1, key: 'boxer-head-right', name: 'Right Cylinder Head — DOHC' },
      ].map(({ side, sx, key, name }) => (
        <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.cylinderHead}
          position={[sx * (1.30 + 1.4 * explosion), 0, 0]}
          rotation={[0, 0, sx === -1 ? Math.PI / 2 : -Math.PI / 2]}>

          <mesh castShadow>
            <boxGeometry args={[0.55, 0.72, 2.25]} />
            <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.20} />
          </mesh>
        </EnginePart>
      ))}

      {/* ── Oil Pan ── */}
      <EnginePart {...pp('boxer-oilpan', 'Boxer Flat Oil Pan', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -0.65 - 2.2 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.50, 0.35, 2.20]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>
      </EnginePart>

    </group>
  );
}
