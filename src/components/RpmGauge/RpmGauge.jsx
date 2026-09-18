import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './RpmGauge.css';

/**
 * RpmGauge.jsx
 * Professional Engineering / CAD HUD Circular Analog RPM Gauge
 * Range: 0 - 7000 RPM
 */
export default function RpmGauge({ rpm = 0, isAnimated = false, targetRpm = 800, compact = false }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Clamp RPM to 0 - 7000
  const clampedRpm = Math.max(0, Math.min(7000, rpm));

  // Angle mapping: 0 RPM = -135°, 7000 RPM = +135° (270° total sweep)
  const angle = -135 + (clampedRpm / 7000) * 270;

  // Major ticks (0 to 7 x1000 RPM)
  const majorTicks = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000];

  // Minor ticks every 250 RPM
  const minorTicks = Array.from({ length: 29 }, (_, i) => i * 250);

  // Helper to convert polar coords to cartesian for SVG
  const polarToCartesian = (cx, cy, r, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(angleInRadians),
      y: cy + r * Math.sin(angleInRadians),
    };
  };

  // Helper to draw SVG arc
  const describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return [
      'M', start.x, start.y,
      'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');
  };

  // Redline arc (6000 to 7000 RPM -> 96.4° to 135°)
  const redlineStartAngle = -135 + (6000 / 7000) * 270;
  const redlineEndAngle = 135;
  const redlineArcD = describeArc(100, 100, 78, redlineStartAngle, redlineEndAngle);

  // Gauge arc background (0 to 7000 RPM)
  const gaugeArcD = describeArc(100, 100, 78, -135, 135);

  // Theme color stops
  const bgGrad1 = isLight ? '#FFFFFF' : '#151F2B';
  const bgGrad2 = isLight ? '#F4F7FA' : '#101923';
  const bgGrad3 = isLight ? '#EAF0F4' : '#0B1118';
  
  const outerBorder = isLight ? '#D5DEE7' : '#263545';
  const innerTrack = isLight ? 'rgba(0, 142, 170, 0.2)' : 'rgba(0, 184, 217, 0.2)';
  const minorTickColor = isLight ? '#A0AEC0' : 'rgba(255, 255, 255, 0.25)';
  const majorTickColor = isLight ? '#008EAA' : '#00B8D9';
  const textColor = isLight ? '#17212B' : '#F3F7FA';
  const subtextColor = isLight ? '#526170' : '#718294';
  const digitalBg = isLight ? '#F8FAFC' : '#0E1620';
  const digitalBorder = isLight ? '#D5DEE7' : '#263545';
  const digitalText = isAnimated ? (isLight ? '#008EAA' : '#00B8D9') : subtextColor;
  const accentColor = isLight ? '#008EAA' : '#00B8D9';
  const accentSecondary = isLight ? '#087E99' : '#1687A7';

  return (
    <div className={`rpm-gauge-container ${compact ? 'compact' : ''}`}>
      <svg className="rpm-gauge-svg" viewBox="0 0 200 200">
        <defs>
          {/* Radial gradient background */}
          <radialGradient id="gaugeBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={bgGrad1} />
            <stop offset="70%" stopColor={bgGrad2} />
            <stop offset="100%" stopColor={bgGrad3} />
          </radialGradient>

          {/* Needle gradient */}
          <linearGradient id="needleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={accentColor} />
            <stop offset="100%" stopColor={accentSecondary} />
          </linearGradient>

          {/* Glow filter */}
          <filter id="accentGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Ring & Background */}
        <circle cx="100" cy="100" r="94" fill="url(#gaugeBg)" stroke={outerBorder} strokeWidth="2" />
        <circle cx="100" cy="100" r="88" fill="none" stroke={innerTrack} strokeWidth="1" />

        {/* Outer Track Arc */}
        <path d={gaugeArcD} fill="none" stroke={innerTrack} strokeWidth="2" />

        {/* Redline Arc */}
        <path d={redlineArcD} fill="none" stroke="#D94A4A" strokeWidth="4" strokeLinecap="round" opacity="0.85" />

        {/* Minor Ticks */}
        {minorTicks.map((val) => {
          const tickAngle = -135 + (val / 7000) * 270;
          const p1 = polarToCartesian(100, 100, 84, tickAngle);
          const p2 = polarToCartesian(100, 100, 78, tickAngle);
          return (
            <line
              key={`minor-${val}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={val >= 6000 ? '#D94A4A' : minorTickColor}
              strokeWidth="1"
            />
          );
        })}

        {/* Major Ticks & Numbers */}
        {majorTicks.map((val) => {
          const tickAngle = -135 + (val / 7000) * 270;
          const p1 = polarToCartesian(100, 100, 85, tickAngle);
          const p2 = polarToCartesian(100, 100, 74, tickAngle);
          const pText = polarToCartesian(100, 100, 60, tickAngle);
          const isRed = val >= 6000;

          return (
            <g key={`major-${val}`}>
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={isRed ? '#D94A4A' : majorTickColor}
                strokeWidth="2.5"
              />
              <text
                x={pText.x}
                y={pText.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
                fill={isRed ? '#D94A4A' : textColor}
              >
                {val / 1000}
              </text>
            </g>
          );
        })}

        {/* Subtitle / Unit Label */}
        <text x="100" y="132" textAnchor="middle" fontSize="8" fontWeight="600" fontFamily="sans-serif" fill={subtextColor} letterSpacing="1">
          RPM x1000
        </text>

        {/* Digital RPM Box */}
        <rect x="62" y="142" width="76" height="22" rx="4" fill={digitalBg} stroke={digitalBorder} strokeWidth="1" />
        <text
          x="100"
          y="157"
          textAnchor="middle"
          fontSize="12"
          fontWeight="800"
          fontFamily="monospace"
          fill={digitalText}
        >
          {Math.round(clampedRpm)}
        </text>

        {/* Status Indicator Dot */}
        <circle cx="70" cy="153" r="2.5" fill={isAnimated ? '#22A06B' : '#D94A4A'} />

        {/* Gauge Center Label */}
        <text x="100" y="80" textAnchor="middle" fontSize="9" fontWeight="700" fontFamily="sans-serif" fill={subtextColor} letterSpacing="1">
          ENGINE RPM
        </text>

        {/* Needle Group */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          {/* Needle Shadow */}
          <polygon points="98,105 102,105 100,20" fill="rgba(0,0,0,0.25)" transform="translate(2, 2)" />
          {/* Main Needle */}
          <polygon points="97.5,104 102.5,104 100,18" fill="url(#needleGrad)" />
          {/* Needle Tip */}
          <polygon points="99,35 101,35 100,18" fill={isLight ? '#008EAA' : '#FFFFFF'} />
        </g>

        {/* Center Hub Cap */}
        <circle cx="100" cy="100" r="12" fill={bgGrad1} stroke={accentColor} strokeWidth="1.5" />
        <circle cx="100" cy="100" r="6" fill={digitalBg} />
        <circle cx="100" cy="100" r="2" fill={accentColor} />
      </svg>
    </div>
  );
}
