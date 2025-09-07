'use client';

import dynamic from 'next/dynamic';

// Dynamically import Chart components with client-side only rendering
const DoughnutChart = dynamic(() => import('./DoughnutChart'), { ssr: false });
const LineChart = dynamic(() => import('./LineChart'), { ssr: false });

interface DoughnutChartData {
  labels: string[];
  counts: number[];
}

interface LineChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }>;
}

interface ChartContainerProps {
  data: DoughnutChartData | LineChartData;
  type: 'doughnut' | 'line';
}

export default function ChartContainer({ data, type }: ChartContainerProps) {
  if (type === 'line' && 'datasets' in data) {
    return <LineChart data={data} />;
  }
  
  if (type === 'doughnut' && 'counts' in data) {
    return <DoughnutChart data={data} />;
  }
  
  return <div>Invalid chart data or type</div>;
}