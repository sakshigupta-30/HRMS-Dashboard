import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { name: 'Permanent', value: 40 },
  { name: 'Contract', value: 30 },
  { name: 'Temporary', value: 30 },
];

const COLORS = ['#2563EB', '#60A5FA', '#93C5FD'];

const UpcomingInterviews = () => {
  return (
    <div>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Upcoming Interviews</h2>

      {/* Pie Chart */}
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
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

      {/* Table below chart */}
      <div style={{ marginTop: '1rem' }}>
        <table style={{ width: '100%', fontSize: '0.9rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Date</th>
              <th style={{ textAlign: 'left' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>July 4, 2024</td>
              <td><span style={{ backgroundColor: '#FACC15', padding: '0.25rem 0.5rem', borderRadius: '5px' }}>Pending</span></td>
            </tr>
            <tr>
              <td>July 6, 2024</td>
              <td><span style={{ backgroundColor: '#10B981', padding: '0.25rem 0.5rem', borderRadius: '5px', color: '#fff' }}>Confirmed</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingInterviews;
