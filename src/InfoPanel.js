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

  const getPopulation = () => {
    switch (stateName) {
      case 'Louisiana':
        return "37.6";
      case 'New Jersey':
        return "40";
      default:
        return 'N/A'; 
    }
  };

  const getPoliticalLean = () => {
    switch (currArea) {
      case 'Louisiana':
        return 'Republican';
      case 'New Jersey':
        return 'Republican';
      default:
        return 'Democratic'; 
    }
  };

  const getDistrictAmt = () => {
    switch (currArea) {
      case 'Louisiana':
        return 6;
      case 'New Jersey':
        return 'Republican';
      default:
        return 12; 
    }
  };

  const getHouseHoldIncome = () => {
    switch (currArea) {
      case 'Louisiana':
        return "$57,852";
      case 'New Jersey':
        return "$97,126";
      default:
        return "$97,126"; 
    }
  };

  const getPrecinctAmt = () => {
    switch (currArea) {
      case 'Louisiana':
        return "4,864";
      case 'New Jersey':
        return "2,324";
      default:
        return "$97,126"; 
    }
  };

  return (
    <div className={`info-panel ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized && (
        <>
          <div className='infoDiv'>
            <h2 className='stateNameInfoPanel'>{stateName}</h2>

            <div style={{fontSize: "20px"}}>
              <span style={{ fontWeight: 'bold' }}>Current Area: </span>
              <span>{currArea}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Political Lean: </span>
              <span>{getPoliticalLean()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Median Household Income: </span>
              <span>{getHouseHoldIncome()}</span>
            </div>

            <div style={{fontSize: "20px"}}>
              <span style={{ fontWeight: 'bold' }}>Median Age: </span>
              <span>{getPopulation()} </span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Districts: </span>
              <span>{getDistrictAmt()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Precincts: </span>
              <span>{getPrecinctAmt()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Drawing Process: </span>
              <span style={{ cursor: "pointer", textDecoration: 'underline' }}>click here</span>
              
            </div>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
              <Tab label="Ensemble plan analysis" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
              <Tab label="Ecological Inference" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
            </Tabs>
            <Box sx={{ padding: 2 }}>
              {activeTab === 0 && (
                <div className='BarChartsContainer'>
                  {/* Container for side-by-side charts */}
                  <div className="topChartsContainer">
                    <div className="PopChart">
                      {currArea && <Chart currArea={currArea} />}
                    </div>
                    <div className="VotingChart">
                      {currArea && <VotingChart currArea={currArea} currState={currState}/>}
                    </div>
                  </div>
                  {/* Container for IncomeChart below */}
                  <div className="IncomeChart">
                    {currArea && <IncomeChart currArea={currArea} currState={currState}/>}
                  </div>
                </div>
              )}
              {activeTab === 1 && <div>Content for Tab 1</div>}
              {activeTab === 2 && <div>Content for Tab 2</div>}
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
