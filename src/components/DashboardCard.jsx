import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, bgColor, textColor, onClick }) => {
  const cardClasses =
    "rounded-lg p-6 flex-1 min-w-[150px] flex flex-col justify-between shadow-md transition-transform duration-200 hover:scale-[1.02] min-h-[160px] cursor-pointer";

  const dynamicStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  const content = (
    <>
      <p className="text-lg font-medium">{title}</p>
      {value && <h2 className="text-3xl font-bold mt-2">{value}</h2>}
    </>
  );

  // Special case for cards that use <Link>
  if (title === "Payroll & Expenses") {
    return (
      <Link to="/payroll" className={cardClasses} style={dynamicStyles}>
        {content}
      </Link>
    );
  }

  // Default clickable card using onClick handler
  return (
    <div
      className={cardClasses}
      style={dynamicStyles}
      onClick={onClick}
    >
      {content}
    </div>
  );
};

export default DashboardCard;
