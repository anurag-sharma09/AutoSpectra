/**
 * HomeEngineViewer.jsx
 * Imperative Three.js viewer for the Home hero 3D preview.
 * Loads public/models/home-engine.glb with:
 *   - Bounding-box auto-fit camera
 *   - Professional product lighting (adapts to dark / light theme)
 *   - Slow auto-rotation (pauses on interaction)
 *   - OrbitControls (mouse + touch)
 *   - ResizeObserver responsive re-fit
 *   - Loading / error states
 *   - Zero impact on the Explorer3D page
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from '../../context/ThemeContext';
import './HomeEngineViewer.css';

// ── Constants ──────────────────────────────────────────────────────────────
const AUTO_ROTATE_SPEED = 0.18;   // radians per second
const RESUME_DELAY_MS   = 2200;   // ms after pointer-up before auto-rotate resumes
const PIXEL_RATIO_CAP   = 2;      // GPU safety cap

// ── Component ──────────────────────────────────────────────────────────────
export default function HomeEngineViewer() {
  const mountRef   = useRef(null);
  const stateRef   = useRef({});   // mutable Three.js objects – never trigger re-render
  const { theme }  = useTheme();
  const themeRef   = useRef(theme);

  // Keep themeRef in sync without re-running the heavy effect
  useEffect(() => { themeRef.current = theme; }, [theme]);

  // ── Theme-dependent scene colours ────────────────────────────────────────
  const applyTheme = useCallback((isDark) => {
    const s = stateRef.current;
    if (!s.renderer || !s.scene) return;

    if (isDark) {
      s.scene.background = new THREE.Color('#0a0f1a');
      if (s.ambientLight)    s.ambientLight.color.set('#d0daf0');
      if (s.ambientLight)    s.ambientLight.intensity = 0.70;
      if (s.hemiLight)       { s.hemiLight.color.set('#c8d8f0'); s.hemiLight.groundColor.set('#080c18'); s.hemiLight.intensity = 0.6; }
      if (s.keyLight)        { s.keyLight.color.set('#fff8f0'); s.keyLight.intensity = 2.6; }
      if (s.fillLight)       { s.fillLight.color.set('#b0c8f0'); s.fillLight.intensity = 1.0; }
      if (s.rimLight)        { s.rimLight.color.set('#4090ff'); s.rimLight.intensity = 0.8; }
      if (s.bottomLight)     { s.bottomLight.color.set('#607090'); s.bottomLight.intensity = 0.35; }
      s.renderer.toneMappingExposure = 1.05;
    } else {
      s.scene.background = new THREE.Color('#f0f4f8');
      if (s.ambientLight)    s.ambientLight.color.set('#ffffff');
      if (s.ambientLight)    s.ambientLight.intensity = 1.05;
      if (s.hemiLight)       { s.hemiLight.color.set('#d8e8f8'); s.hemiLight.groundColor.set('#b0bec5'); s.hemiLight.intensity = 0.55; }
      if (s.keyLight)        { s.keyLight.color.set('#fff5e0'); s.keyLight.intensity = 2.8; }
      if (s.fillLight)       { s.fillLight.color.set('#e0eeff'); s.fillLight.intensity = 1.1; }
      if (s.rimLight)        { s.rimLight.color.set('#a0b8d8'); s.rimLight.intensity = 0.5; }
      if (s.bottomLight)     { s.bottomLight.color.set('#90a0b0'); s.bottomLight.intensity = 0.4; }
      s.renderer.toneMappingExposure = 1.20;
    }
  }, []);

  // Whenever theme prop changes, re-apply to the live scene
  useEffect(() => {
    applyTheme(theme === 'dark');
  }, [theme, applyTheme]);

  // ── Auto-fit camera to the loaded model ──────────────────────────────────
  const fitCamera = useCallback(() => {
    const { camera, controls, engineRoot, containerWidth, containerHeight } = stateRef.current;
    if (!camera || !controls || !engineRoot) return;

    const box     = new THREE.Box3().setFromObject(engineRoot);
    if (box.isEmpty()) return;

    const center  = new THREE.Vector3();
    const size    = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const sphere  = box.getBoundingSphere(new THREE.Sphere());
    const radius  = sphere.radius || Math.max(size.x, size.y, size.z) / 2;

    const fovRad  = (camera.fov * Math.PI) / 180;
    const aspect  = (containerWidth || 1) / (containerHeight || 1);

    // Vertical + horizontal distance needed to frame the sphere
    const distV   = radius / Math.sin(fovRad / 2);
    const distH   = radius / Math.sin(Math.atan(Math.tan(fovRad / 2) * aspect));
    let dist      = Math.max(distV, distH);

    // Responsive padding: more breathing room on mobile
    const isMobile = (containerWidth || 800) <= 768;
    const isTablet = (containerWidth || 800) > 768 && (containerWidth || 800) <= 1100;
    const padding  = isMobile ? 1.55 : isTablet ? 1.35 : 1.18;
    dist *= padding;

    // Engineering 3/4 front-right isometric angle
    const dir = new THREE.Vector3(0.7, 0.45, 0.8).normalize();
    camera.position.copy(center).addScaledVector(dir, dist);
    controls.target.copy(center);

    camera.near = Math.max(0.01, dist / 30);
    camera.far  = dist * 30;
    camera.updateProjectionMatrix();

    // OrbitControls zoom limits relative to model size
    controls.minDistance = radius * 1.4;
    controls.maxDistance = radius * 8.0;
    controls.update();

    // Store for auto-rotate pivot
    stateRef.current.modelCenter = center.clone();
  }, []);

  // ── Main Three.js setup (runs once on mount) ──────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animId;
    const s = stateRef.current;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, PIXEL_RATIO_CAP));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace  = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    s.renderer = renderer;

    // ── Scene ─────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    s.scene = scene;

    // ── Lights ───────────────────────────────────────────────────────────
    const ambientLight  = new THREE.AmbientLight('#d0daf0', 0.70);
    const hemiLight     = new THREE.HemisphereLight('#c8d8f0', '#080c18', 0.60);
    hemiLight.position.set(0, 20, 0);

    const keyLight      = new THREE.DirectionalLight('#fff8f0', 2.6);
    keyLight.position.set(6, 10, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0005;

    const fillLight     = new THREE.DirectionalLight('#b0c8f0', 1.0);
    fillLight.position.set(-6, 5, -5);

    const rimLight      = new THREE.DirectionalLight('#4090ff', 0.8);
    rimLight.position.set(2, 3, -8);

    const bottomLight   = new THREE.DirectionalLight('#607090', 0.35);
    bottomLight.position.set(0, -6, 0);

    scene.add(ambientLight, hemiLight, keyLight, fillLight, rimLight, bottomLight);
    s.ambientLight = ambientLight;
    s.hemiLight    = hemiLight;
    s.keyLight     = keyLight;
    s.fillLight    = fillLight;
    s.rimLight     = rimLight;
    s.bottomLight  = bottomLight;

    // ── Camera ────────────────────────────────────────────────────────────
    const camera = new THREE.PerspectiveCamera(
      44,
      container.clientWidth / container.clientHeight,
      0.05,
      500
    );
    camera.position.set(4, 3, 5);
    s.camera = camera;

    // ── OrbitControls ─────────────────────────────────────────────────────
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping    = true;
    controls.dampingFactor    = 0.06;
    controls.rotateSpeed      = 0.75;
    controls.zoomSpeed        = 0.9;
    controls.panSpeed         = 0.6;
    controls.enablePan        = true;
    controls.screenSpacePanning = true;
    s.controls = controls;

    // ── Auto-rotation state ───────────────────────────────────────────────
    s.autoRotate       = false;   // enabled after model loads
    s.userInteracting  = false;
    s.resumeTimer      = null;

    const onPointerDown = () => {
      s.userInteracting = true;
      if (s.resumeTimer) { clearTimeout(s.resumeTimer); s.resumeTimer = null; }
    };
    const onPointerUp = () => {
      s.userInteracting = false;
      s.resumeTimer = setTimeout(() => { s.autoRotate = true; }, RESUME_DELAY_MS);
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup',   onPointerUp);

    // ── Container size cache ──────────────────────────────────────────────
    s.containerWidth  = container.clientWidth;
    s.containerHeight = container.clientHeight;

    // ── Apply initial theme ───────────────────────────────────────────────
    applyTheme(themeRef.current === 'dark');

    // ── Animation Loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();

      if (s.autoRotate && !s.userInteracting && s.engineRoot) {
        s.engineRoot.rotation.y += AUTO_ROTATE_SPEED * dt;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // ── ResizeObserver ────────────────────────────────────────────────────
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      s.containerWidth  = w;
      s.containerHeight = h;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Re-fit camera framing on significant width changes
      if (s.engineRoot) fitCamera();
    });
    ro.observe(container);

    // ── Load GLB ─────────────────────────────────────────────────────────
    const loader = new GLTFLoader();
    loader.load(
      '/models/home-engine.glb',

      // onLoad
      (gltf) => {
        const root = gltf.scene;

        // Centre model at world origin
        const box    = new THREE.Box3().setFromObject(root);
        const center = new THREE.Vector3();
        box.getCenter(center);
        root.position.sub(center);   // shift so bounding-box center = (0,0,0)

        // Enable shadows on every mesh
        root.traverse((child) => {
          if (child.isMesh) {
            child.castShadow    = true;
            child.receiveShadow = true;
          }
        });

        // Wrap in a group so auto-rotation pivot = model centre
        const engineRoot = new THREE.Group();
        engineRoot.add(root);
        scene.add(engineRoot);
        s.engineRoot = engineRoot;

        // Auto-fit camera
        fitCamera();

        // Start auto-rotation
        s.autoRotate = true;

        // Hide loading overlay
        const overlay = container.querySelector('.hev-loading');
        if (overlay) overlay.style.display = 'none';
      },

      // onProgress
      undefined,

      // onError
      (err) => {
        console.error('[HomeEngineViewer] GLB load error:', err);
        const overlay = container.querySelector('.hev-loading');
        if (overlay) {
          overlay.innerHTML = `
            <span class="hev-load-icon">⚠</span>
            <span class="hev-load-text">3D MODEL UNAVAILABLE</span>
            <span class="hev-load-sub">Check public/models/home-engine.glb</span>
          `;
          overlay.classList.add('hev-error');
        }
      }
    );

    // ── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup',   onPointerUp);
      if (s.resumeTimer) clearTimeout(s.resumeTimer);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once — theme changes handled via separate effect

  return (
    <div ref={mountRef} className="hev-mount">
      {/* Loading overlay — hidden once model loads */}
      <div className="hev-loading">
        <span className="hev-load-icon">⚙</span>
        <span className="hev-load-text">LOADING 3D ENGINE...</span>
        <span className="hev-load-sub">Parsing Blender model geometry</span>
        <div className="hev-load-bar"><div className="hev-load-bar-inner" /></div>
      </div>
    </div>
  );
}
