import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Layers, 
  Cpu, 
  Wrench, 
  BookOpen, 
  Calculator, 
  ArrowRight,
  Zap,
  Activity
} from 'lucide-react';
import HomeEngineViewer from '../components/HomeEngineViewer/HomeEngineViewer';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();

  const stats = [
    { value: '9+', label: 'Engine Architectures', desc: 'V8, Inline, Boxer, Radial, W12 & more' },
    { value: '50+', label: 'Interactive Components', desc: 'Precise 3D mesh raycasting' },
    { value: '18+', label: 'Educational Modules', desc: 'Valvetrains, physics & cycles' },
    { value: '12+', label: 'Diagnostic Workflows', desc: 'Real-world troubleshooting' }
  ];

  const features = [
    {
      icon: Box,
      title: 'Auto Spectra 3D Explorer',
      desc: 'Rotate, zoom, pan, explode, and inspect internal combustion engines with real-time WebGL rendering.',
      path: '/explorer'
    },
    {
      icon: Layers,
      title: '9 Engine Architectures',
      desc: 'Compare mechanical configurations from classic V8 OHV pushrods to W12 twin-turbos and rotary wankel engines.',
      path: '/engine-types'
    },
    {
      icon: Cpu,
      title: 'Component Telemetry',
      desc: 'Select individual engine parts to inspect function, working principles, material composition, and failure modes.',
      path: '/parts-library'
    },
    {
      icon: Wrench,
      title: 'Repair & Diagnostics Lab',
      desc: 'Step-by-step interactive troubleshooting flowcharts for overheating, oil pressure drops, knocking, and misfires.',
      path: '/repair-lab'
    },
    {
      icon: Calculator,
      title: 'Engineering Toolkit',
      desc: 'Real-time calculators for engine displacement, static compression ratios, mean piston speeds, and torque curves.',
      path: '/toolkit'
    },
    {
      icon: BookOpen,
      title: 'Physics & Knowledge',
      desc: 'Learn the thermodynamic 4-stroke Otto cycle, valvetrain inertia, forced induction, and rotational balancing.',
      path: '/knowledge'
    }
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge badge-cad">
            <Zap size={14} className="text-cyan" /> ADVANCED 3D MECHANICAL VISUALIZATION
          </div>
          <h1 className="hero-headline">
            EXPLORE THE ENGINE <br />
            <span className="text-cyan">FROM THE INSIDE</span>
          </h1>
          <p className="hero-subtext">
            Learn how internal combustion engines work through interactive 3D models, exploded assembly views, mechanical kinematics animations, engineering information, and repair guides.
          </p>

          <div className="hero-cta-group">
            <button className="btn-cad btn-cad-solid hero-btn" onClick={() => navigate('/engine-types')}>
              <Layers size={18} />
              <span>EXPLORE ENGINES</span>
            </button>
            <button className="btn-cad btn-cad-secondary hero-btn" onClick={() => navigate('/explorer')}>
              <Box size={18} />
              <span>OPEN AUTO SPECTRA</span>
            </button>
          </div>
        </div>

        {/* Hero 3D Preview — Real Blender GLB Model */}
        <div className="hero-3d-preview cad-panel cad-panel-glow">
          <div className="preview-canvas-badge">
            <Activity size={14} className="text-cyan" />
            <span className="font-mono text-cyan">LIVE V8 OHV 3D ENGINE PREVIEW</span>
          </div>
          <HomeEngineViewer />
          <div className="preview-instructions font-mono">
            <span>DRAG TO ROTATE 3D ENGINE MODEL</span>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {stats.map((st, i) => (
            <div key={i} className="stat-card cad-panel">
              <span className="stat-value font-mono text-cyan">{st.value}</span>
              <span className="stat-label">{st.label}</span>
              <span className="stat-desc">{st.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Overview */}
      <section className="features-section">
        <div className="section-title-box">
          <span className="badge-cad">ENGINEERING SUITE</span>
          <h2 className="section-title">LABORATORY CAPABILITIES</h2>
        </div>

        <div className="features-grid">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div 
                key={i} 
                className="feature-card cad-panel"
                onClick={() => navigate(feat.path)}
              >
                <div className="feature-icon-box">
                  <Icon size={22} className="text-cyan" />
                </div>
                <h3 className="feature-title">{feat.title}</h3>
                <p className="feature-desc">{feat.desc}</p>
                <div className="feature-link text-cyan font-mono">
                  <span>ENTER MODULE</span> <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
