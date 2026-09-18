import React from 'react';
import {
  Eye,
  Sparkles,
  Scissors,
  Play,
  Pause,
  RotateCcw,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Tag
} from 'lucide-react';
import './ViewerControls.css';

export default function ViewerControls({
  viewMode = 'Assembled',
  onSetViewMode,
  isAnimated = false,
  onToggleAnimated,
  isCutaway = false,
  onToggleCutaway,
  showLabels = false,
  onToggleLabels,
  cameraView = 'Reset',
  onSetCameraView,
  onResetSimulation,
}) {
  const cameraButtons = [
    { id: 'Reset',     label: 'Reset',  icon: RotateCcw },
    { id: 'Isometric', label: 'Iso',    icon: Compass },
    { id: 'Front',     label: 'Front',  icon: Compass },
    { id: 'Rear',      label: 'Rear',   icon: Compass },
    { id: 'Left',      label: 'Left',   icon: ArrowLeft },
    { id: 'Right',     label: 'Right',  icon: ArrowRight },
    { id: 'Top',       label: 'Top',    icon: ArrowUp },
    { id: 'Bottom',    label: 'Bottom', icon: ArrowDown },
  ];

  const handleCameraClick = (id) => {
    onSetCameraView(id);
    if (id === 'Reset' && onResetSimulation) {
      onResetSimulation();
    }
  };

  return (
    <div className="viewer-controls-bar cad-panel">
      {/* View Mode Controls */}
      <div className="control-group">
        <span className="control-group-title">VIEW MODES</span>
        <div className="btn-segmented">
          <button
            className={`btn-seg ${viewMode === 'Assembled' ? 'active' : ''}`}
            onClick={() => onSetViewMode('Assembled')}
          >
            <Eye size={14} /> Assembled
          </button>
          <button
            className={`btn-seg ${viewMode === 'Exploded' ? 'active' : ''}`}
            onClick={() => onSetViewMode('Exploded')}
          >
            <Sparkles size={14} /> Exploded
          </button>
          <button
            className={`btn-seg ${isCutaway ? 'active' : ''}`}
            onClick={onToggleCutaway}
          >
            <Scissors size={14} /> Cutaway
          </button>
          <button
            className={`btn-seg ${isAnimated ? 'active' : ''}`}
            onClick={onToggleAnimated}
          >
            {isAnimated ? <Pause size={14} /> : <Play size={14} />} Kinematics
          </button>
          <button
            className={`btn-seg ${showLabels ? 'active' : ''}`}
            onClick={onToggleLabels}
          >
            <Tag size={14} /> Labels
          </button>
        </div>
      </div>

      {/* Camera Presets */}
      <div className="control-group">
        <span className="control-group-title">CAMERA ANGLE</span>
        <div className="camera-btn-grid">
          {cameraButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                className={`btn-cam ${cameraView === btn.id ? 'active' : ''}`}
                onClick={() => handleCameraClick(btn.id)}
                title={`Orient camera to ${btn.label} view`}
              >
                <Icon size={12} />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
