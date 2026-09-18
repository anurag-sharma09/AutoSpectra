import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
import './LoadingScreen.css';

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [statusMsg, setStatusMsg] = useState('Initializing WebGL Context...');

  const messages = [
    'Initializing WebGL Context...',
    'Loading 3D Engine Geometry...',
    'Configuring Lighting & Materials...',
    'Assembling V8 Engine Components...',
    'Synchronizing Kinematics Engine...',
    'Calibrating CAD Grid Systems...',
    'Loading Parts Library Database...',
    'System Ready.',
  ];

  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const pct = Math.min((step / messages.length) * 100, 100);
      setProgress(pct);
      setStatusMsg(messages[Math.min(step, messages.length - 1)]);
      if (step >= messages.length) clearInterval(interval);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-logo-box">
          <img src="/logo.png" alt="AutoSpectraXR Logo" className="loading-logo-img" />
        </div>
        <h1 className="loading-title">AutoSpectra<span className="brand-title-gradient">XR</span></h1>
        <p className="loading-subtitle font-mono">AUTO SPECTRA 3D ENGINE LABORATORY</p>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="loading-status font-mono">{statusMsg}</p>
      </div>
    </div>
  );
}
