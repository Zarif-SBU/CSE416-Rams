import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './charts';

export default function InfoPanel({ stateName, currArea }) {
  const [activeTab, setActiveTab] = useState(0);
  const [isPointLeft, setPointLeft] = useState(true);
  const [isMinimized, setMinimizeInfoPanel] = useState(false);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleArrow = () => {
    setPointLeft((prev) => !prev);
    setMinimizeInfoPanel((prev) => !prev);
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
            {activeTab === 1 && <p>Content for Tab 2</p>}
            {activeTab === 2 && <p>Content for Tab 3</p>}
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