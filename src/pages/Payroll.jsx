// src/pages/Payroll.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeePayrollCard from '../components/EmployeePayrollCard';

const Payroll = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/candidates', {
          withCredentials: true // If you're using cookies/auth tokens
        });
        const data = response.data;

        // Transform data into format expected by <EmployeePayrollCard />
        const transformed = data.map(candidate => ({
          name: `${candidate.personalDetails.firstName} ${candidate.personalDetails.lastName}`,
          empId: candidate._id.slice(-6).toUpperCase(), // create short id
          month: new Date(candidate.applicationDate).toLocaleString('default', { month: 'short', year: 'numeric' }),
          netPay: candidate.professionalDetails?.expectedSalary || 0,
          salaryComponents: [
            { component: 'Basic', amount: candidate.professionalDetails?.currentSalary || 0 },
            { component: 'HRA', amount: (candidate.professionalDetails?.currentSalary || 0) * 0.4 },
            { component: 'Conveyance Allowance', amount: 2000 },
            { component: 'Professional Tax', amount: 1000 },
          ],
          payrollSummary: [
            { month: 'Apr 2023', totalEmployees: 25, totalPay: '12,50,000' },
            { month: 'Mar 2023', totalEmployees: 25, totalPay: '12,40,000' },
            { month: 'Feb 2023', totalEmployees: 25, totalPay: '12,45,000' },
          ],
          compliance: [
            { type: 'Provident Fund (PF)', month: 'Apr 2023', status: 'Filed' },
            { type: 'ESI', month: 'Apr 2023', status: 'Filed' },
            { type: 'Professional Tax (PT)', month: 'Apr 2023', status: 'Pending' },
          ],
        }));

        setEmployees(transformed);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="payroll-page">
      <h2>Payroll & Expenses</h2>
      {employees.map((employee, index) => (
        <EmployeePayrollCard key={index} employee={employee} />
      ))}
    </div>
  );
};

export default Payroll;
