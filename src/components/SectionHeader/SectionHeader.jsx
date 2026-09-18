import React from 'react';
import './SectionHeader.css';

export default function SectionHeader({ title, subtitle, badge, action }) {
  return (
    <div className="section-header">
      <div className="section-title-group">
        {badge && <span className="badge-cad">{badge}</span>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
}
