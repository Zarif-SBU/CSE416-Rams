import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './charts';
import IncomeChart from './income_graph';
import VotingChart from './voting_graph';

export default function InfoPanel({ stateName, currArea, handleArrowClick, currState }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPointLeft, setPointLeft] = useState(true);
  const [isMinimized, setMinimizeInfoPanel] = useState(false);

  useEffect(() => {
    setMinimizeInfoPanel(false); // Reset to false when stateName changes
  }, [stateName]); // Trigger the effect when stateName changes

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleArrow = () => {
    setPointLeft((prev) => !prev);
    setMinimizeInfoPanel((prev) => !prev);

    handleArrowClick(!isMinimized);
  };

  return (
    <div className={`info-panel ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized && (
        <>
        <div className='infoDiv'>
          <h2 className='stateNameInfoPanel'>{stateName}</h2>
          <div>Current Area: {currArea}</div>
          <Tabs value={activeTab} onChange={handleChange}>
            <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
            <Tab label="Ensemble plan analysis" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
            <Tab label="Tab 3" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
            <Tab label="Tab 4" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
          </Tabs>
          <Box sx={{ padding: 2 }}>
            {activeTab === 0 && (
              <div className="chartContainer">
                {currArea && <Chart currArea={currArea} />}
              </div>
            )}
            {activeTab === 1 && (
              <div className="chartContainer">
                {currArea && <IncomeChart currArea={currArea} currState={currState}/>}
              </div>
            )}
            {activeTab === 2 && (
              <div className="chartContainer">
                {currArea && <VotingChart currArea={currArea} currState={currState}/>}
              </div>
            )}
            {activeTab === 3 && <p>Test for Tab 4</p>}
          </Box>
        </div>
        </>
      )}
      <div className={`infoMinimizeButtonDiv ${isMinimized ? 'minimized' : ''}`}>
        <button className="infoPanelArrow" onClick={toggleArrow}>
          <span className= "infoPanelArrowTop" style={{ transform: isPointLeft ? 'rotate(-135deg)' : 'rotate(-45deg)', transition: 'transform 0.3s' }}></span>
          <span className= "infoPanelArrowBottom" style={{ transform: isPointLeft ? 'rotate(135deg)' : 'rotate(45deg)', transition: 'transform 0.3s' }}></span>
        </button>
      </div>
    </div>
  );
}