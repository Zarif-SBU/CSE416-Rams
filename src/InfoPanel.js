import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import Chart from './Charts';
import axios from 'axios';
import axios from 'axios';
import IncomeChart from './Income_graph';
import VotingChart from './Voting_graph';
import ScatterPlot from './ScatterChart';
import CongressionalTable from './CongressionalTable';
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
  const [stateData, setStateData] = useState(null);

  useEffect(() => {
    setMinimizeInfoPanel(false);
    fetchStateData();
  }, [stateName]);

  const fetchStateData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/info/${stateName}/summary`);
      setStateData(response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

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
        return "4.57 Million";
      case 'New Jersey':
        return "9.29 Million";
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
              <span>{stateData?.averageHouseholdIncomeDistribution?.toLocaleString() || ""}</span>
            </div>

            <div style={{fontSize: "20px"}}>
              <span style={{ fontWeight: 'bold' }}>State Population: </span>
              <span>{stateData?.statePopulation || ''} </span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Party Control: </span>
              <span>{stateData?.partyControlRedistricting?.toLocaleString() || ""}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Precinct: </span>
              <span>{getPrecinctAmt()}</span>
              <span style={{ marginLeft: '20px', fontWeight: 'bold' }}>Drawing Process: </span>
              <span style={{ cursor: "pointer", textDecoration: 'underline' }}>click here</span>
              
            </div>
            <Tabs value={activeTab} onChange={handleChange}>
              <Tab label="Overview" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
              <Tab label="Precinct Voting Analysis" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
              <Tab label="Ecological Inference" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
              <Tab label="Congressional Representation Table" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}/>
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
                  <ScatterPlot
                  stateName={stateName}
                  /> {/* Render the ScatterPlot */}
                </>
              )}
              {activeTab === 2 && <div className='BarChartsContainer'><BoxWhiskerPlot /></div>}
              {activeTab === 3 && (<CongressionalTable stateName={stateName}/>)}
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
