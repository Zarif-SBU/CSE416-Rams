// Legend.js
import React from 'react';
import './App.css';

export default function Legend({ isVisible, legendColor}) {
  if (!isVisible) return null;

  if(legendColor === 'income'){
    return (
        <div className="legend-container">
          <h4>Income</h4>
          <ul className="legend-list">
            <li><span className="legend-color" style={{ backgroundColor: 'green' }}></span>Republican</li>
            <li><span className="legend-color" style={{ backgroundColor: 'yellow' }}></span>Democrat</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>Other</li>
          </ul>
        </div>
      );
  }

  if(legendColor === 'race'){
    return (
        <div className="legend-container">
          <h4>Race</h4>
          <ul className="legend-list">
            <li><span className="legend-color" style={{ backgroundColor: 'purple' }}></span>Republican</li>
            <li><span className="legend-color" style={{ backgroundColor: 'white' }}></span>Democrat</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>Other</li>
          </ul>
        </div>
      );
  }

  else if(legendColor === 'voting'){
    return (
        <div className="legend-container">
          <h4>Political Party Votes</h4>
          <ul className="legend-list">
            <li><span className="legend-color" style={{ backgroundColor: 'red' }}></span>Republican</li>
            <li><span className="legend-color" style={{ backgroundColor: 'blue' }}></span>Democrat</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>Other</li>
          </ul>
        </div>
      );
  }

  return (
    <div className="legend-container">
      <h4>Political Party Votes</h4>
      <ul className="legend-list">
        <li><span className="legend-color" style={{ backgroundColor: 'red' }}></span>Republican</li>
        <li><span className="legend-color" style={{ backgroundColor: 'blue' }}></span>Democrat</li>
        <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>Other</li>
      </ul>
    </div>
  );
}
