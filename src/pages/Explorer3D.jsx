import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EngineScene from '../3d/EngineScene';
import ViewerControls from '../components/ViewerControls/ViewerControls';
import ExplosionSlider from '../components/ExplosionSlider/ExplosionSlider';
import KinematicControls from '../components/KinematicControls/KinematicControls';
import PartInfoPanel from '../components/PartInfoPanel/PartInfoPanel';
import RpmGauge from '../components/RpmGauge/RpmGauge';
import { ENGINES_DATA } from '../data/engines';
import { Layers, Info } from 'lucide-react';
import './Explorer3D.css';

export default function Explorer3D() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEngineId = searchParams.get('engine') || 'v8-ohv';
  const initialPartId = searchParams.get('part');

  const [activeEngineId, setActiveEngineId] = useState(initialEngineId);
  const [explosion, setExplosion] = useState(0);
  const [viewMode, setViewMode] = useState('Assembled'); // 'Assembled' | 'Exploded'
  const [isCutaway, setIsCutaway] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);
  const [targetRpm, setTargetRpm] = useState(800);
  const [currentRpm, setCurrentRpm] = useState(0);
  const [crankAngle, setCrankAngle] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [cameraView, setCameraView] = useState('Reset');
  const [selectedPart, setSelectedPart] = useState(
    initialPartId ? { id: initialPartId, name: initialPartId.replace(/-/g, ' ').toUpperCase() } : null
  );
  const [showLabels, setShowLabels] = useState(false);

  // Sync URL search params if engine or part changes
  useEffect(() => {
    const paramEngine = searchParams.get('engine');
    const paramPart = searchParams.get('part');
    if (paramEngine && paramEngine !== activeEngineId) {
      setActiveEngineId(paramEngine);
    }
    if (paramPart) {
      setSelectedPart({ id: paramPart, name: paramPart.replace(/-/g, ' ').toUpperCase() });
    }
  }, [searchParams]);

  // Smooth RPM Interpolation (exponential easing each frame)
  useEffect(() => {
    let animFrameId;
    const updateRpm = () => {
      const destRpm = isAnimated ? targetRpm : 0;
      setCurrentRpm(prev => {
        const diff = destRpm - prev;
        if (Math.abs(diff) < 0.5) return destRpm;
        return prev + diff * 0.12; // smooth lerp
      });
      animFrameId = requestAnimationFrame(updateRpm);
    };
    animFrameId = requestAnimationFrame(updateRpm);
    return () => cancelAnimationFrame(animFrameId);
  }, [isAnimated, targetRpm]);

  const activeEngineData = ENGINES_DATA.find(e => e.id === activeEngineId) || ENGINES_DATA[0];

  // Derive animation speed multiplier for Three.js engine loops (800 RPM = 1.0x base speed)
  const animationSpeed = currentRpm > 0 ? currentRpm / 800 : 0.0001;

  const handleSelectEngine = (id) => {
    setIsAnimated(false);
    setCurrentRpm(0);
    setCrankAngle(0);
    setResetSignal(prev => prev + 1);
    setActiveEngineId(id);
    setSearchParams({ engine: id });
    setSelectedPart(null);
  };

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    if (mode === 'Assembled') {
      setExplosion(0);
    } else if (mode === 'Exploded') {
      if (explosion === 0) setExplosion(0.6);
    }
  };

  const handleToggleAnimated = () => {
    if (!isAnimated) {
      if (targetRpm === 0) setTargetRpm(800);
      setIsAnimated(true);
    } else {
      setIsAnimated(false);
    }
  };

  const handleResetSimulation = () => {
    setIsAnimated(false);
    setTargetRpm(800);
    setCurrentRpm(0);
    setCrankAngle(0);
    setCameraView('Reset');
    setExplosion(0);
    setViewMode('Assembled');
    setIsCutaway(false);
    setResetSignal(prev => prev + 1);
  };

  const handleSelectPart = (id, name) => {
    if (!id) {
      setSelectedPart(null);
      return;
    }
    setSelectedPart({ id, name });
  };

  return (
    <div className="explorer-3d-layout">
      {/* Top Header HUD Bar */}
      <header className="explorer-top-bar cad-panel">
        <div className="top-title-group">
          <span className="badge-cad">{activeEngineData.type} ENGINE</span>
          <h2 className="top-engine-title">{activeEngineData.name}</h2>
          <span className="top-engine-specs font-mono text-cyan">
            {activeEngineData.cylinders} CYLINDERS • {activeEngineData.displacement} • {activeEngineData.valvetrain}
          </span>
        </div>

        {/* Engine Selector Dropdown */}
        <div className="engine-select-dropdown">
          <Layers size={16} className="text-cyan" />
          <select
            value={activeEngineId}
            onChange={(e) => handleSelectEngine(e.target.value)}
            className="cad-select"
          >
            {ENGINES_DATA.map((eng) => (
              <option key={eng.id} value={eng.id}>
                {eng.name} ({eng.type})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Horizontal Engine Selector Bar for Mobile/Tablet */}
      <div className="explorer-mobile-architecture-bar cad-panel">
        <span className="sidebar-section-title font-mono">ARCHITECTURES:</span>
        <div className="horizontal-engine-scroll">
          {ENGINES_DATA.map((eng) => (
            <button
              key={eng.id}
              className={`arch-scroll-item ${activeEngineId === eng.id ? 'active' : ''}`}
              onClick={() => handleSelectEngine(eng.id)}
            >
              <span>{eng.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Canvas Container */}
      <div className="explorer-main-viewport">
        {/* Left Side: Desktop Engine Quick Switch Drawer */}
        <aside className="explorer-left-sidebar cad-panel">
          <span className="sidebar-section-title font-mono">ARCHITECTURES</span>
          <div className="engine-quick-list">
            {ENGINES_DATA.map((eng) => (
              <button
                key={eng.id}
                className={`engine-quick-item ${activeEngineId === eng.id ? 'active' : ''}`}
                onClick={() => handleSelectEngine(eng.id)}
              >
                <div className="quick-item-text">
                  <span className="quick-title">{eng.name}</span>
                  <span className="quick-subtitle">{eng.cylinders} Cyl • {eng.type}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Center: WebGL 3D Canvas */}
        <main className="explorer-canvas-wrapper">
          <EngineScene
            engineId={activeEngineId}
            explosion={explosion}
            selectedPartId={selectedPart?.id}
            onSelectPart={handleSelectPart}
            isCutaway={isCutaway}
            isAnimated={isAnimated}
            animationSpeed={animationSpeed}
            cameraView={cameraView}
            showLabels={showLabels}
            onCrankUpdate={setCrankAngle}
            resetSignal={resetSignal}
          />

          {/* Floating CAD/HUD Circular Analog RPM Gauge */}
          <div className="canvas-rpm-gauge-overlay">
            <RpmGauge
              rpm={currentRpm}
              isAnimated={isAnimated}
              targetRpm={targetRpm}
              compact
            />
          </div>

          {/* Interactive Instructions Overlay */}
          {!selectedPart && (
            <div className="canvas-hint-overlay font-mono">
              <Info size={14} className="text-cyan" />
              <span>CLICK ANY COMPONENT TO HIGHLIGHT & INSPECT TELEMETRY</span>
            </div>
          )}
        </main>

        {/* Right Side: Selected Component Telemetry Sidebar */}
        {selectedPart && (
          <div className="explorer-right-panel font-mono">
            <PartInfoPanel
              partId={selectedPart.id}
              partName={selectedPart.name}
              onClose={() => setSelectedPart(null)}
              onSelectRelatedPart={(relName) => setSelectedPart({ id: relName.toLowerCase().replace(/\s+/g, '-'), name: relName })}
            />
          </div>
        )}
      </div>

      {/* Bottom HUD Control Panel */}
      <footer className="explorer-bottom-panel">
        <ViewerControls
          viewMode={viewMode}
          onSetViewMode={handleSetViewMode}
          isAnimated={isAnimated}
          onToggleAnimated={handleToggleAnimated}
          isCutaway={isCutaway}
          onToggleCutaway={() => setIsCutaway(!isCutaway)}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(v => !v)}
          cameraView={cameraView}
          onSetCameraView={setCameraView}
          onResetSimulation={handleResetSimulation}
        />

        {/* Show Explosion slider if in exploded mode or explosion > 0 */}
        {(viewMode === 'Exploded' || explosion > 0) && (
          <ExplosionSlider
            explosion={explosion}
            onChangeExplosion={(val) => {
              setExplosion(val);
              if (val > 0 && viewMode !== 'Exploded') setViewMode('Exploded');
              if (val === 0 && viewMode === 'Exploded') setViewMode('Assembled');
            }}
          />
        )}

        {/* Kinematic Controls & Telemetry Panel */}
        {isAnimated && (
          <KinematicControls
            isAnimated={isAnimated}
            onToggleAnimated={handleToggleAnimated}
            targetRpm={targetRpm}
            onChangeRpm={setTargetRpm}
            currentRpm={currentRpm}
            crankAngle={crankAngle}
            onResetSimulation={handleResetSimulation}
          />
        )}
      </footer>
    </div>
  );
}
