import { IActivityLog } from '@/models/ActivityLog';
import { useEffect, useState } from 'react';
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Bar, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadarController,
  Title,
  Tooltip,
  Legend
);

import 'chart.js/auto';
import 'chartjs-plugin-annotation';

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string | string[];
      borderColor?: string;
      borderWidth?: number;
    }[];
  };
  options: {
    plugins?: {
      legend?: {
        display?: boolean;
      };
    };
    scales?: {
      r?: {
        suggestedMin?: number;
        suggestedMax?: number;
      };
      y?: {
        beginAtZero?: boolean;
      };
    };
  };
}

// Reusable BarChart component
function BarChart({ data, options }: ChartProps) {
  return <Bar data={data} options={options} />;
}

// Reusable RadarChart component
function RadarChart({ data, options }: ChartProps) {
  return <Radar data={data} options={options} />;
}

// Add these color constants at the top of the file
const ACTIVITY_COLORS = {
  physicalActivity: '#4CAF50', // Green
  reading: '#2196F3',         // Blue
  codingLearning: '#FFC107',  // Yellow
  writingTweeting: '#FF5722', // Orange
  protein: '#9C27B0'         // Purple
};

export default function Dashboard() {
  const [logs, setLogs] = useState<IActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const getPastDatesInYear = () => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const today = new Date();
    // Set today to the end of the day for accurate comparison
    today.setHours(23, 59, 59, 999);
    const dates = [];

    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates.reverse(); // Most recent dates first
  };

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/logs');
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(
            `HTTP error! status: ${response.status}${
              errorData ? `, message: ${errorData.message || JSON.stringify(errorData)}` : ''
            }`
          );
        }
        const data = await response.json();
        setLogs(data);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error('Error fetching logs:', {
          message: errorMessage,
          timestamp: new Date().toISOString(),
          error: error
        });
        
        setError(
          `Failed to load activity logs: ${errorMessage}. ${
            error instanceof Error && error.message.includes('HTTP error')
              ? 'The server returned an error.'
              : 'Please check your connection and try again.'
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const chartData = {
    labels: [
      'Physical Activity',
      'Reading',
      'Coding / Learning',
      'Writing / Tweeting',
      'Protein'
    ],
    datasets: [
      {
        label: 'Activity Frequency',
        data: [
          logs.filter((log) => log.physicalActivity).length,
          logs.filter((log) => log.reading).length,
          logs.filter((log) => log.codingLearning).length,
          logs.filter((log) => log.writingTweeting).length,
          logs.filter((log) => log.protein).length
        ],
        backgroundColor: [
          '#4CAF50',
          '#2196F3',
          '#FFC107',
          '#FF5722',
          '#9C27B0'
        ]
      }
    ]
  };

  const calculateCurrentStreak = (
    logs: IActivityLog[],
    activity?: keyof IActivityLog
  ) => {
    let streak = 0;
    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];
      if (activity) {
        if (log[activity]) streak++;
        else break;
      } else {
        const isComplete =
          log.physicalActivity &&
          log.reading &&
          log.codingLearning &&
          log.writingTweeting &&
          log.protein;
        if (isComplete) streak++;
        else break;
      }
    }
    return streak;
  };


  const getWeeks = () => {
    const year = new Date().getFullYear();
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    const days = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      days.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  };

  const formatDate = (date: Date) => {
    const adjustedDate = new Date(
      new Date(date).getTime() + new Date(date).getTimezoneOffset() * 60000
    );
    
    return adjustedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="border-b pb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your daily progress</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="col-span-2 md:col-span-3">
                <div className="bg-gray-50 p-6">
                  <h3 className="text-sm font-medium text-gray-600">
                    Current Streak
                  </h3>
                  <p className="text-4xl font-light mt-2 text-gray-900">
                    {calculateCurrentStreak(logs)} days
                  </p>
                </div>
              </div>

              {[
                { name: 'Physical Activity', key: 'physicalActivity' },
                { name: 'Reading', key: 'reading' },
                { name: 'Coding/Learning', key: 'codingLearning' },
                { name: 'Writing/Tweeting', key: 'writingTweeting' },
                { name: 'Protein', key: 'protein' },
                { name: 'Success Rate', key: 'success' }
              ].map((item) => (
                <div key={item.key} className="bg-gray-50 p-6">
                  <h3 className="text-sm font-medium text-gray-600">
                    {item.name}
                  </h3>
                  <p className="text-3xl font-light mt-2 text-gray-900">
                    {item.key === 'success'
                      ? `${(
                          (logs.filter(
                            (log) =>
                              log.physicalActivity &&
                              log.reading &&
                              log.codingLearning &&
                              log.writingTweeting &&
                              log.protein
                          ).length /
                            logs.length) *
                          100
                        ).toFixed(1)}%`
                      : `${calculateCurrentStreak(
                          logs,
                          item.key as keyof IActivityLog
                        )} days`}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="bg-white p-6">
                <h2 className="text-sm font-medium text-gray-600 mb-4">
                  Activity Distribution
                </h2>
                <BarChart
                  data={chartData}
                  options={{
                    plugins: {
                      legend: {
                        display: false
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>

              <div className="bg-white p-6">
                <h2 className="text-sm font-medium text-gray-600 mb-4">
                  Activity Balance
                </h2>
                <RadarChart
                  data={{
                    labels: [
                      'Physical',
                      'Reading',
                      'Coding',
                      'Writing',
                      'Protein'
                    ],
                    datasets: [
                      {
                        label: 'Completion Rate',
                        data: [
                          (logs.filter((log) => log.physicalActivity).length /
                            logs.length) *
                            100,
                          (logs.filter((log) => log.reading).length /
                            logs.length) *
                            100,
                          (logs.filter((log) => log.codingLearning).length /
                            logs.length) *
                            100,
                          (logs.filter((log) => log.writingTweeting).length /
                            logs.length) *
                            100,
                          (logs.filter((log) => log.protein).length /
                            logs.length) *
                            100
                        ],
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        borderColor: 'rgba(99, 102, 241, 0.8)',
                        borderWidth: 1
                      }
                    ]
                  }}
                  options={{
                    scales: {
                      r: {
                        suggestedMin: 0,
                        suggestedMax: 100
                      }
                    }
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6">
              <h2 className="text-sm font-medium text-gray-600 mb-6">
                Activity History
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                    All Activities
                  </h3>
                  <div className="flex gap-1 overflow-x-auto pb-2">
                    {getWeeks().map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((date) => {
                          const dayLog = logs.find(
                            (log) =>
                              new Date(log.date).toISOString().split('T')[0] ===
                              date
                          );
                          if (!dayLog) {
                            return (
                              <div
                                key={date}
                                className="w-3 h-3 border border-gray-200"
                                title={`No data for ${new Date(
                                  date
                                ).toLocaleDateString()}`}
                              />
                            );
                          }

                          const completionRate =
                            [
                              dayLog.physicalActivity,
                              dayLog.reading,
                              dayLog.codingLearning,
                              dayLog.writingTweeting,
                              dayLog.protein
                            ].filter(Boolean).length / 5;

                          return (
                            <div
                              key={date}
                              style={{
                                backgroundColor: `rgba(17, 24, 39, ${completionRate})`
                              }}
                              className="w-3 h-3 border border-gray-200"
                              title={`${(completionRate * 100).toFixed(
                                0
                              )}% completed on ${new Date(
                                date
                              ).toLocaleDateString()}`}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Individual Activity Views */}
                {[
                  { name: 'Physical Activity', key: 'physicalActivity' },
                  { name: 'Reading', key: 'reading' },
                  { name: 'Coding/Learning', key: 'codingLearning' },
                  { name: 'Writing/Tweeting', key: 'writingTweeting' },
                  { name: 'Protein', key: 'protein' }
                ].map((activity) => (
                  <div key={activity.key}>
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">
                      {activity.name}
                    </h3>
                    <div className="flex gap-1 overflow-x-auto pb-2">
                      {getWeeks().map((week, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-1">
                          {week.map((date) => {
                            const dayLog = logs.find(
                              (log) =>
                                new Date(log.date)
                                  .toISOString()
                                  .split('T')[0] === date
                            );
                            const completed =
                              dayLog?.[
                                activity.key as keyof IActivityLog
                              ] ?? false;

                            return (
                              <div
                                key={date}
                                className="w-3 h-3 border border-gray-200"
                                style={{
                                  backgroundColor: completed 
                                    ? ACTIVITY_COLORS[activity.key as keyof typeof ACTIVITY_COLORS] 
                                    : '#ffffff'
                                }}
                                title={`${activity.name}: ${
                                  completed ? 'Completed' : 'Not completed'
                                } on ${new Date(date).toLocaleDateString()}`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6">
              <h2 className="text-sm font-medium text-gray-600 mb-6">
                Activity Log Entries
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Physical
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reading
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Coding
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Writing
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Protein
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getPastDatesInYear().map((date) => {
                      const log = logs.find(
                        (l) => formatDate(new Date(l.date)) === formatDate(date)
                      );
                      
                      return (
                        <tr key={date.toString()}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log?.physicalActivity ? '✅' : '❌'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log?.reading ? '✅' : '❌'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log?.codingLearning ? '✅' : '❌'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log?.writingTweeting ? '✅' : '❌'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {log?.protein ? '✅' : '❌'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
