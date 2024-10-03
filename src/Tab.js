import React from 'react';
import './App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ }) => {
  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      {stateName === "Louisiana" && (
        <button id="precinctbutton" onClick={onPrecinctsClickLA}>
          PRECINCTS
        </button>
      )}
      {stateName === "New Jersey" && (
        <button id="precinctbutton" onClick={onPrecinctsClickNJ}>
          PRECINCTS
        </button>
      )}
    </div>
  );
};

export default Tab;