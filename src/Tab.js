import React, { useState } from 'react';
import './App.css';

const Tab = ({ isVisible, stateName, onPrecinctsClickLA, onPrecinctsClickNJ, onDistrictsClick, fakecurrArea, changeLegendColor2}) => {
  // State to track the active legend buttons
  const [activeLegendButton, setActiveLegendButton] = useState('votingbutton');
  // State to track the active precinct or district button
  const [activePrecinctDistrict, setActivePrecinctDistrict] = useState('district');
  // State to manage race dropdown visibility and selected race
  const [isRaceDropdownOpen, setIsRaceDropdownOpen] = useState(false);
  const [selectedRace, setSelectedRace] = useState('Race');

  const raceOptions = [
    'All Races', 
    'White', 
    'Black', 
    'Hispanic', 
    'Asian', 
    'Native American', 
    'Other'
  ];

  const handleLegendButtonClick = (buttonId) => {
    setActiveLegendButton(buttonId);
    // Close race dropdown if not race button
    if (buttonId !== 'racebutton') {
      setIsRaceDropdownOpen(false);
    }

    // Toggle race dropdown if race button is clicked
    if (buttonId === 'racebutton') {
      setIsRaceDropdownOpen(!isRaceDropdownOpen);
    }

    // Call the respective function based on the button clicked
    if (buttonId === 'votingbutton') changeLegendColor2("voting");
    else if (buttonId === 'racebutton') changeLegendColor2("race");
    else if (buttonId === 'incomebutton') changeLegendColor2("income");
    //test
    else if(buttonId === 'regionbutton') changeLegendColor2("voting");
  };

  const handlePrecinctDistrictClick = (type) => {
    setActivePrecinctDistrict(type);
    // Close race dropdown when changing precinct/district
    setIsRaceDropdownOpen(false);

    if (type === 'precinct') {
      if (stateName === "Louisiana") onPrecinctsClickLA();
      else if (stateName === "New Jersey") onPrecinctsClickNJ();
    } else {
      onDistrictsClick();
    }
  };

  return (
    <div className={`tab ${isVisible ? 'slide-in' : 'slide-out'}`}>
      <div className="columnizebutton">
        <button 
          id="votingbutton" 
          className={activeLegendButton === 'votingbutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('votingbutton')}
        >
          Voting
        </button>
        <button 
          id="racebutton" 
          className={activeLegendButton === 'racebutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('racebutton')}
        >
          Race
        </button>
        <button 
          id="incomebutton" 
          className={activeLegendButton === 'incomebutton' ? 'active' : ''} 
          onClick={() => handleLegendButtonClick('incomebutton')}
        >
          Income
        </button>
        {/* <div id="precinct-district-buttons"> */}
        <button 
          id="districtbutton" 
          className={activePrecinctDistrict === 'district' ? 'active' : ''} 
          onClick={() => handlePrecinctDistrictClick('district')}
        >
          Districts
        </button>

        {(stateName === "Louisiana" || stateName === "New Jersey") && (
          <button 
            id="precinctbutton" 
            className={activePrecinctDistrict === 'precinct' ? 'active' : ''} 
            onClick={() => handlePrecinctDistrictClick('precinct')}
          >
            Precincts
          </button>
        )}
      </div>

      <div id="fakecurrArea">
        {fakecurrArea}
      </div>
    </div>
  );
};

export default Tab;
