import React from 'react';
import { Link } from 'react-router-dom';

const DashboardCard = ({ title, value, bgColor, textColor }) => {
  // All static styles from the CSS file are now combined into Tailwind classes.
  const cardClasses = "rounded-lg p-4 flex-1 min-w-[150px] flex flex-col justify-between shadow-md transition-transform duration-200 hover:scale-[1.02]";

  // The style object is now only for dynamic colors passed as props.
  const dynamicStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  const content = (
    <>
      <p className="text-base font-medium">{title}</p>
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