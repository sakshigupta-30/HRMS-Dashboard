import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, bgColor, textColor }) => {
  // Changes are in this line: p-6 and min-h-[120px] are added/changed
  const cardClasses = "rounded-lg p-6 flex-1 min-w-[150px] flex flex-col justify-between shadow-md transition-transform duration-200 hover:scale-[1.02] min-h-[120px]";

  const dynamicStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  const content = (
    <>
      {/* Change is in this line: text-lg */}
      <p className="text-lg font-medium">{title}</p>
      {value && <h2 className="text-3xl font-bold mt-2">{value}</h2>}
    </>
  );

  return title === "Payroll & Expenses" ? (
    <Link to="/payroll" className={cardClasses} style={dynamicStyles}>
      {content}
    </Link>
  ) : (
    <div className={cardClasses} style={dynamicStyles}>
      {content}
    </div>
  );
};

export default DashboardCard;