import React from 'react';
import { Play, Pause, Gauge, Flame, Wind, ArrowDownCircle, ArrowUpCircle, RotateCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './KinematicControls.css';

export default function KinematicControls({
  isAnimated = false,
  onToggleAnimated,
  targetRpm = 800,
  onChangeRpm,
  currentRpm = 0,
  crankAngle = 0,
  onResetSimulation,
}) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // 4-Stroke Cycle Stages
  // 0°..180° = INTAKE, 180°..360° = COMPRESSION, 360°..540° = POWER, 540°..720° = EXHAUST
  const deg = ((crankAngle % 720) + 720) % 720;
  let activeStage = 'INTAKE';
  if (deg >= 180 && deg < 360) activeStage = 'COMPRESSION';
  else if (deg >= 360 && deg < 540) activeStage = 'POWER';
  else if (deg >= 540 && deg < 720) activeStage = 'EXHAUST';

  const stages = [
    { id: 'INTAKE',      name: 'INTAKE',      range: '0°–180°',   icon: Wind,            color: isLight ? '#008EAA' : '#00B8D9' },
    { id: 'COMPRESSION', name: 'COMPRESSION', range: '180°–360°', icon: ArrowUpCircle,   color: isLight ? '#C4861F' : '#D99A2B' },
    { id: 'POWER',       name: 'POWER',       range: '360°–540°', icon: Flame,           color: isLight ? '#C83B3B' : '#D94A4A' },
    { id: 'EXHAUST',     name: 'EXHAUST',     range: '540°–720°', icon: ArrowDownCircle, color: isLight ? '#526170' : '#718294' },
  ];

  return (
    <div className="kinematic-controls-panel cad-panel">
      {/* Top Header & Telemetry Badges */}
      <div className="kinematic-header">
        <div className="title-telemetry">
          <span className="kinematic-title font-mono text-cyan">4-STROKE KINEMATICS SIMULATION</span>
          <span className="crank-angle-tag font-mono">
            CRANK ANGLE: <strong className="text-cyan">{Math.round(deg)}°</strong> / 720°
          </span>
        </div>
        <div className="kinematic-badge font-mono">
          <Flame size={12} className="text-red" />
          <span>CAM SPEED = 1/2 CRANK SPEED</span>
        </div>
      </div>

      {/* Primary Control Row */}
      <div className="kinematic-controls-row">
        {/* Play / Pause Toggle Button */}
        <button
          className={`btn-cad ${isAnimated ? 'btn-cad-solid' : 'btn-cad-secondary'}`}
          onClick={onToggleAnimated}
        >
          {isAnimated ? <Pause size={16} /> : <Play size={16} />}
          <span>{isAnimated ? 'PAUSE KINEMATICS' : 'START KINEMATICS'}</span>
        </button>

        {/* Reset Simulation Button */}
        <button
          className="btn-cad btn-cad-secondary"
          onClick={onResetSimulation}
          title="Reset Crank Angle & RPM to Initial Position"
        >
          <RotateCcw size={14} />
          <span>RESET</span>
        </button>

        {/* RPM / Simulation Speed Slider */}
        <div className="speed-slider-group">
          <div className="speed-label font-mono">
            <Gauge size={14} className="text-cyan" />
            <span>ENGINE RPM: <strong className="text-cyan">{targetRpm} RPM</strong></span>
          </div>
          <input
            type="range"
            min="200"
            max="7000"
            step="100"
            value={targetRpm}
            onChange={(e) => onChangeRpm(parseInt(e.target.value, 10))}
            className="cad-range-input speed-range"
            title="Adjust Engine Simulation RPM (200 - 7000 RPM)"
          />
        </div>
      </div>

      {/* Synchronized 4-Stroke Cycle Stage Indicator */}
      <div className="cycle-stages-grid">
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isActive = activeStage === stg.id;
          return (
            <div
              key={stg.id}
              className={`cycle-stage-card ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? stg.color : 'var(--border-color)',
                boxShadow: isActive ? `0 2px 8px ${stg.color}33` : 'none',
              }}
            >
              <div className="stage-card-header">
                <Icon size={14} style={{ color: isActive ? stg.color : 'var(--text-muted)' }} />
                <span className="stage-name" style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {stg.name}
                </span>
              </div>
              <span className="stage-range font-mono" style={{ color: isActive ? stg.color : 'var(--text-muted)' }}>
                {stg.range}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
