import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import './UpcomingInterviews.css';

const data = [
  { name: 'Permanent', value: 40 },
  { name: 'Contract', value: 30 },
  { name: 'Temporary', value: 30 },
];

const COLORS = ['#2563EB', '#60A5FA', '#93C5FD'];

const UpcomingInterviews = () => {
  return (
    <div className="interview-container">
      <h2 className="heading">Upcoming Interviews</h2>

      <div className="chart-table-wrapper">
        {/* Chart */}
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>July 4, 2024</td>
                <td><span className="badge pending">Pending</span></td>
              </tr>
              <tr>
                <td>July 6, 2024</td>
                <td><span className="badge confirmed">Confirmed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UpcomingInterviews;
