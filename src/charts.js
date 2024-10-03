import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js

export default function Chart() {
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading with dummy data
    setLoading(true);
    try {
      const formattedData = generateDummyRaceData(8000000); // Total population: 8 million
      setRaceData(formattedData);
      setLoading(false);
    } catch (err) {
      console.error('Error generating dummy data:', err);
      setError('Failed to generate data');
      setLoading(false);
    }
  }, []);

  const generateDummyRaceData = (totalPopulation) => {
    // Step 1: Calculate White population (70% to 95% of total population)
    const whitePercentage = getRandomPercentage(60, 80);
    const whitePopulation = Math.round((whitePercentage / 100) * totalPopulation);

    // Step 2: Calculate Black population (65% of the remaining population after White)
    const remainingAfterWhite = totalPopulation - whitePopulation;
    const blackPopulation = Math.round(0.65 * remainingAfterWhite);

    // Step 3: Calculate Asian population (65% of the remaining population after Black and White)
    const remainingAfterBlack = remainingAfterWhite - blackPopulation;
    const asianPopulation = Math.round(0.65 * remainingAfterBlack);

    // Step 4: Calculate Native population (65% of the remaining population after Asian)
    const remainingAfterAsian = remainingAfterBlack - asianPopulation;
    const nativePopulation = Math.round(0.65 * remainingAfterAsian);

    // Step 5: Calculate Pacific Islander population (65% of the remaining population after Native)
    const remainingAfterNative = remainingAfterAsian - nativePopulation;
    const pacificIslanderPopulation = Math.round(0.65 * remainingAfterNative);

    // Step 6: Others get the rest of the remaining population
    const remainingAfterPacificIslander = remainingAfterNative - pacificIslanderPopulation;
    const otherPopulation = remainingAfterPacificIslander;

    const raceCategories = [
      'White',
      'Black',
      'Asian',
      'Native/Pacific Islander',
      'Pacific Islander',
      'Other',
    ];

    const populationData = [
      { category: 'White', population: whitePopulation },
      { category: 'Black', population: blackPopulation },
      { category: 'Asian', population: asianPopulation },
      { category: 'Native American', population: nativePopulation },
      { category: 'Pacific Islander', population: pacificIslanderPopulation },
      { category: 'Other', population: otherPopulation },
    ];

    return populationData;
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
          'rgba(255, 205, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(201, 203, 207, 1)',
          'rgba(255, 205, 86, 1)',
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

  return raceData ? <Bar data={data} options={options} /> : null;
}
