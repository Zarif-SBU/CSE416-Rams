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
            <li><span className="legend-color" style={{ backgroundColor: '#99ccff' }}></span>{'<'}10000 - 20k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#6699ff' }}></span>20k - 35k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#3366ff' }}></span>35 - 50k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#3333ff' }}></span>50k - 100k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#000066' }}></span>100k - 200k</li>
            <li><span className="legend-color" style={{ backgroundColor: '#00001a' }}></span>200000+</li>
          </ul>
        </div>
      );
  }

  if(legendColor === 'race'){
    return (
        <div className="legend-container">
          <h4>Race</h4>
          <ul className="legend-list">
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(142, 214, 214)' }}></span>White</li>
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(161, 161, 252)' }}></span>Black</li>
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(252, 183, 138)' }}></span>Asian</li>
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(255, 199, 207)' }}></span>Native American</li>
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(224, 235, 249)' }}></span>Pacific Islander</li>
            <li><span className="legend-color" style={{ backgroundColor: 'rgb(224, 225, 225)' }}></span>Other</li>
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
