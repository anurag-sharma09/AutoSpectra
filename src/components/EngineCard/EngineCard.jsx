import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CheckCircle2, XCircle, ArrowRight, Layers } from 'lucide-react';
import './EngineCard.css';

export default function EngineCard({ engine }) {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate(`/explorer?engine=${engine.id}`);
  };

  return (
    <div className="engine-card cad-panel">
      {/* Top Header */}
      <div className="engine-card-header">
        <span className="badge-cad">{engine.type} ARCHITECTURE</span>
        <h3 className="engine-card-title">{engine.name}</h3>
        <span className="engine-card-specs font-mono">{engine.cylinders} Cylinders • {engine.displacement}</span>
      </div>

      {/* Preview Canvas Badge / Visual Placeholder */}
      <div className="engine-card-preview cad-grid-bg">
        <div className="preview-hud">
          <Layers size={36} className="text-cyan preview-hud-icon" />
          <span className="preview-label font-mono">3D PROCEDURAL ASSEMBLY</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="engine-card-body">
        <p className="engine-card-desc">{engine.description}</p>

        {/* Pros & Cons */}
        <div className="advantages-limitations-grid">
          <div className="adv-col">
            <span className="col-label text-cyan">ADVANTAGES</span>
            <ul className="adv-list">
              {engine.advantages.slice(0, 2).map((adv, i) => (
                <li key={i}><CheckCircle2 size={12} className="text-cyan" /> {adv}</li>
              ))}
            </ul>
          </div>
          <div className="lim-col">
            <span className="col-label text-dim">LIMITATIONS</span>
            <ul className="adv-list">
              {engine.limitations.slice(0, 2).map((lim, i) => (
                <li key={i}><XCircle size={12} className="text-dim" /> {lim}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Card Footer Button */}
      <div className="engine-card-footer">
        <button className="btn-cad btn-cad-solid w-full" onClick={handleExplore}>
          <Box size={14} />
          <span>EXPLORE IN 3D</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
