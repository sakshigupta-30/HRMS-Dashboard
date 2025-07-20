import React, { useState } from "react";
import * as XLSX from "xlsx";

const SalarySlips = () => {
  const [summaryData, setSummaryData] = useState([]);

  const parseExcel = (workbook) => {
    const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
    const attendanceData = XLSX.utils.sheet_to_json(sheet1, { defval: "" });

    const wagesSheet = workbook.Sheets["WAGES"];
    const wagesData = XLSX.utils.sheet_to_json(wagesSheet, { defval: "" });

    const filteredRows = attendanceData.filter((row) => {
      const name = row["Name Of Employee"] || row["__EMPTY"];
      return (
        name &&
        typeof name === "string" &&
        name.toLowerCase() !== "name of employee" &&
        name.toLowerCase() !== "sr.no"
      );
    });

    const attendanceSummary = filteredRows.map((row) => {
      const name = row["Name Of Employee"] || row["__EMPTY"];
      const summary = {
        Name: name,
        Present: 0,
        "Week Off": 0,
        Holiday: 0,
        "Paid Leave": parseInt(row["__EMPTY_10"] || 0),
        "Com Off": parseInt(row["__EMPTY_11"] || 0),
        "Working on Holiday": parseInt(row["__EMPTY_12"] || 0),
        "Total Paid Days": 0,
        "Earned Gross Pay": 0,
        "Net Pay": 0,
        "Grand Total": 0,
      };

      Object.values(row).forEach((code) => {
        if (typeof code === "string") {
          const val = code.trim().toUpperCase();
          if (val === "P") summary.Present += 1;
          else if (val === "W/O") summary["Week Off"] += 1;
          else if (val === "H") summary.Holiday += 1;
        }
      });

      summary["Total Paid Days"] =
        summary.Present +
        summary["Week Off"] +
        summary.Holiday +
        summary["Paid Leave"] +
        summary["Com Off"] +
        summary["Working on Holiday"];

      return summary;
    });

    const merged = attendanceSummary.map((summary) => {
      const wageEntry = wagesData.find(
        (w) =>
          (w["NAME"] || "").toLowerCase().trim() ===
          summary.Name.toLowerCase().trim()
      );

      if (!wageEntry) {
        console.warn("No match in WAGES for:", summary.Name);
        return summary;
      }

      const paidDays = summary["Total Paid Days"] || 0;
      const monthDays = 31;

      const basic = parseFloat(wageEntry["Basic"]) || 0;
      const hra = parseFloat(wageEntry["HRA"]) || 0;
      const retention = parseFloat(wageEntry["4 Hrs Retention"]) || 0;
      const otHours = parseFloat(wageEntry["OT Hours"]) || 0;
      const extraDuty = parseFloat(wageEntry["Extra Duty"]) || 0;
      const actualSalary = parseFloat(wageEntry["Actual Salary"]) || 0;
      const otherAllow = parseFloat(wageEntry["Other Allowances"]) || 0;

      const earnedBasic = Math.round((basic / monthDays) * paidDays);
      const earnedHRA = Math.round((hra / monthDays) * paidDays);
      const earnedRetention = Math.round((retention / monthDays) * paidDays);
      const earnedOT = Math.round((basic / 26 / 8) * otHours * 2);
      const earnedExtraDuty = Math.round((actualSalary / monthDays) * extraDuty);
      const earnedOtherAllow = Math.round((otherAllow / monthDays) * paidDays);

      const earnedGrossPay =
        earnedBasic +
        earnedHRA +
        earnedRetention +
        earnedOT +
        earnedExtraDuty +
        earnedOtherAllow;

      const empPF = Math.round(earnedBasic * 0.12);
      const empESI = earnedGrossPay < 21001 ? Math.ceil(earnedGrossPay * 0.0075) : 0;
      const lwf = Math.ceil(Math.min(earnedGrossPay * 0.002, 34));
      const totalDeduction = empPF + empESI + lwf;
      const netPay = Math.round(earnedGrossPay - totalDeduction);

      const attendanceBonus = paidDays >= 31 ? 1000 : 0;
      const takeHome = netPay + attendanceBonus;

      const emprPF = Math.round(earnedBasic * 0.13);
      const emprESI = earnedGrossPay < 21001 ? Math.ceil(earnedGrossPay * 0.0325) : 0;
      const emplLWF = lwf * 2;

      const totalCTC =
        earnedGrossPay + emprPF + emprESI + emplLWF + attendanceBonus;

      const serviceCharge = Math.round(totalCTC * 0.04);
      const subTotal = totalCTC + serviceCharge;
      const gst = Math.round(subTotal * 0.18);
      const grandTotal = subTotal + gst;

      summary["Earned Gross Pay"] = earnedGrossPay;
      summary["Net Pay"] = netPay;
      summary["Grand Total"] = grandTotal;

      return summary;
    });

    setSummaryData(merged);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      parseExcel(workbook);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Salary Slips Summary</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {summaryData.length > 0 && (
        <table border="1" style={{ marginTop: "20px", borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ backgroundColor: "#f0f0f0" }}>
            <tr>
              <th>Name</th>
              <th>Present</th>
              <th>Week Off</th>
              <th>Holiday</th>
              <th>Paid Leave</th>
              <th>Com Off</th>
              <th>Working on Holiday</th>
              <th>Total Paid Days</th>
              <th>Earned Gross Pay</th>
              <th>Net Pay</th>
              <th>Grand Total</th>
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, index) => (
              <tr key={index}>
                <td>{row.Name}</td>
                <td>{row.Present}</td>
                <td>{row["Week Off"]}</td>
                <td>{row.Holiday}</td>
                <td>{row["Paid Leave"]}</td>
                <td>{row["Com Off"]}</td>
                <td>{row["Working on Holiday"]}</td>
                <td>{row["Total Paid Days"]}</td>
                <td>{row["Earned Gross Pay"]}</td>
                <td>{row["Net Pay"]}</td>
                <td>{row["Grand Total"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalarySlips;
