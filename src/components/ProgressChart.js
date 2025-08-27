import React, { useContext, useState, useEffect } from 'react';
import { LearningContext } from '../context/LearningContext';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressChart = () => {
  const { topics, getTopicProgress } = useContext(LearningContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const studiedData = topics.map(topic => {
    const progress = getTopicProgress(topic.id);
    const isComplete = topic.goalHours > 0 && progress.totalHours >= topic.goalHours;
    const isDeadlinePassed = topic.targetDate && new Date(topic.targetDate) < new Date();

    return {
      hours: parseFloat(progress.totalHours),
      status: isComplete ? 'complete' : isDeadlinePassed ? 'deadline' : 'normal'
    };
  });

  const chartData = {
    labels: topics.map(topic => topic.name),
    datasets: [
      {
        label: 'Hours Studied',
        data: studiedData.map(d => d.hours),
        backgroundColor: studiedData.map(d =>
          d.status === 'complete'
            ? 'rgba(16, 185, 129, 0.8)' 
            : d.status === 'deadline'
            ? 'rgba(239, 68, 68, 0.8)' 
            : 'rgba(79, 70, 229, 0.7)' 
        ),
        borderColor: studiedData.map(d =>
          d.status === 'complete'
            ? 'rgba(5, 150, 105, 1)'
            : d.status === 'deadline'
            ? 'rgba(220, 38, 38, 1)'
            : 'rgba(79, 70, 229, 1)'
        ),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: isMobile ? 0.6 : 0.8,
        categoryPercentage: 0.7,
      },
      {
        label: 'Goal Hours',
        data: topics.map(topic => topic.goalHours || 0),
        backgroundColor: 'rgba(209, 213, 219, 0.7)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: isMobile ? 0.6 : 0.8,
        categoryPercentage: 0.7,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'top',
        labels: {
          boxWidth: 12,
          padding: isMobile ? 10 : 15,
          font: {
            size: isMobile ? 12 : 14
          }
        }
      },
      title: {
        display: true,
        text: 'Study Progress by Topic',
        font: {
          size: isMobile ? 16 : 18
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const status = studiedData[context.dataIndex].status;
            if (status === 'deadline') {
              return `Deadline Passed - ${context.raw} hours`;
            } else if (status === 'complete') {
              return `Completed - ${context.raw} hours`;
            } else {
              return `${context.dataset.label}: ${context.raw} hours`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Hours',
          font: {
            size: isMobile ? 12 : 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: isMobile ? 11 : 12
          },
          precision: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Topics',
          font: {
            size: isMobile ? 12 : 14,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            size: isMobile ? 11 : 12
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart'
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Study Progress</h2>
        <div className="text-sm text-gray-500">
          {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'}
        </div>
      </div>
      
      <div className="relative" style={{ height: isMobile ? '350px' : '450px' }}>
        <Bar data={chartData} options={options} />
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Track your progress toward your study goals
      </div>
    </div>
  );
};

export default ProgressChart;
