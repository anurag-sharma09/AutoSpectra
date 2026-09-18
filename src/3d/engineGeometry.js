/**
 * engineGeometry.js
 * Shared THREE.js geometry factory utilities.
 * All geometries are created fresh each call — do NOT cache
 * between engine instances or you'll share vertex data.
 */
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// PISTON — lathe-profile piston: crown, ring grooves, skirt
// ─────────────────────────────────────────────────────────────
export function makePistonGeometry(radius = 0.34, height = 0.62) {
  const r = radius;
  const h = height;
  const pts = [
    // Crown top (flat with slight dome via extra point)
    new THREE.Vector2(0, h * 0.42),
    new THREE.Vector2(r * 0.82, h * 0.40),
    new THREE.Vector2(r, h * 0.34),       // top of crown outer edge
    // First compression ring groove
    new THREE.Vector2(r, h * 0.26),
    new THREE.Vector2(r * 0.94, h * 0.24),
    new THREE.Vector2(r, h * 0.22),
    // Second compression ring groove
    new THREE.Vector2(r, h * 0.14),
    new THREE.Vector2(r * 0.94, h * 0.12),
    new THREE.Vector2(r, h * 0.10),
    // Oil control ring groove
    new THREE.Vector2(r, h * 0.02),
    new THREE.Vector2(r * 0.92, h * -0.02),
    new THREE.Vector2(r, h * -0.06),
    // Skirt — slight taper inward at bottom
    new THREE.Vector2(r, h * -0.14),
    new THREE.Vector2(r * 0.99, h * -0.30),
    new THREE.Vector2(r * 0.96, h * -0.40),   // skirt bottom
    // Inner wall
    new THREE.Vector2(r * 0.72, h * -0.42),
    new THREE.Vector2(r * 0.72, h * 0.34),
    new THREE.Vector2(0, h * 0.42),
  ];
  return new THREE.LatheGeometry(pts, 32);
}

// ─────────────────────────────────────────────────────────────
// CONNECTING ROD
// ─────────────────────────────────────────────────────────────
export function makeConrodGeometry(length = 0.85, bigEndR = 0.18, smallEndR = 0.10) {
  // Build from primitives via merging — we return a group description
  // (caller assembles it as JSX). This function returns params.
  return { length, bigEndR, smallEndR };
}

// ─────────────────────────────────────────────────────────────
// VALVE — lathe profile: disc head → undercut → stem
// ─────────────────────────────────────────────────────────────
export function makeValveGeometry(stemLength = 0.55, headRadius = 0.12, stemRadius = 0.022) {
  const pts = [
    new THREE.Vector2(0, stemLength * 0.5),           // stem top (keeper groove)
    new THREE.Vector2(stemRadius * 1.4, stemLength * 0.46),
    new THREE.Vector2(stemRadius, stemLength * 0.40),
    new THREE.Vector2(stemRadius, -stemLength * 0.05), // stem body
    // Undercut to head
    new THREE.Vector2(stemRadius * 2.8, -stemLength * 0.12),
    new THREE.Vector2(headRadius * 0.85, -stemLength * 0.20),
    new THREE.Vector2(headRadius, -stemLength * 0.28), // head edge
    new THREE.Vector2(headRadius, -stemLength * 0.33), // head face
    new THREE.Vector2(headRadius * 0.5, -stemLength * 0.36),
    new THREE.Vector2(0, -stemLength * 0.38),
  ];
  return new THREE.LatheGeometry(pts, 20);
}

// ─────────────────────────────────────────────────────────────
// CAM LOBE — lathe profile: egg-shaped lobe
// ─────────────────────────────────────────────────────────────
export function makeCamLobeGeometry(baseRadius = 0.12, liftRadius = 0.18, width = 0.10) {
  // Use an elliptical profile around Y, extruded along Z
  const pts = [];
  const segments = 16;
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    // Ellipse with a "lift" bump at top
    const r = baseRadius + (liftRadius - baseRadius) * Math.max(0, Math.cos(a));
    pts.push(new THREE.Vector2(r, (i / segments - 0.5) * width));
  }
  return new THREE.LatheGeometry(pts, 16);
}

// ─────────────────────────────────────────────────────────────
// EXHAUST HEADER TUBE — TubeGeometry along a Bezier curve
// p0 = port exit, p1/p2 = control points, p3 = collector entry
// ─────────────────────────────────────────────────────────────
export function makeHeaderTube(p0, p1, p2, p3, radius = 0.042, segments = 20) {
  const curve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(...p0),
    new THREE.Vector3(...p1),
    new THREE.Vector3(...p2),
    new THREE.Vector3(...p3),
  );
  return new THREE.TubeGeometry(curve, segments, radius, 8, false);
}

