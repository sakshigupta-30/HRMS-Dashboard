// src/components/EmployeePayrollCard.jsx
import React from 'react';
import './EmployeePayrollCard.css'; // Optional for styling

const EmployeePayrollCard = ({ employee }) => {
  return (
    <div className="employee-payroll-card">
      <div className="card">
        <h4>Payslip Details</h4>
        <p>{employee.name} ({employee.empId})</p>
        <p>{employee.month} | Net Pay: ₹{employee.netPay}</p>
      </div>

      <div className="card">
        <h4>Salary Components</h4>
        <table>
          <tbody>
            {employee.salaryComponents.map((item, idx) => (
              <tr key={idx}>
                <td>{item.component}</td>
                <td>₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h4>Payroll Summary</h4>
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Employees</th>
              <th>Total Pay</th>
            </tr>
          </thead>
          <tbody>
            {employee.payrollSummary.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>{item.totalEmployees}</td>
                <td>{item.totalPay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h4>Compliance Filing</h4>
        <ul>
          {employee.compliance.map((item, idx) => (
            <li key={idx}>
              {item.type} ({item.month}) — 
              <span className={item.status.toLowerCase()}>{item.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeePayrollCard;
