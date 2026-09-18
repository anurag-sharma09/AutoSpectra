import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Layers, Cpu, BookOpen, Wrench, ArrowRight } from 'lucide-react';
import { ENGINES_DATA } from '../../data/engines';
import { ENGINE_PARTS_DATA } from '../../data/engineParts';
import { KNOWLEDGE_DATA } from '../../data/knowledgeData';
import { REPAIR_DATA } from '../../data/repairData';
import './SearchBar.css';

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle open handled by parent or state
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Filter datasets
  const matchingEngines = cleanQuery ? ENGINES_DATA.filter(e => 
    e.name.toLowerCase().includes(cleanQuery) || 
    e.type.toLowerCase().includes(cleanQuery) ||
    e.description.toLowerCase().includes(cleanQuery)
  ) : ENGINES_DATA.slice(0, 3);

  const matchingParts = cleanQuery ? ENGINE_PARTS_DATA.filter(p => 
    p.name.toLowerCase().includes(cleanQuery) || 
    p.category.toLowerCase().includes(cleanQuery) ||
    p.function.toLowerCase().includes(cleanQuery)
  ) : ENGINE_PARTS_DATA.slice(0, 4);

  const matchingKnowledge = cleanQuery ? KNOWLEDGE_DATA.filter(k => 
    k.title.toLowerCase().includes(cleanQuery) || 
    k.summary.toLowerCase().includes(cleanQuery)
  ) : KNOWLEDGE_DATA.slice(0, 2);

  const matchingRepair = cleanQuery ? REPAIR_DATA.filter(r => 
    r.symptom.toLowerCase().includes(cleanQuery) || 
    r.category.toLowerCase().includes(cleanQuery)
  ) : REPAIR_DATA.slice(0, 2);

  const handleSelect = (path) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-box cad-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Input */}
        <div className="search-modal-header">
          <Search className="modal-search-icon" />
          <input
            type="text"
            className="search-modal-input"
            placeholder="Search engines, components, failure modes, repair procedures..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="clear-query-btn" onClick={() => setQuery('')}>
              <X size={16} />
            </button>
          )}
          <button className="close-modal-btn" onClick={onClose}>
            ESC
          </button>
        </div>

        {/* Search Results Body */}
        <div className="search-results-body">
          {/* Engines Section */}
          {matchingEngines.length > 0 && (
            <div className="result-category">
              <div className="category-title">
                <Layers className="cat-icon" />
                <span>Engine Architectures ({matchingEngines.length})</span>
              </div>
              <div className="result-list">
                {matchingEngines.map(item => (
                  <div 
                    key={item.id} 
                    className="result-item"
                    onClick={() => handleSelect(`/explorer?engine=${item.id}`)}
                  >
                    <div className="result-info">
                      <span className="result-title">{item.name}</span>
                      <span className="result-desc">{item.cylinders} Cylinders • {item.valvetrain}</span>
                    </div>
                    <ArrowRight className="result-arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parts Section */}
          {matchingParts.length > 0 && (
            <div className="result-category">
              <div className="category-title">
                <Cpu className="cat-icon" />
                <span>Components & Parts ({matchingParts.length})</span>
              </div>
              <div className="result-list">
                {matchingParts.map(item => (
                  <div 
                    key={item.id} 
                    className="result-item"
                    onClick={() => handleSelect(`/parts-library?part=${item.id}`)}
                  >
                    <div className="result-info">
                      <span className="result-title">{item.name}</span>
                      <span className="result-desc">{item.category} — {item.function.slice(0, 75)}...</span>
                    </div>
                    <ArrowRight className="result-arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Section */}
          {matchingKnowledge.length > 0 && (
            <div className="result-category">
              <div className="category-title">
                <BookOpen className="cat-icon" />
                <span>Knowledge & Physics ({matchingKnowledge.length})</span>
              </div>
              <div className="result-list">
                {matchingKnowledge.map(item => (
                  <div 
                    key={item.id} 
                    className="result-item"
                    onClick={() => handleSelect(`/knowledge#${item.id}`)}
                  >
                    <div className="result-info">
                      <span className="result-title">{item.title}</span>
                      <span className="result-desc">{item.summary}</span>
                    </div>
                    <ArrowRight className="result-arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Repair Section */}
          {matchingRepair.length > 0 && (
            <div className="result-category">
              <div className="category-title">
                <Wrench className="cat-icon" />
                <span>Repair Lab & Diagnostics ({matchingRepair.length})</span>
              </div>
              <div className="result-list">
                {matchingRepair.map(item => (
                  <div 
                    key={item.id} 
                    className="result-item"
                    onClick={() => handleSelect(`/repair-lab?issue=${item.id}`)}
                  >
                    <div className="result-info">
                      <span className="result-title text-red">{item.symptom}</span>
                      <span className="result-desc">{item.category} • Severity: {item.severity}</span>
                    </div>
                    <ArrowRight className="result-arrow" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
