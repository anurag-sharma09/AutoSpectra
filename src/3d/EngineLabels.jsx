import React from 'react';
import { Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// Part label positions per engine (assembled, explosion=0)
// Each entry: { id, label, pos: [x,y,z], lineEnd: [x,y,z] }
const ENGINE_LABELS = {
  'v8-ohv': [
    { id: 'valve-cover-left',       label: 'Valve Cover (L)',      pos: [-1.4, 2.2, 0],    lineEnd: [-1.1, 1.8, 0] },
    { id: 'valve-cover-right',      label: 'Valve Cover (R)',      pos: [1.4, 2.2, 0],     lineEnd: [1.1, 1.8, 0] },
    { id: 'intake-manifold',        label: 'Intake Manifold',      pos: [0, 2.4, 0],        lineEnd: [0, 1.7, 0] },
    { id: 'cylinder-head-left',     label: 'Cylinder Head (L)',    pos: [-2.2, 1.4, 1.5],  lineEnd: [-1.3, 1.1, 0.8] },
    { id: 'cylinder-head-right',    label: 'Cylinder Head (R)',    pos: [2.2, 1.4, 1.5],   lineEnd: [1.3, 1.1, 0.8] },
    { id: 'engine-block',           label: 'V8 Engine Block',      pos: [0, 0.4, 2.2],     lineEnd: [0.5, 0.2, 1.7] },
    { id: 'crankshaft',             label: 'Crankshaft',           pos: [0, -1.2, 2.0],    lineEnd: [0, -0.5, 1.6] },
    { id: 'piston-left-0',          label: 'Piston / Con Rod',     pos: [-2.0, 0.8, -1.5], lineEnd: [-1.2, 0.6, -1.3] },
    { id: 'oil-pan',                label: 'Oil Pan',              pos: [0, -2.2, 0],       lineEnd: [0.4, -1.5, 0.5] },
    { id: 'exhaust-header-left',    label: 'Exhaust Header (L)',   pos: [-3.0, 0.5, 0],    lineEnd: [-2.0, 0.5, 0] },
    { id: 'exhaust-header-right',   label: 'Exhaust Header (R)',   pos: [3.0, 0.5, 0],     lineEnd: [2.0, 0.5, 0] },
    { id: 'camshaft',               label: 'Camshaft',             pos: [0.6, 0.5, 2.0],   lineEnd: [0.2, 0.2, 1.6] },
  ],
  'inline-4': [
    { id: 'inline-cover',   label: 'DOHC Valve Cover',  pos: [0, 2.8, 0],    lineEnd: [0, 2.2, 0] },
    { id: 'inline-head',    label: 'Cylinder Head',     pos: [1.6, 1.8, 0],  lineEnd: [0.6, 1.5, 0] },
    { id: 'inline-block',   label: 'Inline-4 Block',    pos: [1.6, 0.4, 0],  lineEnd: [0.5, 0.3, 0] },
    { id: 'inline-crank',   label: 'Crankshaft',        pos: [0, -1.4, 0],   lineEnd: [0, -0.8, 0] },
    { id: 'inline-oilpan',  label: 'Oil Pan',           pos: [0, -2.3, 0],   lineEnd: [0, -1.5, 0] },
    { id: 'inline-piston-0', label: 'Piston / Rod',    pos: [-1.6, 0.4, 0], lineEnd: [-0.4, 0.6, -1.2] },
  ],
  'boxer-4': [
    { id: 'boxer-block',       label: 'Flat-4 Block',    pos: [0, 1.2, 0],    lineEnd: [0, 0.4, 0] },
    { id: 'boxer-head-left',   label: 'Head (L)',         pos: [-2.8, 0.8, 0], lineEnd: [-1.8, 0, 0] },
    { id: 'boxer-head-right',  label: 'Head (R)',         pos: [2.8, 0.8, 0],  lineEnd: [1.8, 0, 0] },
    { id: 'boxer-crankshaft',  label: 'Crankshaft',       pos: [0, -1.0, 0],   lineEnd: [0, 0, 0] },
  ],
  'radial-7': [
    { id: 'radial-crankcase',  label: 'Crankcase',        pos: [0, 0, 1.0],    lineEnd: [0, 0, 0.5] },
    { id: 'radial-cyl-1',      label: 'Cylinder + Fins',  pos: [0, 2.8, 0.5],  lineEnd: [0, 1.8, 0] },
    { id: 'radial-master-rod', label: 'Master Rod',       pos: [1.5, 0, 0.6],  lineEnd: [0.3, 0, 0.2] },
  ],
  'rotary-wankel': [
    { id: 'rotary-rotor-0',   label: 'Eccentric Rotor',   pos: [0, 1.5, 0.8],  lineEnd: [0, 0.6, 0.4] },
    { id: 'rotary-housing',   label: 'Rotor Housing',     pos: [0, 0, 1.0],    lineEnd: [0, 0, 0.5] },
    { id: 'rotary-shaft',     label: 'Eccentric Shaft',   pos: [1.5, 0, 0],    lineEnd: [0.5, 0, 0] },
  ],
};

// Fallback minimal labels for engines not specified above
const DEFAULT_LABELS = [
  { id: null, label: 'Engine Block', pos: [0, 0.5, 1.8], lineEnd: [0, 0.2, 1.0] },
  { id: null, label: 'Crankshaft',   pos: [0, -1.2, 0],  lineEnd: [0, -0.5, 0] },
];

function LabelPoint({ label, pos, lineEnd, isActive, onClick }) {
  const points = [
    new THREE.Vector3(...lineEnd),
    new THREE.Vector3(...pos),
  ];

  return (
    <group>
      {/* Callout line */}
      <Line
        points={points}
        color={isActive ? '#00f0ff' : '#6080a0'}
        lineWidth={1.2}
        transparent
        opacity={0.7}
      />

      {/* Dot at part end */}
      <mesh position={lineEnd}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial color={isActive ? '#00f0ff' : '#6080a0'} emissive={isActive ? '#008888' : '#203040'} emissiveIntensity={0.5} />
      </mesh>

      {/* HTML label at line tip */}
      <Html
        position={pos}
        center
        distanceFactor={8}
        style={{ pointerEvents: 'none' }}
        zIndexRange={[1, 10]}
      >
        <div
          style={{
            background: isActive ? 'rgba(0,240,255,0.15)' : 'rgba(8,16,32,0.80)',
            border: `1px solid ${isActive ? '#00f0ff' : '#304060'}`,
            borderRadius: '3px',
            padding: '2px 8px',
            color: isActive ? '#00f0ff' : '#90b0d0',
            fontSize: '10px',
            fontFamily: 'monospace',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  );
}

export default function EngineLabels({ engineId, explosion, selectedPartId }) {
  // Scale label positions outward with explosion
  const labels = ENGINE_LABELS[engineId] || DEFAULT_LABELS;

  return (
    <group>
      {labels.map((lbl, i) => (
        <LabelPoint
          key={i}
          label={lbl.label}
          pos={lbl.pos}
          lineEnd={lbl.lineEnd}
          isActive={lbl.id && lbl.id === selectedPartId}
        />
      ))}
    </group>
  );
}
