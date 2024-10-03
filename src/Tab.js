import React from 'react';
import './App.css';

const Tab = ({ isVisible, stateName }) => {
  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      <h3>{stateName}</h3>
      <p>Additional information about {stateName} goes here.</p>
    </div>
  );
};

export default Tab;
