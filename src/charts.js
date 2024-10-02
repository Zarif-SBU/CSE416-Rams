import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // Required for Chart.js

export default function Chart({ ucgid }) {
  const [raceData, setRaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (ucgid) {
      setLoading(true);
      fetch(
        `https://api.census.gov/data/2020/dec/pl?get=group(P1)&ucgid=0400000US34`
      )
        .then((response) => response.json())
        .then((data) => {
          // Handle and format the data as needed for the chart
          const formattedData = processCensusData(data);
          setRaceData(formattedData);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching Census data:', err);
          setError('Failed to load data');
          setLoading(false);
        });
    }
  }, [ucgid]);

  const processCensusData = (data) => {
    // Process the API response and extract race data for the chart
    // Assuming data is structured as a matrix, where rows contain race categories and population
    if (data && data.length > 1) {
      const headers = data[0]; // First row contains the headers
      const values = data[1]; // Second row contains the data values
      
      const raceCategories = [
        'White', 
        'Black or African American', 
        'American Indian and Alaska Native', 
        'Asian', 
        'Native Hawaiian and Other Pacific Islander', 
        'Other', 
        'Two or more races'
      ];

      // Map categories to population values (replace these indices with the actual indices from the API data)
      const populationData = raceCategories.map((category, index) => {
        return {
          category,
          population: values[index + 1], // Adjust the index to match the actual data structure
        };
      });

      return populationData;
    }
    return [];
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
