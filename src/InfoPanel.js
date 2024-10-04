import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './charts';
import IncomeChart from './income_graph';
import VotingChart from './voting_graph';
import ScatterPlot from './ScatterChart';
import BoxWhiskerPlot from './BoxWhiskerPlot';


function TableDisplay() {
  const data = [
    { precinct: 'Precinct 1', blackPercentage: '10%', bidenShare: '15%', trumpShare: '80%' },
    { precinct: 'Precinct 2', blackPercentage: '25%', bidenShare: '30%', trumpShare: '60%' },
    { precinct: 'Precinct 3', blackPercentage: '40%', bidenShare: '50%', trumpShare: '40%' },
    { precinct: 'Precinct 4', blackPercentage: '55%', bidenShare: '65%', trumpShare: '20%' },
    { precinct: 'Precinct 5', blackPercentage: '70%', bidenShare: '80%', trumpShare: '10%' },
  ];

  return (
    <table border="1" style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>
      <thead>
        <tr>
          <th>Precinct</th>
          <th>Black Population (%)</th>
          <th>Biden Vote Share (%)</th>
          <th>Trump Vote Share (%)</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.precinct}</td>
            <td>{row.blackPercentage}</td>
            <td>{row.bidenShare}</td>
            <td>{row.trumpShare}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default function InfoPanel({ stateName, currArea, handleArrowClick, currState }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPointLeft, setPointLeft] = useState(true);
  const [isMinimized, setMinimizeInfoPanel] = useState(false);

  useEffect(() => {
    setMinimizeInfoPanel(false);
  }, [stateName]);

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
                <div className='BarChartsContainer'>
                  <div className="topChartsContainer">
                    <div className="PopChart">
                      {currArea && <Chart currArea={currArea} />}
                    </div>
                    <div className="VotingChart">
                      {currArea && <VotingChart currArea={currArea} currState={currState}/>}
                    </div>
                  </div>
                  <div className="IncomeChart">
                    {currArea && <IncomeChart currArea={currArea} currState={currState}/>}
                  </div>
                </div>
              )}
              {activeTab === 1 && (
                <>
                  <ScatterPlot/> {/* Render the ScatterPlot */}
                </>
              )}
              {activeTab === 2 && <div className='BarChartsContainer'><BoxWhiskerPlot /></div>}
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
