import React, { forwardRef } from "react";
import "./SalarySlipTemplate.css";
import logoImage from "../assets/logo.png";

const SalarySlipTemplate = forwardRef(({ employee }, ref) => {
  // Helper
  const formatAmount = (val) =>
    isNaN(val) || val === null ? "₹0" : `₹${Math.round(val)}`;

  return (
    <div ref={ref} className="salary-container">
      {/* Header */}
      <div className="salary-header-row">
        <div className="salary-header-left">
          <div className="company-name">Raymoon Services Private Limited</div>
          <div className="company-address">
            DLF Corporate Greens, Unit no. 807, 8th floor, sec 74A, Gurgaon
            122004
          </div>
        </div>
        <div className="company-logo">
          <img
            src={logoImage}
            alt="Company Logo"
            className="company-logo-img"
          />
        </div>
      </div>
      {/* Title */}
      <div className="salary-title-row">
        <div className="salary-title-text">Salary Slip</div>
        <div className="salary-subtitle-text">
          Salary / Wages Advice for the Month: March 2024
        </div>
      </div>
      {/* Employee Info */}
      <div className="salary-emp-info-grid">
        <div className="salary-emp-column">
          <div>Emp Code: {employee["Employee Code"]}</div>
          <div>Emp Name: {employee.Name}</div>
          <div>F/H Name: -</div>
        </div>
        <div className="salary-emp-column">
          <div>Designation: {employee.Designation}</div>
          <div>Location: Gurgaon-FC5</div>
          <div>DOJ: {employee["DOJ"] ?? "-"}</div>
        </div>
        <div className="salary-emp-column">
          <div>PF / UAN No: {employee["PF/UAN"] ?? "-"}</div>
          <div>ESIC No: {employee["ESIC No"] ?? "-"}</div>
          <div>Bank A/C No: {employee["Bank A/C"] ?? "-"}</div>
        </div>
      </div>
      {/* Main Grid */}
      <div className="salary-main-grid">
        {/* Column 1 – Rate of Wages */}
        <div className="main-grid-column">
          <strong>Rate of Salary / Wages</strong>
          <div>Basic: {formatAmount(employee["Basic"])}</div>
          <div>HRA: {formatAmount(employee["HRA"])}</div>
          <div>
            Retention:{" "}
            {formatAmount(employee["Retention"] ?? employee["4 Hrs Retention"])}
          </div>
          <div>
            Other Allowances: {formatAmount(employee["Other Allowances"])}
          </div>
        </div>
        {/* Column 2 – Earnings */}
        <div className="main-grid-column">
          <strong>Earnings</strong>
          <div>Earned Basic: {formatAmount(employee["Earned Basic"])}</div>
          <div>Earned HRA: {formatAmount(employee["Earned HRA"])}</div>
          <div>
            Earned Retention: {formatAmount(employee["Earn Retention"])}
          </div>
          <div>Earned OT: {formatAmount(employee["Earn OT"])}</div>
          <div>
            Earned Extra Duty: {formatAmount(employee["Earn Extra Duty"])}
          </div>
          <div>
            Earned Allowances: {formatAmount(employee["Earn Other Allow"])}
          </div>
          {employee["Attendance Bonus"] !== undefined && (
            <div>
              Attendance Bonus: {formatAmount(employee["Attendance Bonus"])}
            </div>
          )}
          <strong>
            Total Earnings: {formatAmount(employee["Earned Gross Pay"])}
          </strong>
        </div>
        {/* Column 3 – Deductions */}
        <div className="main-grid-column">
          <strong>Deductions</strong>
          <div>PF (12%): {formatAmount(employee["Emp PF"])}</div>
          <div>ESI (0.75%): {formatAmount(employee["Emp ESI"])}</div>
          <div>LWF: {formatAmount(employee["LWF"])}</div>
          <div>
            Other Deductions: {formatAmount(employee["Other Deductions"] ?? 0)}
          </div>
          <strong>
            Total Deduction: {formatAmount(employee["Total Deductions"])}
          </strong>
        </div>
        {/* Column 4 – Attendance */}
        <div className="main-grid-column">
          <strong>Attendance / Leave</strong>
          <div>Days of Month: {employee["Total Days"] ?? 31}</div>
          <div>Paid Days: {employee["Total Paid Days"] ?? 0}</div>
          <div>OT Hrs: {employee["OT Hours"] ?? 0}</div>
        </div>
        {/* Column 5 – Signature & Payment */}
        <div className="main-grid-column">
          <strong>Payment & Signature</strong>
          <div>Mode of Payment: {employee["Payment Mode"] ?? "NEFT"}</div>
          <div>Net Pay: {formatAmount(employee["Net Pay"])}</div>
          <div className="signature-box">Signature of Employee</div>
          <div className="salary-note">This is a computer-generated slip.</div>
        </div>
      </div>
      {/* Footer */}
      <div className="salary-footer-row">
        <div className="footer-item">
          Gross: {formatAmount(employee["Earned Gross Pay"])}
        </div>
        <div className="footer-item-deductions">
          Total Deduction: {formatAmount(employee["Total Deductions"])}
        </div>
        <div className="footer-net-salary">
          Net Salary: {formatAmount(employee["Net Pay"])}
        </div>
      </div>
    </div>
  );
});

export default SalarySlipTemplate;
