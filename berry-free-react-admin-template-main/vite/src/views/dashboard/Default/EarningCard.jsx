import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const SimpleChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    // Replace the URL with your API endpoint
    fetch('http://localhost:5001/chart-data')
      .then((response) => response.json())
      .then((data) => {
        setChartData(data);
      })
      .catch((error) => console.error('Error fetching chart data:', error));
  }, []);

  if (!chartData) {
    return <div>Loading chart data...</div>;
  }

  // Configure chart options using the fetched categories
  const options = {
    chart: {
      id: 'simple-chart'
    },
    xaxis: {
      categories: chartData.categories
    }
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default SimpleChart;
