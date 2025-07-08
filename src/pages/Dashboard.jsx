// src/pages/Dashboard.jsx

import React from 'react';
import DashboardCard from '../components/DashboardCard';
import CandidateList from '../components/CandidateList';
import UpcomingInterviews from '../components/UpcomingInterviews';
import ProfileCard from '../components/ProfileCard';
import { useCandidateContext } from '../context/CandidateContext';
import './Dashboard.css';

const Dashboard = () => {
  const { candidateCount } = useCandidateContext();
  return (
    <div className="dashboard-container">
      {/* Top Summary Cards */}
      <div className="dashboard-cards">
        <DashboardCard title="Total Candidates" value={candidateCount.toString()} bgColor="#F97316" textColor="#ffffff" />
        <DashboardCard title="Placement Today" value="0" bgColor="#FACC15" textColor="#1E293B" />
        <DashboardCard title="Salary Slip" bgColor="#3B82F6" textColor="#ffffff" />
        <DashboardCard title="Workforce Management" bgColor="#06B6D4" textColor="#ffffff" />
        <DashboardCard title="Payroll & Expenses" bgColor="#F59E0B" textColor="#1E293B" />
        <DashboardCard title="Talent Acquisition" bgColor="#EF4444" textColor="#ffffff" />
      </div>

      {/* Bottom Row */}
      <div className="dashboard-bottom">
        <div className="dashboard-box white">
          <div className="scroll-area">
            <CandidateList />
          </div>
        </div>

        <div className="dashboard-box white">
          <div className="scroll-area">
            <UpcomingInterviews />
          </div>
        </div>

        <div className="dashboard-box green">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
