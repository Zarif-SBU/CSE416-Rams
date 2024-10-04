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
            <li><span className="legend-color" style={{ backgroundColor: 'green' }}></span>{'<'}10000 - 20k</li>
            <li><span className="legend-color" style={{ backgroundColor: 'yellow' }}></span>20k - 35k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>35 - 50k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>100k - 200k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>45k - 60k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#ffffff' }}></span>200000+</li>
          </ul>
        </div>
      );
  }

  if(legendColor === 'race'){
    return (
        <div className="legend-container">
          <h4>Minority Density</h4>
          <ul className="legend-list">
            <li><span className="legend-color" style={{ backgroundColor: '#FF4500' }}></span>81% - 100%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FF8C00' }}></span>61% - 80%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFA500' }}></span>41% - 60%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFD700' }}></span>21% - 40%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFFAF0' }}></span>0% - 20%</li>
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
