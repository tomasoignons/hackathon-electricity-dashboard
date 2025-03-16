import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { subHours, addHours, format } from 'date-fns';

const EolienneChart = () => {
  const pastData =  [180, 174, 162, 151, 155, 136, 120, 146, 170, 192, 210, 220, 234, null, null, null, null, null]
  const forecastData = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 220, 201, 174, 176]
  const warningData = [null, null, null, null, null, null, null, null, null, null, null, null, 234, 280, 252, 220, null, null, null]

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    const fetchData = async () => {
      const now = new Date();
      const labels = [];
      

      // Last data point of past data to connect lines
      const connectionPoint = pastData[pastData.length - 1];
      for (let i = 0; i <= 12; i++) {
        labels.push(format(subHours(now, 12 - i), 'HH:mm'));
      }
            
      for (let i = 0; i < 6; i++) {
        const forecastTime = format(addHours(now, i), 'HH:mm');
        labels.push(forecastTime);
        // Add null to past data for forecast timestamps
      }
      
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        id : 2,
        data: {
          labels,
          datasets: [
            {
              label: 'Past',
              data: pastData,
              borderColor: 'rgba(75, 192, 102, 1)',
              backgroundColor: 'rgba(75, 192, 102, 0.2)',
              fill: true,
              tension : 0.3,
              spanGaps: true
            },
            {
              label: 'Too much production',
              data: warningData,
              borderColor: 'rgba(255, 50, 50, 1)',
              backgroundColor: 'rgba(255, 50, 50, 0.2)',
              fill: true,
              tension : 0.3,
              borderDash: [5, 5], // Creates a dashed line
              spanGaps: true
            },
            {
              label: 'Forecast',
              data: forecastData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
              tension : 0.3,
              borderDash: [5, 5], // Creates a dashed line
              spanGaps: true
            }
          ]
        },
        options: {
          plugins: {
            title: {
              display: true,
              text: 'Wind Energy Production (Gigawatts)',
              font: {
                size: 18
              },
              padding: {
                top: 10,
                bottom: 30
              }
            },
            legend: {
              labels: {
                usePointStyle: true,
                pointStyle: 'line',
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Time'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Gigawatts'
              },
              min: 0,
              max: 300
            }
          }
        }
      });
    };
    
    fetchData()
      .then(() => {
        return () => {
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
          }
        };
      });
  }, []);

  return <canvas ref={chartRef}></canvas>;
};

export default EolienneChart;