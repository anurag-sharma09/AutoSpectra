import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { ENGINE_PARTS_DATA } from '../data/engineParts';
import { Search, Cpu, Box, AlertTriangle, Layers, Info, ChevronRight } from 'lucide-react';
import './PartsLibrary.css';

export default function PartsLibrary() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPart = searchParams.get('part');

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(initialPart || '');

  const categories = [
    'ALL',
    'Engine Block',
    'Cylinder Head',
    'Pistons',
    'Connecting Rods',
    'Crankshaft',
    'Camshaft',
    'Valves',
    'Valve Springs',
    'Rocker Arms',
    'Pushrods',
    'Lifters',
    'Bearings',
    'Timing System',
    'Intake System',
    'Exhaust System',
    'Lubrication System',
    'Cooling System',
    'Fuel System'
  ];

  const filteredParts = ENGINE_PARTS_DATA.filter((part) => {
    const matchesCategory = activeCategory === 'ALL' || part.category === activeCategory;
    const matchesSearch = part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.function.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          part.material.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="page-container parts-library-page">
      <SectionHeader
        badge="MECHANICAL COMPONENTS"
        title="PARTS LIBRARY & TELEMETRY"
        subtitle="Searchable database of internal combustion engine components, 3D visualizations, materials, working principles, and common failure modes."
      />

      {/* Filter Tabs & Search Bar */}
      <div className="parts-filter-bar cad-panel">
        <div className="parts-category-tabs">
          {categories.slice(0, 8).map((cat) => (
            <button
              key={cat}
              className={`parts-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="cad-select category-select"
          >
            <option value="ALL">More Categories...</option>
            {categories.slice(8).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="parts-search-box">
          <Search size={16} className="text-cyan" />
          <input
            type="text"
            placeholder="Search part name, material, or function..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="parts-search-input"
          />
        </div>
      </div>

      {/* Parts Grid: 3/4 column desktop, 2 col tablet, 1 col mobile */}
      <div className="parts-grid">
        {filteredParts.map((part) => (
          <div key={part.id} className="part-card cad-panel">
            {/* Visual 3D Component Header Badge Box */}
            <div className="part-card-thumb" onClick={() => navigate(`/parts/${part.id}`)}>
              <div className="thumb-icon-wrapper">
                <Box size={28} className="text-cyan" />
              </div>
              <span className="thumb-badge font-mono">3D COMPONENT</span>
            </div>

            <div className="part-card-header">
              <span className="badge-cad">{part.category}</span>
              <h3 className="part-card-title">{part.name}</h3>
            </div>

            <div className="part-card-body">
              <div className="part-section">
                <span className="part-section-label">
                  <Cpu size={14} className="text-cyan" /> FUNCTION
                </span>
                <p className="part-section-text">{part.function}</p>
              </div>

              <div className="part-section">
                <span className="part-section-label">
                  <Layers size={14} className="text-cyan" /> WORKING PRINCIPLE
                </span>
                <p className="part-section-text">{part.workingPrinciple}</p>
              </div>

              <div className="part-section">
                <span className="part-section-label">
                  <Info size={14} className="text-cyan" /> MATERIAL
                </span>
                <p className="part-section-text font-mono text-cyan">{part.material}</p>
              </div>

              {part.failureModes && (
                <div className="part-section">
                  <span className="part-section-label text-red">
                    <AlertTriangle size={14} /> FAILURE MODES
                  </span>
                  <ul className="part-failure-list">
                    {part.failureModes.slice(0, 2).map((fm, idx) => (
                      <li key={idx}><AlertTriangle size={10} className="text-red" /> {fm}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="part-card-footer">
              <button 
                className="btn-cad btn-cad-solid w-full view-part-btn"
                onClick={() => navigate(`/parts/${part.id}`)}
              >
                <span>VIEW PART</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
