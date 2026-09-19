import React, { useState, useEffect } from 'react';
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
    { path: '/explorer', label: '3D Explorer', icon: Box },
    { path: '/parts-library', label: 'Parts Library', icon: Cpu },
    { path: '/knowledge', label: 'Knowledge', icon: BookOpen },
    { path: '/repair-lab', label: 'Repair Lab', icon: Wrench },
    { path: '/compare', label: 'Compare', icon: BarChart2 },
    { path: '/toolkit', label: 'Toolkit', icon: Calculator },
    { path: '/about', label: 'About', icon: Info }
  ];

  // Close drawer on route change or Escape key press, and toggle body scroll lock
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen]);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

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
            <span className="brand-subtitle">ENGINE LAB</span>
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
          {/* Search Trigger Button */}
          <button 
            className="search-trigger-btn"
            onClick={onOpenSearch}
            title="Search Engines, Parts, Repair Guides (Ctrl+K)"
            aria-label="Search"
          >
            <Search className="search-icon" />
            <span className="search-placeholder">Search...</span>
            <kbd className="search-shortcut">⌘K</kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn desktop-theme-btn"
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
            <span>OPEN 3D LAB</span>
          </button>

          {/* Mobile Menu Toggle Hamburger Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer Menu */}
      {isMobileOpen && (
        <>
          <div 
            className="mobile-drawer-overlay" 
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-title font-mono">NAVIGATION MENU</span>
              <button 
                className="mobile-drawer-close"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>
            
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
                  className="btn-cad btn-cad-solid w-full mobile-open-lab-btn"
                  onClick={handleOpen3DLab}
                >
                  <Box className="btn-icon" />
                  <span>OPEN 3D LAB</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
