import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import EngineCard from '../components/EngineCard/EngineCard';
import { ENGINES_DATA } from '../data/engines';
import { Search } from 'lucide-react';
import './EngineTypes.css';

export default function EngineTypes() {
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const types = ['ALL', 'V8', 'Inline', 'V6', 'Boxer', 'Radial', 'W-Engine', 'Rotary', 'Single-Cylinder', 'Opposed-Piston'];

  const filteredEngines = ENGINES_DATA.filter((engine) => {
    const matchesType = filterType === 'ALL' || engine.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesSearch = engine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          engine.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="page-container">
      <SectionHeader
        badge="ENGINE ARCHITECTURES"
        title="INTERNAL COMBUSTION ENGINES"
        subtitle="Explore different engine configurations, cylinder arrangements, valvetrains, and mechanical principles. Select any engine to open its interactive 3D laboratory."
      />

      {/* Filter Tabs & Search Bar */}
      <div className="engine-filter-bar cad-panel">
        <div className="filter-tabs-scroll">
          {types.map((type) => (
            <button
              key={type}
              className={`filter-tab-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="filter-search-box">
          <Search size={16} className="text-cyan" />
          <input
            type="text"
            placeholder="Search engine type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-search-input"
          />
        </div>
      </div>

      {/* Engine Cards Grid */}
      <div className="engine-cards-grid">
        {filteredEngines.map((engine) => (
          <EngineCard key={engine.id} engine={engine} />
        ))}
      </div>
    </div>
  );
}
