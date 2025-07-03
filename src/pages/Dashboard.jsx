import React from 'react';
import DashboardCard from '../components/DashboardCard';
import CandidateList from '../components/CandidateList';
import UpcomingInterviews from '../components/UpcomingInterviews';
import ProfileCard from '../components/ProfileCard';

const Dashboard = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        gap: '0.8rem',
        overflow: 'hidden',
        boxSizing: 'border-box',
          padding: '1rem',
      }}
    >
      {/* Top Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.8rem',
          flexShrink: 0,
        }}
      >
        <DashboardCard title="Total Candidates" value="0" bgColor="#F97316" textColor="#ffffff" />
        <DashboardCard title="Placement Today" value="0" bgColor="#FACC15" textColor="#1E293B" />
        <DashboardCard title="Salary Slip" bgColor="#3B82F6" textColor="#ffffff" />
        <DashboardCard title="Workforce Management" bgColor="#06B6D4" textColor="#ffffff" />
        <DashboardCard title="Payroll & Expenses" bgColor="#F59E0B" textColor="#1E293B" />
        <DashboardCard title="Talent Acquisition" bgColor="#EF4444" textColor="#ffffff" />
      </div>

      {/* Bottom Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1.5fr 1.2fr',
          gap: '0.8rem',
          flexGrow: 1,
          overflow: 'hidden',
        }}
      >
        {/* Candidate List */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ overflowY: 'auto' }}>
            <CandidateList />
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ overflowY: 'auto' }}>
            <UpcomingInterviews />
          </div>
        </div>

        {/* Profile Card */}
        <div
          style={{
            background: '#10B981',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <ProfileCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
