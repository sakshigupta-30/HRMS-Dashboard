import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FaTachometerAlt, FaUserTie, FaChartBar, FaCog, FaUserPlus } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">HRMS</h2>
      <nav className="nav-links">
        <NavLink to="/" className="nav-link">
          <FaTachometerAlt /> Dashboard
        </NavLink>
        <NavLink to="/placements" className="nav-link">
          <FaUserTie /> Placements
        </NavLink>
        <NavLink to="/reports" className="nav-link">
          <FaChartBar /> Reports
        </NavLink>
        <NavLink to="/add-candidate" className="nav-link">
          <FaUserPlus /> Add Candidate
        </NavLink>
        <NavLink to="/settings" className="nav-link">
          <FaCog /> Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
