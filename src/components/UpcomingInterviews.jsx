import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

// Dummy data for the component
const chartData = [
  { name: 'Permanent', value: 40 },
  { name: 'Contract', value: 30 },
  { name: 'Temporary', value: 30 },
];
const COLORS = ['#2563EB', '#60A5FA', '#93C5FD']; // Blue shades

const interviewData = [
    { date: 'July 4, 2024', status: 'Pending' },
    { date: 'July 6, 2024', status: 'Confirmed' },
];

// Reusable object map for dynamic badge styles
const badgeStyles = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
};

const UpcomingInterviews = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming Interviews</h2>

      <div className="flex flex-wrap items-start justify-between gap-8">
        {/* Chart Wrapper */}
        <div className="flex-1 min-w-[220px]">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: '14px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Table Wrapper */}
        <div className="flex-1 min-w-[220px]">
          <table className="w-full border-separate border-spacing-y-1.5 text-sm">
            <thead>
              <tr>
                <th className="px-3 pb-2 text-left font-medium text-slate-500">Date</th>
                <th className="px-3 pb-2 text-left font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {interviewData.map((interview, index) => (
                <tr key={index}>
                  <td className="bg-gray-50 rounded-l-md py-2 px-3">{interview.date}</td>
                  <td className="bg-gray-50 rounded-r-md py-2 px-3">
                    <span 
                      className={`inline-block py-1 px-3 rounded-md text-xs font-medium ${badgeStyles[interview.status.toLowerCase()]}`}
                    >
                      {interview.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingInterviews;