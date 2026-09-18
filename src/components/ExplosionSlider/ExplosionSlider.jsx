import React from 'react';
import { Layers, RotateCcw } from 'lucide-react';
import './ExplosionSlider.css';

export default function ExplosionSlider({ explosion = 0, onChangeExplosion }) {
  const percentage = Math.round(explosion * 100);

  const presets = [0, 0.25, 0.5, 0.75, 1.0];

  return (
    <div className="explosion-slider-panel cad-panel">
      <div className="slider-header">
        <div className="slider-title">
          <Layers size={14} className="text-cyan" />
          <span>EXPLOSION DISTANCE</span>
        </div>
        <span className="slider-value font-mono text-cyan">{percentage}%</span>
      </div>

      <div className="slider-track-container">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={explosion}
          onChange={(e) => onChangeExplosion(parseFloat(e.target.value))}
          className="cad-range-input"
        />
      </div>

      <div className="slider-presets">
        {presets.map((val) => (
          <button
            key={val}
            className={`preset-btn ${Math.abs(explosion - val) < 0.05 ? 'active' : ''}`}
            onClick={() => onChangeExplosion(val)}
          >
            {val * 100}%
          </button>
        ))}
      </div>
    </div>
  );
}
