import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import Chart from 'react-apexcharts'; 

const DynamicChart = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    series: []
  });

  // Fetch data from API
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:5001/chart-data');
        const data = response.data;
        
        console.log('Fetched chart data:', data);  // Check the data format
        
        setChartData({
          categories: data.categories || [], // Default to empty array if missing
          series: data.series || []          // Default to empty array if missing
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };
  
    fetchChartData();
  }, []);// Empty dependency array ensures this runs only once when the component mounts

  const chartOptions = {
   
      chart: {
        id: 'bar-chart',
        stacked: true,
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%'
        },
      },
      xaxis: {
        type: 'category',
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      legend: {
        show: true,
        fontFamily: `'Roboto', sans-serif`,
        position: 'bottom',
        offsetX: 20,
        labels: {
          useSeriesColors: false
        },
        markers: {
          width: 16,
          height: 16,
          radius: 5
        },
        itemMargin: {
          horizontal: 15,
          vertical: 8
        }
      },
      fill: {
        type: 'solid'
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        show: true
      },
  
};
return (
  <div>
    <Chart options={chartOptions} series={chartData.series} type="bar" height={480} />
  </div>
);
};

export default DynamicChart;
