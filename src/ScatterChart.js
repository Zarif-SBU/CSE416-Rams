import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import regression from 'regression';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function ScatterPlot() {
  // Dummy data for Biden and Trump
  const bidenData = [
    { x: 5, y: 15 },
    { x: 10, y: 18 },
    { x: 15, y: 22 },
    { x: 20, y: 25 },
    { x: 25, y: 35 },
    { x: 30, y: 28 },
    { x: 35, y: 45 },
    { x: 40, y: 50 },
    { x: 45, y: 42 },
    { x: 50, y: 55 },
    { x: 55, y: 58 },
    { x: 60, y: 67 },
    { x: 65, y: 60 },
    { x: 70, y: 72 },
    { x: 75, y: 78 },
    { x: 80, y: 65 },
    { x: 85, y: 85 },
    { x: 90, y: 75 },
    { x: 95, y: 90 },
    { x: 14, y: 53 },
    { x: 12, y: 57 },
    { x: 11, y: 45 },
    { x: 12, y: 57 },
    { x: 11, y: 28 },
    { x: 22, y: 31 },
    { x: 22, y: 42 },
    { x: 17, y: 42 },
    { x: 18, y: 33 },
    { x: 24, y: 33 },
  ];

  const trumpData = [

    { x: 5, y: 85 },
    { x: 10, y: 82 },
    { x: 11, y: 60 },
    { x: 12, y: 70 },
    { x: 13, y: 51 },
    { x: 14, y: 53 },
    { x: 15, y: 59 },
    { x: 11, y: 30 },
    { x: 12, y: 20 },
    { x: 13, y: 10 },
    { x: 14, y: 35 },
    { x: 15, y: 20 },
    { x: 15, y: 60 },
    { x: 20, y: 70 },
    { x: 25, y: 78 },
    { x: 30, y: 65 },
    { x: 35, y: 55 },
    { x: 40, y: 60 },
    { x: 45, y: 48 },
    { x: 50, y: 50 },
    { x: 55, y: 40 },
    { x: 60, y: 45 },
    { x: 65, y: 35 },
    { x: 70, y: 30 },
    { x: 75, y: 38 },
    { x: 80, y: 25 },
    { x: 85, y: 20 },
    { x: 90, y: 15 },
    { x: 95, y: 10 },
    { x: 2, y: 90 },
    { x: 3, y: 88 },
    { x: 8, y: 80 },
    { x: 9, y: 75 },
    { x: 16, y: 40 },
    { x: 17, y: 65 },
    { x: 18, y: 78 },
    { x: 19, y: 83 },
    { x: 22, y: 55 },
    { x: 23, y: 73 },
    { x: 26, y: 62 },
    { x: 27, y: 58 },
    { x: 28, y: 72 },
    { x: 29, y: 64 },
    { x: 31, y: 68 },
    { x: 32, y: 52 },
    { x: 33, y: 45 },
    { x: 34, y: 33 },
    { x: 36, y: 29 },
    { x: 37, y: 37 },
    { x: 38, y: 34 },
    { x: 39, y: 30 },

    { x: 66, y: 5 },
    { x: 67, y: 8 },
    { x: 68, y: 10 },
    { x: 69, y: 13 },
  ];

  // Function to calculate polynomial regression points
  const getRegressionPoints = (data) => {
    // Using regression.js to calculate polynomial regression
    const result = regression.polynomial(data.map(point => [point.x, point.y]), { order: 3 });

    // Generate points along the regression line
    const regressionPoints = [];
    for (let x = 0; x <= 100; x += 1) {
      const y = result.equation[0] * Math.pow(x, 3) + result.equation[1] * Math.pow(x, 2) + result.equation[2] * x + result.equation[3];
      regressionPoints.push({ x, y });
    }
    return regressionPoints;
  };

  const bidenRegression = getRegressionPoints(bidenData);
  const trumpRegression = getRegressionPoints(trumpData);

  const data = {
    datasets: [
      {
        label: 'Biden',
        data: bidenData,
        backgroundColor: 'blue',
      },
      {
        label: 'Trump',
        data: trumpData,
        backgroundColor: 'red',
      },
      {
        label: 'Biden Regression Line',
        data: bidenRegression,
        type: 'line',
        borderColor: 'rgba(0,0,255,0.6)',
        backgroundColor: 'rgba(0,0,255,0.2)',
        font: { size: 20 , weight: 'bold', color: 'black'},
        fill: false,
        showLine: false,
      },
      {
        label: 'Trump Regression Line',
        data: trumpRegression,
        type: 'line',
        borderColor: 'rgba(255,0,0,0.6)',
        backgroundColor: 'rgba(255,0,0,0.2)',
        font: { size: 20 , weight: 'bold', color: 'black'},
        fill: false,
        showLine: false,
      },
    ],
  };

  // Options for customizing the axes and appearance
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Percentage of Black Population (%)',
          font: { size: 20 , weight: 'bold', color: 'black'},
        },
        ticks: {
          callback: (value) => `${value}%`,
        },
        min: 0,
        max: 100,
      },
      y: {
        title: {
          display: true,
          text: 'Vote Share (%)',
          font: { size: 20 , weight: 'bold', color: 'black'},
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
      <Scatter data={data} options={options} />
    </div>
  );
}
