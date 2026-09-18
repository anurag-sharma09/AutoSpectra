/**
 * VEngine.jsx
 * 60° V6 DOHC (e.g. Ferrari/Alfa style)
 * Full Imperative Kinematics with direct Three.js ref mutation inside useFrame.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, sliderCrankY } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.33, 0.60);
const BANK_ANGLE = Math.PI / 6; // 30° each = 60° V
const Z_OFFSETS  = [-0.90, 0.0, 0.90];
const CRANK_ANGLES = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];
const CRANK_R = 0.26;
const ROD_L   = 0.80;

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function VEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
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
      ['left', 'right'].forEach(bank => {
        const sx = bank === 'left' ? -1 : 1;
        const bankAngleOffset = sx * BANK_ANGLE;
        // Piston travel along bank axis
        const pDisp = sliderCrankY(CRANK_R, ROD_L, ang - bankAngleOffset) - ROD_L;

        const baseBoreX = sx * (0.48 + 0.55 * Math.sin(BANK_ANGLE));
        const baseBoreY = 0.62 + 0.55 * Math.cos(BANK_ANGLE);

        // Move piston along cylinder axis line
        const dx = -Math.sin(bankAngleOffset) * pDisp;
        const dy = Math.cos(bankAngleOffset) * pDisp;

        const key = `${bank}-${i}`;
        if (pistonsRef.current[key]) {
          pistonsRef.current[key].position.set(
            baseBoreX + dx + sx * explosion * 0.9,
            baseBoreY + dy + explosion * 0.35,
            z
          );
        }
      });
    });
  });

  return (
    <group position={[0, -0.22, 0]}>

      {/* ── Engine Block ── */}
      <EnginePart {...pp('v6-block', 'V6 60° Cast Aluminium Engine Block', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Central crankcase */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.55, 1.10, 2.58]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Left bank (30° from vertical) */}
        <mesh position={[-0.48, 0.68, 0]} rotation={[0, 0, BANK_ANGLE]} castShadow>
          <boxGeometry args={[0.82, 0.78, 2.56]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Right bank */}
        <mesh position={[0.48, 0.68, 0]} rotation={[0, 0, -BANK_ANGLE]} castShadow>
          <boxGeometry args={[0.82, 0.78, 2.56]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* 6 cylinder bores */}
        {Z_OFFSETS.flatMap((z, i) =>
          [{ sx: -1, bx: -(0.48 + 0.55 * Math.sin(BANK_ANGLE)), by: 0.62 + 0.55 * Math.cos(BANK_ANGLE) },
           { sx:  1, bx:  (0.48 + 0.55 * Math.sin(BANK_ANGLE)), by: 0.62 + 0.55 * Math.cos(BANK_ANGLE) }]
            .map(({ sx, bx, by }, bi) => (
              <mesh key={`bore-${i}-${bi}`} position={[bx, by, z]}
                rotation={[0, 0, sx * -BANK_ANGLE]} castShadow>
                <cylinderGeometry args={[0.338, 0.338, 0.88, 26, 1, true]} />
                <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
              </mesh>
            ))
        )}

        {/* 4 main bearing webs */}
        {[-0.9, -0.3, 0.3, 0.9].map((z, i) => (
          <mesh key={`web-${i}`} position={[0, -0.42, z]} castShadow>
            <boxGeometry args={[1.48, 0.22, 0.18]} />
            <meshStandardMaterial color="#262e3c" metalness={0.78} roughness={0.52} />
          </mesh>
        ))}
      </EnginePart>

      {/* ── Crankshaft ── */}
      <group ref={crankRef} position={[0, -0.44 - 1.4 * explosion, 0]}>
        <EnginePart {...pp('v6-crank', 'V6 Single-Plane Forged Crankshaft — 4 Journal', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.10, 2.74, 22]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* 4 main journals */}
          {[-0.88, -0.29, 0.29, 0.88].map((z, i) => (
            <mesh key={`mj-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.185, 0.185, 0.20, 20]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}

          {/* 3 rod throws */}
          {Z_OFFSETS.map((z, i) => {
            const ang = CRANK_ANGLES[i];
            const cx = CRANK_R * Math.cos(ang);
            const cy = CRANK_R * Math.sin(ang);
            return (
              <group key={`throw-${i}`} position={[0, 0, z]}>
                <mesh position={[cx, cy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.155, 0.155, 0.22, 18]} />
                  <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
                </mesh>
                <mesh position={[-cx * 0.85, -cy * 0.85, 0]} castShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.14, 18, 1, false, 0, Math.PI]} />
                  <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.22} />
                </mesh>
              </group>
            );
          })}

          {/* Balancer + flywheel */}
          <mesh position={[0, 0, -1.52]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.22, 24]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 1.48]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.52, 0.52, 0.08, 32]} />
            <meshStandardMaterial color="#2c3442" metalness={0.85} roughness={0.40} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Pistons × 6 ── */}
      {Z_OFFSETS.flatMap((z, i) =>
        ['left', 'right'].map((bank) => {
          const sx = bank === 'left' ? -1 : 1;
          const boreX = sx * (0.48 + 0.55 * Math.sin(BANK_ANGLE));
          const boreY = 0.62 + 0.55 * Math.cos(BANK_ANGLE);
          const key = `${bank}-${i}`;
          return (
            <group key={`piston-grp-${bank}-${i}`}
              ref={node => pistonsRef.current[key] = node}
              position={[boreX + sx * explosion * 0.9, boreY + explosion * 0.35, z]}
              rotation={[0, 0, sx * -BANK_ANGLE]}>
              <EnginePart {...pp(`v6-piston-${bank}-${i}`, `V6 Piston — ${bank} Bank Cyl ${i + 1}`, selectedPartId, onSelectPart)}
                defaultMaterial={MATERIALS.piston}
                isCutaway={isCutaway}>

                <mesh geometry={PISTON_GEO} castShadow>
                  <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                </mesh>
                <mesh position={[0, -0.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.035, 0.035, 0.46, 10]} />
                  <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
                </mesh>
                <mesh position={[0, -0.42, 0]} castShadow>
                  <boxGeometry args={[0.068, 0.68, 0.098]} />
                  <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                </mesh>
                <mesh position={[0, -0.82, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.148, 0.148, 0.10, 16]} />
                  <meshStandardMaterial color="#6a7e94" metalness={0.90} roughness={0.20} />
                </mesh>
              </EnginePart>
            </group>
          );
        })
      )}

      {/* ── Cylinder Heads L + R ── */}
      {[
        { bank: 'left',  sx: -1, key: 'v6-head-left',  name: 'V6 Left Cylinder Head — DOHC 12V' },
        { bank: 'right', sx:  1, key: 'v6-head-right', name: 'V6 Right Cylinder Head — DOHC 12V' },
      ].map(({ bank, sx, key, name }) => {
        const hx = sx * (0.80 + 1.30 * explosion * Math.sin(BANK_ANGLE));
        const hy = 0.95 + 1.30 * explosion * Math.cos(BANK_ANGLE);
        return (
          <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.cylinderHead}
            position={[hx, hy, 0]}
            rotation={[0, 0, sx * -BANK_ANGLE]}>

            <mesh castShadow>
              <boxGeometry args={[0.82, 0.58, 2.56]} />
              <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.20} />
            </mesh>

            {Z_OFFSETS.map((z, ci) => (
              <mesh key={`cc-${ci}`} position={[0, -0.30, z]} castShadow>
                <sphereGeometry args={[0.252, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#7a98b4" metalness={0.85} roughness={0.22} />
              </mesh>
            ))}

            {/* DOHC cam tunnels */}
            {[-0.16, 0.16].map((dx, ci) => (
              <mesh key={`ct-${ci}`} position={[dx, 0.10, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.095, 0.095, 2.52, 14]} />
                <meshStandardMaterial color="#788a9e" metalness={0.86} roughness={0.24} />
              </mesh>
            ))}
          </EnginePart>
        );
      })}

      {/* ── Valve Covers L + R ── */}
      {[
        { sx: -1, key: 'v6-cover-left',  name: 'V6 Left Valve Cover' },
        { sx:  1, key: 'v6-cover-right', name: 'V6 Right Valve Cover' },
      ].map(({ sx, key, name }) => {
        const cvX = sx * (1.08 + 2.25 * explosion * Math.sin(BANK_ANGLE));
        const cvY = 1.38 + 2.25 * explosion * Math.cos(BANK_ANGLE);
        return (
          <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.valveCover} isShell isCutaway={isCutaway}
            position={[cvX, cvY, 0]}
            rotation={[0, 0, sx * -BANK_ANGLE]}>

            <mesh castShadow>
              <boxGeometry args={[0.78, 0.26, 2.50]} />
              <meshStandardMaterial color="#1a3a72" metalness={0.78} roughness={0.24} />
            </mesh>

            {[-0.8, 0, 0.8].map((z, ri) => (
              <mesh key={ri} position={[0, 0.12, z]} castShadow>
                <boxGeometry args={[0.70, 0.048, 0.038]} />
                <meshStandardMaterial color="#1a3a72" metalness={0.78} roughness={0.24} />
              </mesh>
            ))}
          </EnginePart>
        );
      })}

      {/* ── Intake (valley-mounted) ── */}
      <EnginePart {...pp('v6-intake', 'Valley-Mounted Intake Manifold', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.intake}
        position={[0, 1.14 + 1.85 * explosion, 0]}>

        <mesh castShadow>
          <boxGeometry args={[1.14, 0.44, 2.52]} />
          <meshStandardMaterial color="#303848" metalness={0.55} roughness={0.52} />
        </mesh>

        {/* Throttle body */}
        <mesh position={[0, 0.32, 0.2]} castShadow>
          <cylinderGeometry args={[0.11, 0.11, 0.24, 16]} />
          <meshStandardMaterial color="#404858" metalness={0.65} roughness={0.38} />
        </mesh>
      </EnginePart>

      {/* ── Oil Pan ── */}
      <EnginePart {...pp('v6-oilpan', 'Dry/Wet Sump Oil Pan', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -0.90 - 2.4 * explosion, 0]}>

        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[1.58, 0.44, 2.60]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>

        <mesh position={[0.55, 0.05, 0.80]} castShadow>
          <cylinderGeometry args={[0.14, 0.14, 0.44, 18]} />
          <meshStandardMaterial color="#b82020" metalness={0.65} roughness={0.42} />
        </mesh>
      </EnginePart>

      {/* ── Exhaust Headers (L + R) ── */}
      {[
        { sx: -1, key: 'v6-header-left',  name: 'Left 3-into-1 Exhaust Header' },
        { sx:  1, key: 'v6-header-right', name: 'Right 3-into-1 Exhaust Header' },
      ].map(({ sx, key, name }) => {
        return (
          <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.exhaust}
            position={[sx * (0.58 + 2.0 * explosion * 0.5), 0.42, 0]}>

            {Z_OFFSETS.map((z, i) => (
              <mesh key={`stub-${i}`} position={[0, 0.18, z]} rotation={[0, 0, sx * -0.5]} castShadow>
                <cylinderGeometry args={[0.052, 0.052, 0.52, 12]} />
                <meshStandardMaterial color="#c07848" metalness={0.86} roughness={0.26} />
              </mesh>
            ))}

            <mesh position={[sx * 0.20, -0.20, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 2.55, 14]} />
              <meshStandardMaterial color="#b87040" metalness={0.86} roughness={0.28} />
            </mesh>
          </EnginePart>
        );
      })}

    </group>
  );
}
