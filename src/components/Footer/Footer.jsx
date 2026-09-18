import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, ShieldCheck, Box, Layers, BookOpen, Wrench, Terminal } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Left Brand info */}
        <div className="footer-brand-col">
          <div className="footer-brand-header">
            <div className="footer-logo-box">
              <img src="/logo.png" alt="AutoSpectraXR Logo" className="footer-logo-img" />
            </div>
            <span className="footer-brand-title">AutoSpectra<span className="brand-title-gradient">XR</span></span>
          </div>
          <p className="footer-brand-desc">
            Advanced interactive 3D mechanical visualization platform by Auto Spectra for internal combustion engines, valvetrains, kinematic physics, and diagnostic engineering.
          </p>
          <div className="footer-badge">
            <ShieldCheck size={14} className="text-cyan" />
            <span>AUTOSPECTRA MECHANICAL VISUALIZATION v1.0</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Navigation</h4>
          <ul className="footer-links">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/engine-types">Engine Types</NavLink></li>
            <li><NavLink to="/explorer">Auto Spectra</NavLink></li>
            <li><NavLink to="/parts-library">Parts Library</NavLink></li>
          </ul>
        </div>

        {/* Educational Modules */}
        <div className="footer-links-col">
          <h4 className="footer-col-title">Laboratory</h4>
          <ul className="footer-links">
            <li><NavLink to="/knowledge">Knowledge & Physics</NavLink></li>
            <li><NavLink to="/repair-lab">Repair Lab & Diagnostics</NavLink></li>
            <li><NavLink to="/compare">Engine Comparison</NavLink></li>
            <li><NavLink to="/toolkit">Engineering Calculators</NavLink></li>
          </ul>
        </div>

        {/* System Telemetry */}
        <div className="footer-telemetry-col cad-panel">
          <h4 className="footer-col-title text-cyan">
            <Terminal size={14} /> SYSTEM STATUS
          </h4>
          <div className="telemetry-grid font-mono">
            <div className="telemetry-row">
              <span>3D Engine:</span> <span className="text-cyan">WebGL / R3F</span>
            </div>
            <div className="telemetry-row">
              <span>Architectures:</span> <span>9 Types</span>
            </div>
            <div className="telemetry-row">
              <span>Valvetrains:</span> <span>OHV / SOHC / DOHC</span>
            </div>
            <div className="telemetry-row">
              <span>Status:</span> <span className="text-green">● Operational</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} AutoSpectraXR (Auto Spectra). Educational Engineering Visualization Platform.</span>
        <span>Built with React + Three.js + R3F</span>
      </div>
    </footer>
  );
}
