import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';

const getRandomValue = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

export default function BoxWhiskerPlot() {
  const data = useMemo(() => {
    return Array.from({ length: 20 }, (v, i) => {
      const districtIndex = i + 1;


      const minValue = (districtIndex * 0.02) + parseFloat(getRandomValue(0, 0.05));
      const median = minValue + parseFloat(getRandomValue(0.15, 0.2));
      const maxValue = minValue + parseFloat(getRandomValue(0.2, 0.25));

      return {
        type: 'box',
        y: [minValue, median, maxValue],
        name: `District ${districtIndex}`,
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: -1.8,
        marker: {
          color: ['red', 'yellow', 'blue'],
          size: 5,
        },
        boxmean: false,
        line: {
          color: 'black',
        },
        fillcolor: 'white',
      };
    });
  }, []);

  const layout = {
    title: 'Minority Population % by District',
    xaxis: {
      title: 'Indexed Districts',
      tickmode: 'linear',
      titlefont: { size: 14 },
      tickfont: { size: 10 },
    },
    yaxis: {
      title: 'Minority Population %',
      range: [0, 0.7],
      tickvals: [0, 0.2, 0.4, 0.6, 0.7],
      ticktext: ['0%', '20%', '40%', '60%', '70%'],
      titlefont: { size: 14 },
      tickfont: { size: 10 },
    },
    showlegend: false,
    margin: {
      l: 50,
      r: 50, 
      t: 50,
      b: 50,
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Plot
        data={data}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
