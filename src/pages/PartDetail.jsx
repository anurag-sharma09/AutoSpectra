import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Part3DCanvas from '../3d/Part3DCanvas';
import { ENGINE_PARTS_DATA } from '../data/engineParts';
import {
  ArrowLeft,
  Box,
  RotateCcw,
  Play,
  Pause,
  Sparkles,
  Tag,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowRight as ArrowRightIcon,
  Cpu,
  Layers,
  Info,
  AlertTriangle,
  MapPin,
  Link,
  Activity,
  Wrench,
  CheckCircle2
} from 'lucide-react';
import './PartDetail.css';

export default function PartDetail() {
  const { partId } = useParams();
  const navigate = useNavigate();

  // Find part data by matching partId or fallback to first part
  const part = ENGINE_PARTS_DATA.find(p => p.id === partId) || ENGINE_PARTS_DATA[0];

  const [explosion, setExplosion] = useState(0);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [cameraView, setCameraView] = useState('Reset');

  const handleResetControls = () => {
    setExplosion(0);
    setAutoRotate(false);
    setShowLabels(false);
    setCameraView('Reset');
  };

  const handleViewInEngine = () => {
    // Navigates to full engine viewer with part highlighted
    navigate(`/explorer?engine=v8-ohv&part=${part.id}`);
  };

  const cameraPresets = [
    { id: 'Reset', label: 'Reset', icon: RotateCcw },
    { id: 'Isometric', label: 'Iso', icon: Compass },
    { id: 'Front', label: 'Front', icon: Compass },
    { id: 'Rear', label: 'Rear', icon: Compass },
    { id: 'Left', label: 'Left', icon: ArrowLeft },
    { id: 'Right', label: 'Right', icon: ArrowRightIcon },
    { id: 'Top', label: 'Top', icon: ArrowUp },
    { id: 'Bottom', label: 'Bottom', icon: ArrowDown },
  ];

  return (
    <div className="part-detail-container">
      {/* Top Header Bar */}
      <header className="part-detail-header cad-panel">
        <div className="header-left">
          <button
            className="btn-cad btn-cad-secondary back-btn"
            onClick={() => navigate('/parts-library')}
          >
            <ArrowLeft size={16} />
            <span>Back to Parts Library</span>
          </button>
          <div className="title-group">
            <span className="badge-cad">{part.category}</span>
            <h1 className="part-detail-title">{part.name}</h1>
          </div>
        </div>

        <div className="header-right">
          <button
            className="btn-cad btn-cad-solid view-in-engine-btn"
            onClick={handleViewInEngine}
          >
            <Box size={16} />
            <span>VIEW IN ENGINE</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="part-detail-content">
        {/* Left/Top Column: 3D Viewport & Interactive Controls */}
        <section className="part-viewport-section cad-panel">
          <div className="part-canvas-container">
            <Part3DCanvas
              partId={part.id}
              explosion={explosion}
              autoRotate={autoRotate}
              showLabels={showLabels}
              cameraView={cameraView}
              partName={part.name}
            />

            {/* Hint overlay */}
            <div className="part-canvas-hint font-mono">
              <Info size={14} className="text-cyan" />
              <span>DRAG TO ROTATE • PINCH/SCROLL TO ZOOM • RIGHT-DRAG TO PAN</span>
            </div>
          </div>

          {/* 3D Controls Bar */}
          <div className="part-controls-bar">
            {/* Action Toggles */}
            <div className="control-group">
              <span className="group-label">CONTROLS</span>
              <div className="btn-group">
                <button
                  className={`part-ctrl-btn ${autoRotate ? 'active' : ''}`}
                  onClick={() => setAutoRotate(!autoRotate)}
                  title="Toggle continuous rotation"
                >
                  {autoRotate ? <Pause size={14} /> : <Play size={14} />}
                  <span>Auto Rotate</span>
                </button>

                <button
                  className={`part-ctrl-btn ${showLabels ? 'active' : ''}`}
                  onClick={() => setShowLabels(!showLabels)}
                  title="Toggle 3D label tag"
                >
                  <Tag size={14} />
                  <span>Labels</span>
                </button>

                <button
                  className="part-ctrl-btn"
                  onClick={handleResetControls}
                  title="Reset 3D view and animation state"
                >
                  <RotateCcw size={14} />
                  <span>Reset View</span>
                </button>
              </div>
            </div>

            {/* Explosion Slider */}
            <div className="control-group explosion-group">
              <span className="group-label">
                <Sparkles size={13} className="text-cyan" /> EXPLODED VIEW
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explosion}
                onChange={(e) => setExplosion(parseFloat(e.target.value))}
                className="part-explosion-slider"
              />
              <span className="font-mono text-cyan slider-val">{Math.round(explosion * 100)}%</span>
            </div>

            {/* Camera Presets */}
            <div className="control-group">
              <span className="group-label">CAMERA ANGLE</span>
              <div className="camera-grid">
                {cameraPresets.map((cam) => {
                  const Icon = cam.icon;
                  return (
                    <button
                      key={cam.id}
                      className={`cam-preset-btn ${cameraView === cam.id ? 'active' : ''}`}
                      onClick={() => setCameraView(cam.id)}
                    >
                      <Icon size={12} />
                      <span>{cam.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Right/Bottom Column: Technical Telemetry & Specifications */}
        <section className="part-info-section cad-panel">
          <div className="info-section-header">
            <h2 className="info-section-title">TECHNICAL TELEMETRY & SPECIFICATIONS</h2>
            <span className="font-mono text-cyan text-xs">ISO/SAE COMPONENT DATA</span>
          </div>

          <div className="info-grid">
            {/* Primary Function */}
            <div className="telemetry-card">
              <span className="telemetry-label">
                <Cpu size={15} className="text-cyan" /> PRIMARY FUNCTION
              </span>
              <p className="telemetry-text">{part.function}</p>
            </div>

            {/* Working Principle */}
            <div className="telemetry-card">
              <span className="telemetry-label">
                <Layers size={15} className="text-cyan" /> WORKING PRINCIPLE
              </span>
              <p className="telemetry-text">{part.workingPrinciple}</p>
            </div>

            {/* Material Composition */}
            <div className="telemetry-card">
              <span className="telemetry-label">
                <Info size={15} className="text-cyan" /> MATERIAL COMPOSITION
              </span>
              <p className="telemetry-text font-mono text-cyan">{part.material}</p>
            </div>

            {/* Key Features */}
            {part.keyFeatures && (
              <div className="telemetry-card">
                <span className="telemetry-label">
                  <CheckCircle2 size={15} className="text-cyan" /> KEY ENGINEERING FEATURES
                </span>
                <ul className="telemetry-list">
                  {part.keyFeatures.map((feat, idx) => (
                    <li key={idx}>
                      <CheckCircle2 size={12} className="text-cyan" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Failure Modes */}
            {part.failureModes && (
              <div className="telemetry-card failure-card">
                <span className="telemetry-label text-red">
                  <AlertTriangle size={15} /> COMMON FAILURE MODES
                </span>
                <ul className="telemetry-list">
                  {part.failureModes.map((fm, idx) => (
                    <li key={idx}>
                      <AlertTriangle size={12} className="text-red" />
                      <span className="text-secondary">{fm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional Attributes Grid */}
            <div className="telemetry-subgrid">
              {part.typicalLocation && (
                <div className="sub-card">
                  <span className="sub-label"><MapPin size={13} /> TYPICAL LOCATION</span>
                  <span className="sub-val">{part.typicalLocation}</span>
                </div>
              )}

              {part.movementType && (
                <div className="sub-card">
                  <span className="sub-label"><Activity size={13} /> MOVEMENT TYPE</span>
                  <span className="sub-val text-cyan font-mono">{part.movementType}</span>
                </div>
              )}
            </div>

            {part.connectedComponents && (
              <div className="telemetry-card">
                <span className="telemetry-label"><Link size={15} className="text-cyan" /> CONNECTED COMPONENTS</span>
                <div className="tags-row">
                  {part.connectedComponents.map((comp, idx) => (
                    <span key={idx} className="comp-tag">{comp}</span>
                  ))}
                </div>
              </div>
            )}

            {part.maintenanceNotes && (
              <div className="telemetry-card maintenance-card">
                <span className="telemetry-label"><Wrench size={15} className="text-warning" /> MAINTENANCE & SERVICE NOTES</span>
                <p className="telemetry-text text-muted">{part.maintenanceNotes}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
