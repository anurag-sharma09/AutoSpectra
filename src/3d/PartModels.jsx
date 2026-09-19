import React, { useMemo } from 'react';
import * as THREE from 'three';
import { MATERIALS } from './materials';
import {
  makePistonGeometry,
  makeValveGeometry,
  makeCamLobeGeometry,
  makeValveSpringGeometry,
  makeBoreGeometry,
  makeCrankWebGeometry,
  makeHeaderTube
} from './engineGeometry';

// ── 1. ENGINE BLOCK ─────────────────────────────────────────
export function PartEngineBlock({ explosion = 0 }) {
  const blockMat = MATERIALS.block;
  const cylinderMat = MATERIALS.cylinderHead;
  const boltMat = MATERIALS.bolt;

  return (
    <group>
      {/* Main Crankcase Box */}
      <mesh position={[0, -0.2, 0]} material={blockMat}>
        <boxGeometry args={[1.8, 1.2, 2.4]} />
      </mesh>

      {/* 4 Cylinder Bores cut into block */}
      {[-0.75, -0.25, 0.25, 0.75].map((z, idx) => (
        <group key={idx} position={[0, 0.35, z]}>
          <mesh geometry={makeBoreGeometry(0.32, 0.42, 0.8)} material={cylinderMat} />
        </group>
      ))}

      {/* Main Bearing Saddles underneath */}
      {[-0.9, -0.3, 0.3, 0.9].map((z, idx) => (
        <mesh key={idx} position={[0, -0.8, z]} rotation={[Math.PI / 2, 0, 0]} material={blockMat}>
          <cylinderGeometry args={[0.35, 0.35, 0.15, 24]} />
        </mesh>
      ))}

      {/* Deck Mounting Bolts */}
      {[-0.8, 0.8].map((x) =>
        [-1.0, -0.5, 0, 0.5, 1.0].map((z, idx) => (
          <mesh key={`${x}-${idx}`} position={[x, 0.42, z]} material={boltMat}>
            <cylinderGeometry args={[0.03, 0.03, 0.12, 12]} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ── 2. CYLINDER HEAD ─────────────────────────────────────────
export function PartCylinderHead({ explosion = 0 }) {
  const headMat = MATERIALS.cylinderHead;
  const valveMat = MATERIALS.valve;

  const explodeOffset = explosion * 0.5;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Cylinder Head Casting */}
      <mesh position={[0, 0, 0]} material={headMat}>
        <boxGeometry args={[1.6, 0.65, 2.2]} />
      </mesh>

      {/* Combustion Chambers & Port Openings on Underside */}
      {[-0.6, -0.2, 0.2, 0.6].map((z, idx) => (
        <group key={idx} position={[0, -0.34 - explodeOffset, z]}>
          {/* Chamber dome */}
          <mesh rotation={[Math.PI, 0, 0]} material={MATERIALS.piston}>
            <sphereGeometry args={[0.3, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.4]} />
          </mesh>
          {/* Intake / Exhaust Valve Port Seats */}
          <mesh position={[-0.15, 0.02, 0]} material={valveMat}>
            <cylinderGeometry args={[0.10, 0.10, 0.04, 16]} />
          </mesh>
          <mesh position={[0.15, 0.02, 0]} material={valveMat}>
            <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── 3. PISTON & COMPRESSION RINGS ────────────────────────────
export function PartPiston({ explosion = 0 }) {
  const pistonGeo = useMemo(() => makePistonGeometry(0.48, 0.72), []);
  const pistonMat = MATERIALS.piston;
  const ringMat = MATERIALS.crankshaft;
  const pinMat = MATERIALS.valve;

  const explodeOffset = explosion * 0.4;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Piston Body */}
      <mesh geometry={pistonGeo} material={pistonMat} />

      {/* Compression Rings */}
      {[-0.05 + explodeOffset * 0.8, 0.08 + explodeOffset * 1.2, 0.20 + explodeOffset * 1.6].map((y, idx) => (
        <mesh key={idx} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} material={ringMat}>
          <torusGeometry args={[0.485, 0.014, 12, 32]} />
        </mesh>
      ))}

      {/* Wrist Pin */}
      <mesh position={[0, -0.15 - explodeOffset * 0.5, 0]} rotation={[0, 0, Math.PI / 2]} material={pinMat}>
        <cylinderGeometry args={[0.09, 0.09, 0.92, 24]} />
      </mesh>
    </group>
  );
}

// ── 4. CONNECTING ROD ────────────────────────────────────────
export function PartConnectingRod({ explosion = 0 }) {
  const rodMat = MATERIALS.rod;
  const boltMat = MATERIALS.bolt;
  const bearingMat = MATERIALS.piston;

  const explodeOffset = explosion * 0.45;

  return (
    <group position={[0, 0, 0]}>
      {/* Small End (Wrist Pin Bushing) */}
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]} material={rodMat}>
        <cylinderGeometry args={[0.16, 0.16, 0.22, 24]} />
      </mesh>
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]} material={bearingMat}>
        <cylinderGeometry args={[0.10, 0.10, 0.23, 24]} />
      </mesh>

      {/* H-Beam Rod Shaft */}
      <mesh position={[0, 0.15, 0]} material={rodMat}>
        <boxGeometry args={[0.18, 0.95, 0.10]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={rodMat}>
        <boxGeometry args={[0.06, 0.95, 0.18]} />
      </mesh>

      {/* Big End Journal Body */}
      <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={rodMat}>
        <cylinderGeometry args={[0.32, 0.32, 0.24, 24, 1, true, -Math.PI / 2, Math.PI]} />
      </mesh>

      {/* Big End Rod Cap (Explodable) */}
      <group position={[0, -explodeOffset, 0]}>
        <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={rodMat}>
          <cylinderGeometry args={[0.32, 0.32, 0.24, 24, 1, true, Math.PI / 2, Math.PI]} />
        </mesh>
        {/* Rod Cap Bolts */}
        {[-0.26, 0.26].map((x, idx) => (
          <mesh key={idx} position={[x, -0.45, 0]} material={boltMat}>
            <cylinderGeometry args={[0.035, 0.035, 0.35, 12]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── 5. CRANKSHAFT ────────────────────────────────────────────
export function PartCrankshaft({ explosion = 0 }) {
  const crankMat = MATERIALS.crankshaft;
  const webGeo = useMemo(() => makeCrankWebGeometry(0.55, 0.18, 0.14), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Central Axis Shaft */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={crankMat}>
        <cylinderGeometry args={[0.14, 0.14, 2.6, 24]} />
      </mesh>

      {/* Main Journals & Counterweights */}
      {[-0.9, -0.3, 0.3, 0.9].map((z, idx) => (
        <group key={idx} position={[0, 0, z]}>
          <mesh geometry={webGeo} material={crankMat} position={[0, 0, -0.07]} rotation={[0, 0, idx % 2 === 0 ? 0 : Math.PI]} />
          {/* Offset Crank Pin Throw */}
          <mesh position={[0, idx % 2 === 0 ? 0.32 : -0.32, 0.10]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.valve}>
            <cylinderGeometry args={[0.15, 0.15, 0.22, 24]} />
          </mesh>
        </group>
      ))}

      {/* Front Snout & Rear Flywheel Flange */}
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]} material={crankMat}>
        <cylinderGeometry args={[0.10, 0.10, 0.35, 24]} />
      </mesh>
      <mesh position={[0, 0, -1.4]} rotation={[Math.PI / 2, 0, 0]} material={crankMat}>
        <cylinderGeometry args={[0.30, 0.30, 0.12, 24]} />
      </mesh>
    </group>
  );
}

// ── 6. CAMSHAFT ──────────────────────────────────────────────
export function PartCamshaft({ explosion = 0 }) {
  const camMat = MATERIALS.camshaft;
  const lobeGeo = useMemo(() => makeCamLobeGeometry(0.16, 0.25, 0.12), []);

  return (
    <group position={[0, 0, 0]}>
      {/* Camshaft Main Bar */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={camMat}>
        <cylinderGeometry args={[0.10, 0.10, 2.4, 24]} />
      </mesh>

      {/* Cam Lobes angled along length */}
      {[-0.9, -0.65, -0.4, -0.15, 0.15, 0.4, 0.65, 0.9].map((z, idx) => (
        <mesh key={idx} geometry={lobeGeo} material={camMat} position={[0, 0, z]} rotation={[0, 0, (idx * Math.PI) / 3]} />
      ))}

      {/* Drive Sprocket Gear */}
      <mesh position={[0, 0, 1.25]} rotation={[Math.PI / 2, 0, 0]} material={MATERIALS.crankshaft}>
        <cylinderGeometry args={[0.38, 0.38, 0.10, 32]} />
      </mesh>
    </group>
  );
}

// ── 7. VALVES ────────────────────────────────────────────────
export function PartValves({ explosion = 0 }) {
  const valveGeo = useMemo(() => makeValveGeometry(1.2, 0.28, 0.04), []);
  const intakeMat = MATERIALS.valve;
  const exhaustMat = MATERIALS.exhaust;

  const explodeOffset = explosion * 0.4;

  return (
    <group position={[0, 0, 0]}>
      {/* Intake Valve */}
      <group position={[-0.3 - explodeOffset, 0, 0]}>
        <mesh geometry={valveGeo} material={intakeMat} />
      </group>
      {/* Exhaust Valve */}
      <group position={[0.3 + explodeOffset, 0, 0]}>
        <mesh geometry={valveGeo} material={exhaustMat} />
      </group>
    </group>
  );
}

// ── 8. VALVE SPRINGS ─────────────────────────────────────────
export function PartValveSprings({ explosion = 0 }) {
  const springGeo = useMemo(() => makeValveSpringGeometry(0.18, 0.026, 7, 0.85), []);
  const springMat = MATERIALS.valveSpring;
  const retainerMat = MATERIALS.bolt;

  const explodeOffset = explosion * 0.35;

  return (
    <group position={[0, 0, 0]}>
      <mesh geometry={springGeo} material={springMat} />
      {/* Top Retainer Cap */}
      <mesh position={[0, 0.44 + explodeOffset, 0]} material={retainerMat}>
        <cylinderGeometry args={[0.22, 0.18, 0.08, 24]} />
      </mesh>
      {/* Bottom Seat Washer */}
      <mesh position={[0, -0.44 - explodeOffset, 0]} material={retainerMat}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 24]} />
      </mesh>
    </group>
  );
}

// ── 9. ROCKER ARMS ───────────────────────────────────────────
export function PartRockerArms({ explosion = 0 }) {
  const rockerMat = MATERIALS.rockerArm;
  const rollerMat = MATERIALS.valve;

  return (
    <group position={[0, 0, 0]}>
      {/* Central Pivot Trunnion */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={rockerMat}>
        <cylinderGeometry args={[0.12, 0.12, 0.30, 20]} />
      </mesh>
      {/* Main Arm Body */}
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, -0.2]} material={rockerMat}>
        <boxGeometry args={[0.65, 0.14, 0.20]} />
      </mesh>
      {/* Pushrod Cup Contact */}
      <mesh position={[-0.28, 0.10, 0]} material={rockerMat}>
        <sphereGeometry args={[0.08, 16, 16]} />
      </mesh>
      {/* Valve Tip Roller */}
      <mesh position={[0.28, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]} material={rollerMat}>
        <cylinderGeometry args={[0.07, 0.07, 0.16, 16]} />
      </mesh>
    </group>
  );
}

// ── 10. PUSHRODS ─────────────────────────────────────────────
export function PartPushrods({ explosion = 0 }) {
  const rodMat = MATERIALS.pushrod;
  const tipMat = MATERIALS.valve;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Hollow Shaft */}
      <mesh material={rodMat}>
        <cylinderGeometry args={[0.035, 0.035, 1.8, 20]} />
      </mesh>
      {/* Top Spherical Ball Tip */}
      <mesh position={[0, 0.9, 0]} material={tipMat}>
        <sphereGeometry args={[0.05, 16, 16]} />
      </mesh>
      {/* Bottom Spherical Ball Tip */}
      <mesh position={[0, -0.9, 0]} material={tipMat}>
        <sphereGeometry args={[0.05, 16, 16]} />
      </mesh>
    </group>
  );
}

// ── 11. LIFTERS ──────────────────────────────────────────────
export function PartLifters({ explosion = 0 }) {
  const bodyMat = MATERIALS.bolt;
  const rollerMat = MATERIALS.valve;

  return (
    <group position={[0, 0, 0]}>
      {/* Cylindrical Lifter Body */}
      <mesh material={bodyMat}>
        <cylinderGeometry args={[0.14, 0.14, 0.75, 24]} />
      </mesh>
      {/* Bottom Cam Roller Wheel */}
      <mesh position={[0, -0.38, 0]} rotation={[0, 0, Math.PI / 2]} material={rollerMat}>
        <cylinderGeometry args={[0.08, 0.08, 0.22, 20]} />
      </mesh>
    </group>
  );
}

// ── 12. BEARINGS ─────────────────────────────────────────────
export function PartBearings({ explosion = 0 }) {
  const bearingMat = MATERIALS.piston;
  const explodeOffset = explosion * 0.4;

  return (
    <group position={[0, 0, 0]}>
      {/* Top Bearing Shell Half */}
      <mesh position={[0, explodeOffset, 0]} rotation={[Math.PI / 2, 0, 0]} material={bearingMat}>
        <cylinderGeometry args={[0.36, 0.36, 0.30, 32, 1, true, 0, Math.PI]} />
      </mesh>
      {/* Bottom Bearing Shell Half */}
      <mesh position={[0, -explodeOffset, 0]} rotation={[Math.PI / 2, 0, 0]} material={bearingMat}>
        <cylinderGeometry args={[0.36, 0.36, 0.30, 32, 1, true, Math.PI, Math.PI]} />
      </mesh>
    </group>
  );
}

// ── 13. TIMING SYSTEM (CHAIN & SPROCKETS) ────────────────────
export function PartTimingSystem({ explosion = 0 }) {
  const sprocketMat = MATERIALS.crankshaft;
  const chainMat = MATERIALS.rod;

  return (
    <group position={[0, 0, 0]}>
      {/* Top Camshaft Sprocket */}
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]} material={sprocketMat}>
        <cylinderGeometry args={[0.45, 0.45, 0.08, 32]} />
      </mesh>
      {/* Bottom Crankshaft Sprocket */}
      <mesh position={[0, -0.75, 0]} rotation={[Math.PI / 2, 0, 0]} material={sprocketMat}>
        <cylinderGeometry args={[0.25, 0.25, 0.08, 32]} />
      </mesh>
      {/* Left Timing Chain Link */}
      <mesh position={[-0.38, 0, 0]} material={chainMat}>
        <boxGeometry args={[0.06, 1.5, 0.07]} />
      </mesh>
      {/* Right Timing Chain Link */}
      <mesh position={[0.38, 0, 0]} material={chainMat}>
        <boxGeometry args={[0.06, 1.5, 0.07]} />
      </mesh>
    </group>
  );
}

// ── 14. INTAKE SYSTEM (MANIFOLD) ─────────────────────────────
export function PartIntakeSystem({ explosion = 0 }) {
  const intakeMat = MATERIALS.intake;
  const throttleMat = MATERIALS.cylinderHead;

  return (
    <group position={[0, 0, 0]}>
      {/* Central Plenum Box */}
      <mesh position={[0, 0.4, 0]} material={intakeMat}>
        <boxGeometry args={[0.9, 0.45, 1.6]} />
      </mesh>
      {/* Throttle Body Flange */}
      <mesh position={[0.55, 0.4, 0]} rotation={[0, 0, Math.PI / 2]} material={throttleMat}>
        <cylinderGeometry args={[0.22, 0.22, 0.25, 24]} />
      </mesh>
      {/* Curved Runner Tubes down to cylinder ports */}
      {[-0.6, -0.2, 0.2, 0.6].map((z, idx) => (
        <group key={idx} position={[-0.2, 0.1, z]} rotation={[0, 0, 0.4]}>
          <mesh material={intakeMat}>
            <cylinderGeometry args={[0.10, 0.11, 0.65, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── 15. EXHAUST SYSTEM (HEADERS) ─────────────────────────────
export function PartExhaustSystem({ explosion = 0 }) {
  const exhaustMat = MATERIALS.exhaust;

  // Render 4 tuned header tubes connecting into a collector
  const tubes = useMemo(() => {
    return [
      makeHeaderTube([-0.6, 0.4, -0.6], [-0.9, 0.1, -0.4], [-0.9, -0.4, -0.2], [0, -0.8, 0], 0.065),
      makeHeaderTube([-0.6, 0.4, -0.2], [-0.75, 0.1, -0.1], [-0.75, -0.4, -0.1], [0, -0.8, 0], 0.065),
      makeHeaderTube([-0.6, 0.4, 0.2],  [-0.75, 0.1, 0.1],  [-0.75, -0.4, 0.1],  [0, -0.8, 0], 0.065),
      makeHeaderTube([-0.6, 0.4, 0.6],  [-0.9, 0.1, 0.4],  [-0.9, -0.4, 0.2],  [0, -0.8, 0], 0.065),
    ];
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {tubes.map((geo, idx) => (
        <mesh key={idx} geometry={geo} material={exhaustMat} />
      ))}
      {/* 4-into-1 Collector */}
      <mesh position={[0, -1.0, 0]} material={exhaustMat}>
        <cylinderGeometry args={[0.18, 0.14, 0.45, 20]} />
      </mesh>
    </group>
  );
}

// ── 16. LUBRICATION SYSTEM (OIL PUMP & PAN) ──────────────────
export function PartLubricationSystem({ explosion = 0 }) {
  const panMat = MATERIALS.oilPan;
  const pumpMat = MATERIALS.cylinderHead;
  const filterMat = MATERIALS.oilFilter;

  const explodeOffset = explosion * 0.4;

  return (
    <group position={[0, 0, 0]}>
      {/* Oil Pan Sump */}
      <mesh position={[0, -0.3, 0]} material={panMat}>
        <boxGeometry args={[1.5, 0.55, 2.0]} />
      </mesh>
      {/* Pan Mounting Flange */}
      <mesh position={[0, 0, 0]} material={panMat}>
        <boxGeometry args={[1.65, 0.06, 2.15]} />
      </mesh>
      {/* Oil Pump Housing */}
      <group position={[0, 0.35 + explodeOffset, 0.6]}>
        <mesh material={pumpMat}>
          <boxGeometry args={[0.45, 0.35, 0.45]} />
        </mesh>
        {/* Pickup Screen Tube */}
        <mesh position={[0, -0.35, 0]} material={pumpMat}>
          <cylinderGeometry args={[0.06, 0.06, 0.45, 16]} />
        </mesh>
      </group>
      {/* Oil Filter Canister */}
      <mesh position={[0.7, -0.1, 0.4]} rotation={[0, 0, -Math.PI / 2]} material={filterMat}>
        <cylinderGeometry args={[0.22, 0.22, 0.50, 24]} />
      </mesh>
    </group>
  );
}

// ── 17. COOLING SYSTEM (WATER PUMP) ──────────────────────────
export function PartCoolingSystem({ explosion = 0 }) {
  const housingMat = MATERIALS.cylinderHead;
  const pulleyMat = MATERIALS.crankshaft;
  const impellerMat = MATERIALS.valve;

  return (
    <group position={[0, 0, 0]}>
      {/* Main Pump Housing */}
      <mesh material={housingMat}>
        <cylinderGeometry args={[0.45, 0.52, 0.40, 24]} />
      </mesh>
      {/* Pulley Hub & Shaft */}
      <mesh position={[0, 0.35, 0]} material={pulleyMat}>
        <cylinderGeometry args={[0.38, 0.38, 0.18, 32]} />
      </mesh>
      <mesh position={[0, 0.15, 0]} material={pulleyMat}>
        <cylinderGeometry args={[0.08, 0.08, 0.55, 20]} />
      </mesh>
      {/* Internal Impeller Blades */}
      <group position={[0, -0.22, 0]}>
        {[0, 60, 120, 180, 240, 300].map((deg, idx) => (
          <mesh key={idx} rotation={[0, (deg * Math.PI) / 180, 0]} position={[0.18, 0, 0]} material={impellerMat}>
            <boxGeometry args={[0.20, 0.12, 0.02]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ── 18. FUEL SYSTEM (INJECTORS & RAIL) ───────────────────────
export function PartFuelSystem({ explosion = 0 }) {
  const railMat = MATERIALS.cylinderHead;
  const injectorMat = MATERIALS.valve;
  const oRingMat = MATERIALS.oilPan;

  const explodeOffset = explosion * 0.35;

  return (
    <group position={[0, 0, 0]}>
      {/* Hexagonal High-Pressure Fuel Rail */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={railMat}>
        <cylinderGeometry args={[0.10, 0.10, 2.2, 6]} />
      </mesh>

      {/* 4 Fuel Injectors */}
      {[-0.75, -0.25, 0.25, 0.75].map((z, idx) => (
        <group key={idx} position={[0, -0.45 - explodeOffset, z]}>
          {/* Injector Body */}
          <mesh material={injectorMat}>
            <cylinderGeometry args={[0.07, 0.05, 0.55, 20]} />
          </mesh>
          {/* Electrical Connector Plug */}
          <mesh position={[0.09, 0.12, 0]} material={railMat}>
            <boxGeometry args={[0.12, 0.10, 0.10]} />
          </mesh>
          {/* O-Ring Seal */}
          <mesh position={[0, 0.20, 0]} rotation={[Math.PI / 2, 0, 0]} material={oRingMat}>
            <torusGeometry args={[0.065, 0.012, 12, 24]} />
          </mesh>
          {/* Atomizer Nozzle Tip */}
          <mesh position={[0, -0.30, 0]} material={MATERIALS.exhaust}>
            <coneGeometry args={[0.035, 0.10, 16]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ── PART MODEL SWITCHER ROUTER ──────────────────────────────
export default function PartModelSwitcher({ partId, explosion = 0 }) {
  switch (partId) {
    case 'engine-block':
      return <PartEngineBlock explosion={explosion} />;
    case 'cylinder-head':
      return <PartCylinderHead explosion={explosion} />;
    case 'pistons':
    case 'piston':
      return <PartPiston explosion={explosion} />;
    case 'connecting-rods':
    case 'connecting-rod':
      return <PartConnectingRod explosion={explosion} />;
    case 'crankshaft':
      return <PartCrankshaft explosion={explosion} />;
    case 'camshaft':
      return <PartCamshaft explosion={explosion} />;
    case 'valves':
    case 'valve':
      return <PartValves explosion={explosion} />;
    case 'valve-springs':
    case 'valve-spring':
      return <PartValveSprings explosion={explosion} />;
    case 'rocker-arms':
    case 'rocker-arm':
      return <PartRockerArms explosion={explosion} />;
    case 'pushrods':
    case 'pushrod':
      return <PartPushrods explosion={explosion} />;
    case 'lifters':
    case 'lifter':
      return <PartLifters explosion={explosion} />;
    case 'bearings':
    case 'bearing':
      return <PartBearings explosion={explosion} />;
    case 'timing-system':
    case 'timing-chain':
      return <PartTimingSystem explosion={explosion} />;
    case 'intake-system':
    case 'intake-manifold':
      return <PartIntakeSystem explosion={explosion} />;
    case 'exhaust-system':
    case 'exhaust-headers':
      return <PartExhaustSystem explosion={explosion} />;
    case 'lubrication-system':
    case 'oil-pump':
      return <PartLubricationSystem explosion={explosion} />;
    case 'cooling-system':
    case 'water-pump':
      return <PartCoolingSystem explosion={explosion} />;
    case 'fuel-system':
    case 'fuel-injectors':
      return <PartFuelSystem explosion={explosion} />;
    default:
      return <PartPiston explosion={explosion} />;
  }
}
