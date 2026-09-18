/**
 * RadialEngine.jsx
 * 7-Cylinder Air-Cooled Radial (WWII Pratt & Whitney / Wright style)
 * Full Imperative Kinematics with direct Three.js ref mutation inside useFrame.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makePistonGeometry, makeFinRingGeometry, sliderCrankY } from './engineGeometry';

const PISTON_GEO = makePistonGeometry(0.30, 0.54);
const FIN_GEO    = makeFinRingGeometry(0.30, 0.46, 0.022);

const N_CYLINDERS = 7;
const CRANK_R = 0.26;
const ROD_L   = 0.82;
const BASE_RADIUS = 1.35;  // cylinder centre distance from crankcase axis

const CYL_ANGLES = Array.from({ length: N_CYLINDERS }, (_, i) => (i / N_CYLINDERS) * Math.PI * 2);

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

export default function RadialEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
  const thetaRef = useRef(0);
  const crankRef = useRef();
  const pistonsRef = useRef([]);

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 5.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (crankRef.current) {
      crankRef.current.rotation.z = theta;
    }

    CYL_ANGLES.forEach((angle, i) => {
      const pDisp = sliderCrankY(CRANK_R, ROD_L, theta - angle) - ROD_L;
      const totalR = BASE_RADIUS + pDisp + explosion * 1.2;

      const px = Math.sin(angle) * totalR;
      const py = Math.cos(angle) * totalR;

      if (pistonsRef.current[i]) {
        pistonsRef.current[i].position.set(px, py, 0);
        pistonsRef.current[i].rotation.z = -angle;
      }
    });
  });

  const FIN_POSITIONS = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => -0.24 + i * 0.095);
  }, []);

  return (
    <group position={[0, 0, 0]}>

      {/* ── Central Circular Crankcase ── */}
      <EnginePart {...pp('radial-crankcase', '7-Cylinder Radial Crankcase — Aluminium', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block} isShell isCutaway={isCutaway}>

        {/* Main crankcase disc */}
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.88, 0.95, 0.72, 36]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.55} />
        </mesh>

        {/* Front face — prop hub mount */}
        <mesh position={[0, 0, -0.42]} castShadow>
          <cylinderGeometry args={[0.35, 0.88, 0.12, 32]} />
          <meshStandardMaterial color="#28323e" metalness={0.78} roughness={0.42} />
        </mesh>

        {/* Rear face — accessory drive */}
        <mesh position={[0, 0, 0.42]} castShadow>
          <cylinderGeometry args={[0.32, 0.92, 0.10, 32]} />
          <meshStandardMaterial color="#28323e" metalness={0.78} roughness={0.42} />
        </mesh>
      </EnginePart>

      {/* ── Single Throw Crankshaft ── */}
      <group ref={crankRef} position={[0, 0, 0]}>
        <EnginePart {...pp('radial-crank', 'Single-Throw Radial Crankshaft', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.92, 22]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {/* Single crank throw */}
          <mesh position={[0, CRANK_R, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.28, 20]} />
            <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
          </mesh>

          {/* Large counterweight */}
          <mesh position={[0, -CRANK_R * 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.42, 0.22, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.22} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── 7 Radial Cylinder Barrels ── */}
      {CYL_ANGLES.map((angle, i) => {
        const cx = Math.sin(angle) * (BASE_RADIUS + explosion * 0.8);
        const cy = Math.cos(angle) * (BASE_RADIUS + explosion * 0.8);

        return (
          <EnginePart key={`barrel-${i}`}
            {...pp(`radial-barrel-${i}`, `Cylinder Barrel #${i + 1} — Air-Cooled`, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.cylinderHead}
            position={[cx, cy, 0]}
            rotation={[0, 0, -angle]}>

            {/* Cylinder barrel body */}
            <mesh castShadow>
              <cylinderGeometry args={[0.32, 0.32, 0.72, 24]} />
              <meshStandardMaterial color="#8ea4be" metalness={0.88} roughness={0.22} />
            </mesh>

            {/* Cooling fins */}
            {FIN_POSITIONS.map((fy, fi) => (
              <mesh key={fi} geometry={FIN_GEO} position={[0, fy, 0]} castShadow>
                <meshStandardMaterial color="#7a98b4" metalness={0.85} roughness={0.22} />
              </mesh>
            ))}

            {/* Rocker box / cylinder head top */}
            <mesh position={[0, 0.44, 0]} castShadow>
              <boxGeometry args={[0.62, 0.26, 0.62]} />
              <meshStandardMaterial color="#6a82a0" metalness={0.86} roughness={0.24} />
            </mesh>
          </EnginePart>
        );
      })}

      {/* ── 7 Radial Pistons ── */}
      {CYL_ANGLES.map((angle, i) => (
        <group key={`radial-piston-grp-${i}`} ref={node => pistonsRef.current[i] = node}>
          <EnginePart {...pp(`radial-piston-${i}`, `Radial Piston #${i + 1}`, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.piston}
            isCutaway={isCutaway}>

            <mesh geometry={PISTON_GEO} castShadow>
              <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
            </mesh>

            {/* Connecting rod */}
            <mesh position={[0, -0.38, 0]} castShadow>
              <boxGeometry args={[0.065, 0.65, 0.088]} />
              <meshStandardMaterial color="#7a8ea4" metalness={0.88} roughness={0.22} />
            </mesh>
          </EnginePart>
        </group>
      ))}

      {/* ── Propeller Hub (Front) ── */}
      <EnginePart {...pp('radial-prophub', 'Propeller Mounting Flange + Shaft', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.crankshaft}
        position={[0, 0, -0.65 - explosion * 1.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.42, 24]} />
          <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
        </mesh>
        <mesh position={[0, 0, -0.22]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.48, 0.48, 0.08, 30]} />
          <meshStandardMaterial color="#38445a" metalness={0.85} roughness={0.28} />
        </mesh>
      </EnginePart>

    </group>
  );
}
