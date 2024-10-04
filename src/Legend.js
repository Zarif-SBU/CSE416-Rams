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
            <li><span className="legend-color" style={{ backgroundColor: '#B33D00' }}></span>91% - 100%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#CC4D00' }}></span>81% - 90%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#E65C00' }}></span>71% - 80%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FF6A00' }}></span>61% - 70%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FF7800' }}></span>51% - 60%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FF8F1C' }}></span>41% - 50%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFA84C' }}></span>31% - 40%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFC07F' }}></span>21% - 30%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFD194' }}></span>11% - 20%</li>
            <li><span className="legend-color" style={{ backgroundColor: '#FFE5B4' }}></span>0% - 10%</li>
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
