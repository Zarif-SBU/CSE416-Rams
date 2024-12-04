import React from 'react';
import './App.css';

export default function Legend({ isVisible, legendColor, colors }) {
  if (!isVisible || !colors) return null; 

  return (
    <div className="legend-container">
      <h4>{legendColor.charAt(0).toUpperCase() + legendColor.slice(1)}</h4>
      <ul className="legend-list">
        {Object.entries(colors).map(([label, color]) => (
          <li key={label}>
            <span className="legend-color" style={{ backgroundColor: color }}></span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}