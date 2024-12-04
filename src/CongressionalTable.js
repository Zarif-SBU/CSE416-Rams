import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function CongressionalTable({ stateName }) {
  const [tableData, setTableData] = useState([]);

  const fetchCongressionalTableData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/CongressionalTable/${stateName}`
      );
  
      const districts = Object.entries(response.data)
        .filter(([key]) => key.startsWith('district'))
        .map(([_, value]) => value)
        .sort((a, b) => a.DISTRICTNUM - b.DISTRICTNUM);
  
      setTableData(districts);
    } catch (error) {
      console.error('Error fetching state data:', error);
    }
  };

  useEffect(() => {
    fetchCongressionalTableData();
  }, [stateName]);

  return (
    <div className="congressional-table-container">
      <h2>State Congressional Representation</h2>
      <table className="congressional-table">
        <thead>
          <tr>
            <th>District</th>
            <th>Representative</th>
            <th>Party</th>
            <th>Racial/Ethnic Group</th>
            <th>Avg. Household Income</th>
            <th>% Below Poverty</th>
            <th>% Rural</th>
            <th>% Urban</th>
            <th>% Suburban</th>
            <th>Vote Margin (D)(%)</th>
            <th>Vote Margin (R)(%)</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((district, index) => (
            <tr key={index}>
              <td>{district.DISTRICTNUM}</td>
              <td>{district.Representative}</td>
              <td>{district.winning_party}</td>
              <td>{district.Representative_race}</td>
              <td>${district.AVG_INC.toLocaleString()}</td>
              <td>{district.Poverty}%</td>
              <td>{district.rural_precincts}%</td>
              <td>{district.urban_precincts}%</td>
              <td>{district.suburban_precincts}%</td>
              <td>{district.democratic_votes}%</td>
              <td>{district.republican_votes}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


