// Legend.js
import React from 'react';
import './App.css';

export default function Legend({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="legend-container">
      <h4>Map Legend</h4>
      <ul className="legend-list">
        <li><span className="legend-color" style={{ backgroundColor: 'red' }}></span>Republican</li>
        <li><span className="legend-color" style={{ backgroundColor: 'blue' }}></span>Democrat</li>
        <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>Other</li>
      </ul>
    </div>
  );
}
