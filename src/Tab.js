import React from 'react';
import './App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ, onDistrictsClick, fakecurrArea }) => {
  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      
      <div className="columnizebutton">
        <button id="votingbutton">
            Voting
        </button>
        <button id="racebutton">
            Race
        </button>
        <button id="incomebutton">
            Income
        </button>
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


      <button id="areaButton">
          {fakecurrArea}
      </button>
    </div>
  );
};

export default Tab;