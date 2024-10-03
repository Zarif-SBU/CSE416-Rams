import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './charts';

export default function InfoPanel({ stateName, currArea }) {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className="info-panel">
      <h2>{stateName}</h2>
      <div>Current Area: {currArea}</div>
      <Tabs value={activeTab} onChange={handleChange}>
        <Tab label="Overview" />
        <Tab label="Tab 2" />
        <Tab label="Tab 3" />
        <Tab label="Tab 4" />
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
  );
}