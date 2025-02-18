import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

// third party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import chartData from './chart-data/bajaj-area-chart';
import { useEffect, useState } from 'react';

// ===========================|| DASHBOARD DEFAULT - BAJAJ AREA CHART CARD ||=========================== //

export default function BajajAreaChartCard() {
  const theme = useTheme();
  const [highestStock, setHighestStock] = useState(null);
  const orangeDark = theme.palette.secondary[800];

  useEffect(() => {

    fetch('http://localhost:5001/stocks')
      .then((res) => res.json())
      .then((stocks) => {
      
        const maxStock = stocks.reduce((max, stock) => (stock.price > max.price ? stock : max), stocks[0]);
        setHighestStock(maxStock);
      })
      .catch((error) => console.error('Error fetching stock data:', error));
  }, []);

  React.useEffect(() => {
    const newSupportChart = {
      ...chartData.options,
      colors: [orangeDark],
      tooltip: { theme: 'light' }
    };
    ApexCharts.exec(`support-chart`, 'updateOptions', newSupportChart);
  }, [orangeDark]);

  return (
    <Card sx={{ bgcolor: 'secondary.light' }}>
      <Grid container sx={{ p: 2, pb: 0, color: '#fff' }}>
        <Grid size={12}>
          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <Grid>
              <Typography variant="subtitle1" sx={{ color: 'secondary.dark' }}>
              {highestStock ? highestStock.name : 'Loading...'}
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h4" sx={{ color: 'grey.800' }}>
              {highestStock ? highestStock.name : 'Loading...'}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ color: 'grey.800' }}>
          {highestStock && highestStock.change >= 0
              ? `${highestStock.change}% Profit`
              : highestStock && `${Math.abs(highestStock.change)}% Loss`}
          </Typography>
        </Grid>
      </Grid>
      <Chart {...chartData} />
    </Card>
  );
}
