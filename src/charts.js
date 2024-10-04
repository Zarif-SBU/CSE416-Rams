import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';  // For parsing CSV
import { Bar } from 'react-chartjs-2';  // Chart.js component
import 'chart.js/auto';  // Automatically imports required chart.js components

const PopulationChart = ({ currArea }) => {
  const [chartData, setChartData] = useState(null);
  const [totalPopulation, setTotalPopulation] = useState(0);  // Total population
  const [chartTitle, setChartTitle] = useState(''); // Title for the chart

  // Function to load and filter data from the CSV or generate dummy data
  const loadData = () => {
    let csvFilePath = '';

    // Check if currArea is Louisiana or New Jersey to load real data
    if (currArea === 'Louisiana') {
      csvFilePath = 'LA_Population_data.csv';
    } else if (currArea === 'New Jersey') {
      csvFilePath = 'NJ_Population_data.csv';
    }

    if (csvFilePath) {
      // Load real CSV data
      Papa.parse(csvFilePath, {
        download: true,
        header: true,
        complete: (result) => {
          const filteredData = formatCsvData(result.data);

          if (filteredData) {
            const total = calculateTotalPopulation(filteredData);
            setTotalPopulation(total);

            const chartData = {
              labels: filteredData.map((item) => item.category),
              datasets: [{
                label: 'Population',
                data: filteredData.map((item) => item.population),
                backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(201, 203, 207, 0.6)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(201, 203, 207, 1)'],
                borderWidth: 1,
              }]
            };

            setChartData(chartData);
            setChartTitle(`Population Distribution for ${currArea}`);
          } else {
            handleNoData();
          }
        }
      });
    } else {
      // Generate dummy data if currArea is not Louisiana or New Jersey
      const dummyData = generateDummyRaceData(currArea);
      const total = calculateTotalPopulation(dummyData);
      setTotalPopulation(total);

      const chartData = {
        labels: dummyData.map((item) => item.category),
        datasets: [{
          label: 'Population',
          data: dummyData.map((item) => item.population),
          backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(201, 203, 207, 0.6)'],
          borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(201, 203, 207, 1)'],
          borderWidth: 1,
        }]
      };

      setChartData(chartData);
      setChartTitle(`Dummy Population Data for ${currArea}`);
    }
  };

  // Helper function for formatting CSV data
  const formatCsvData = (data) => {
    const raceMapping = [
      { category: 'White', key: 'White alone' },
      { category: 'Black', key: 'Black or African American alone' },
      { category: 'Asian', key: 'Asian alone' },
      { category: 'Native', key: 'American Indian and Alaska Native alone' }, 
      { category: 'Pacific', key: 'Native Hawaiian and Other Pacific Islander alone' }, 
      { category: 'Other', key: 'Some Other Race alone' },
      { category: '2+ races', key: 'Population of two or more races' }
    ];

    const populationMap = {};
    data.forEach((row) => {
      const label = row['Label (Grouping)'].trim();
      if (row['Louisiana']) {
        populationMap[label] = parseInt(row['Louisiana'].replace(/,/g, ''), 10);
      } else if (row['New Jersey']) {
        populationMap[label] = parseInt(row['New Jersey'].replace(/,/g, ''), 10);
      }
    });

    return raceMapping.map((race) => {
      const population = populationMap[race.key] || 0;
      return { category: race.category, population: population };
    });
  };

  // Function to calculate total population
  const calculateTotalPopulation = (data) => {
    return data.reduce((total, item) => total + item.population, 0);
  };

  // Generate dummy race data for areas other than Louisiana or New Jersey
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
    const twoOrMore = 10000;
    totalPopulation += twoOrMore;

    return [
      { category: 'White', population: whitePopulation },
      { category: 'Black', population: blackPopulation },
      { category: 'Asian', population: asianPopulation },
      { category: 'Native', population: nativePopulation },
      { category: 'Pacific', population: pacificIslanderPopulation },
      { category: 'Other', population: otherPopulation },
      { category: '2+ races', population: twoOrMore }
    ];
  };

  // Get random percentage for dummy data
  const getRandomPercentage = (min, max) => {
    return Math.random() * (max - min) + min;
  };

  // Handle no data found case
  const handleNoData = () => {
    setChartData({
      labels: ['No Data'],
      datasets: [{
        label: 'No Data',
        data: [0],
        backgroundColor: ['rgba(201, 203, 207, 0.6)'],
        borderColor: ['rgba(201, 203, 207, 1)'],
        borderWidth: 1,
      }]
    });
    setChartTitle('No population data available');
  };

  // Effect hook to load data when component mounts or currArea changes
  useEffect(() => {
    loadData();
  }, [currArea]);

  return (
    <div>
      <div>Total Population: {totalPopulation.toLocaleString()}</div>
      <div className="chart-container">
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: chartTitle,  // Dynamic title based on data
                  font: {
                    size: 18,
                    family: 'Open Sans',
                    weight: '700',
                  }
                },
                legend: {
                  display: false,
                },
                tooltip: {
                  bodyFont: {
                    family: 'Open Sans',
                    size: 12
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Race',
                    font: {
                      family: 'Open Sans',
                      size: 14
                    }
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 12
                    }
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Population',
                    font: {
                      family: 'Open Sans',
                      size: 14
                    }
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 12
                    },
                    beginAtZero: true,
                    callback: function(value) {
                      return value >= 1000 ? `${value / 1000}K` : value;
                    }
                  }
                }
              }
            }}
          />
        ) : (
          <p>Loading chart data...</p>
        )}
      </div>
    </div>
  );
};

export default PopulationChart;
