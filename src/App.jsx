import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import SearchBar from './components/SearchBar/SearchBar';
import Footer from './components/Footer/Footer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

// Pages
import Home from './pages/Home';
import EngineTypes from './pages/EngineTypes';
import Explorer3D from './pages/Explorer3D';
import PartsLibrary from './pages/PartsLibrary';
import Knowledge from './pages/Knowledge';
import RepairLab from './pages/RepairLab';
import Compare from './pages/Compare';
import Toolkit from './pages/Toolkit';
import About from './pages/About';

// Error Boundary for graceful fallback
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
          fontFamily: 'var(--font-heading)', padding: '40px'
        }}>
          <div style={{
            width: 60, height: 60, background: 'rgba(255,59,92,0.1)',
            border: '1px solid #ff3b5c', borderRadius: 4,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem'
          }}>⚠</div>
          <h2 style={{ color: '#ff3b5c', letterSpacing: '0.08em' }}>SYSTEM FAULT DETECTED</h2>
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', textAlign: 'center', maxWidth: 600 }}>
            {this.state.error?.message || 'An unexpected error occurred in this module.'}
          </p>
          <button
            style={{ padding: '10px 24px', background: 'var(--accent-cyan)', border: 'none', color: '#06090e', fontFamily: 'var(--font-heading)', fontWeight: 700, cursor: 'pointer', borderRadius: 2 }}
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            RESET MODULE
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function Layout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isExplorer = location.pathname === '/explorer';

  return (
    <>
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="app-main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/engine-types" element={<EngineTypes />} />
            <Route path="/explorer" element={<Explorer3D />} />
            <Route path="/parts-library" element={<PartsLibrary />} />
            <Route path="/knowledge" element={<Knowledge />} />
            <Route path="/repair-lab" element={<RepairLab />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/toolkit" element={<Toolkit />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </ErrorBoundary>
      </main>

      {!isExplorer && <Footer />}
    </>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Show loading screen for ~2.5 seconds on first load
  React.useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2600);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <Router>
        <Layout />
      </Router>
    </ThemeProvider>
  );
}
