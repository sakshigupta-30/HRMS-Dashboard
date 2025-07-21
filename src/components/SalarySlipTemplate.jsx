// src/components/SalarySlipTemplate.jsx
import React, { forwardRef } from 'react';
import './SalarySlipTemplate.css';

const SalarySlipTemplate = forwardRef(({ employee }, ref) => {
    console.log("Employee object for PDF:", employee);
  // Fallback helper
  const formatAmount = (value) => isNaN(value) ? '0' : `₹${Math.round(value)}`;

  return (
    <div ref={ref} className="salary-slip-template">
      <h2>Payslip for the Month <span>March 2024</span></h2>
      <hr />
      <div className="employee-summary">
        <div>
          <p><strong>Employee Name:</strong> {employee.Name}</p>
          <p><strong>Designation:</strong> {employee.Designation}</p>
          <p><strong>Employee Code:</strong> {employee["Employee Code"]}</p>
          <p><strong>Pay Date:</strong> 31/03/2024</p>
        </div>
        <div>
          <p><strong>Net Pay:</strong> ₹{employee["Net Pay"] ?? 0}</p>
          <p><strong>Paid Days:</strong> {employee["Total Paid Days"] ?? 0}</p>
          <p><strong>Grand Total:</strong> ₹{employee["Grand Total"] ?? 0}</p>
        </div>
      </div>

      <table className="salary-table">
        <thead>
          <tr>
            <th>EARNINGS</th><th>AMOUNT</th><th>DEDUCTIONS</th><th>AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic</td>
            <td>{formatAmount(employee["Earned Basic"])}</td>
            <td>PF (12%)</td>
            <td>{formatAmount(employee["Emp PF"])}</td>
          </tr>
          <tr>
            <td>HRA</td>
            <td>{formatAmount(employee["Earned HRA"])}</td>
            <td>ESI (0.75%)</td>
            <td>{formatAmount(employee["Emp ESI"])}</td>
          </tr>
          <tr>
            <td>OT</td>
            <td>{formatAmount(employee["Earn OT"])}</td>
            <td>LWF</td>
            <td>{formatAmount(employee["LWF"])}</td>
          </tr>
          <tr>
            <td colSpan="2"><strong>Total Earnings: ₹{employee["Earned Gross Pay"] ?? 0}</strong></td>
            <td colSpan="2"><strong>Total Deductions: ₹{employee["Total Deductions"] ?? 0}</strong></td>
          </tr>
        </tbody>
      </table>

      <div className="net-pay-summary">
        <p><strong>Net Pay:</strong> ₹{employee["Net Pay"] ?? 0}</p>
        <p><strong>Take Home Pay:</strong> ₹{employee["Take Home Pay"] ?? 0}</p>
        <p><strong>Grand Total (CTC):</strong> ₹{employee["Grand Total"] ?? 0}</p>
      </div>
    </div>
  );
});

export default SalarySlipTemplate;
