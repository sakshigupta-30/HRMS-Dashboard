import React from 'react';
import DashboardCard from '../components/DashboardCard';
import CandidateList from '../components/CandidateList';
import UpcomingInterviews from '../components/UpcomingInterviews';
import ProfileCard from '../components/ProfileCard';
import { useCandidateContext } from '../context/CandidateContext';

const Dashboard = () => {
  const { candidateCount } = useCandidateContext();
  
  // Base classes for the main content boxes for consistency
  const boxClasses = "rounded-xl p-4 shadow-md flex flex-col overflow-hidden";

  return (
    // Main container with full height and consistent spacing
    <div className="flex flex-col h-full gap-4 p-4">
      
      {/* Top Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 flex-shrink-0">
        <DashboardCard title="Total Candidates" value={candidateCount.toString()} bgColor="#F97316" textColor="#ffffff" />
        <DashboardCard title="Placement Today" value="0" bgColor="#FACC15" textColor="#1E293B" />
        <DashboardCard title="Salary Slip" bgColor="#3B82F6" textColor="#ffffff" />
        <DashboardCard title="Workforce Management" bgColor="#06B6D4" textColor="#ffffff" />
        <DashboardCard title="Payroll & Expenses" bgColor="#F59E0B" textColor="#1E293B" />
        <DashboardCard title="Talent Acquisition" bgColor="#EF4444" textColor="#ffffff" />
      </div>

      {/* Bottom Row - Proportional, Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.2fr] gap-4 flex-grow overflow-hidden max-h-[calc(100vh-180px)]">
        
        {/* Candidate List Box */}
        <div className={`${boxClasses} bg-white`}>
          <div className="overflow-y-auto">
            <CandidateList />
          </div>
        </div>

        {/* Upcoming Interviews Box */}
        <div className={`${boxClasses} bg-white`}>
          <div className="overflow-y-auto">
            <UpcomingInterviews />
          </div>
        </div>

        {/* Profile Card Box */}
        <div className={`${boxClasses} bg-emerald-500 text-white items-center justify-center`}>
          <ProfileCard />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;