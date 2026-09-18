import * as THREE from 'three';

/**
 * Factory: create a MeshStandardMaterial with given params.
 * We use a factory so each call returns a fresh material instance
 * (no shared-instance mutation bugs across parts).
 */
export function mat(color, metalness, roughness, opts = {}) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness,
    roughness,
    envMapIntensity: opts.envMapIntensity ?? 1.0,
    side: opts.side ?? THREE.FrontSide,
    transparent: opts.transparent ?? false,
    opacity: opts.opacity ?? 1.0,
    wireframe: opts.wireframe ?? false,
    ...opts,
  });
}

/**
 * MATERIALS — each component gets its own distinct PBR look.
 * Colors are carefully chosen to be visually distinct yet all
 * look like real metal/machined surfaces.
 */
export const MATERIALS = {
  // ── Structural ─────────────────────────────────────────
  /** Cast iron / dark cast aluminium engine block */
  block: mat('#2c3342', 0.75, 0.58),

  /** Machined aluminium cylinder head */
  cylinderHead: mat('#8ea4be', 0.88, 0.20),

  /** Dark forged steel crankshaft */
  crankshaft: mat('#485566', 0.92, 0.16),

  /** Forged aluminium pistons */
  piston: mat('#c2d2e8', 0.92, 0.12),

  /** Forged steel connecting rods */
  rod: mat('#7a8ea4', 0.88, 0.22),

  /** Hardened steel camshaft */
  camshaft: mat('#5a7090', 0.88, 0.20),

  // ── Valvetrain ─────────────────────────────────────────
  /** Polished chrome valves */
  valve: mat('#dce8f8', 0.96, 0.06),

  /** Spring steel valve springs */
  valveSpring: mat('#6890b0', 0.88, 0.22),

  /** Machined / anodized rocker arms */
  rockerArm: mat('#5c7890', 0.86, 0.28),

  /** Thin steel pushrods */
  pushrod: mat('#7090aa', 0.90, 0.18),

  // ── External covers ────────────────────────────────────
  /** Anodized blue valve cover */
  valveCover: mat('#1a3a72', 0.78, 0.24),

  /** Timing cover — darker block-coloured aluminium */
  timingCover: mat('#232d3a', 0.70, 0.42),

  // ── Intake / Exhaust ───────────────────────────────────
  /** Composite / painted intake manifold */
  intake: mat('#303848', 0.55, 0.52),

  /** Stainless steel exhaust headers with heat patina */
  exhaust: mat('#c07848', 0.86, 0.26),

  /** Cast iron exhaust manifold */
  exhaustCast: mat('#3a3030', 0.80, 0.50),

  // ── Lubrication ────────────────────────────────────────
  /** Black painted / powder-coated oil pan */
  oilPan: mat('#141820', 0.82, 0.46),

  /** Oil filter canister — bright red */
  oilFilter: mat('#b82020', 0.65, 0.42),

  // ── Fasteners ──────────────────────────────────────────
  /** Zinc-plated / dark steel bolts */
  bolt: mat('#3c4858', 0.88, 0.30),

  // ── Special states ─────────────────────────────────────
  /** Cyan selection highlight */
  cyanHighlight: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00f0ff'),
    emissive: new THREE.Color('#00c0e0'),
    emissiveIntensity: 0.55,
    metalness: 0.92,
    roughness: 0.08,
  }),

  /** Red hover highlight */
  redHighlight: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#ff3b5c'),
    emissive: new THREE.Color('#cc2040'),
    emissiveIntensity: 0.50,
    metalness: 0.90,
    roughness: 0.10,
  }),

  /** Cutaway wireframe shell */
  cutawayShell: new THREE.MeshStandardMaterial({
    color: new THREE.Color('#3a5070'),
    metalness: 0.4,
    roughness: 0.6,
    transparent: true,
    opacity: 0.15,
    wireframe: false,
    side: THREE.DoubleSide,
  }),
};
