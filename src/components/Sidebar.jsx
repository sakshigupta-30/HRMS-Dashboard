// src/components/Sidebar.jsx

import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Sidebar.css';
import {
  FaTachometerAlt,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaUserPlus,
  FaSignOutAlt,
} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const confirmLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <>
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

        {/* Logout Button at Bottom */}
        <div className="logout-link" onClick={() => setShowModal(true)}>
          <FaSignOutAlt /> Logout
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="confirm">Yes</button>
              <button onClick={() => setShowModal(false)} className="cancel">No</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
