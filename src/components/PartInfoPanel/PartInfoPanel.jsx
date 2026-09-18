import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Cpu, 
  AlertTriangle, 
  Layers, 
  ShieldAlert, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { ENGINE_PARTS_DATA } from '../../data/engineParts';
import './PartInfoPanel.css';

export default function PartInfoPanel({ partId, partName, onClose, onSelectRelatedPart }) {
  const navigate = useNavigate();

  if (!partId) return null;

  // Find part data from ENGINE_PARTS_DATA by matching partId or category
  const matchedPart = ENGINE_PARTS_DATA.find(p => 
    p.id === partId || 
    partId.includes(p.id) || 
    p.name.toLowerCase().includes(partName?.toLowerCase() || '')
  ) || {
    id: partId,
    name: partName || 'Engine Component',
    category: 'Assembly Component',
    function: 'Precision engineered internal combustion engine component operating within synchronized assembly tolerances.',
    workingPrinciple: 'Executes synchronized mechanical, thermal, or fluid dynamics force transmission during engine operation.',
    material: 'High-tensile forged steel or aluminum alloy with protective heat treatment coating.',
    failureModes: ['Wear under lubrication breakdown', 'Thermal stress fatigue', 'Surface scuffing'],
    relatedParts: ['Crankshaft', 'Engine Block', 'Cylinder Head']
  };

  return (
    <aside className="part-info-panel cad-panel cad-panel-glow">
      {/* CAD Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <span className="badge-cad">{matchedPart.category}</span>
          <h3 className="panel-title">{matchedPart.name}</h3>
        </div>
        <button className="panel-close-btn" onClick={onClose} title="Deselect component (ESC)">
          <X size={18} />
        </button>
      </div>

      {/* Body Content */}
      <div className="panel-body">
        {/* Primary Function */}
        <div className="telemetry-block">
          <span className="block-label">
            <Cpu size={14} className="text-cyan" /> PRIMARY FUNCTION
          </span>
          <p className="block-content">{matchedPart.function}</p>
        </div>

        {/* Working Principle */}
        <div className="telemetry-block">
          <span className="block-label">
            <Layers size={14} className="text-cyan" /> WORKING PRINCIPLE
          </span>
          <p className="block-content">{matchedPart.workingPrinciple}</p>
        </div>

        {/* Material */}
        <div className="telemetry-block">
          <span className="block-label">
            <Info size={14} className="text-cyan" /> MATERIAL COMPOSITION
          </span>
          <p className="block-content font-mono text-cyan">{matchedPart.material}</p>
        </div>

        {/* Failure Modes */}
        {matchedPart.failureModes && (
          <div className="telemetry-block">
            <span className="block-label text-red">
              <ShieldAlert size={14} /> COMMON FAILURE MODES
            </span>
            <ul className="failure-list">
              {matchedPart.failureModes.map((fm, idx) => (
                <li key={idx} className="failure-item">
                  <AlertTriangle size={12} className="text-red" />
                  <span>{fm}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Components */}
        {matchedPart.relatedParts && (
          <div className="telemetry-block">
            <span className="block-label">RELATED COMPONENTS</span>
            <div className="related-tags-grid">
              {matchedPart.relatedParts.map((rel, idx) => (
                <button
                  key={idx}
                  className="related-tag-btn"
                  onClick={() => onSelectRelatedPart && onSelectRelatedPart(rel)}
                >
                  <span>{rel}</span>
                  <ChevronRight size={12} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer link to Parts Library */}
      <div className="panel-footer">
        <button 
          className="btn-cad btn-cad-secondary w-full"
          onClick={() => navigate(`/parts-library?part=${matchedPart.id}`)}
        >
          <ExternalLink size={14} />
          <span>VIEW IN PARTS LIBRARY</span>
        </button>
      </div>
    </aside>
  );
}
