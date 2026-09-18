/**
 * RotaryEngine.jsx
 * Twin-Rotor Wankel (RX-7 / RX-8 style)
 * Full Imperative Kinematics with 1:3 rotor planet gearing and eccentric motion.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import EnginePart from './EnginePart';
import { MATERIALS } from './materials';
import { makeRotorGeometry } from './engineGeometry';

function pp(id, name, sel, cb) { return { partId: id, partName: name, selectedPartId: sel, onSelectPart: cb }; }

function makeHousingGeometry(R = 0.72, depth = 0.24) {
  const shape = new THREE.Shape();
  const pts = 64;
  for (let i = 0; i <= pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const r = R * (1 + 0.14 * Math.cos(2 * a));
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false });
}

export default function RotaryEngine({ explosion=0, selectedPartId=null, onSelectPart, isCutaway=false, isAnimated=false, animationSpeed=1.0 }) {
  const thetaRef = useRef(0);
  const shaftRef = useRef();
  const rotorsRef = useRef([]);

  useFrame((_, dt) => {
    if (isAnimated) {
      thetaRef.current += dt * 5.0 * animationSpeed;
    }
    const theta = thetaRef.current;

    if (shaftRef.current) {
      shaftRef.current.rotation.z = theta;
    }

    const ECC = 0.18; // Eccentric shaft offset
    const rotorZ = [-0.22, 0.22];

    rotorZ.forEach((z, ri) => {
      const rotorPhase = ri * Math.PI; // Phase offset between 2 rotors (180°)
      const orbitAngle = theta;
      const spinAngle = theta * (1 / 3) + rotorPhase;

      const ex = ECC * Math.cos(orbitAngle);
      const ey = ECC * Math.sin(orbitAngle);

      if (rotorsRef.current[ri]) {
        rotorsRef.current[ri].position.set(ex, ey, z);
        rotorsRef.current[ri].rotation.z = spinAngle;
      }
    });
  });

  const ROTOR_GEO   = useMemo(() => makeRotorGeometry(0.52, 0.22), []);
  const HOUSING_GEO = useMemo(() => makeHousingGeometry(0.72, 0.24), []);
  const rotorZ = [-0.22, 0.22];

  return (
    <group position={[0, 0, 0]}>

      {/* ── Rotor Housings (2) ── */}
      {rotorZ.map((z, ri) => (
        <EnginePart key={`rotary-housing-${ri}`}
          {...pp('rotary-housing', `Rotor #${ri + 1} Housing — Aluminium`, selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.cylinderHead} isShell isCutaway={isCutaway}
          position={[0, 0, z]}>

          <mesh geometry={HOUSING_GEO} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <meshStandardMaterial color="#7a98b4" metalness={0.82} roughness={0.30} side={THREE.DoubleSide} />
          </mesh>

          {[-0.13, 0.13].map((dz, si) => (
            <mesh key={si} position={[0, 0, dz]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.74, 0.74, 0.03, 40]} />
              <meshStandardMaterial color="#6a8aaa" metalness={0.85} roughness={0.22} />
            </mesh>
          ))}
        </EnginePart>
      ))}

      {/* ── Eccentric Rotors (2) — spinning + orbiting ── */}
      {rotorZ.map((z, ri) => (
        <group key={`rotary-rotor-grp-${ri}`} ref={node => rotorsRef.current[ri] = node} position={[0, 0, z]}>
          <EnginePart {...pp(`rotary-rotor-${ri}`, `Eccentric Rotor #${ri + 1} — Aluminium Alloy`, selectedPartId, onSelectPart)}
            defaultMaterial={MATERIALS.piston}>

            <mesh geometry={ROTOR_GEO} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <meshStandardMaterial color="#c2d2e8" metalness={0.92} roughness={0.12} />
            </mesh>

            {[0, 2 * Math.PI / 3, 4 * Math.PI / 3].map((ang, si) => (
              <mesh key={si} position={[0.54 * Math.cos(ang), 0.54 * Math.sin(ang), 0]} rotation={[0, 0, ang]} castShadow>
                <boxGeometry args={[0.045, 0.08, 0.24]} />
                <meshStandardMaterial color="#485566" metalness={0.88} roughness={0.26} />
              </mesh>
            ))}

            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.18, 0.22, 20]} />
              <meshStandardMaterial color="#485566" metalness={0.90} roughness={0.18} />
            </mesh>
          </EnginePart>
        </group>
      ))}

      {/* ── Eccentric Shaft ── */}
      <group ref={shaftRef} position={[0, 0, 0]}>
        <EnginePart {...pp('rotary-shaft', 'Eccentric Output Shaft', selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.crankshaft}>

          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.09, 0.09, 1.05, 20]} />
            <meshStandardMaterial color="#485566" metalness={0.92} roughness={0.16} />
          </mesh>

          {rotorZ.map((z, ri) => (
            <mesh key={ri} position={[0.18, 0, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.14, 0.14, 0.20, 18]} />
              <meshStandardMaterial color="#5a6878" metalness={0.94} roughness={0.10} />
            </mesh>
          ))}

          <mesh position={[0, 0, -0.62]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.30, 0.30, 0.16, 22]} />
            <meshStandardMaterial color="#3c4858" metalness={0.88} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.60]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 0.06, 30]} />
            <meshStandardMaterial color="#2c3442" metalness={0.85} roughness={0.40} />
          </mesh>
        </EnginePart>
      </group>

      {/* ── Intermediate Housing ── */}
      <EnginePart {...pp('rotary-intermediate', 'Intermediate Housing', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.block}
        position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.70, 0.70, 0.06, 36]} />
          <meshStandardMaterial color="#2c3342" metalness={0.75} roughness={0.55} />
        </mesh>
      </EnginePart>

      {/* ── Front + Rear end covers ── */}
      {[[-0.66 - explosion * 1.4, 'rotary-front-cover', 'Front End Cover'], [0.66 + explosion * 1.4, 'rotary-rear-cover', 'Rear End Cover']].map(([z, key, name]) => (
        <EnginePart key={key} {...pp(key, name, selectedPartId, onSelectPart)}
          defaultMaterial={MATERIALS.block}
          position={[0, 0, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.08, 36]} />
            <meshStandardMaterial color="#28323e" metalness={0.78} roughness={0.42} />
          </mesh>
        </EnginePart>
      ))}

      {/* ── Intake Manifold ── */}
      <EnginePart {...pp('rotary-intake', 'Peripheral Port Intake Manifold', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.intake}
        position={[0, 0.85 + 1.8 * explosion, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.28, 0.32, 0.92]} />
          <meshStandardMaterial color="#303848" metalness={0.55} roughness={0.52} />
        </mesh>
        {[-0.20, 0.20].map((z, i) => (
          <mesh key={i} position={[0, 0.20, z]} castShadow>
            <cylinderGeometry args={[0.095, 0.095, 0.24, 14]} />
            <meshStandardMaterial color="#404858" metalness={0.65} roughness={0.38} />
          </mesh>
        ))}
      </EnginePart>

      {/* ── Exhaust ── */}
      <EnginePart {...pp('rotary-exhaust', 'Rotary Exhaust Manifold + Downpipe', selectedPartId, onSelectPart)}
        defaultMaterial={MATERIALS.exhaust}
        position={[0, -0.80 - 1.8 * explosion, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.10, 0.10, 0.78, 14]} />
          <meshStandardMaterial color="#c07848" metalness={0.86} roughness={0.26} />
        </mesh>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.26, 14]} />
          <meshStandardMaterial color="#b87040" metalness={0.86} roughness={0.28} />
        </mesh>
      </EnginePart>

    </group>
  );
}