// ─────────────────────────────────────────────────────────────
// VALVE SPRING — TubeGeometry along a helical CatmullRomCurve3
// ─────────────────────────────────────────────────────────────
export function makeValveSpringGeometry(
  coilRadius = 0.09,
  wireRadius = 0.012,
  coils = 7,
  height = 0.42
) {
  const pts = [];
  const turns = coils * 32;
  for (let i = 0; i <= turns; i++) {
    const t = i / turns;
    const angle = t * coils * Math.PI * 2;
    pts.push(new THREE.Vector3(
      coilRadius * Math.cos(angle),
      t * height - height / 2,
      coilRadius * Math.sin(angle),
    ));
  }
  const curve = new THREE.CatmullRomCurve3(pts);
  return new THREE.TubeGeometry(curve, turns, wireRadius, 6, false);
}

// ─────────────────────────────────────────────────────────────
// CYLINDER BORE (open-ended hollow cylinder for cutaway)
// ─────────────────────────────────────────────────────────────
export function makeBoreGeometry(innerR = 0.35, outerR = 0.42, height = 0.95) {
  // Use a lathe profile: outer wall → inner wall
  const pts = [
    new THREE.Vector2(innerR, -height / 2),
    new THREE.Vector2(outerR, -height / 2),
    new THREE.Vector2(outerR,  height / 2),
    new THREE.Vector2(innerR,  height / 2),
  ];
  const geo = new THREE.LatheGeometry(pts, 32);
  geo.computeVertexNormals();
  return geo;
}

// ─────────────────────────────────────────────────────────────
// COOLING FIN RING (stacked discs for radial / single cyl)
// ─────────────────────────────────────────────────────────────
export function makeFinRingGeometry(innerR = 0.38, outerR = 0.52, height = 0.025) {
  const pts = [
    new THREE.Vector2(innerR, -height / 2),
    new THREE.Vector2(outerR, -height / 2),
    new THREE.Vector2(outerR,  height / 2),
    new THREE.Vector2(innerR,  height / 2),
    new THREE.Vector2(innerR, -height / 2),
  ];
  return new THREE.LatheGeometry(pts, 28);
}

// ─────────────────────────────────────────────────────────────
// CRANKSHAFT WEB (counterweight arc shape — extruded arc)
// ─────────────────────────────────────────────────────────────
export function makeCrankWebGeometry(r = 0.45, thickness = 0.16, depth = 0.10) {
  // Extruded half-circle arc = counterweight
  const shape = new THREE.Shape();
  shape.arc(0, 0, r, Math.PI * 0.05, Math.PI * 0.95, false);
  shape.lineTo(0, 0);
  shape.closePath();
  const extrudeSettings = { depth, bevelEnabled: true, bevelSize: 0.01, bevelThickness: 0.01, bevelSegments: 2 };
  return new THREE.ExtrudeGeometry(shape, extrudeSettings);
}

// ─────────────────────────────────────────────────────────────
// ROTARY ROTOR — Reuleaux triangle (extruded)
// ─────────────────────────────────────────────────────────────
export function makeRotorGeometry(R = 0.55, depth = 0.22) {
  const shape = new THREE.Shape();
  const cx = [0, R * Math.cos(Math.PI / 6), -R * Math.cos(Math.PI / 6)];
  const cy = [R, -R * Math.sin(Math.PI / 6), -R * Math.sin(Math.PI / 6)];
  const arcR = R * 1.732; // circumradius of arc ≈ R√3

  // 3 curved sides of Reuleaux triangle
  shape.moveTo(cx[0], cy[0]);
  for (let i = 0; i < 3; i++) {
    const next = (i + 1) % 3;
    const opp = (i + 2) % 3;
    // Arc centred at opposite vertex
    const startAngle = Math.atan2(cy[i] - cy[opp], cx[i] - cx[opp]);
    const endAngle   = Math.atan2(cy[next] - cy[opp], cx[next] - cx[opp]);
    shape.absarc(cx[opp], cy[opp], arcR, startAngle, endAngle, false);
  }

  const extrudeSettings = { depth, bevelEnabled: true, bevelSize: 0.015, bevelThickness: 0.015, bevelSegments: 3 };
  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geo.center();
  return geo;
}

// ─────────────────────────────────────────────────────────────
// SLIDER-CRANK piston position (true kinematics)
// r = crank throw radius, l = rod length, theta = crank angle
// Returns Y offset from BDC centre position
// ─────────────────────────────────────────────────────────────
export function sliderCrankY(r, l, theta) {
  return r * Math.cos(theta) + Math.sqrt(Math.max(0, l * l - r * r * Math.sin(theta) * Math.sin(theta)));
}

// ─────────────────────────────────────────────────────────────
// BOLT helper — returns bolt geometry (cylinder + hex head)
// ─────────────────────────────────────────────────────────────
export function makeBoltGeometry(shaftR = 0.025, shaftLen = 0.12, headR = 0.04, headH = 0.022) {
  // We return a group description; caller assembles
  return { shaftR, shaftLen, headR, headH };
}
