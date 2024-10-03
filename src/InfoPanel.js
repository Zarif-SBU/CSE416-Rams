import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './charts';

export default function InfoPanel({ stateName, legendColorBtn }) {
  const [activeTab, setActiveTab] = useState(0);
  const [ucgid, setUcgid] = useState(null);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    setUcgid(1);
  };

  return (
    <div className="info-panel">
      <h2>{stateName}</h2>
      <div>Information Here</div>
      <Tabs value={activeTab} onChange={handleChange}>
        <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
        <Tab label="Ensemble plan analysis" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
        <Tab label="Tab 3" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
        <Tab label="Tab 4" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
      </Tabs>
      <Box sx={{ padding: 2 }}>
        {activeTab === 0 && <div className="chart-container">
        {ucgid && <Chart ucgid={ucgid} />}
      </div>}
        {activeTab === 1 && <p><button onClick={legendColorBtn}>Click to Change Color Test</button></p>}
        {activeTab === 2 && <p>Content for Tab 3</p>}
        {activeTab === 3 && <p>Test for tab 4</p>}
      </Box>
    </div>
  );
}