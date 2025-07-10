import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardCard.css';

const DashboardCard = ({ title, value, bgColor, textColor }) => {
  const cardStyles = {
    backgroundColor: bgColor,
    color: textColor,
    textDecoration: 'none',
    display: 'block',
    borderRadius: '8px',
    padding: '1rem',
  };

  const content = (
    <>
      <p className="card-title">{title}</p>
      {value && <h2 className="card-value">{value}</h2>}
    </>
  );

  return title === "Payroll & Expenses" ? (
    <Link to="/payroll" className="dashboard-card" style={cardStyles}>
      {content}
    </Link>
  ) : (
    <div className="dashboard-card" style={cardStyles}>
      {content}
    </div>
  );
};

export default DashboardCard;
