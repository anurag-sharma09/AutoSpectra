import React from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { Cpu, ShieldCheck, Layers, Box, Wrench, BookOpen, Calculator, ExternalLink } from 'lucide-react';
import './About.css';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <SectionHeader
        badge="PROJECT ARCHITECTURE"
        title="ABOUT AUTOSPECTRA XR"
        subtitle="AutoSpectraXR (Auto Spectra) is a professional interactive 3D engineering visualization platform and computer-aided learning laboratory."
      />

      <div className="about-layout">
        {/* Left Column: Mission & System Specs */}
        <div className="about-main-col">
          <div className="about-card cad-panel">
            <h3 className="about-card-title text-cyan">
              <Cpu size={18} /> THE MISSION
            </h3>
            <p className="about-text">
              AutoSpectraXR was engineered to bridge the gap between abstract mechanical textbook diagrams and real 3D spatial understanding. By rendering internal combustion assemblies procedurally in WebGL with interactive raycasting, multi-vector explosion drawings, and synchronized 4-stroke kinematics, students, technicians, and automotive engineers can explore internal engine mechanics from any angle.
            </p>
          </div>

          <div className="about-card cad-panel">
            <h3 className="about-card-title text-cyan">
              <Layers size={18} /> KEY PLATFORM FEATURES
            </h3>
            <ul className="about-feature-list">
              <li>
                <strong>9 Engine Architectures:</strong> 90° V8 OHV, Inline-4 DOHC, 60° V6 Twin-Turbo, Flat-4 Boxer, 7-Cylinder Radial, W12, Twin-Rotor Wankel Rotary, Single-Cylinder 250cc, and Opposed-Piston Diesel.
              </li>
              <li>
                <strong>Assembly-Aware Explosion Vectors:</strong> Vector-based spatial separation that separates valve covers, rocker arms, cylinder heads, exhaust headers, camshafts, pistons, crankshafts, and oil pans along authentic mechanical assembly axes.
              </li>
              <li>
                <strong>Interactive Telemetry & Component Raycasting:</strong> Click any 3D mesh element to highlight its outline in electric cyan and bring up detailed material composition, working principles, and common failure modes.
              </li>
              <li>
                <strong>Synchronized Kinematics:</strong> Real-time mechanical animation enforcing exact kinematic constraints: Camshaft Speed = 1/2 Crankshaft Speed.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Platform Tech Stack */}
        <div className="about-side-col">
          <div className="about-tech-card cad-panel cad-panel-glow">
            <span className="badge-cad">TECHNOLOGY STACK</span>
            <h4 className="tech-card-title">TECHNICAL ARCHITECTURE</h4>

            <div className="tech-stack-list font-mono">
              <div className="tech-item">
                <span className="tech-label">Core UI:</span>
                <span className="tech-val text-cyan">React 18 + Vite</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">3D WebGL Engine:</span>
                <span className="tech-val text-cyan">Three.js / R3F</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">3D Helpers:</span>
                <span className="tech-val text-cyan">@react-three/drei</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Icons:</span>
                <span className="tech-val text-cyan">Lucide React</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Routing:</span>
                <span className="tech-val text-cyan">React Router DOM v6</span>
              </div>
              <div className="tech-item">
                <span className="tech-label">Design System:</span>
                <span className="tech-val text-cyan">CAD Graphite Theme</span>
              </div>
            </div>

            <button className="btn-cad btn-cad-solid w-full" style={{ marginTop: '20px' }} onClick={() => navigate('/explorer')}>
              <Box size={14} />
              <span>LAUNCH AUTO SPECTRA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
