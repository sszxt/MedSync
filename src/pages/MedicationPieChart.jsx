import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MedicationPieChart = ({ medications }) => {
  // Prepare data for the pie chart
  const labels = medications.map(med => med.name);
  const dataValues = medications.map(med => med.stock);

  const data = {
    labels,
    datasets: [
      {
        label: 'Medication Stock',
        data: dataValues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          // Add more colors if needed
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Medication Distribution',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default MedicationPieChart;
