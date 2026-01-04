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
  { bg: '#EFF6FF', border: '#3B82F6' }, // Blue
  { bg: '#F0FDF4', border: '#10B981' }, // Green
  { bg: '#FEF3C7', border: '#F59E0B' }, // Amber
  { bg: '#FCE7F3', border: '#EC4899' }, // Pink
  { bg: '#F0F9FF', border: '#0EA5E9' }, // Sky Blue
  { bg: '#F5F3FF', border: '#8B5CF6' }, // Violet
  { bg: '#FFF7ED', border: '#F97316' }, // Orange
  { bg: '#F1F5F9', border: '#64748B' }  // Slate Gray
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