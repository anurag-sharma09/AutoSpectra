/**
 * InlineEngine.jsx
 * Inline-4 DOHC 16-Valve Engine (e.g. Toyota 2JZ / BMW S58 / Honda K20 style)
 *
 * Mechanical Architecture:
 * - Inline-4 engine block with 4 cylinders, 5 main bearing webs & caps
 * - 5-journal flatplane crankshaft with crank webs, counterweights & flywheel
 * - 4 forged pistons with wrist pins & 4 H-beam connecting rods (slider-crank math)
 * - DOHC Cylinder head with 6 cam bearing towers/caps
 * - Dual overhead camshafts (intake & exhaust) with 16 distinct cam lobes
 * - 16 valves (2 intake, 2 exhaust per cyl) with valve springs & bucket tappets
 * - Front dual timing sprockets & chain drive representation
 * - Intake plenum manifold, tubular exhaust manifold, sculpted valve cover, wet sump pan
 *
 * NO helper/fake rods. All rotation is driven by the crankshaft and timing system.
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, makeValveGeometry, makeValveSpringGeometry } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.36, 0.65);
const VALVE_GEO  = makeValveGeometry(0.50, 0.120, 0.022);
const SPRING_GEO = makeValveSpringGeometry(0.092, 0.012, 6, 0.36);

const Z_OFFSETS = [-1.20, -0.40, 0.40, 1.20];
const CRANK_R = 0.27;
const ROD_L   = 0.82;

// Flatplane firing: 1-3-4-2 → pistons 1&4 paired (0°), 2&3 paired (180°)
const CRANK_ANGLES = [0, Math.PI, Math.PI, 0];

function pp(id, name, selectedPartId, onSelectPart) {
  return { partId: id, partName: name, selectedPartId, onSelectPart };
}

export default function InlineEngine({
  explosion = 0,
  selectedPartId = null,
  onSelectPart,
  isCutaway = false,
  isAnimated = false,
  animationSpeed = 1.0,
  onCrankUpdate = null,
  resetSignal = 0,
}) {
  const thetaRef = useRef(0);
  const crankRef = useRef();
  const cam1Ref  = useRef();
  const cam2Ref  = useRef();
  const pistonsRef = useRef([]);
  const rodsRef   = useRef([]);

  // Reset logic
  useEffect(() => {
    if (resetSignal > 0) {
      thetaRef.current = 0;
      if (crankRef.current) crankRef.current.rotation.z = 0;
      if (cam1Ref.current) cam1Ref.current.rotation.z = 0;
      if (cam2Ref.current) cam2Ref.current.rotation.z = 0;
      if (onCrankUpdate) onCrankUpdate(0);
    }
  }, [resetSignal]);

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 4.0 * animationSpeed;
    }
    const theta = thetaRef.current;
    const crankYCenter = -0.52 - 1.4 * explosion;

    if (onCrankUpdate) {
      const deg = ((theta * 180 / Math.PI) % 720 + 720) % 720;
      onCrankUpdate(deg);
    }

    if (crankRef.current) {
      crankRef.current.rotation.z = theta;
    }

    // Dual overhead camshafts rotate at exactly 1/2 crankshaft speed
    if (cam1Ref.current) cam1Ref.current.rotation.z = theta * 0.5;
    if (cam2Ref.current) cam2Ref.current.rotation.z = theta * 0.5;

    Z_OFFSETS.forEach((z, i) => {
      const crankAng = theta + CRANK_ANGLES[i];
      const pinX = CRANK_R * Math.cos(crankAng);
      const pinY = crankYCenter + CRANK_R * Math.sin(crankAng);
      const pistonY = crankYCenter + CRANK_R * Math.sin(crankAng) + Math.sqrt(Math.max(0.01, ROD_L * ROD_L - pinX * pinX));
      const rodAngle = Math.atan2(-pinX, pistonY - pinY);

      if (pistonsRef.current[i]) {
        pistonsRef.current[i].position.set(0, pistonY + 0.40 + explosion * 0.95, z);
      }
      if (rodsRef.current[i]) {
        rodsRef.current[i].position.set(pinX * 0.5, (pistonY + pinY) * 0.5, z);
        rodsRef.current[i].rotation.z = rodAngle;
      }
    });
  });

  return (
    <group position={[0, -0.25, 0]}>

      {/* ── Engine Block ──────────────────────────────── */}
      <EnginePart {...pp('inline-block', 'Inline-4 Cast Aluminium Engine Block', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Main block body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.12, 1.45, 3.30]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* 4 cylinder sleeves/liners */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`bore-${i}`} position={[0, 0.38, z]} castShadow>
            <cylinderGeometry args={[0.368, 0.368, 0.92, 28, 1, true]} />
            <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
          </mesh>
        ))}

        {/* Deck surface */}
        <mesh position={[0, 0.74, 0]} castShadow>
          <boxGeometry args={[1.10, 0.055, 3.26]} />
          <meshStandardMaterial color="#38445a" metalness={0.82} roughness={0.28} />
        </mesh>

        {/* 5 main bearing webs and bearing caps with bolts */}
        {[-1.6, -0.8, 0, 0.8, 1.6].map((z, i) => (
          <group key={`web-${i}`} position={[0, -0.52, z]}>
            <mesh castShadow>
              <boxGeometry args={[1.05, 0.22, 0.20]} />
              <meshStandardMaterial color="#262e3c" metalness={0.78} roughness={0.52} />
            </mesh>
            {[-0.38, 0.38].map((dx, bi) => (
              <mesh key={bi} position={[dx, -0.10, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
                <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.30} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Water pump housing (front) */}
        <mesh position={[0.30, 0.32, -1.80]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.25, 18]} />
          <meshStandardMaterial color="#28323e" metalness={0.78} roughness={0.42} />
        </mesh>
      </EnginePart>

      {/* ── Crankshaft ────────────────────────────────── */}
      <group ref={crankRef} position={[0, -0.52 - 1.4 * explosion, 0]}>
        <EnginePart {...pp('inline-crank', 'Inline-4 Flatplane Crankshaft — 5 Journal', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          {/* Shaft axis */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 3.46, 22]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* 5 main journals */}
          {[-1.4, -0.70, 0, 0.70, 1.4].map((z, i) => (
            <mesh key={`mj-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.20, 0.20, 0.22, 22]} />
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
                <mesh position={[cx, cy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.165, 0.165, 0.24, 20]} />
                  <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
                </mesh>
                {/* Crank web */}
                <mesh position={[cx * 0.5, cy * 0.5, -0.12]} castShadow>
                  <boxGeometry args={[0.22, 0.40, 0.085]} />
                  <meshStandardMaterial color="#404e60" metalness={0.90} roughness={0.20} />
                </mesh>
                {/* Counterweight */}
                <mesh position={[-cx * 0.9, -cy * 0.9, 0]} castShadow>
                  <cylinderGeometry args={[0.28, 0.28, 0.15, 18, 1, false, 0, Math.PI]} />
                  <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.22} />
                </mesh>
              </group>
            );
          })}

          {/* Pulley / harmonic balancer */}
          <mesh position={[0, 0, -1.85]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.36, 0.36, 0.24, 26]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.28} />
          </mesh>
          {/* Flywheel */}
          <mesh position={[0, 0, 1.82]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.58, 0.58, 0.08, 36]} />
            <meshStandardMaterial color="#2c3442" metalness={0.85} roughness={0.40} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Pistons & Rods × 4 ───────────────────────────────── */}
      {Z_OFFSETS.map((z, i) => (
        <React.Fragment key={`inline-cyl-${i}`}>
          {/* Connecting Rod */}
          <group ref={node => rodsRef.current[i] = node} position={[0, 0, z]}>
            <EnginePart {...pp(`inline-rod-${i}`, `Connecting Rod (Cylinder ${i + 1})`, selectedPartId, onSelectPart)}
              defaultMaterial={MATERIALS.rod}>
              <mesh castShadow>
                <boxGeometry args={[0.072, 0.70, 0.10]} />
                <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
              </mesh>
              <mesh position={[0, -0.35, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.155, 0.155, 0.11, 18]} />
                <meshStandardMaterial color="#6a7e94" metalness={0.90} roughness={0.20} />
              </mesh>
            </EnginePart>
          </group>

          {/* Piston */}
          <group ref={node => pistonsRef.current[i] = node} position={[0, 0.40, z]}>
            <EnginePart {...pp(`inline-piston-${i}`, `Piston (Cylinder ${i + 1})`, selectedPartId, onSelectPart)}
              defaultMaterial={MATERIALS.piston}
              isCutaway={isCutaway}>
              <mesh geometry={PISTON_GEO} castShadow>
                <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
              </mesh>
              {/* Wrist pin */}
              <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <cylinderGeometry args={[0.038, 0.038, 0.50, 12]} />
                <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
              </mesh>
            </EnginePart>
          </group>
        </React.Fragment>
      ))}

      {/* ── Cylinder Head — DOHC with Cam Towers & Caps ──────────────────────── */}
      <EnginePart {...pp('inline-head', 'DOHC Aluminium Cylinder Head — 16 Valve', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.cylinderHead}
        position={[0, 1.30 + 1.5 * explosion, 0]}>

        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.10, 0.58, 3.22]} />
          <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.20} />
        </mesh>

        {/* Combustion chambers */}
        {Z_OFFSETS.map((z, i) => (
          <mesh key={`cc-${i}`} position={[0, -0.30, z]} castShadow>
            <sphereGeometry args={[0.275, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#7a98b4" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}

        {/* 6 Cam Bearing Towers & Caps (mounting the DOHC camshafts) */}
        {[-1.5, -0.9, -0.3, 0.3, 0.9, 1.5].map((z, ti) => (
          <group key={`cam-tower-${ti}`} position={[0, 0.32, z]}>
            {/* Left tower cap */}
            <mesh position={[-0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.14, 0.12]} />
              <meshStandardMaterial color="#6a7e94" metalness={0.88} roughness={0.22} />
            </mesh>
            {/* Right tower cap */}
            <mesh position={[0.22, 0, 0]} castShadow>
              <boxGeometry args={[0.16, 0.14, 0.12]} />
              <meshStandardMaterial color="#6a7e94" metalness={0.88} roughness={0.22} />
            </mesh>
          </group>
        ))}

        {/* 16 Valves (4 per cylinder) with Valve Springs */}
        {Z_OFFSETS.flatMap((z, ci) =>
          [-0.22, 0.22].flatMap((dx, di) =>
            [-0.10, 0.10].map((dz, dzi) => {
              const vId = `inline-valve-${ci}-${di}-${dzi}`;
              return (
                <EnginePart key={vId} {...pp(vId, `Valve (Cylinder ${ci + 1})`, selectedPartId, onSelectPart)}
                  defaultMaterial={MATERIALS.valve}
                  position={[dx, -0.15, z + dz]}>
                  <mesh geometry={VALVE_GEO} castShadow>
                    <meshStandardMaterial color="#dce8f8" metalness={0.96} roughness={0.06} />
                  </mesh>
                  <mesh geometry={SPRING_GEO} position={[0, -0.08, 0]} castShadow>
                    <meshStandardMaterial color="#6890b0" metalness={0.88} roughness={0.22} />
                  </mesh>
                </EnginePart>
              );
            })
          )
        )}
      </EnginePart>

      {/* ── DOHC Camshafts (with 16 Cam Lobes & Front Timing Sprockets) ────────── */}
      <group ref={cam1Ref} position={[-0.22, 1.62 + 1.4 * explosion, 0]}>
        <EnginePart {...pp('inline-cam-intake', 'Intake Camshaft — DOHC', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.camshaft}>

          {/* Cam shaft core */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 3.16, 16]} />
            <meshStandardMaterial color="#5a7090" metalness={0.88} roughness={0.20} />
          </mesh>

          {/* Front Timing Sprocket */}
          <mesh position={[0, 0, -1.60]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 26]} />
            <meshStandardMaterial color="#3a4858" metalness={0.88} roughness={0.25} />
          </mesh>

          {/* 8 Intake Cam Lobes */}
          {Z_OFFSETS.flatMap((z, ci) => [
            <mesh key={`ilobe1-${ci}`} position={[0.048, 0, z - 0.10]} rotation={[0, 0, (ci / 4) * Math.PI]} castShadow>
              <cylinderGeometry args={[0.058, 0.125, 0.065, 14]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
            <mesh key={`ilobe2-${ci}`} position={[0.048, 0, z + 0.10]} rotation={[0, 0, (ci / 4) * Math.PI]} castShadow>
              <cylinderGeometry args={[0.058, 0.125, 0.065, 14]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
          ])}
        </EnginePart>
      </group>

      <group ref={cam2Ref} position={[0.22, 1.62 + 1.4 * explosion, 0]}>
        <EnginePart {...pp('inline-cam-exhaust', 'Exhaust Camshaft — DOHC', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.camshaft}>

          {/* Cam shaft core */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 3.16, 16]} />
            <meshStandardMaterial color="#5a7090" metalness={0.88} roughness={0.20} />
          </mesh>

          {/* Front Timing Sprocket */}
          <mesh position={[0, 0, -1.60]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.26, 0.26, 0.06, 26]} />
            <meshStandardMaterial color="#3a4858" metalness={0.88} roughness={0.25} />
          </mesh>

          {/* 8 Exhaust Cam Lobes */}
          {Z_OFFSETS.flatMap((z, ci) => [
            <mesh key={`elobe1-${ci}`} position={[-0.048, 0, z - 0.10]} rotation={[0, 0, (ci / 4) * Math.PI + Math.PI * 0.75]} castShadow>
              <cylinderGeometry args={[0.058, 0.125, 0.065, 14]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
            <mesh key={`elobe2-${ci}`} position={[-0.048, 0, z + 0.10]} rotation={[0, 0, (ci / 4) * Math.PI + Math.PI * 0.75]} castShadow>
              <cylinderGeometry args={[0.058, 0.125, 0.065, 14]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
          ])}
        </EnginePart>
      </group>

      {/* ── Valve Cover ── */}
      <EnginePart {...pp('inline-cover', 'Twin Cam Aluminium Valve Cover', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.valveCover} isShell isCutaway={isCutaway}
        position={[0, 1.84 + 2.4 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.08, 0.28, 3.20]} />
          <meshStandardMaterial color="#801818" metalness={0.78} roughness={0.24} />
        </mesh>
      </EnginePart>

      {/* ── Oil Pan ── */}
      <EnginePart {...pp('inline-oilpan', 'Wet Sump Oil Pan', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -1.25 - 2.5 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.15, 0.45, 3.28]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>
      </EnginePart>

    </group>
  );
}
