import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TrendChart = ({ timeRange, metric, type = 'line' }) => {
  // Mock data based on range
  const labels = timeRange === '24h' 
    ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'] 
    : ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const lineData = {
    labels,
    datasets: [
      {
        label: 'Signalements',
        data: [12, 19, 3, 5, 2, 3, 20],
        borderColor: '#1F77D2',
        backgroundColor: 'rgba(31, 119, 210, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: ['Total', 'Partiel', 'Minimal'],
    datasets: [
      {
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(244, 196, 48, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type === 'pie',
        labels: { color: '#94a3b8', font: { weight: 'bold', size: 10 } }
      },
      tooltip: {
        backgroundColor: '#0A0F2A',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: type !== 'pie' ? {
      x: { grid: { display: false }, ticks: { color: '#64748b' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }
    } : {}
  };

  return (
    <div className="h-64 w-full">
      {type === 'line' && <Line data={lineData} options={options} />}
      {type === 'bar' && <Bar data={lineData} options={options} />}
      {type === 'pie' && <Pie data={pieData} options={options} />}
    </div>
  );
};

export default TrendChart;
