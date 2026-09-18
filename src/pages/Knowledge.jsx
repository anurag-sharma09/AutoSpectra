import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { KNOWLEDGE_DATA } from '../data/knowledgeData';
import { BookOpen, Clock, Zap, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import './Knowledge.css';

export default function Knowledge() {
  const [expandedId, setExpandedId] = useState('4-stroke-cycle');
  const [strokePhase, setStrokePhase] = useState(0); // 0: Intake, 1: Compression, 2: Power, 3: Exhaust

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const strokePhases = [
    { title: '1. INTAKE STROKE', desc: 'Piston moves down from TDC to BDC. Vacuum draws fresh air/fuel charge through open intake valve.', color: 'var(--accent-cyan)' },
    { title: '2. COMPRESSION STROKE', desc: 'Both valves seal tightly. Piston moves up to TDC, compressing mixture to ~10:1 ratio.', color: 'var(--accent-orange)' },
    { title: '3. POWER STROKE', desc: 'Spark plug ignites mixture at TDC. Rapid gas expansion drives piston down violently.', color: 'var(--accent-red)' },
    { title: '4. EXHAUST STROKE', desc: 'Exhaust valve opens. Piston sweeps burned gases out through exhaust port.', color: 'var(--text-muted)' }
  ];

  return (
    <div className="page-container">
      <SectionHeader
        badge="EDUCATIONAL ENGINEERING"
        title="KNOWLEDGE & PHYSICS LABORATORY"
        subtitle="In-depth educational modules explaining thermodynamic cycles, valvetrain dynamics, forced induction, and rotational balancing."
      />

      {/* Interactive 4-Stroke Cycle Visualizer Banner */}
      <div className="stroke-visualizer-card cad-panel cad-panel-glow">
        <div className="visualizer-header">
          <span className="badge-cad">INTERACTIVE CYCLE VISUALIZER</span>
          <h3 className="visualizer-title">THE 4-STROKE OTTO CYCLE</h3>
          <p className="visualizer-subtitle">Click through the 4 thermodynamic phases below to understand piston and valve synchronization.</p>
        </div>

        {/* Phase Buttons */}
        <div className="stroke-phase-buttons">
          {strokePhases.map((phase, idx) => (
            <button
              key={idx}
              className={`phase-btn ${strokePhase === idx ? 'active' : ''}`}
              onClick={() => setStrokePhase(idx)}
              style={{ borderColor: strokePhase === idx ? phase.color : 'transparent' }}
            >
              <span>{phase.title}</span>
            </button>
          ))}
        </div>

        {/* Selected Phase Info Box */}
        <div className="selected-phase-box cad-panel">
          <h4 className="phase-box-title" style={{ color: strokePhases[strokePhase].color }}>
            {strokePhases[strokePhase].title}
          </h4>
          <p className="phase-box-desc">{strokePhases[strokePhase].desc}</p>
          <div className="phase-metric font-mono">
            <span>Crankshaft Angle: {strokePhase * 180}° - {(strokePhase + 1) * 180}°</span> • 
            <span> Camshaft Angle: {strokePhase * 90}° - {(strokePhase + 1) * 90}°</span>
          </div>
        </div>
      </div>

      {/* Educational Articles List */}
      <div className="articles-list">
        {KNOWLEDGE_DATA.map((article) => {
          const isExpanded = expandedId === article.id;
          return (
            <div key={article.id} className="article-card cad-panel" id={article.id}>
              <div className="article-card-header" onClick={() => toggleExpand(article.id)}>
                <div className="article-header-text">
                  <div className="article-badges">
                    <span className="badge-cad">{article.category}</span>
                    <span className="read-time font-mono"><Clock size={12} /> {article.readTime}</span>
                  </div>
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-summary">{article.summary}</p>
                </div>
                <button className="expand-toggle-btn">
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div className="article-card-body">
                  <div className="formula-box font-mono cad-panel">
                    <span className="formula-label text-cyan"><Zap size={14} /> KEY GOVERNING EQUATION:</span>
                    <span className="formula-text text-cyan">{article.keyFormula}</span>
                  </div>

                  <div className="article-sections-grid">
                    {article.sections.map((sec, idx) => (
                      <div key={idx} className="article-section-block">
                        <h4 className="sec-heading">{sec.heading}</h4>
                        <p className="sec-content">{sec.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
