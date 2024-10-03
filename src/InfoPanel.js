import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function InfoPanel({ stateName }) {
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
          <div>Information Here</div>
          <Tabs value={activeTab} onChange={handleChange}>
            <Tab label="Overview" />
            <Tab label="Tab 2" />
            <Tab label="Tab 3" />
            <Tab label="Tab 4" />
          </Tabs>
          <Box sx={{ padding: 2 }}>
            {activeTab === 0 && <p>Content for Tab 1</p>}
            {activeTab === 1 && <p>Content for Tab 2</p>}
            {activeTab === 2 && <p>Content for Tab 3</p>}
            {activeTab === 3 && <p>Test for tab 4</p>}
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