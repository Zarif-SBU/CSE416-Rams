import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2'; 
import 'chart.js/auto';

const IncomeChart = ({ currArea, currState}) => {
  const [chartData, setChartData] = useState(null);
  const [totalHouseholds, setTotalHouseholds] = useState(0);

  const loadData = () => {
    let csvFilePath = ''
    if(currState === 'Louisiana') {
      csvFilePath = 'LA_District_income_2020_data.csv';
    } else {
      csvFilePath = 'NJ_District_income_2020_data.csv';
    }

    Papa.parse(csvFilePath, {
      download: true,
      header: true,  
      complete: (result) => {
        const filteredData = result.data.filter(row => row.Geography === currArea);

        const incomeBuckets = filteredData.map(row => formatIncomeBucket(row['Household Income Bucket']));
        const incomeData = filteredData.map(row => parseFloat(row['Household Income']));
        
        const shareData = filteredData.map(row => parseFloat(row['share']) * 100);

        const totalHouseholds = incomeData.reduce((acc, value) => acc + value, 0);
        setTotalHouseholds(totalHouseholds);

        const chartData = {
          labels: incomeBuckets,
          datasets: [{
            label: 'Share of Households (%)',
            data: shareData,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }]
        };

        setChartData(chartData);
      }
    });
  };

  const formatIncomeBucket = (bucket) => {
    return bucket
      .replace(/\$|,/g, '')
      .replace(/(\d+)-(\d+)/, (match, p1, p2) => {
        return `${Math.round(parseInt(p1) / 1000)}k-${Math.round(parseInt(p2) / 1000)}k`;
      });
  };

  useEffect(() => {
    loadData();
  }, [currArea]);

  return (<div>
    <div className='Total'>Total Households: {totalHouseholds.toLocaleString()}</div>
    <div className="chart-container">
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            
            plugins: {
              title: {
                display: true,
                text: `Household Income`, 
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
                  size: 14 
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Median Household Income',
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
                  text: 'Share of Households (%)', 
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

export default IncomeChart;
