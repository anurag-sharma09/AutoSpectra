/**
 * SingleCylinderEngine.jsx
 * 250–500cc 4-Stroke Single Cylinder OHV Engine (Motorcycle / Thumper style)
 *
 * Mechanical Architecture:
 * - Air-cooled cylinder barrel with 10 lathe cooling fins & steel liner
 * - Lower crankcase halves with split flange line & main bearing caps
 * - Twin counterweight crank webs (flywheel discs) & single crank pin
 * - Forged aluminium piston with ring grooves, skirt cutouts & wrist pin
 * - Forged H-beam connecting rod with slider-crank kinematics
 * - SOHC / OHV Camshaft in block with cam lobes & timing gear
 * - 2 Tappets/lifters, 2 pushrods, 2 rocker arms, 2 valves (intake & exhaust) & valve springs
 * - Exhaust header pipe connected flush to cylinder head exhaust port flange
 *
 * NO helper/fake rods. Every moving part is real engine architecture.
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
  makeFinRingGeometry,
} from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.38, 0.68);
const VALVE_GEO  = makeValveGeometry(0.52, 0.125, 0.023);
const SPRING_GEO = makeValveSpringGeometry(0.095, 0.013, 6, 0.36);
const FIN_GEO    = makeFinRingGeometry(0.40, 0.62, 0.028);

const CRANK_R = 0.30;
const ROD_L   = 0.90;

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function SingleCylinderEngine({
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
  const rodRef   = useRef();
  const pistonRef = useRef();
  const camRef   = useRef();
  const iValveRef = useRef();
  const eValveRef = useRef();
  const iPushRef  = useRef();
  const ePushRef  = useRef();
  const iRockRef  = useRef();
  const eRockRef  = useRef();

  // Reset logic
  useEffect(() => {
    if (resetSignal > 0) {
      thetaRef.current = 0;
      if (crankRef.current) crankRef.current.rotation.z = 0;
      if (camRef.current) camRef.current.rotation.z = 0;
      if (onCrankUpdate) onCrankUpdate(0);
    }
  }, [resetSignal]);

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 4.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (onCrankUpdate) {
      const deg = ((theta * 180 / Math.PI) % 720 + 720) % 720;
      onCrankUpdate(deg);
    }

    // Kinematics calculations
    const crankYCenter = -0.32 - 1.5 * explosion;
    const pinX = CRANK_R * Math.cos(theta);
    const pinY = crankYCenter + CRANK_R * Math.sin(theta);
    const pistonY = crankYCenter + CRANK_R * Math.sin(theta) + Math.sqrt(Math.max(0.01, ROD_L * ROD_L - pinX * pinX));
    const rodAngle = Math.atan2(-pinX, pistonY - pinY);

    if (crankRef.current) {
      crankRef.current.rotation.z = theta;
    }

    if (pistonRef.current) {
      pistonRef.current.position.set(0, pistonY + explosion * 1.0, 0);
    }

    if (rodRef.current) {
      rodRef.current.position.set(pinX * 0.5, (pistonY + pinY) * 0.5, 0);
      rodRef.current.rotation.z = rodAngle;
    }

    // Camshaft rotates at exactly 1/2 crankshaft speed
    if (camRef.current) {
      camRef.current.rotation.z = theta * 0.5;
    }

    // 4-Stroke Valve Timing
    const normAngle = ((theta * 0.5) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2);

    let iLift = 0; // Intake lift (0..180°)
    if (normAngle > 0.2 && normAngle < 1.8) {
      iLift = Math.sin((normAngle - 0.2) / 1.6 * Math.PI);
    }

    let eLift = 0; // Exhaust lift (540°..720°)
    if (normAngle > 4.5 && normAngle < 6.1) {
      eLift = Math.sin((normAngle - 4.5) / 1.6 * Math.PI);
    }

    const MAX_VLV = 0.08;
    const MAX_PUSH = 0.06;

    if (iValveRef.current) iValveRef.current.position.y = -iLift * MAX_VLV;
    if (eValveRef.current) eValveRef.current.position.y = -eLift * MAX_VLV;

    if (iPushRef.current)  iPushRef.current.position.y  =  iLift * MAX_PUSH;
    if (ePushRef.current)  ePushRef.current.position.y  =  eLift * MAX_PUSH;

    if (iRockRef.current)  iRockRef.current.rotation.z  = -iLift * 0.25;
    if (eRockRef.current)  eRockRef.current.rotation.z  = -eLift * 0.25;
  });

  const FIN_POSITIONS = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => -0.38 + i * 0.085);
  }, []);

  return (
    <group position={[0, -0.25, 0]}>

      {/* ── Crankcase ── */}
      <EnginePart {...pp('single-crankcase', 'Crankcase / Lower Block — Aluminium Casting', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Lower crankcase halves */}
        <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.15, 0.88, 0.95]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.58} />
        </mesh>

        {/* Split line flanges */}
        <mesh position={[0, -0.58, 0]} castShadow>
          <boxGeometry args={[1.22, 0.06, 1.00]} />
          <meshStandardMaterial color="#38445a" metalness={0.82} roughness={0.28} />
        </mesh>

        {/* Primary drive side cover */}
        <mesh position={[-0.62, -0.10, 0]} castShadow>
          <boxGeometry args={[0.10, 0.80, 0.88]} />
          <meshStandardMaterial color="#282e3a" metalness={0.72} roughness={0.50} />
        </mesh>
        {/* Clutch / gearbox cover side */}
        <mesh position={[0.62, -0.10, 0]} castShadow>
          <boxGeometry args={[0.10, 0.80, 0.88]} />
          <meshStandardMaterial color="#282e3a" metalness={0.72} roughness={0.50} />
        </mesh>

        {/* Crank bearing tunnels (2 sides) */}
        {[-0.44, 0.44].map((z, i) => (
          <mesh key={i} position={[0, -0.28, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.20, 0.20, 0.08, 20]} />
            <meshStandardMaterial color="#3a4858" metalness={0.88} roughness={0.22} />
          </mesh>
        ))}

        {/* Main bearing cap */}
        <EnginePart {...pp('single-maincap', 'Main Bearing Cap', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}
          position={[0, -0.62, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.70, 0.22, 0.25]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>
          {[-0.22, 0.22].map((dx, i) => (
            <mesh key={i} position={[dx, 0.10, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.18, 8]} />
              <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.30} />
            </mesh>
          ))}
        </EnginePart>
      </EnginePart>

      {/* ── Crankshaft ── */}
      <group ref={crankRef} position={[0, -0.32 - 1.5 * explosion, 0]}>
        <EnginePart {...pp('single-crank', 'Single-Cylinder Crankshaft — Forged Steel', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          {/* Shaft through width of engine */}
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.10, 1.02, 20]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* 2 main journals */}
          {[-0.40, 0.40].map((z, i) => (
            <mesh key={i} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.185, 0.185, 0.16, 20]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}

          {/* Single rod journal */}
          <mesh position={[CRANK_R, 0, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.155, 0.155, 0.25, 18]} />
            <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
          </mesh>

          {/* 2 crank webs (discs) */}
          {[-0.14, 0.14].map((z, i) => (
            <mesh key={i} position={[CRANK_R * 0.5, 0, z]} castShadow>
              <boxGeometry args={[CRANK_R * 1.2, 0.60, 0.08]} />
              <meshStandardMaterial color="#404e60" metalness={0.90} roughness={0.20} />
            </mesh>
          ))}

          {/* Counterweight */}
          <mesh position={[-CRANK_R * 0.6, 0, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.26, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Primary sprocket (left side) */}
          <mesh position={[0, 0, -0.58]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.10, 22]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.28} />
          </mesh>

          {/* Flywheel / alternator rotor (right side) */}
          <mesh position={[0, 0, 0.56]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.40, 0.40, 0.08, 30]} />
            <meshStandardMaterial color="#2c3442" metalness={0.85} roughness={0.40} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Connecting Rod ── */}
      <group ref={rodRef} position={[0, 0, 0]}>
        <EnginePart {...pp('single-rod', 'Connecting Rod — Forged Steel H-Beam', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.rod}>

          {/* Rod body (I-beam) */}
          <mesh castShadow>
            <boxGeometry args={[0.08, 1.02, 0.115]} />
            <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
          </mesh>

          {/* Small end (wrist pin) */}
          <mesh position={[0, 0.50, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.10, 0.10, 0.28, 16]} />
            <meshStandardMaterial color="#6a7e94" metalness={0.90} roughness={0.20} />
          </mesh>

          {/* Big end */}
          <mesh position={[0, -0.52, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.165, 0.165, 0.26, 18]} />
            <meshStandardMaterial color="#6a7e94" metalness={0.90} roughness={0.20} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Piston ── */}
      <group ref={pistonRef} position={[0, 0.40 + explosion * 1.0, 0]}>
        <EnginePart {...pp('single-piston', 'Forged Aluminium Piston', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.piston} isCutaway={isCutaway}>

          <mesh geometry={PISTON_GEO} castShadow>
            <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
          </mesh>

          {/* Wrist pin */}
          <mesh position={[0, -0.08, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.042, 0.042, 0.55, 14]} />
            <meshStandardMaterial color="#a8b8cc" metalness={0.88} roughness={0.18} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Cylinder Barrel (with cooling fins) ── */}
      <EnginePart {...pp('single-barrel', 'Finned Cylinder Barrel — Air Cooled Steel Liner', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.cylinderHead} isShell isCutaway={isCutaway}
        position={[0, 0.55 + explosion * 0.2, 0]}>

        {/* Main barrel body */}
        <mesh castShadow>
          <cylinderGeometry args={[0.405, 0.405, 0.92, 28]} />
          <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.22} />
        </mesh>

        {/* Bore open cylinder */}
        <mesh castShadow>
          <cylinderGeometry args={[0.382, 0.382, 0.94, 28, 1, true]} />
          <meshStandardMaterial color="#1e2838" metalness={0.80} roughness={0.35} side={THREE.BackSide} />
        </mesh>

        {/* Cooling fins */}
        {FIN_POSITIONS.map((fy, fi) => (
          <mesh key={fi} geometry={FIN_GEO} position={[0, fy, 0]} castShadow>
            <meshStandardMaterial color="#7a98b4" metalness={0.85} roughness={0.22} />
          </mesh>
        ))}
      </EnginePart>

      {/* ── Cylinder Head — OHV / SOHC ── */}
      <EnginePart {...pp('single-head', 'Cylinder Head — 2 Valve OHV', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.cylinderHead}
        position={[0, 1.35 + 1.6 * explosion, 0]}>

        {/* Head body */}
        <mesh castShadow>
          <boxGeometry args={[1.02, 0.54, 1.02]} />
          <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.20} />
        </mesh>

        {/* Combustion chamber dome */}
        <mesh position={[0, -0.28, 0]} castShadow>
          <sphereGeometry args={[0.295, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#7a98b4" metalness={0.85} roughness={0.22} />
        </mesh>

        {/* Intake Valve */}
        <group ref={iValveRef} position={[0.16, 0, 0]}>
          <EnginePart {...pp('single-ivalve', 'Intake Valve', selectedPartId, onSelectPart)}
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
        <group ref={eValveRef} position={[-0.16, 0, 0]}>
          <EnginePart {...pp('single-evalve', 'Exhaust Valve', selectedPartId, onSelectPart)}
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
        <group ref={iPushRef} position={[0.22, -0.20, 0.20]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.65, 10]} />
            <meshStandardMaterial color="#b0c4de" metalness={0.90} roughness={0.15} />
          </mesh>
        </group>

        <group ref={ePushRef} position={[-0.22, -0.20, 0.20]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.016, 0.016, 0.65, 10]} />
            <meshStandardMaterial color="#b0c4de" metalness={0.90} roughness={0.15} />
          </mesh>
        </group>

        {/* Rocker Arms */}
        <group ref={iRockRef} position={[0.16, 0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.06, 0.06]} />
            <meshStandardMaterial color="#405060" metalness={0.88} roughness={0.22} />
          </mesh>
        </group>

        <group ref={eRockRef} position={[-0.16, 0.32, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.18, 0.06, 0.06]} />
            <meshStandardMaterial color="#405060" metalness={0.88} roughness={0.22} />
          </mesh>
        </group>
      </EnginePart>

      {/* ── Camshaft (OHV) in Block ── */}
      <group ref={camRef} position={[0, 0.22, 0.22]} rotation={[0, Math.PI / 2, 0]}>
        <EnginePart {...pp('single-cam', 'Single Camshaft with Lobes', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.camshaft}>

          <mesh castShadow>
            <cylinderGeometry args={[0.060, 0.060, 0.65, 16]} />
            <meshStandardMaterial color="#5a7090" metalness={0.88} roughness={0.20} />
          </mesh>

          {/* 2 Cam Lobes */}
          {[-0.15, 0.15].map((z, li) => (
            <mesh key={li} position={[0.06, 0, z]} rotation={[0, 0, li * Math.PI * 0.75]} castShadow>
              <cylinderGeometry args={[0.058, 0.128, 0.07, 14]} />
              <meshStandardMaterial color="#485c72" metalness={0.90} roughness={0.18} />
            </mesh>
          ))}
        </EnginePart>
      </group>

      {/* ── Valve Cover ── */}
      <EnginePart {...pp('single-cover', 'Valve Cover', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.valveCover} isShell isCutaway={isCutaway}
        position={[0, 1.78 + 2.4 * explosion, 0]}>

        <mesh castShadow>
          <boxGeometry args={[0.98, 0.26, 0.98]} />
          <meshStandardMaterial color="#1a3a72" metalness={0.78} roughness={0.24} />
        </mesh>
      </EnginePart>

      {/* ── Oil Pan ── */}
      <EnginePart {...pp('single-oilpan', 'Single Cylinder Oil Pan / Sump', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.oilPan}
        position={[0, -0.98 - 2.5 * explosion, 0]}>

        <mesh castShadow>
          <boxGeometry args={[1.18, 0.40, 1.00]} />
          <meshStandardMaterial color="#141820" metalness={0.82} roughness={0.46} />
        </mesh>
      </EnginePart>

      {/* ── Exhaust Header Pipe (Connected Flush to Cylinder Head Exhaust Flange) ── */}
      <EnginePart {...pp('single-exhaust', 'Exhaust Header Pipe', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.exhaust}
        position={[-0.51 - 1.2 * explosion, 1.35 + 1.6 * explosion, 0]}>

        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.058, 0.058, 0.45, 14]} />
          <meshStandardMaterial color="#c07848" metalness={0.86} roughness={0.26} />
        </mesh>
        {/* Exhaust Port Mounting Flange */}
        <mesh position={[0.20, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          <meshStandardMaterial color="#3a4858" metalness={0.88} roughness={0.30} />
        </mesh>
      </EnginePart>

    </group>
  );
}
