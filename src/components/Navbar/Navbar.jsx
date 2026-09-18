import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Cpu, 
  Layers, 
  Box, 
  BookOpen, 
  Wrench, 
  BarChart2, 
  Calculator, 
  Info, 
  Search, 
  Menu, 
  X,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

export default function Navbar({ onOpenSearch }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/engine-types', label: 'Engine Types', icon: Layers },
    { path: '/explorer', label: 'Auto Spectra', icon: Box },
    { path: '/parts-library', label: 'Parts Library', icon: Cpu },
    { path: '/knowledge', label: 'Knowledge', icon: BookOpen },
    { path: '/repair-lab', label: 'Repair Lab', icon: Wrench },
    { path: '/compare', label: 'Compare', icon: BarChart2 },
    { path: '/toolkit', label: 'Toolkit', icon: Calculator },
    { path: '/about', label: 'About', icon: Info }
  ];

  const handleOpen3DLab = () => {
    navigate('/explorer');
    setIsMobileOpen(false);
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <NavLink to="/" className="navbar-brand" onClick={() => setIsMobileOpen(false)}>
          <div className="brand-icon-box">
            <img src="/logo.png" alt="AutoSpectraXR" className="brand-logo-img" />
          </div>
          <div className="brand-text-box">
            <span className="brand-title">AutoSpectra<span className="brand-title-gradient">XR</span></span>
            <span className="brand-subtitle">AUTO SPECTRA</span>
          </div>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-item-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="navbar-actions">
          <button 
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Search Engines, Parts, Repair Guides (Ctrl+K)"
          >
            <Search className="search-icon" />
            <span className="search-placeholder">Search...</span>
            <kbd className="search-shortcut">⌘K</kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="theme-toggle-icon sun" />
            ) : (
              <Moon className="theme-toggle-icon moon" />
            )}
          </button>

          <button className="btn-cad btn-cad-solid open-lab-btn" onClick={handleOpen3DLab}>
            <Box className="btn-icon" />
            <span>OPEN AUTO SPECTRA</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileOpen && (
        <div className="mobile-drawer">
          <div className="mobile-nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <Icon className="mobile-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <div className="mobile-drawer-footer">
              <button
                className="theme-toggle-btn mobile-theme-btn w-full"
                onClick={() => {
                  toggleTheme();
                }}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>

              <button 
                className="btn-cad btn-cad-solid w-full"
                onClick={handleOpen3DLab}
                style={{ marginTop: '10px' }}
              >
                <Box className="btn-icon" />
                <span>OPEN AUTO SPECTRA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
