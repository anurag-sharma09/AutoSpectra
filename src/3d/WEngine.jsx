/**
 * WEngine.jsx
 * W12 / W16 Twin-Turbo (VW Group / Bugatti style)
 * Full Imperative Kinematics with direct Three.js ref mutation inside useFrame.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, sliderCrankY } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.30, 0.56);
const NARROW_ANGLE = Math.PI / 12; // 15°
const OUTER_OFFSET = 0.70; // lateral separation between two VR6 modules
const Z_OFFSETS = [-0.88, -0.28, 0.32]; // 3 per bank
const CRANK_R = 0.24;
const ROD_L   = 0.75;

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function WEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
  const thetaRef = useRef(0);
  const crankLeftRef = useRef();
  const crankRightRef = useRef();
  const pistonsRef = useRef({});
  const turboRefs = useRef([]);

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 5.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (crankLeftRef.current) crankLeftRef.current.rotation.z = theta;
    if (crankRightRef.current) crankRightRef.current.rotation.z = theta + Math.PI / 6;

    turboRefs.current.forEach(tNode => {
      if (tNode) tNode.rotation.z = theta * 8.0;
    });

    // Animate pistons in both modules
    [
      { moduleKey: 'left', baseTheta: theta },
      { moduleKey: 'right', baseTheta: theta + Math.PI / 6 },
    ].forEach(({ moduleKey, baseTheta }) => {
      Z_OFFSETS.forEach((z, i) => {
        const ang = (i / Z_OFFSETS.length) * Math.PI * 2 + baseTheta;
        ['left', 'right'].forEach(bank => {
          const sx = bank === 'left' ? -1 : 1;
          const bankAngleOffset = sx * NARROW_ANGLE;
          const pDisp = sliderCrankY(CRANK_R, ROD_L, ang - bankAngleOffset) - ROD_L;

          const baseBx = sx * (0.40 + 0.50 * Math.sin(NARROW_ANGLE));
          const baseBy = 0.62 + 0.50 * Math.cos(NARROW_ANGLE);

          const dx = -Math.sin(bankAngleOffset) * pDisp;
          const dy = Math.cos(bankAngleOffset) * pDisp;

          const key = `${moduleKey}-${bank}-${i}`;
          if (pistonsRef.current[key]) {
            pistonsRef.current[key].position.set(
              baseBx + dx + sx * explosion * 0.85,
              baseBy + dy + explosion * 0.3,
              z
            );
          }
        });
      });
    });
  });

  return (
    <group position={[0, -0.25, 0]}>

      {/* ── Left VR6 Module ── */}
      <group position={[-OUTER_OFFSET, 0, 0]}>
        <EnginePart {...pp('w-block-left', 'Left VR6 Sub-Block', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.05, 1.22, 2.55]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
          <mesh position={[-0.40, 0.65, 0]} rotation={[0, 0, NARROW_ANGLE]} castShadow>
            <boxGeometry args={[0.72, 0.72, 2.52]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
          <mesh position={[0.40, 0.65, 0]} rotation={[0, 0, -NARROW_ANGLE]} castShadow>
            <boxGeometry args={[0.72, 0.72, 2.52]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
        </EnginePart>

        <group ref={crankLeftRef} position={[0, -0.44 - 1.3 * explosion, 0]}>
          <EnginePart {...pp('w-crank-left', 'Left VR6 Crankshaft', selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.crankshaft}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.10, 0.10, 2.72, 20]} />
              <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
            </mesh>
          </EnginePart>
        </group>

        {Z_OFFSETS.flatMap((z, i) =>
          ['left', 'right'].map((bank) => {
            const sx = bank === 'left' ? -1 : 1;
            const bx = sx * (0.40 + 0.50 * Math.sin(NARROW_ANGLE));
            const by = 0.62 + 0.50 * Math.cos(NARROW_ANGLE);
            const key = `left-${bank}-${i}`;
            return (
              <group key={`w-piston-grp-${key}`} ref={node => pistonsRef.current[key] = node}
                position={[bx + sx * explosion * 0.85, by + explosion * 0.3, z]}
                rotation={[0, 0, sx * -NARROW_ANGLE]}>
                <EnginePart {...pp(`w-piston-${key}`, `W-Piston Left ${bank} ${i + 1}`, selectedPartId, onSelectPart)}
                  defaultMaterial={MATERIALS.piston} isCutaway={isCutaway}>
                  <mesh geometry={PISTON_GEO} castShadow>
                    <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                  </mesh>
                  <mesh position={[0, -0.40, 0]} castShadow>
                    <boxGeometry args={[0.065, 0.64, 0.09]} />
                    <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                  </mesh>
                </EnginePart>
              </group>
            );
          })
        )}
      </group>

      {/* ── Right VR6 Module ── */}
      <group position={[OUTER_OFFSET, 0, 0]}>
        <EnginePart {...pp('w-block-right', 'Right VR6 Sub-Block', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.05, 1.22, 2.55]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
          <mesh position={[-0.40, 0.65, 0]} rotation={[0, 0, NARROW_ANGLE]} castShadow>
            <boxGeometry args={[0.72, 0.72, 2.52]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
          <mesh position={[0.40, 0.65, 0]} rotation={[0, 0, -NARROW_ANGLE]} castShadow>
            <boxGeometry args={[0.72, 0.72, 2.52]} />
            <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
          </mesh>
        </EnginePart>

        <group ref={crankRightRef} position={[0, -0.44 - 1.3 * explosion, 0]}>
          <EnginePart {...pp('w-crank-right', 'Right VR6 Crankshaft', selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.crankshaft}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.10, 0.10, 2.72, 20]} />
              <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
            </mesh>
          </EnginePart>
        </group>

        {Z_OFFSETS.flatMap((z, i) =>
          ['left', 'right'].map((bank) => {
            const sx = bank === 'left' ? -1 : 1;
            const bx = sx * (0.40 + 0.50 * Math.sin(NARROW_ANGLE));
            const by = 0.62 + 0.50 * Math.cos(NARROW_ANGLE);
            const key = `right-${bank}-${i}`;
            return (
              <group key={`w-piston-grp-${key}`} ref={node => pistonsRef.current[key] = node}
                position={[bx + sx * explosion * 0.85, by + explosion * 0.3, z]}
                rotation={[0, 0, sx * -NARROW_ANGLE]}>
                <EnginePart {...pp(`w-piston-${key}`, `W-Piston Right ${bank} ${i + 1}`, selectedPartId, onSelectPart)}
                  defaultMaterial={MATERIALS.piston} isCutaway={isCutaway}>
                  <mesh geometry={PISTON_GEO} castShadow>
                    <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                  </mesh>
                  <mesh position={[0, -0.40, 0]} castShadow>
                    <boxGeometry args={[0.065, 0.64, 0.09]} />
                    <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                  </mesh>
                </EnginePart>
              </group>
            );
          })
        )}
      </group>

      {/* Shared W valley / bridging plate */}
      <EnginePart {...pp('w-valley', 'W-Block Centre Bridge / Timing Case', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block}
        position={[0, -0.08, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.55, 0.95, 2.58]} />
          <meshStandardMaterial color="#1e2838" metalness={0.72} roughness={0.62} />
        </mesh>
      </EnginePart>

      {/* Twin Turbochargers */}
      {[-0.70, 0.70].map((x, ti) => (
        <EnginePart key={`w-turbo-${ti}`}
          {...pp(`w-turbo-${ti}`, `Twin Turbocharger #${ti + 1}`, selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.exhaust}
          position={[x, 0.40 + 2.5 * explosion, -1.50 - explosion * 0.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.25, 22]} />
            <meshStandardMaterial color="#485566" metalness={0.90} roughness={0.20} />
          </mesh>
          <mesh position={[0, 0, 0.24]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.20, 20]} />
            <meshStandardMaterial color="#c07848" metalness={0.85} roughness={0.28} />
          </mesh>
          <mesh ref={node => turboRefs.current[ti] = node} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.04, 28]} />
            <meshStandardMaterial color="#8ea4be" metalness={0.90} roughness={0.12} />
          </mesh>
        </EnginePart>
      ))}

      {/* Shared intake manifold */}
      <EnginePart {...pp('w-intake', 'W12 Intake Plenum + Twin TB', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.intake}
        position={[0, 1.62 + 2.0 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.0, 0.42, 2.50]} />
          <meshStandardMaterial color="#303848" metalness={0.55} roughness={0.52} />
        </mesh>
      </EnginePart>

      {/* Shared oil pan */}
      <EnginePart {...pp('w-oilpan', 'W12 Cast Aluminium Dry-Sump Pan', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -1.08 - 2.6 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.65, 0.44, 2.60]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>
      </EnginePart>

    </group>
  );
}
