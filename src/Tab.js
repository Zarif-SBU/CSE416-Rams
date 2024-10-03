import React from 'react';
import './App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ, onDistrictsClick }) => {
  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      
      <div id="columnizebutton">
        <button id="votingbutton">
            Voting
        </button>
        <button id="racebutton">
            Race
        </button>
        <button id="incomebutton">
            Income
        </button>
      </div>

      <button id="districtbutton" onClick={onDistrictsClick}>
        Districts
      </button>
      
      {stateName === "Louisiana" && (
        <button id="precinctbutton" onClick={onPrecinctsClickLA}>
          Precincts
        </button>
      )}
      {stateName === "New Jersey" && (
        <button id="precinctbutton" onClick={onPrecinctsClickNJ}>
          Precincts
        </button>
      )}
    </div>
  );
};

export default Tab;