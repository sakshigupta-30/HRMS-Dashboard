import React, { useState } from "react";
import * as XLSX from "xlsx";

const SalarySlips = () => {
  const [summaryData, setSummaryData] = useState([]);

  const parseExcel = (data) => {
    const parsedData = [];

    // Find the start index by checking when "Name Of Employee" appears
    const headerRowIndex = data.findIndex(
      (row) => row["__EMPTY"]?.toString().toLowerCase().includes("name")
    );

    // Extract rows after header
    const employeeRows = data.slice(headerRowIndex + 1);

    employeeRows.forEach((row) => {
      const name = row["__EMPTY"];
      const srNo = row["Mar-25"];
      if (!name || name.toString().toLowerCase().includes("name")) return;

      const attendanceCodes = Object.entries(row)
        .filter(([key, _]) => key.includes("-Mar"))
        .map(([_, val]) => val?.toString().toUpperCase());

      const presentCount = attendanceCodes.filter((code) => code === "P").length;
      const absent = Number(row["__EMPTY_5"] || 0);
      const weekOff = Number(row["__EMPTY_6"] || 0);
      const holiday = Number(row["__EMPTY_7"] || 0);
      const halfDay = Number(row["__EMPTY_8"] || 0);
      const extraDay = Number(row["__EMPTY_9"] || 0);
      const paidLeave = Number(row["__EMPTY_10"] || 0);
      const comOff = Number(row["__EMPTY_11"] || 0);
      const workingOnHoliday = Number(row["__EMPTY_12"] || 0);

      const totalPaidDays =
        presentCount +
        paidLeave +
        (halfDay * 0.5) +
        extraDay +
        comOff +
        workingOnHoliday;

      parsedData.push({
        "Sr. No": srNo,
        Name: name,
        Present: presentCount,
        Absent: absent,
        "Week Off": weekOff,
        Holiday: holiday,
        "Half Day": halfDay,
        "Extra Day": extraDay,
        "Paid Leave": paidLeave,
        "Com Off": comOff,
        "Working On Holiday": workingOnHoliday,
        "Total Paid Days": totalPaidDays.toFixed(2),
      });
    });

    setSummaryData(parsedData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      parseExcel(data);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Salary Slip Summary</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {summaryData.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              {Object.keys(summaryData[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {summaryData.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SalarySlips;
