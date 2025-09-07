'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define the props interface
interface DoughnutChartProps {
  data: {
    labels: string[];
    counts: number[];
  };
}

// Predefined minimalist color palette
const colorPalette = [
  { bg: '#E8EAF6', border: '#3F51B5' }, // Indigo
  { bg: '#FCE4EC', border: '#E91E63' }, // Pink
  { bg: '#F1F8E9', border: '#8BC34A' }, // Light Green
  { bg: '#FFF3E0', border: '#FF5722' }, // Deep Orange
  { bg: '#E1F5FE', border: '#03A9F4' }, // Light Blue
  { bg: '#F3E5F5', border: '#673AB7' }, // Deep Purple
  { bg: '#FFFDE7', border: '#FFEB3B' }, // Yellow
  { bg: '#EFEBE9', border: '#795548' }  // Brown
];

const generateColors = (count: number) => {
  const colors = [];
  const backgroundColors = [];

  for (let i = 0; i < count; i++) {
    const colorIndex = i % colorPalette.length;
    colors.push(colorPalette[colorIndex].border);
    backgroundColors.push(colorPalette[colorIndex].bg);
  }

  return { colors, backgroundColors };
};

const DoughnutChart = ({ data }: DoughnutChartProps) => {
  const { labels, counts } = data;
  const { colors, backgroundColors } = generateColors(labels.length);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'အရေအတွက်',
        data: counts,
        backgroundColor: backgroundColors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return <Doughnut data={chartData} options={options} />;
};

export default DoughnutChart;