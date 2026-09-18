import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { REPAIR_DATA } from '../data/repairData';
import { 
  Wrench, 
  AlertOctagon, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import './RepairLab.css';

export default function RepairLab() {
  const [searchParams] = useSearchParams();
  const initialIssueId = searchParams.get('issue') || 'overheating';

  const [activeIssueId, setActiveIssueId] = useState(initialIssueId);
  const [searchQuery, setSearchQuery] = useState('');

  const activeIssue = REPAIR_DATA.find(r => r.id === activeIssueId) || REPAIR_DATA[0];

  const filteredIssues = REPAIR_DATA.filter(r => 
    r.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="page-container">
      <SectionHeader
        badge="DIAGNOSTIC & TROUBLESHOOTING"
        title="REPAIR LAB & FAULT MATRIX"
        subtitle="Educational diagnostic laboratory for identifying mechanical, thermal, lubrication, and ignition engine faults."
      />

      <div className="repair-lab-layout">
        {/* Left Side: Symptom Selector Drawer */}
        <aside className="repair-sidebar cad-panel">
          <div className="repair-search-box">
            <Search size={14} className="text-cyan" />
            <input
              type="text"
              placeholder="Search symptom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="repair-search-input"
            />
          </div>

          <div className="symptom-list">
            {filteredIssues.map((issue) => (
              <button
                key={issue.id}
                className={`symptom-item-btn ${activeIssueId === issue.id ? 'active' : ''}`}
                onClick={() => setActiveIssueId(issue.id)}
              >
                <div className="symptom-item-text">
                  <span className="symptom-title">{issue.symptom}</span>
                  <span className="symptom-cat">{issue.category} • {issue.severity}</span>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right Side: Active Diagnostic Flow & Guide */}
        <main className="repair-main-content">
          {/* Header Banner */}
          <div className="repair-header-card cad-panel cad-panel-glow">
            <div className="repair-header-top">
              <span className={`severity-badge ${activeIssue.severity.toLowerCase()}`}>
                <AlertOctagon size={12} /> {activeIssue.severity} SEVERITY
              </span>
              <span className="badge-cad">{activeIssue.category}</span>
            </div>
            <h2 className="repair-symptom-title">{activeIssue.symptom}</h2>
            <p className="repair-symptom-desc">{activeIssue.description}</p>
          </div>

          {/* Interactive Diagnostic Flowchart */}
          <div className="flowchart-container cad-panel">
            <h3 className="flowchart-title font-mono text-cyan">
              <Wrench size={16} /> DIAGNOSTIC WORKFLOW STEPS
            </h3>
            <div className="flowchart-steps-grid">
              {activeIssue.workflow.map((wf) => (
                <div key={wf.step} className="flow-step-card cad-panel">
                  <div className="flow-step-num font-mono">STEP {wf.step}</div>
                  <h4 className="flow-step-title">{wf.title}</h4>
                  
                  <div className="flow-sub-block">
                    <span className="flow-sub-label text-cyan">CHECK:</span>
                    <span className="flow-sub-val">{wf.check}</span>
                  </div>

                  <div className="flow-sub-block">
                    <span className="flow-sub-label text-red">TEST CONDITION:</span>
                    <span className="flow-sub-val">{wf.test}</span>
                  </div>

                  <div className="flow-sub-block">
                    <span className="flow-sub-label text-green">REQUIRED ACTION:</span>
                    <span className="flow-sub-val">{wf.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Causes & Required Tools Grid */}
          <div className="repair-details-grid">
            {/* Possible Causes */}
            <div className="details-col cad-panel">
              <h4 className="details-col-title text-cyan">
                <HelpCircle size={16} /> POSSIBLE ROOT CAUSES
              </h4>
              <ul className="causes-list">
                {activeIssue.possibleCauses.map((cause, i) => (
                  <li key={i}><ArrowRight size={14} className="text-cyan" /> {cause}</li>
                ))}
              </ul>
            </div>

            {/* Inspection Steps & Tools */}
            <div className="details-col cad-panel">
              <h4 className="details-col-title text-cyan">
                <Wrench size={16} /> REQUIRED DIAGNOSTIC TOOLS
              </h4>
              <div className="tools-tags-grid">
                {activeIssue.toolsNeeded.map((tl, i) => (
                  <span key={i} className="tool-tag font-mono">{tl}</span>
                ))}
              </div>

              <h4 className="details-col-title text-cyan" style={{ marginTop: '20px' }}>
                INSPECTION STEPS
              </h4>
              <ol className="inspection-list">
                {activeIssue.inspectionSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Safety Precautions Warning Banner */}
          <div className="safety-warning-banner cad-panel">
            <ShieldAlert size={20} className="text-red" />
            <div className="safety-text">
              <span className="safety-title text-red font-mono">SAFETY PRECAUTIONS & ADVICE</span>
              <p className="safety-desc">{activeIssue.safetyPrecautions}</p>
              <p className="safety-pro text-dim">{activeIssue.professionalAdvice}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
