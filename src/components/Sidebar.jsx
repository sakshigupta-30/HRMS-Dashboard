import React from 'react';
import './Sidebar.css';
import { FaTachometerAlt, FaUserTie, FaChartBar, FaCog } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">HRMS</h2>
      {/* <p className="agency-name"></p> */}
      <nav className="nav-links">
        <a href="#" className="nav-link">
          <FaTachometerAlt /> Dashboard
        </a>
        <a href="#" className="nav-link">
          <FaUserTie /> Placements
        </a>
        <a href="#" className="nav-link">
          <FaChartBar /> Reports
        </a>
        <a href="#" className="nav-link">
          <FaCog /> Settings
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
