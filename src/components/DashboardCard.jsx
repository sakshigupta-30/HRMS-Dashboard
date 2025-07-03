import React from 'react';
import './DashboardCard.css';

const DashboardCard = ({ title, value, bgColor, textColor }) => {
  return (
    <div className="dashboard-card" style={{ backgroundColor: bgColor, color: textColor }}>
      <p className="card-title">{title}</p>
      {value && <h2 className="card-value">{value}</h2>}
    </div>
  );
};

export default DashboardCard;

