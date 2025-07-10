import React from 'react';
import './Payroll.css'; // Optional: for custom styling

const Payroll = () => {
  return (
    <div className="payroll-dashboard">
      <h2>HR & Payroll Dashboard</h2>
      <div className="dashboard-grid">

        {/* Payslip Details */}
        <div className="card">
          <h3>🧾 Payslip Details</h3>
          <p><strong>John Doe</strong></p>
          <p>EMP001</p>
          <p>Apr 2023</p>
          <p>Net Pay: <strong>₹50,000</strong></p>
        </div>

        {/* Salary Components */}
        <div className="card">
          <h3>💰 Salary Components</h3>
          <table>
            <thead>
              <tr><th>Component</th><th>Amount</th></tr>
            </thead>
            <tbody>
              <tr><td>Basic</td><td>₹30,000</td></tr>
              <tr><td>HRA</td><td>₹15,000</td></tr>
              <tr><td>Conveyance</td><td>₹2,000</td></tr>
              <tr><td>Professional Tax</td><td>₹1,000</td></tr>
            </tbody>
          </table>
        </div>

        {/* Payroll Summary */}
        <div className="card">
          <h3>📊 Payroll Summary</h3>
          <table>
            <thead>
              <tr><th>Month</th><th>Total Employees</th><th>Total Pay</th></tr>
            </thead>
            <tbody>
              <tr><td>Apr 2023</td><td>25</td><td>₹12,50,000</td></tr>
              <tr><td>Mar 2023</td><td>25</td><td>₹12,40,000</td></tr>
              <tr><td>Feb 2023</td><td>25</td><td>₹12,45,000</td></tr>
            </tbody>
          </table>
        </div>

        {/* Compliance Filing */}
        <div className="card">
          <h3>📂 Compliance Filing</h3>
          <ul>
            <li>Provident Fund (PF) - <span className="status filed">Filed</span></li>
            <li>ESI - <span className="status filed">Filed</span></li>
            <li>Professional Tax - <span className="status pending">Pending</span></li>
            <li>Labour Welfare Fund - <span className="status pending">Pending</span></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Payroll;
