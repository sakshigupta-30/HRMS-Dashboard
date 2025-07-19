import React from 'react';

// A reusable style for each card in the component to ensure consistency.
const cardClasses = "bg-white border border-gray-300 rounded-lg p-4 w-full sm:w-[300px] flex-shrink-0 flex flex-col";
const cardTitleClasses = "font-semibold mb-2";

const EmployeePayrollCard = ({ employee }) => {
  return (
    <div className="flex flex-wrap gap-4 mb-8">
      {/* Card 1: Payslip Details */}
      <div className={cardClasses}>
        <h4 className={cardTitleClasses}>Payslip Details</h4>
        <p className="text-sm">{employee.name} ({employee.empId})</p>
        <p className="text-sm text-gray-600">{employee.month} | Net Pay: ₹{employee.netPay}</p>
      </div>

      {/* Card 2: Salary Components */}
      <div className={cardClasses}>
        <h4 className={cardTitleClasses}>Salary Components</h4>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-200">
            {employee.salaryComponents.map((item, idx) => (
              <tr key={idx}>
                <td className="py-1.5">{item.component}</td>
                <td className="text-right font-medium">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card 3: Payroll Summary */}
      <div className={cardClasses}>
        <h4 className={cardTitleClasses}>Payroll Summary</h4>
        <table className="w-full text-sm text-left">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="py-1.5 font-medium text-gray-500">Month</th>
              <th className="py-1.5 font-medium text-gray-500">Employees</th>
              <th className="py-1.5 font-medium text-gray-500">Total Pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employee.payrollSummary.map((item, idx) => (
              <tr key={idx}>
                <td className="py-1.5">{item.month}</td>
                <td className="py-1.5">{item.totalEmployees}</td>
                <td className="py-1.5">{item.totalPay}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card 4: Compliance Filing */}
      <div className={cardClasses}>
        <h4 className={cardTitleClasses}>Compliance Filing</h4>
        <ul className="space-y-2 text-sm">
          {employee.compliance.map((item, idx) => (
            <li key={idx}>
              {item.type} ({item.month}) — 
              <span className={`font-bold ${
                item.status.toLowerCase() === 'filed' ? 'text-green-600' : 'text-orange-500'
              }`}>
                {' '}{item.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EmployeePayrollCard;