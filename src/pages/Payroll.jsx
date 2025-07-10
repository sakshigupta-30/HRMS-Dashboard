import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payroll.css'; // You'll create this CSS file next

const Payroll = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('https://hrms-backend-50gj.onrender.com/api/candidates', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div className="payroll-dashboard">
      <div className="card payslip">
        <h3>Payslip Details</h3>
        <p><strong>John Doe</strong></p>
        <p>EMP001</p>
        <p>Apr 2023</p>
        <p><strong>Net Pay</strong></p>
        <h2>₹ 50,000</h2>
      </div>

      <div className="card salary">
        <h3>Salary Components</h3>
        <table>
          <thead>
            <tr>
              <th>Component</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Basic</td><td>₹ 30,000</td></tr>
            <tr><td>HRA</td><td>₹ 15,000</td></tr>
            <tr><td>Conveyance Allowance</td><td>₹ 2,000</td></tr>
            <tr><td>Professional Tax</td><td>₹ 1,000</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card payroll-summary">
        <h3>Payroll Summary</h3>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Total Employees</th>
              <th>Total Payout</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Apr 2023</td><td>25</td><td>₹ 12,50,000</td></tr>
            <tr><td>Mar 2023</td><td>25</td><td>₹ 12,40,000</td></tr>
            <tr><td>Feb 2023</td><td>25</td><td>₹ 12,45,000</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card compliance">
        <h3>Compliance Filing</h3>
        <ul>
          <li>
            Provident Fund (PF) – Apr 2023 <span className="status filed">Filed</span>
          </li>
          <li>
            ESI <span className="status filed">Filed</span>
          </li>
          <li>
            Professional Tax (PT) – Apr 2023 <span className="status pending">Pending</span>
          </li>
          <li>
            Labour Welfare Fund (LWF) <span className="status pending">Pending</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Payroll;
