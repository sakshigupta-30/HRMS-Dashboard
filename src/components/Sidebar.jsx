import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUserTie,
  FaChartBar,
  FaCog,
  FaUserPlus,
  FaSignOutAlt,
  FaFileAlt,
  FaListAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { logout } = useAuth();

  const confirmLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkBaseClasses =
    "flex items-center gap-2 p-[10px] rounded-md text-base text-slate-50 transition-colors duration-300";
  const navLinkActiveClasses = "bg-white/10 font-bold";

  return (
    <>
      <div className="w-[250px] h-screen bg-slate-800 text-slate-50 py-5 px-4 flex flex-col gap-6 sticky top-0 overflow-y-auto">
        <h2 className="text-xl font-bold">HRMS</h2>

        <nav className="flex flex-col gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaTachometerAlt /> Dashboard
          </NavLink>
          <NavLink
            to="/placements"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaUserTie /> Placements
          </NavLink>
          <NavLink
            to="/reports"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaChartBar /> Reports
          </NavLink>
          <NavLink
            to="/add-candidate"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaUserPlus /> Add Candidate
          </NavLink>
          <NavLink
            to="/employees"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaUserTie /> Employees
          </NavLink>
          <NavLink
            to="/salary-slips"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaListAlt /> Salary Slips
          </NavLink>
          <NavLink
            to="/offer-letter"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaFileAlt /> Offer Letter
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${navLinkBaseClasses} ${
                isActive ? navLinkActiveClasses : "hover:text-blue-500"
              }`
            }
          >
            <FaCog /> Settings
          </NavLink>
        </nav>

        <div
          className="mt-auto flex items-center gap-2 p-[10px] text-slate-50 cursor-pointer text-base rounded-md transition-colors duration-300 hover:bg-white/10 hover:text-blue-500"
          onClick={() => setShowModal(true)}
        >
          <FaSignOutAlt /> Logout
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-800/60 flex items-center justify-center z-50">
          <div className="bg-white text-slate-800 p-8 rounded-lg w-[300px] text-center shadow-lg">
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-between mt-6">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white border-none px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 transition-colors"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-slate-100 text-slate-800 border-none px-4 py-2 rounded-md cursor-pointer hover:bg-slate-200 transition-colors"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
