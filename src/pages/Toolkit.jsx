import React, { useState } from 'react';
import SectionHeader from '../components/SectionHeader/SectionHeader';
import { CALCULATORS_DATA } from '../data/calculatorsData';
import { 
  calculateDisplacement, 
  calculateCompressionRatio, 
  calculatePistonSpeed, 
  calculatePowerTorque, 
  calculateCycleFrequencies 
} from '../utils/engineCalculations';
import { Calculator, Zap, CheckCircle2, RotateCcw } from 'lucide-react';
import './Toolkit.css';

export default function Toolkit() {
  // Calculator 1 State: Displacement
  const [dispBore, setDispBore] = useState(101.6);
  const [dispStroke, setDispStroke] = useState(88.4);
  const [dispCylinders, setDispCylinders] = useState(8);

  // Calculator 2 State: Compression Ratio
  const [crSingleCc, setCrSingleCc] = useState(715.7);
  const [crClearanceCc, setCrClearanceCc] = useState(75.3);

  // Calculator 3 State: Piston Speed
  const [psStroke, setPsStroke] = useState(88.4);
  const [psRpm, setPsRpm] = useState(6500);

  // Calculator 4 State: Power / Torque
  const [ptTorque, setPtTorque] = useState(400);
  const [ptRpm, setPtRpm] = useState(5500);

  // Calculator 5 State: Frequencies
  const [freqRpm, setFreqRpm] = useState(6000);
  const [freqCylinders, setFreqCylinders] = useState(8);

  // Calculate results
  const dispRes = calculateDisplacement(dispBore, dispStroke, dispCylinders);
  const crRes = calculateCompressionRatio(crSingleCc, crClearanceCc);
  const psRes = calculatePistonSpeed(psStroke, psRpm);
  const ptRes = calculatePowerTorque(ptTorque, ptRpm, 'imperial');
  const freqRes = calculateCycleFrequencies(freqRpm, freqCylinders);

  return (
    <div className="page-container">
      <SectionHeader
        badge="ENGINEERING CALCULATORS"
        title="KINEMATIC & THERMODYNAMIC TOOLKIT"
        subtitle="Real-time engineering tools for computing cylinder displacement, static compression ratios, mean piston velocities, and power outputs."
      />

      <div className="toolkit-grid">
        {/* 1. DISPLACEMENT CALCULATOR */}
        <div className="calc-card cad-panel">
          <div className="calc-card-header">
            <Calculator size={18} className="text-cyan" />
            <h3 className="calc-title">Engine Displacement</h3>
          </div>
          <div className="calc-formula font-mono text-cyan">
            {"V_d = \\frac{\\pi}{4} \\cdot \\text{Bore}^2 \\cdot \\text{Stroke} \\cdot N"}
          </div>
          <div className="calc-inputs-group">
            <div className="input-row">
              <label>Bore Diameter ({dispBore} mm)</label>
              <input 
                type="range" min="40" max="150" step="0.5" 
                value={dispBore} onChange={(e) => setDispBore(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Stroke Length ({dispStroke} mm)</label>
              <input 
                type="range" min="40" max="150" step="0.5" 
                value={dispStroke} onChange={(e) => setDispStroke(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Cylinders ({dispCylinders})</label>
              <input 
                type="range" min="1" max="16" step="1" 
                value={dispCylinders} onChange={(e) => setDispCylinders(parseInt(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
          </div>
          <div className="calc-result-box cad-panel">
            <span className="res-label">TOTAL ENGINE DISPLACEMENT:</span>
            <div className="res-values font-mono">
              <span className="res-primary text-cyan">{dispRes.liters} Liters</span>
              <span className="res-sec">({dispRes.cc} cc / {dispRes.cuIn} cu in)</span>
            </div>
          </div>
        </div>

        {/* 2. COMPRESSION RATIO CALCULATOR */}
        <div className="calc-card cad-panel">
          <div className="calc-card-header">
            <Calculator size={18} className="text-cyan" />
            <h3 className="calc-title">Static Compression Ratio</h3>
          </div>
          <div className="calc-formula font-mono text-cyan">
            {"CR = \\frac{V_{\\text{swept}} + V_{\\text{clearance}}}{V_{\\text{clearance}}}"}
          </div>
          <div className="calc-inputs-group">
            <div className="input-row">
              <label>Single Swept Volume ({crSingleCc} cc)</label>
              <input 
                type="range" min="50" max="1500" step="5" 
                value={crSingleCc} onChange={(e) => setCrSingleCc(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Chamber Clearance Vol ({crClearanceCc} cc)</label>
              <input 
                type="range" min="5" max="250" step="1" 
                value={crClearanceCc} onChange={(e) => setCrClearanceCc(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
          </div>
          <div className="calc-result-box cad-panel">
            <span className="res-label">COMPRESSION RATIO:</span>
            <div className="res-values font-mono">
              <span className="res-primary text-cyan">{crRes.ratio}</span>
              <span className="res-sec">(Total Cylinder Vol = {(crSingleCc + crClearanceCc).toFixed(1)} cc)</span>
            </div>
          </div>
        </div>

        {/* 3. MEAN PISTON SPEED CALCULATOR */}
        <div className="calc-card cad-panel">
          <div className="calc-card-header">
            <Calculator size={18} className="text-cyan" />
            <h3 className="calc-title">Mean Piston Speed</h3>
          </div>
          <div className="calc-formula font-mono text-cyan">
            {"v_{\\text{mean}} = \\frac{2 \\cdot \\text{Stroke}_{\\text{m}} \\cdot \\text{RPM}}{60}"}
          </div>
          <div className="calc-inputs-group">
            <div className="input-row">
              <label>Stroke Length ({psStroke} mm)</label>
              <input 
                type="range" min="40" max="150" step="0.5" 
                value={psStroke} onChange={(e) => setPsStroke(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Engine Speed ({psRpm} RPM)</label>
              <input 
                type="range" min="500" max="12000" step="100" 
                value={psRpm} onChange={(e) => setPsRpm(parseInt(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
          </div>
          <div className="calc-result-box cad-panel">
            <span className="res-label">MEAN PISTON VELOCITY:</span>
            <div className="res-values font-mono">
              <span className="res-primary text-cyan">{psRes.mPerSec} m/s</span>
              <span className="res-sec">({psRes.ftPerMin} ft/min — {psRes.rating})</span>
            </div>
          </div>
        </div>

        {/* 4. TORQUE TO HORSEPOWER CALCULATOR */}
        <div className="calc-card cad-panel">
          <div className="calc-card-header">
            <Calculator size={18} className="text-cyan" />
            <h3 className="calc-title">Torque to Horsepower</h3>
          </div>
          <div className="calc-formula font-mono text-cyan">
            {"HP = \\frac{\\text{Torque} \\cdot \\text{RPM}}{5252}"}
          </div>
          <div className="calc-inputs-group">
            <div className="input-row">
              <label>Torque Output ({ptTorque} lb-ft)</label>
              <input 
                type="range" min="50" max="1200" step="10" 
                value={ptTorque} onChange={(e) => setPtTorque(parseFloat(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Engine Speed ({ptRpm} RPM)</label>
              <input 
                type="range" min="500" max="10000" step="100" 
                value={ptRpm} onChange={(e) => setPtRpm(parseInt(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
          </div>
          <div className="calc-result-box cad-panel">
            <span className="res-label">BRAKE POWER OUTPUT:</span>
            <div className="res-values font-mono">
              <span className="res-primary text-cyan">{ptRes.horsepower} HP</span>
              <span className="res-sec">({ptRes.kW} kW output)</span>
            </div>
          </div>
        </div>

        {/* 5. 4-STROKE CYCLE FREQUENCY */}
        <div className="calc-card cad-panel">
          <div className="calc-card-header">
            <Calculator size={18} className="text-cyan" />
            <h3 className="calc-title">4-Stroke Cycle Frequencies</h3>
          </div>
          <div className="calc-formula font-mono text-cyan">
            {"f_{\\text{crank}} = \\frac{\\text{RPM}}{60}, \\quad f_{\\text{power}} = \\frac{\\text{RPM}}{120} \\cdot N"}
          </div>
          <div className="calc-inputs-group">
            <div className="input-row">
              <label>Crankshaft Speed ({freqRpm} RPM)</label>
              <input 
                type="range" min="500" max="12000" step="100" 
                value={freqRpm} onChange={(e) => setFreqRpm(parseInt(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
            <div className="input-row">
              <label>Cylinder Count ({freqCylinders})</label>
              <input 
                type="range" min="1" max="16" step="1" 
                value={freqCylinders} onChange={(e) => setFreqCylinders(parseInt(e.target.value))} 
                className="cad-range-input" 
              />
            </div>
          </div>
          <div className="calc-result-box cad-panel">
            <span className="res-label">OPERATIONAL FREQUENCIES:</span>
            <div className="res-values font-mono">
              <span className="res-primary text-cyan">{freqRes.powerEventsPerSec} Power Pulses/sec</span>
              <span className="res-sec">(Crank: {freqRes.crankHz} Hz • Cam: {freqRes.camHz} Hz)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
