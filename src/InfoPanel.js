import React from "react";
import './App.css';

export default function InfoPanel({ stateName}) {
    return (
      <div className="info-panel">
        <div className="info-header">
          <h2>{stateName}</h2>
        </div>
        <div className="info-content">
          <p>Information about {stateName}</p>
          {/* Add more details related to the state here */}
        </div>
      </div>
    );
  }