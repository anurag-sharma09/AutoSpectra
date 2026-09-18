import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { ENGINES_DATA } from '../data/engines';
import { BarChart2, Box, Check, Plus, X } from 'lucide-react';
import './Compare.css';

export default function Compare() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(['v8-ohv', 'inline-4', 'boxer-4']);

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(item => item !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const selectedEngines = selectedIds.map(id => ENGINES_DATA.find(e => e.id === id)).filter(Boolean);

  const fields = [
    { key: 'type', label: 'Architecture Type' },
    { key: 'cylinders', label: 'Cylinder Count' },
    { key: 'displacement', label: 'Displacement Range' },
    { key: 'configuration', label: 'Crank/Bank Geometry' },
    { key: 'valvetrain', label: 'Valvetrain Type' },
    { key: 'firingOrder', label: 'Firing Order' },
    { key: 'powerOutput', label: 'Power Output Range' },
    { key: 'torqueOutput', label: 'Torque Output Range' }
  ];

  return (
    <div className="page-container">
      <SectionHeader
        badge="ENGINEERING COMPARISON"
        title="ENGINE ARCHITECTURE MATRIX"
        subtitle="Select up to 4 engine types to compare mechanical configurations, power curves, balance characteristics, and manufacturing complexity side-by-side."
      />

      {/* Engine Selection Bar */}
      <div className="compare-selector-panel cad-panel">
        <span className="selector-title font-mono text-cyan">SELECT ENGINES TO COMPARE (MAX 4):</span>
        <div className="selector-chips-grid">
          {ENGINES_DATA.map((eng) => {
            const isSelected = selectedIds.includes(eng.id);
            return (
              <button
                key={eng.id}
                className={`chip-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleSelect(eng.id)}
              >
                {isSelected ? <Check size={14} /> : <Plus size={14} />}
                <span>{eng.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Matrix Table */}
      <div className="matrix-table-container cad-panel">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="field-column">SPECIFICATION</th>
              {selectedEngines.map((eng) => (
                <th key={eng.id} className="engine-column">
                  <div className="th-engine-header">
                    <span className="badge-cad">{eng.type}</span>
                    <span className="th-title">{eng.name}</span>
                    <button 
                      className="btn-cad btn-cad-solid btn-th-explore"
                      onClick={() => navigate(`/explorer?engine=${eng.id}`)}
                    >
                      <Box size={12} /> 3D LAB
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fields.map((fld) => (
              <tr key={fld.key}>
                <td className="field-name font-mono text-cyan">{fld.label}</td>
                {selectedEngines.map((eng) => (
                  <td key={eng.id} className="field-value">
                    {eng[fld.key]}
                  </td>
                ))}
              </tr>
            ))}
            {/* Advantages Row */}
            <tr>
              <td className="field-name font-mono text-cyan">Key Advantages</td>
              {selectedEngines.map((eng) => (
                <td key={eng.id} className="field-value">
                  <ul className="matrix-list text-cyan">
                    {eng.advantages.map((adv, i) => (
                      <li key={i}>• {adv}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            {/* Limitations Row */}
            <tr>
              <td className="field-name font-mono text-dim">Key Limitations</td>
              {selectedEngines.map((eng) => (
                <td key={eng.id} className="field-value">
                  <ul className="matrix-list text-dim">
                    {eng.limitations.map((lim, i) => (
                      <li key={i}>• {lim}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
