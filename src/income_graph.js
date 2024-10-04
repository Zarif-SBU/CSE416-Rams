import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';  // For parsing CSV
import { Bar } from 'react-chartjs-2';  // Chart.js component
import 'chart.js/auto';  // Automatically imports required chart.js components

const IncomeChart = ({ currArea, currState}) => {
  const [chartData, setChartData] = useState(null);
  const [totalHouseholds, setTotalHouseholds] = useState(0);  // New state for total household amount

  // Function to load and filter data from the CSV
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
        // Filter data based on currArea in Geography column
        const filteredData = result.data.filter(row => row.Geography === currArea);

        // Extract Household Income Bucket, Household Income, and Share columns
        const incomeBuckets = filteredData.map(row => formatIncomeBucket(row['Household Income Bucket']));
        const incomeData = filteredData.map(row => parseFloat(row['Household Income']));
        
        // Use share values directly (no rounding)
        const shareData = filteredData.map(row => parseFloat(row['share']) * 100);  // Multiply by 100 for percentage

        // Calculate the total households
        const totalHouseholds = incomeData.reduce((acc, value) => acc + value, 0);
        setTotalHouseholds(totalHouseholds);

        // Prepare chart data using percentage
        const chartData = {
          labels: incomeBuckets,
          datasets: [{
            label: 'Share of Households (%)',  // Show the share percentages on the chart
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

  // Helper function to format the income bucket
  const formatIncomeBucket = (bucket) => {
    return bucket
      .replace(/\$|,/g, '')  // Remove $ and commas
      .replace(/(\d+)-(\d+)/, (match, p1, p2) => {
        return `${Math.round(parseInt(p1) / 1000)}k-${Math.round(parseInt(p2) / 1000)}k`;  // Convert to 10k-15k format and round
      });
  };

  // Effect hook to load data when component mounts or currArea changes
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
                text: `Household Income`,  // Dynamically show total households
                font: {
                  size: 18,  // Increased title font size
                  family: 'Open Sans',
                  weight: '700',  // Set font weight to bold
                }
              },
              legend: {
                display: false,  // Remove the legend
              },
              tooltip: {
                bodyFont: {
                  family: 'Open Sans',
                  size: 14  // Increased tooltip font size
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Median Household Income',  // Updated x-axis label
                  font: {
                    family: 'Open Sans',
                    size: 14  // Increased x-axis title font size
                  }
                },
                ticks: {
                  font: {
                    family: 'Open Sans',
                    size: 12  // Increased x-axis tick font size
                  }
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Share of Households (%)',  // Updated y-axis label
                  font: {
                    family: 'Open Sans',
                    size: 14  // Increased y-axis title font size
                  }
                },
                ticks: {
                  font: {
                    family: 'Open Sans',
                    size: 12  // Increased y-axis tick font size
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
