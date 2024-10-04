import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Papa from 'papaparse';
import axios from 'axios'; 

export default function Chart({ currArea }) { 
  const [raceData, setRaceData] = useState(null);
  const [totalPopulation, setTotalPopulation] = useState(0); // State for total population

  useEffect(() => {
    const fetchData = async () => {
      if (currArea === "New Jersey") {
        const response = await axios.get('/NJ_Population_data.csv');
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formattedData = formatCsvData(result.data);
            setRaceData(formattedData);
            setTotalPopulation(calculateTotalPopulation(formattedData)); // Set total population
          },
        });
      } else if(currArea === "Louisiana"){
        const response = await axios.get('/LA_Population_data.csv');
        Papa.parse(response.data, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const formattedData = formatCsvData(result.data);
            setRaceData(formattedData);
            setTotalPopulation(calculateTotalPopulation(formattedData)); // Set total population
          },
        });
      } else {
        const formattedData = generateDummyRaceData(currArea);
        setRaceData(formattedData);
        setTotalPopulation(calculateTotalPopulation(formattedData)); // Set total population
      }
    };

    fetchData();
  }, [currArea]); 

  const formatCsvData = (data) => {
    const raceMapping = [
      { category: 'White', key: 'White alone' },
      { category: 'Black', key: 'Black or African American alone' },
      { category: 'Asian', key: 'Asian alone' },
      { category: 'Native American', key: 'American Indian and Alaska Native alone' },
      { category: 'Pacific Islander', key: 'Native Hawaiian and Other Pacific Islander alone' },
      { category: 'Other', key: 'Some Other Race alone' },
    ];
  
    const populationMap = {};
    data.forEach((row) => {
      const label = row['Label (Grouping)'].trim();
      if (row['New Jersey']) {
        populationMap[label] = parseInt(row['New Jersey'].replace(/,/g, ''), 10);
      } else {
        if (row['Louisiana']) {
          populationMap[label] = parseInt(row['Louisiana'].replace(/,/g, ''), 10);
        }
      }
    });

    return raceMapping.map((race) => {
      const population = populationMap[race.key] || 0;
      return { category: race.category, population: population };
    });
  };

  const calculateTotalPopulation = (data) => {
    return data.reduce((total, item) => total + item.population, 0);
  };

  const generateDummyRaceData = (area) => {
    let totalPopulation = 100000;

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
    plugins: {
      title: {
        display: true,
        text: 'Race and Ethnicity', // Display total population
        font: {
          size: 24, // Increase title font size
          weight: 'bold', // Make title bold
        },
      },
      legend: {
        display: false, // Remove the legend
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Population', // Y-axis title
          font: {
            size: 18, // Increase y-axis title font size
          },
        },
        ticks: {
          font: {
            size: 16, // Increase y-axis tick font size
          },
        },
      },
      x: {
        title: {
          display: true,
          text: 'Race', // X-axis title
          font: {
            size: 18, // Increase x-axis title font size
          },
        },
        ticks: {
          font: {
            size: 16, // Increase x-axis tick font size
          },
        },
      },
    },
  };

  return (
    <div className="chart-container">
      {raceData && <Bar data={data} options={options} />}
    </div>
  );
}
