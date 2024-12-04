import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ScatterPlot({ stateName }) {
  const [selectedRace, setSelectedRace] = useState("white");
  const [selectedDisplay, setSelectedDisplay] = useState("race");
  const [ginglesData, setGinglesData] = useState(null);
  const races = ["White", "Black", "Asian", "Native", "Pacific", "Other"];

  const fetchGinglesData = async (race, display) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Gingles/${display}/${stateName}/${race}`
      );

      setGinglesData(response.data);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  useEffect(() => {
      fetchGinglesData(selectedRace, selectedDisplay);
  }, [stateName, selectedRace, selectedDisplay]);

  const handleRaceChange = (event) => {
    setSelectedRace(event.target.value);
  };

  const handleDisplayChange = (event) => {
    setSelectedDisplay(event.target.value);
    if (event.target.value === "race") {
      setSelectedRace("white");
    } else if (event.target.value === "income") {
      setSelectedRace("none");
    } else if (event.target.value === "income_race") {
      setSelectedRace("white");
    }
  };

  const extractDataPoints = (precincts) => {
    const bidenPoints = [];
    const trumpPoints = [];

    precincts.forEach(([x, trumpY, bidenY]) => {
      bidenPoints.push({ x, y: bidenY });
      trumpPoints.push({ x, y: trumpY });
    });

    return { bidenPoints, trumpPoints };
  };

  let bidenPoints = [];
  let trumpPoints = [];
  let bidenRegressionPoints = [];
  let trumpRegressionPoints = [];
  let xMin = 0;
  let xMax = 100;

  if (ginglesData) {
    const data = extractDataPoints(ginglesData.precincts);
    bidenPoints = data.bidenPoints;
    trumpPoints = data.trumpPoints;
  
    bidenRegressionPoints = ginglesData.regression_points.map(([x, , bidenY]) => ({ x, y: bidenY }));
    trumpRegressionPoints = ginglesData.regression_points.map(([x, trumpY]) => ({ x, y: trumpY }));
  
    const allXValues = [...bidenPoints, ...trumpPoints].map((point) => point.x);
    xMin = Math.floor(Math.min(...allXValues));
    xMax = Math.ceil(Math.max(...allXValues));
  }

  const data = {
    datasets: [
      {
        label: 'Biden',
        data: bidenPoints,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
      },
      {
        label: 'Trump',
        data: trumpPoints,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
      },
      {
        label: 'Biden Regression Line',
        data: bidenRegressionPoints,
        type: 'line',
        borderColor: 'rgba(0,0,255,2)',
        backgroundColor: 'rgba(0,0,255,2)',
        fill: false,
      },
      {
        label: 'Trump Regression Line',
        data: trumpRegressionPoints,
        type: 'line',
        borderColor: 'rgba(255,0,0,2)',
        backgroundColor: 'rgba(255,0,0,2)',
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 
            selectedDisplay === "income"
              ? "Income"
              : selectedDisplay === "income_race"
              ? "Z Value"
              : `Percent ${selectedRace.charAt(0).toUpperCase() + selectedRace.slice(1)}`,
          font: { size: 20, weight: "bold", color: "black" },
        },
        ticks: {
          callback: (value) => {
            if (selectedDisplay === "income") {
              return `$${value.toLocaleString()}`;
            } else if (selectedDisplay === "income_race") {
              return `${value}`;
            } else {
              return `${value}%`;
            }
          },
        },
        min:
          selectedDisplay === "income_race"
            ? xMin
            : selectedDisplay === "income"
            ? 0
            : xMin,
        max:
          selectedDisplay === "income_race"
            ? xMax
            : selectedDisplay === "income"
            ? Math.max(xMax, 100000)
            : xMax,
      },
      y: {
        title: {
          display: true,
          text: "Vote Share",
          font: { size: 20, weight: "bold", color: "black" },
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
        min: 0,
        max: 100,
      },
    },
  };
  return (
    <div>
      <h3>Precinct-by-Precinct Voting and Demographic Analysis</h3>

      <label htmlFor="display-select" style={{ fontSize: "20px"}}>Select Display:</label>
      <select
        id="display-select"
        value={selectedDisplay}
        onChange={handleDisplayChange}
        style={{ marginLeft: "10px", marginBottom: "20px", fontSize: "19px"}}
      >
        <option value="race">Race</option>
        <option value="income">Income</option>
        <option value="income_race">Income/Race</option>
      </select>

      {selectedDisplay !== "income" && (
        <>
          <label htmlFor="race-select" style={{ marginLeft: "20px", fontSize: "20px"}}>Select Race:</label>
          <select
            id="race-select"
            value={selectedRace}
            onChange={handleRaceChange}
            style={{ marginLeft: "10px", marginBottom: "20px", fontSize: "19px"}}
          >
            {races.map((race, index) => (
              <option key={index} value={race}>
                {race}
              </option>
            ))}
          </select>
        </>
      )}

      <Scatter data={data} options={options} />
    </div>
  );
}

