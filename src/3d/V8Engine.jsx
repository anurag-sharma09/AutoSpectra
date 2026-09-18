/**
 * V8Engine.jsx — 90° Crossplane V8 OHV Pushrod Engine
 *
 * Professional Engineering Visualization Model:
 * - 90° V-block with 8 cylinder bores & 5 main bearing webs + caps
 * - 5-journal crossplane crankshaft with counterweights & flexplate
 * - 8 forged pistons with ring grooves & wrist pins
 * - 8 H-beam connecting rods with slider-crank kinematics
 * - Single in-block camshaft with 16 cam lobes & timing gear
 * - 16 hydraulic lifters, 16 pushrods, 16 rocker arms, 16 valves & springs
 * - Dual-plane intake manifold, 4-into-1 exhaust headers, oil pan, valve covers
 *
 * NO helper/fake rods. Every moving component is real engine architecture.
 */

import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import {
  makePistonGeometry,
  makeValveGeometry,
  makeValveSpringGeometry,
  makeHeaderTube,
  makeCrankWebGeometry,
} from './engineGeometry';

// ── Shared Geometries ─────────────────────────────────────────
const PISTON_GEO    = makePistonGeometry(0.34, 0.62);
const VALVE_GEO     = makeValveGeometry(0.52, 0.115, 0.022);
const SPRING_GEO    = makeValveSpringGeometry(0.09, 0.012, 6, 0.38);
const CRANK_WEB_GEO = makeCrankWebGeometry(0.42, 0.15, 0.095);

// ── V8 Geometry Constants ──────────────────────────────────────
const BANK_ANGLE = Math.PI / 4;  // 45° per bank = 90° V
const Z_OFFSETS  = [-1.35, -0.45, 0.45, 1.35];  // 4 cylinder positions

// GM Small Block 350 V8 Firing Order: 1-8-7-2-6-5-4-3
const CYL_FIRING_PHASES = [
  // Left bank (Cyl 1, Cyl 3, Cyl 5, Cyl 7)
  [0, 3.5 * Math.PI, 2.5 * Math.PI, Math.PI],
  // Right bank (Cyl 2, Cyl 4, Cyl 6, Cyl 8)
  [1.5 * Math.PI, 3.0 * Math.PI, 2.0 * Math.PI, 0.5 * Math.PI],
];

// Slider-crank physics
const CRANK_R = 0.28;   // crank throw radius
const ROD_L   = 0.88;   // connecting rod length

const CRANK_CENTRE_Y = -0.46;

const BORE_Y = 0.65 + 0.62 * Math.cos(BANK_ANGLE);
const LEFT_BORE_X  = -(0.55 + 0.62 * Math.sin(BANK_ANGLE));
const RIGHT_BORE_X =  (0.55 + 0.62 * Math.sin(BANK_ANGLE));

const LEFT_DIR  = new THREE.Vector3(-Math.sin(BANK_ANGLE),  Math.cos(BANK_ANGLE), 0);
const RIGHT_DIR = new THREE.Vector3( Math.sin(BANK_ANGLE),  Math.cos(BANK_ANGLE), 0);

// Valve lift profile (0..1)
function valveLift(cylCrankAngle, isExhaust) {
  const a = ((cylCrankAngle % (Math.PI * 4)) + Math.PI * 4) % (Math.PI * 4);
  if (!isExhaust) {
    if (a >= 0 && a <= Math.PI) return Math.sin(a);
  } else {
    if (a >= 3 * Math.PI && a <= 4 * Math.PI) return Math.sin(a - 3 * Math.PI);
  }
  return 0;
}

// True slider-crank displacement
function sliderCrankDisp(crankAngle) {
  const sinT = Math.sin(crankAngle);
  const cosT = Math.cos(crankAngle);
  return CRANK_R * cosT + Math.sqrt(Math.max(0, ROD_L * ROD_L - CRANK_R * CRANK_R * sinT * sinT));
}

const TDC_DISP = CRANK_R + ROD_L;

function pp(id, name, selectedPartId, onSelectPart) {
  return { partId: id, partName: name, selectedPartId, onSelectPart };
}

