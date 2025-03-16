import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { subHours, addHours, format, set } from 'date-fns';

const ElectricityChart = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);


  const [labels, setLabels] = useState([]);
  const [pastData, setPastData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(11);
  const [queryData, setQueryData] = useState({
    "instances": [
        {
            "start": "2023-01-01 00:00:00",
            "target" : [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 0, 0, 0, 0, 0, 0, 20, 34, 65, 60, 63, 63, 64, 68,
              50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 53, 58, 56, 60, 65, 60, 63, 63, 64, 
              50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 53, 58, 56, 60, 65, 60, 63, 63, 64, 
              50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 53, 58, 56, 60, 65, 60, 63, 63, 64, 
            ]
        }
    ]
  })

  const refreshData = async () => {
    // Create a new target array preserving zeros
    const originalTarget = queryData.instances[0].target;
    const newTarget = originalTarget.map(value => {
      if (value === 0) {
        return 0; // Preserve zeros
      } else {
        // Generate random value between 40 and 70
        return Math.floor(Math.random() * 30) + 40;
      }
    });

    const newQueryData = {
      instances: [
        {
          start: queryData.instances[0].start,
          target: newTarget
        }
      ]
    };

    setQueryData(newQueryData);
        // Force re-render by updating the key
    setRefreshKey(prevKey => prevKey + 1);
  };
    

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    console.log("updating...")
    const fetchData = async () => {
      const now = new Date();

      const labels_local = [];
      const pastData_local = [];
      const forecastData_local = [];
      
      // Generate all 18 labels first (12 past + 6 forecast)
      for (let i = 0; i <= 12; i++) {
        labels_local.push(format(subHours(now, 12 - i), 'HH:mm'));
        pastData_local.push(queryData.instances[0].target[i + 12]);
        forecastData_local.push(null); // Fill with nulls for past timestamps
      }

      
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(queryData)
      });
      
      const json = await res.json();
      console.log(json);
      
      // Last data point of past data to connect lines
      const connectionPoint = pastData_local[pastData_local.length - 1];
      console.log(connectionPoint)

      
      for (let i = 0; i < 6; i++) {
        const forecastTime = format(addHours(now, i), 'HH:mm');
        labels_local.push(forecastTime);
        
        // Add null to past data for forecast timestamps
        pastData_local.push(null);
        
        // For the first forecast point, duplicate the last past point to create a continuous line
        if (i === 0) {
          forecastData_local[forecastData_local.length - 1] = connectionPoint;
        }
        
        // Add forecast data
        forecastData_local.push(json.forecast.predictions[0].mean[i]);
      }
      
      setLabels(labels_local);
      setPastData(pastData_local);
      setForecastData(forecastData_local);

      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
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
              text: 'Solar Energy Production (Gigawatts)',
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
              max: 80
            }
          }
        }
      });
    };

    
    fetchData()
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [refreshKey]);

  console.log(pastData)
  console.log(forecastData)

  return (
    <div className="w-full h-full relative">
    <canvas ref={chartRef} className="w-full h-full" id='120'></canvas>
    <button 
      onClick={refreshData}
      className="absolute top-2 right-2 bg-green-700 hover:bg-green-900 text-white font-bold py-1 px-2 rounded text-sm"
    >
      ↻
    </button>
  </div>
  )
};

export default ElectricityChart;