import React from 'react';
import './App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ, onDistrictsClick, changeLegendIncome, changeVotingColor }) => {
  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      
      <div id="columnizebutton">
        <button id="votingbutton" onClick={changeVotingColor}>
            Voting
        </button>
        <button id="racebutton">
            Race
        </button>
        <button id="incomebutton" onClick={changeLegendIncome}>
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