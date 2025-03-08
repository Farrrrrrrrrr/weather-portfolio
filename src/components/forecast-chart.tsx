"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastChartProps {
  forecastData: any;
}

export function ForecastChart({ forecastData }: ForecastChartProps) {
  // Process and prepare data for the chart
  const chartData = useMemo(() => {
    // Group forecast data by day
    const dailyData = forecastData.list.reduce((acc: any, item: any) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString();
      
      if (!acc[day]) {
        acc[day] = {
          temps: [],
          date: day,
          icon: item.weather[0].icon,
          description: item.weather[0].description
        };
      }
      
      acc[day].temps.push(item.main.temp);
      return acc;
    }, {});
    
    // Calculate daily averages
    const days = Object.values(dailyData).map((day: any) => {
      const tempSum = day.temps.reduce((sum: number, temp: number) => sum + temp, 0);
      const tempAvg = tempSum / day.temps.length;
      return {
        date: day.date,
        temp: Math.round(tempAvg),
        icon: day.icon,
        description: day.description
      };
    });
    
    // Only take the first 5 days
    const fiveDays = days.slice(0, 5);
    
    return {
      labels: fiveDays.map((day: any) => formatDate(day.date)),
      datasets: [
        {
          label: "Temperature (°C)",
          data: fiveDays.map((day: any) => day.temp),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.2)",
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [forecastData]);
  
  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        grid: {
          display: true,
          color: "rgba(200, 200, 200, 0.2)"
        },
        ticks: {
          callback: function(value) {
            return `${value}°C`;
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Temperature: ${context.parsed.y}°C`;
          }
        }
      }
    }
  };
  
  // Helper function to format date nicely
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  
  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  );
}
