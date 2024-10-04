import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';  // For parsing CSV
import { Bar } from 'react-chartjs-2';  // Chart.js component
import 'chart.js/auto';  // Automatically imports required chart.js components

const VotingChart = ({ currArea, currState }) => {
  const [chartData, setChartData] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);  // Total of all votes (Biden, Trump, Others)
  const [chartTitle, setChartTitle] = useState(''); // Title for the chart

  // Function to load and filter data from the CSV
  const loadData = () => {
    let csvFilePath = '';
    
    if (currState === 'Louisiana') {
      csvFilePath = 'LA_Precinct_Voting_Data.csv';
    } else if (currState === 'New Jersey') {
      csvFilePath = 'NJ_Precinct_Voting_Data.csv';
    }

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (result) => {
        let filteredData;

        // Filter data based on currState and currArea
        if (currState === 'New Jersey') {
          // Combine MUN_NAME, WARD_CODE, and ELECD_CODE into a single string
          filteredData = result.data.find(row => 
            `${row.MUN_NAME} ${row.WARD_CODE} ${row.ELECD_CODE}`.trim() === currArea
          );
        } else if (currState === 'Louisiana') {
          // Compare the Precinct column with currArea
          filteredData = result.data.find(row => row.Precinct === currArea);
        }

        if (filteredData) {
          const bidenVotes = parseInt(filteredData.BIDEN, 10);
          const trumpVotes = parseInt(filteredData.TRUMP, 10);
          const othersVotes = parseInt(filteredData.OTHERS, 10);

          const total = bidenVotes + trumpVotes + othersVotes;
          setTotalVotes(total);

          // Prepare chart data for Chart.js
          const chartData = {
            labels: ['Biden', 'Trump', 'Others'],
            datasets: [{
              label: 'Vote Share (%)',
              data: [
                ((bidenVotes / total) * 100).toFixed(2),
                ((trumpVotes / total) * 100).toFixed(2),
                ((othersVotes / total) * 100).toFixed(2)
              ],
              backgroundColor: ['blue', 'red', 'purple'],
              borderColor: ['darkblue', 'darkred', 'indigo'],
              borderWidth: 1,
            }]
          };

          setChartData(chartData);
          setChartTitle(`Voting Results for ${currArea}`);
        } else {
          // If no data is found for the given area, set empty chart data
          const emptyData = {
            labels: ['Biden', 'Trump', 'Others'],
            datasets: [{
              label: 'No Data',
              data: [0, 0, 0],
              backgroundColor: ['blue', 'red', 'purple'],
              borderColor: ['darkblue', 'darkred', 'indigo'],
              borderWidth: 1,
            }]
          };

          setChartData(emptyData);
          setChartTitle('No voting data');
        }
      }
    });
  };

  // Effect hook to load data when component mounts or currArea changes
  useEffect(() => {
    loadData();
  }, [currArea]);

  return (
    <div>
      <div className='Total'>Total Votes: {totalVotes.toLocaleString()}</div>
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
                    size: 24,
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
                    size: 16
                  }
                }
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Candidates',
                    font: {
                      family: 'Open Sans',
                      size: 18
                    }
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 16
                    }
                  }
                },
                y: {
                  title: {
                    display: true,
                    text: 'Percentage of Total Votes (%)',
                    font: {
                      family: 'Open Sans',
                      size: 18
                    }
                  },
                  ticks: {
                    font: {
                      family: 'Open Sans',
                      size: 16
                    },
                    beginAtZero: true,
                    callback: function(value) {
                      return value + '%';  // Show percentage symbol on y-axis
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

export default VotingChart;
