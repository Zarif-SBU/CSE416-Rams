import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const VotingChart = ({ currArea, currState }) => {
  const [chartData, setChartData] = useState(null);
  const [totalVotes, setTotalVotes] = useState(0);
  const [chartTitle, setChartTitle] = useState(''); 

  const loadData = () => {
    let csvFilePath = '';
    
    if (currState === 'Louisiana') {
        if(currState === currArea || currArea.includes("District")){
            csvFilePath = 'Louisiana_State_and_District_Voting_Data.csv';
        } else {
            csvFilePath = 'LA_Precinct_Voting_Data.csv';
        }
    } else if (currState === 'New Jersey') {
        if(currState === currArea || currArea.includes("District")){
            csvFilePath = 'NJ_State_and_District_Voting_Data.csv';
        } else {
            csvFilePath = 'NJ_Precinct_Voting_Data.csv';
        }
    }

    Papa.parse(csvFilePath, {
      download: true,
      header: true,
      complete: (result) => {
        let filteredData;

        if (csvFilePath.includes('State_and_District_Voting_Data')) {
          filteredData = result.data.find(row => row.Location === currArea);
          
          if (filteredData) {
            const bidenPct = parseFloat(filteredData.BIDEN);
            const trumpPct = parseFloat(filteredData.TRUMP);
            const othersPct = parseFloat(filteredData.OTHERS);
            const total = parseInt(filteredData['Total Votes'].replace(/,/g, ''), 10); 

            setTotalVotes(total);

            const chartData = {
              labels: ['Biden', 'Trump', 'Others'],
              datasets: [{
                label: 'Vote Share (%)',
                data: [bidenPct.toFixed(2), trumpPct.toFixed(2), othersPct.toFixed(2)],
                backgroundColor: ['blue', 'red', 'purple'],
                borderWidth: 1,
              }]
            };

            setChartData(chartData);
            setChartTitle(`Voting Results for ${currArea}`);
          }
        }
        else {
          if (currState === 'New Jersey') {
            filteredData = result.data.find(row => 
              `${row.MUN_NAME} ${row.WARD_CODE} ${row.ELECD_CODE}`.trim() === currArea
            );
          } else if (currState === 'Louisiana') {
            filteredData = result.data.find(row => row.Precinct === currArea);
          }

          if (filteredData) {
            const bidenVotes = parseInt(filteredData.BIDEN, 10);
            const trumpVotes = parseInt(filteredData.TRUMP, 10);
            const othersVotes = parseInt(filteredData.OTHERS, 10);

            const total = bidenVotes + trumpVotes + othersVotes;
            setTotalVotes(total);

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
                borderWidth: 1,
              }]
            };

            setChartData(chartData);
            setChartTitle(`Voting Results for ${currArea}`);
          }
        }

        if (!filteredData) {
          const emptyData = {
            labels: ['Biden', 'Trump', 'Others'],
            datasets: [{
              label: 'No Data',
              data: [0, 0, 0],
              backgroundColor: ['blue', 'red', 'purple'],
              borderWidth: 1,
            }]
          };

          setChartData(emptyData);
          setChartTitle('No voting data');
        }
      }
    });
  };

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
                  text: chartTitle, 
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
                    text: 'Candidates',
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
                    text: 'Percentage of Total Votes (%)',
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
                      return value + '%'; 
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