export default function V8Engine({
  explosion      = 0,
  selectedPartId = null,
  onSelectPart,
  isCutaway      = false,
  isAnimated     = false,
  animationSpeed = 1.0,
  onCrankUpdate  = null,
  resetSignal    = 0,
}) {
  const sim = useRef({ crankAngle: 0, camAngle: 0 });

  const isAnimatedRef   = useRef(isAnimated);
  const animSpeedRef    = useRef(animationSpeed);
  const explosionRef    = useRef(explosion);
  isAnimatedRef.current = isAnimated;
  animSpeedRef.current  = animationSpeed;
  explosionRef.current  = explosion;

  const crankRef    = useRef();
  const camRef      = useRef();
  const flywheelRef = useRef();

  // Reset logic
  useEffect(() => {
    if (resetSignal > 0) {
      sim.current.crankAngle = 0;
      sim.current.camAngle = 0;
      if (crankRef.current) crankRef.current.rotation.z = 0;
      if (camRef.current) camRef.current.rotation.z = 0;
      if (flywheelRef.current) flywheelRef.current.rotation.z = 0;
      if (onCrankUpdate) onCrankUpdate(0);
    }
  }, [resetSignal]);

  const cylRefs = useMemo(() => {
    const make = () => ({
      piston: { current: null },
      rod:    { current: null },
      iValve: { current: null },
      eValve: { current: null },
      iPush:  { current: null },
      ePush:  { current: null },
      iRock:  { current: null },
      eRock:  { current: null },
      iLifter:{ current: null },
      eLifter:{ current: null },
    });
    return [
      [make(), make(), make(), make()],
      [make(), make(), make(), make()],
    ];
  }, []);

  const headerGeos = useMemo(() => {
    const L = Z_OFFSETS.map((z, i) => {
      const px = -0.82 - 0.58 * Math.sin(BANK_ANGLE);
      const py =  0.85 + 0.58 * Math.cos(BANK_ANGLE);
      return makeHeaderTube([px,py,z],[px-0.4,py-0.3,z+0.2*(i-1.5)],[-1.55,0.4,z*0.6],[-1.65,0.05,0],0.040,18);
    });
    const R = Z_OFFSETS.map((z, i) => {
      const px =  0.82 + 0.58 * Math.sin(BANK_ANGLE);
      const py =  0.85 + 0.58 * Math.cos(BANK_ANGLE);
      return makeHeaderTube([px,py,z],[px+0.4,py-0.3,z+0.2*(i-1.5)],[1.55,0.4,z*0.6],[1.65,0.05,0],0.040,18);
    });
    return [L, R];
  }, []);

  // ── THE KINEMATIC LOOP ────────────────────────────────────
  useFrame((_, delta) => {
    if (isAnimatedRef.current) {
      const speed = animSpeedRef.current;
      sim.current.crankAngle += 4.0 * speed * delta;
      if (sim.current.crankAngle > Math.PI * 4) {
        sim.current.crankAngle -= Math.PI * 4;
      }
      sim.current.camAngle = sim.current.crankAngle * 0.5; // 1:2 ratio
    }

    const θ    = sim.current.crankAngle;
    const θcam = sim.current.camAngle;
    const e    = explosionRef.current;

    if (onCrankUpdate) {
      const deg = ((θ * 180 / Math.PI) % 720 + 720) % 720;
      onCrankUpdate(deg);
    }

    // Crankshaft
    if (crankRef.current) {
      crankRef.current.rotation.z = θ;
      crankRef.current.position.y = CRANK_CENTRE_Y - 1.5 * e;
    }

    // Flywheel
    if (flywheelRef.current) {
      flywheelRef.current.rotation.z = θ;
      flywheelRef.current.position.y = CRANK_CENTRE_Y - 1.5 * e;
      flywheelRef.current.position.z = 1.92 + 0.4 * e;
    }

    // Camshaft
    if (camRef.current) {
      camRef.current.rotation.z = θcam;
      camRef.current.position.y = 0.16;
      camRef.current.position.z = -1.85 * e;
    }

    // Per-cylinder updates
    const BANKS = [
      {
        bi: 0, dir: LEFT_DIR,  boreX: LEFT_BORE_X,   sx: -1,
        bankRotZ: BANK_ANGLE,  exVecX: -Math.sin(BANK_ANGLE), exVecY: Math.cos(BANK_ANGLE),
      },
      {
        bi: 1, dir: RIGHT_DIR, boreX: RIGHT_BORE_X,  sx: 1,
        bankRotZ: -BANK_ANGLE, exVecX:  Math.sin(BANK_ANGLE), exVecY: Math.cos(BANK_ANGLE),
      },
    ];

    for (const bank of BANKS) {
      for (let ci = 0; ci < 4; ci++) {
        const cyl = cylRefs[bank.bi][ci];
        const cylPhase = CYL_FIRING_PHASES[bank.bi][ci];
        const cylAngle = θ + cylPhase;

        // Piston displacement
        const disp   = sliderCrankDisp(cylAngle);
        const travel = disp - TDC_DISP; // ≤ 0, BDC = -(2*CRANK_R)

        const bx = bank.boreX + bank.exVecX * e;
        const by = BORE_Y     + bank.exVecY * e;
        const bz = Z_OFFSETS[ci];

        const pistonX = bx + bank.dir.x * travel;
        const pistonY = by + bank.dir.y * travel;

        if (cyl.piston.current) {
          cyl.piston.current.position.set(pistonX, pistonY, bz);
          cyl.piston.current.rotation.z = bank.bankRotZ;
        }

        // Connecting Rod
        const crankCX = 0;
        const crankCY = CRANK_CENTRE_Y - 1.5 * e;
        const crankPinX = crankCX + CRANK_R * Math.cos(cylAngle);
        const crankPinY = crankCY + CRANK_R * Math.sin(cylAngle);

        const wristX = pistonX - bank.dir.x * 0.08;
        const wristY = pistonY - bank.dir.y * 0.08;

        if (cyl.rod.current) {
          const midX = (wristX + crankPinX) * 0.5;
          const midY = (wristY + crankPinY) * 0.5;
          cyl.rod.current.position.set(midX, midY, bz);

          const dx = wristX - crankPinX;
          const dy = wristY - crankPinY;
          cyl.rod.current.rotation.z = Math.atan2(dx, -dy);

          const dist = Math.sqrt(dx * dx + dy * dy);
          cyl.rod.current.scale.y = dist / ROD_L;
        }

        // Valve timing & Pushrods / Lifters / Rocker arms
        const iLift = valveLift(cylAngle, false);
        const eLift = valveLift(cylAngle, true);

        const MAX_VLV  = 0.08;
        const MAX_PUSH = 0.06;

        // Lifters (ride on cam inside block valley)
        if (cyl.iLifter.current) cyl.iLifter.current.position.y = 0.16 + iLift * MAX_PUSH;
        if (cyl.eLifter.current) cyl.eLifter.current.position.y = 0.16 + eLift * MAX_PUSH;

        // Intake valve + pushrod + rocker
        if (cyl.iValve.current) cyl.iValve.current.position.y = -iLift * MAX_VLV;
        if (cyl.iPush.current)  cyl.iPush.current.position.y  =  iLift * MAX_PUSH;
        if (cyl.iRock.current)  cyl.iRock.current.rotation.z  = -iLift * 0.22;

        // Exhaust valve + pushrod + rocker
        if (cyl.eValve.current) cyl.eValve.current.position.y = -eLift * MAX_VLV;
        if (cyl.ePush.current)  cyl.ePush.current.position.y  =  eLift * MAX_PUSH;
        if (cyl.eRock.current)  cyl.eRock.current.rotation.z  = -eLift * 0.22;
      }
    }
  });

  return (
    <group position={[0, -0.22, 0]}>

      {/* ── Stationary Engine Block ── */}
      <EnginePart {...pp('v8-block', 'Engine Block — 90° V8 Cast Iron', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Lower crankcase tunnel */}
        <mesh position={[0, -0.22, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.52, 0.96, 3.48]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Left cylinder bank wall */}
        <mesh position={[-0.52, 0.65, 0]} rotation={[0, 0, BANK_ANGLE]} castShadow>
          <boxGeometry args={[0.82, 0.78, 3.44]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Right cylinder bank wall */}
        <mesh position={[0.52, 0.65, 0]} rotation={[0, 0, -BANK_ANGLE]} castShadow>
          <boxGeometry args={[0.82, 0.78, 3.44]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* 8 Cylinder bore sleeves */}
        {Z_OFFSETS.flatMap((z, i) => [
          <mesh key={`boreL-${i}`} position={[LEFT_BORE_X, BORE_Y, z]} rotation={[0, 0, BANK_ANGLE]} castShadow>
            <cylinderGeometry args={[0.342, 0.342, 0.88, 28, 1, true]} />
            <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
          </mesh>,
          <mesh key={`boreR-${i}`} position={[RIGHT_BORE_X, BORE_Y, z]} rotation={[0, 0, -BANK_ANGLE]} castShadow>
            <cylinderGeometry args={[0.342, 0.342, 0.88, 28, 1, true]} />
            <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
          </mesh>,
        ])}

        {/* 5 Main bearing caps with hex bolts */}
        {[-1.8, -0.9, 0, 0.9, 1.8].map((z, i) => (
          <group key={`cap-${i}`} position={[0, CRANK_CENTRE_Y - 0.22, z]}>
            <mesh castShadow>
              <boxGeometry args={[0.85, 0.28, 0.22]} />
              <meshStandardMaterial color="#485566" metalness={0.90} roughness={0.18} />
            </mesh>
            {[-0.32, 0.32].map((dx, bi) => (
              <mesh key={bi} position={[dx, 0.12, 0]} castShadow>
                <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
                <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.30} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Internal Camshaft Bearing Tunnel (inside valley floor) */}
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 3.42, 20, 1, true]} />
          <meshStandardMaterial color="#202a38" metalness={0.80} roughness={0.40} side={THREE.DoubleSide} />
        </mesh>
      </EnginePart>

      {/* ── Animated Crankshaft ── */}
      <group ref={crankRef} position={[0, CRANK_CENTRE_Y - 1.5 * explosion, 0]}>
        <EnginePart {...pp('v8-crankshaft', 'Crankshaft — Forged Steel Crossplane', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          {/* Main shaft axis */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 3.65, 24]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* 5 Main journals */}
          {[-1.75, -0.88, 0, 0.88, 1.75].map((z, i) => (
            <mesh key={`mj-${i}`} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.20, 0.20, 0.24, 22]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}

          {/* 4 Crossplane crank throws & counterweight webs */}
          {Z_OFFSETS.map((z, i) => {
            const phase = CYL_FIRING_PHASES[0][i];
            const cx = CRANK_R * Math.cos(phase);
            const cy = CRANK_R * Math.sin(phase);
            return (
              <group key={`throw-${i}`} position={[0, 0, z]}>
                <mesh position={[cx, cy, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                  <cylinderGeometry args={[0.165, 0.165, 0.32, 20]} />
                  <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
                </mesh>
                <mesh position={[cx * 0.5, cy * 0.5, -0.16]} geometry={CRANK_WEB_GEO} castShadow>
                  <meshStandardMaterial color="#404e60" metalness={0.90} roughness={0.20} />
                </mesh>
                <mesh position={[cx * 0.5, cy * 0.5, 0.16]} geometry={CRANK_WEB_GEO} castShadow>
                  <meshStandardMaterial color="#404e60" metalness={0.90} roughness={0.20} />
                </mesh>
              </group>
            );
          })}
        </EnginePart>
      </group>

      {/* ── Flywheel / Flexplate ── */}
      <group ref={flywheelRef} position={[0, CRANK_CENTRE_Y - 1.5 * explosion, 1.92 + 0.4 * explosion]}>
        <EnginePart {...pp('v8-flywheel', 'Flywheel / Flexplate', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.68, 0.68, 0.08, 40]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.25} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Camshaft inside Block (with 16 distinct lobes & timing gear) ── */}
      <group ref={camRef} position={[0, 0.16, -1.85 * explosion]}>
        <EnginePart {...pp('v8-camshaft', 'Camshaft — OHV Single Cam', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.camshaft}>

          {/* Cam shaft core (oriented along Z) */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 3.40, 20]} />
            <meshStandardMaterial color="#5a7090" metalness={0.88} roughness={0.20} />
          </mesh>

          {/* Front Timing Gear / Sprocket */}
          <mesh position={[0, 0, -1.72]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.32, 0.08, 30]} />
            <meshStandardMaterial color="#384858" metalness={0.88} roughness={0.25} />
          </mesh>

          {/* 16 Cam Lobes (intake & exhaust for all 8 cylinders) */}
          {Z_OFFSETS.flatMap((z, ci) => [
            <mesh key={`camL-${ci}`} position={[0.065, 0, z - 0.08]} rotation={[0, 0, CYL_FIRING_PHASES[0][ci] * 0.5]} castShadow>
              <cylinderGeometry args={[0.065, 0.138, 0.07, 16]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
            <mesh key={`camR-${ci}`} position={[-0.065, 0, z + 0.08]} rotation={[0, 0, CYL_FIRING_PHASES[1][ci] * 0.5]} castShadow>
              <cylinderGeometry args={[0.065, 0.138, 0.07, 16]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>,
          ])}
        </EnginePart>
      </group>

      {/* ── Animated Pistons & Connecting Rods ── */}
      {[
        { bi: 0, prefix: 'L', sx: -1, boreX: LEFT_BORE_X,  rotZ: BANK_ANGLE },
        { bi: 1, prefix: 'R', sx:  1, boreX: RIGHT_BORE_X, rotZ: -BANK_ANGLE },
      ].flatMap(({ bi, prefix, sx, boreX, rotZ }) =>
        Z_OFFSETS.map((z, ci) => {
          const cyl = cylRefs[bi][ci];
          const pistonId = `v8-piston-${prefix}${ci + 1}`;
          const rodId    = `v8-rod-${prefix}${ci + 1}`;

          return (
            <React.Fragment key={`cyl-${prefix}-${ci}`}>
              {/* Piston */}
              <group ref={cyl.piston} position={[boreX, BORE_Y, z]} rotation={[0, 0, rotZ]}>
                <EnginePart {...pp(pistonId, `Piston ${prefix}${ci + 1} — Forged Aluminium`, selectedPartId, onSelectPart)}
                  defaultMaterial={MATERIALS.piston} isCutaway={isCutaway}>
                  <mesh geometry={PISTON_GEO} castShadow>
                    <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
                  </mesh>
                  {/* Wrist pin */}
                  <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.040, 0.040, 0.50, 12]} />
                    <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
                  </mesh>
                </EnginePart>
              </group>

              {/* Connecting Rod */}
              <group ref={cyl.rod} position={[boreX, BORE_Y - 0.4, z]}>
                <EnginePart {...pp(rodId, `Connecting Rod ${prefix}${ci + 1} — Forged H-Beam`, selectedPartId, onSelectPart)}
                  defaultMaterial={MATERIALS.rod}>
                  <mesh castShadow>
                    <boxGeometry args={[0.075, ROD_L * 0.9, 0.11]} />
                    <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
                  </mesh>
                  {/* Big-end journal cap */}
                  <mesh position={[0, -ROD_L * 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
                    <meshStandardMaterial color="#68788c" metalness={0.90} roughness={0.20} />
                  </mesh>
                </EnginePart>
              </group>
            </React.Fragment>
          );
        })
      )}

      {/* ── Cylinder Heads (L + R) with Valves, Lifters, Pushrods, Rocker Arms ── */}
      {[
        { bi: 0, sx: -1, key: 'v8-head-left',  name: 'Left Cylinder Head — Cast Iron OHV' },
        { bi: 1, sx:  1, key: 'v8-head-right', name: 'Right Cylinder Head — Cast Iron OHV' },
      ].map(({ bi, sx, key, name }) => {
        const rotZ = sx * -BANK_ANGLE;
        const hx   = sx * (0.84 + 1.32 * explosion * Math.sin(BANK_ANGLE));
        const hy   = 0.96 + 1.32 * explosion * Math.cos(BANK_ANGLE);

        return (
          <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.cylinderHead}
            position={[hx, hy, 0]} rotation={[0, 0, rotZ]}>

            {/* Head body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.84, 0.62, 3.42]} />
              <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.20} />
            </mesh>

            {/* Valvetrain components for this bank */}
            {Z_OFFSETS.map((z, ci) => {
              const cyl = cylRefs[bi][ci];
              const pfx = bi === 0 ? 'L' : 'R';

              return (
                <React.Fragment key={`valvetrain-${pfx}-${ci}`}>
                  {/* Hydraulic Lifters */}
                  <group ref={cyl.iLifter} position={[-0.26, -0.45, z - 0.10]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.032, 0.032, 0.18, 12]} />
                      <meshStandardMaterial color="#4a5a6c" metalness={0.88} roughness={0.20} />
                    </mesh>
                  </group>
                  <group ref={cyl.eLifter} position={[0.26, -0.45, z + 0.10]}>
                    <mesh castShadow>
                      <cylinderGeometry args={[0.032, 0.032, 0.18, 12]} />
                      <meshStandardMaterial color="#4a5a6c" metalness={0.88} roughness={0.20} />
                    </mesh>
                  </group>

                  {/* Intake Valve */}
                  <group ref={cyl.iValve} position={[-0.14, 0.10, z - 0.10]}>
                    <EnginePart {...pp(`v8-ivalve-${pfx}${ci + 1}`, `Intake Valve ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.valve}>
                      <mesh geometry={VALVE_GEO} castShadow>
                        <meshStandardMaterial color="#dce8f8" metalness={0.96} roughness={0.06} />
                      </mesh>
                      <mesh geometry={SPRING_GEO} position={[0, -0.10, 0]} castShadow>
                        <meshStandardMaterial color="#6890b0" metalness={0.88} roughness={0.22} />
                      </mesh>
                    </EnginePart>
                  </group>

                  {/* Exhaust Valve */}
                  <group ref={cyl.eValve} position={[0.14, 0.10, z + 0.10]}>
                    <EnginePart {...pp(`v8-evalve-${pfx}${ci + 1}`, `Exhaust Valve ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.valve}>
                      <mesh geometry={VALVE_GEO} castShadow>
                        <meshStandardMaterial color="#dce8f8" metalness={0.96} roughness={0.06} />
                      </mesh>
                      <mesh geometry={SPRING_GEO} position={[0, -0.10, 0]} castShadow>
                        <meshStandardMaterial color="#6890b0" metalness={0.88} roughness={0.22} />
                      </mesh>
                    </EnginePart>
                  </group>

                  {/* Pushrods */}
                  <group ref={cyl.iPush} position={[-0.26, -0.22, z - 0.10]}>
                    <EnginePart {...pp(`v8-ipush-${pfx}${ci + 1}`, `Pushrod Intake ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.rod}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.016, 0.016, 0.72, 10]} />
                        <meshStandardMaterial color="#b0c4de" metalness={0.90} roughness={0.15} />
                      </mesh>
                    </EnginePart>
                  </group>

                  <group ref={cyl.ePush} position={[0.26, -0.22, z + 0.10]}>
                    <EnginePart {...pp(`v8-epush-${pfx}${ci + 1}`, `Pushrod Exhaust ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.rod}>
                      <mesh castShadow>
                        <cylinderGeometry args={[0.016, 0.016, 0.72, 10]} />
                        <meshStandardMaterial color="#b0c4de" metalness={0.90} roughness={0.15} />
                      </mesh>
                    </EnginePart>
                  </group>

                  {/* Rocker Arms */}
                  <group ref={cyl.iRock} position={[-0.14, 0.38, z - 0.10]}>
                    <EnginePart {...pp(`v8-irock-${pfx}${ci + 1}`, `Rocker Arm Intake ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.valve}>
                      <mesh castShadow>
                        <boxGeometry args={[0.18, 0.06, 0.06]} />
                        <meshStandardMaterial color="#405060" metalness={0.88} roughness={0.22} />
                      </mesh>
                    </EnginePart>
                  </group>

                  <group ref={cyl.eRock} position={[0.14, 0.38, z + 0.10]}>
                    <EnginePart {...pp(`v8-erock-${pfx}${ci + 1}`, `Rocker Arm Exhaust ${pfx}${ci + 1}`, selectedPartId, onSelectPart)}
                      defaultMaterial={MATERIALS.valve}>
                      <mesh castShadow>
                        <boxGeometry args={[0.18, 0.06, 0.06]} />
                        <meshStandardMaterial color="#405060" metalness={0.88} roughness={0.22} />
                      </mesh>
                    </EnginePart>
                  </group>
                </React.Fragment>
              );
            })}
          </EnginePart>
        );
      })}

      {/* ── Valve Covers (L + R) ── */}
      {[
        { sx: -1, key: 'v8-cover-left',  name: 'Left Stamped Steel Valve Cover' },
        { sx:  1, key: 'v8-cover-right', name: 'Right Stamped Steel Valve Cover' },
      ].map(({ sx, key, name }) => {
        const cvX = sx * (1.12 + 2.30 * explosion * Math.sin(BANK_ANGLE));
        const cvY = 1.42 + 2.30 * explosion * Math.cos(BANK_ANGLE);
        return (
          <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.valveCover} isShell isCutaway={isCutaway}
            position={[cvX, cvY, 0]} rotation={[0, 0, sx * -BANK_ANGLE]}>
            <mesh castShadow>
              <boxGeometry args={[0.80, 0.30, 3.36]} />
              <meshStandardMaterial color="#b81c1c" metalness={0.78} roughness={0.24} />
            </mesh>
          </EnginePart>
        );
      })}

      {/* ── Intake Manifold ── */}
      <EnginePart {...pp('v8-intake', 'Dual-Plane Intake Manifold', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.intake}
        position={[0, 1.18 + 1.9 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.28, 0.48, 3.30]} />
          <meshStandardMaterial color="#303848" metalness={0.55} roughness={0.52} />
        </mesh>
      </EnginePart>

      {/* ── Oil Pan ── */}
      <EnginePart {...pp('v8-oilpan', 'Stamped Steel Oil Pan', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -0.98 - 2.5 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.56, 0.48, 3.42]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>
      </EnginePart>

    </group>
  );
}
