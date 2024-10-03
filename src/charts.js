import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; 

export default function Chart({ currArea }) { 
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    try {
      const formattedData = generateDummyRaceData(currArea);
      setRaceData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Error generating dummy data:', err);
      setError('Failed to generate data');
      setLoading(false);
    }
  }, [currArea]); 

  const generateDummyRaceData = (area) => {
    let totalPopulation = 0;
    if (area === "New Jersey") {
      totalPopulation = 9200000; 
    } else {
      totalPopulation = 4200000;
    }

    const whitePercentage = getRandomPercentage(60, 80);
    const whitePopulation = Math.round((whitePercentage / 100) * totalPopulation);

    const remainingAfterWhite = totalPopulation - whitePopulation;
    const blackPopulation = Math.round(0.65 * remainingAfterWhite);

    const remainingAfterBlack = remainingAfterWhite - blackPopulation;
    const asianPopulation = Math.round(0.65 * remainingAfterBlack);

    const remainingAfterAsian = remainingAfterBlack - asianPopulation;
    const nativePopulation = Math.round(0.65 * remainingAfterAsian);

    const remainingAfterNative = remainingAfterAsian - nativePopulation;
    const pacificIslanderPopulation = Math.round(0.65 * remainingAfterNative);

    const remainingAfterPacificIslander = remainingAfterNative - pacificIslanderPopulation;
    const otherPopulation = remainingAfterPacificIslander;

    return [
      { category: 'White', population: whitePopulation },
      { category: 'Black', population: blackPopulation },
      { category: 'Asian', population: asianPopulation },
      { category: 'Native American', population: nativePopulation },
      { category: 'Pacific Islander', population: pacificIslanderPopulation },
      { category: 'Other', population: otherPopulation },
    ];
  };

  const getRandomPercentage = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  const data = {
    labels: raceData ? raceData.map((item) => item.category) : [],
    datasets: [
      {
        label: 'Population by Race',
        data: raceData ? raceData.map((item) => item.population) : [],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(201, 203, 207, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(201, 203, 207, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return <div>Loading chart...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
}
