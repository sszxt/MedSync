import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdherenceBarChart = ({ history }) => {
  // Prepare data for the bar chart
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const takenCounts = Array(7).fill(0);
  const missedCounts = Array(7).fill(0);

  history.forEach(entry => {
    const dayIndex = new Date(entry.takenAt).getDay();
    if (entry.status === 'taken') {
      takenCounts[dayIndex]++;
    } else if (entry.status === 'missed') {
      missedCounts[dayIndex]++;
    }
  });

  const data = {
    labels: daysOfWeek,
    datasets: [
      {
        label: 'Taken',
        data: takenCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Missed',
        data: missedCounts,
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Adherence',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default AdherenceBarChart;
