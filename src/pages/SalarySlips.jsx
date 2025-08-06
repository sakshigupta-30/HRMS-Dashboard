import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import SalarySlipTemplate from "../components/SalarySlipTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { candidateAPI, salarySummaryAPI } from "../services/api";
// Import saveSalarySummary API

const SalarySlips = () => {
  const [summaryData, setSummaryData] = useState([]); // Calculated salary slip data from excel
  const [employeeList, setEmployeeList] = useState([]); // Employees from backend
  const [uploadError, setUploadError] = useState("");
  const [excelUploaded, setExcelUploaded] = useState(false);
  // const [loadingEmployees, setLoadingEmployees] = useState(true);
  const templateRef = useRef();
  const fileInputRef = useRef(null); // ✅ Add this line
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees once on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const data = await candidateAPI.getAllCandidates({
          isEmployee: true,
          page: 1,
          limit: 1000,
        });
        setEmployeeList(data.candidates || []);
      } catch (err) {
        setEmployeeList([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  const parseExcel = async (workbook) => {
    try {
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

      const attendanceSummary = filteredRows.map((row, index) => {
        const name = row["Name Of Employee"] || row["__EMPTY"];
        const designation = row["Designation"] || row["__EMPTY_1"] || "";

        const summary = {
          "Employee Code": `RAY${String(index + 1).padStart(3, "0")}`,
          Name: name,
          Designation: designation,
          Present: 0,
          "Week Off": 0,
          Holiday: 0,
          "Paid Leave": parseInt(row["__EMPTY_10"] || 0),
          "Com Off": parseInt(row["__EMPTY_11"] || 0),
          "Working on Holiday": parseInt(row["__EMPTY_12"] || 0),
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

        summary["Basic"] = basic;
        summary["HRA"] = hra;
        summary["Retention"] = retention;
        summary["Other Allowances"] = otherAllow;

        const earnedBasic = Math.round((basic / monthDays) * paidDays);
        const earnedHRA = Math.round((hra / monthDays) * paidDays);
        const earnedRetention = Math.round((retention / monthDays) * paidDays);
        const earnedOT = Math.round((basic / 26 / 8) * otHours * 2);
        const earnedExtraDuty = Math.round(
          (actualSalary / monthDays) * extraDuty
        );
        const earnedOtherAllow = Math.round(
          (otherAllow / monthDays) * paidDays
        );

        const earnedGrossPay =
          earnedBasic +
          earnedHRA +
          earnedRetention +
          earnedOT +
          earnedExtraDuty +
          earnedOtherAllow;

        const empPF = Math.round(earnedBasic * 0.12);
        const empESI =
          earnedGrossPay < 21001 ? Math.ceil(earnedGrossPay * 0.0075) : 0;
        const lwf = Math.ceil(Math.min(earnedGrossPay * 0.002, 34));
        const totalDeduction = empPF + empESI + lwf;
        const netPay = Math.round(earnedGrossPay - totalDeduction);

        summary["Earned Basic"] = earnedBasic;
        summary["Earned HRA"] = earnedHRA;
        summary["Earn Retention"] = earnedRetention;
        summary["Earn OT"] = earnedOT;
        summary["Earn Extra Duty"] = earnedExtraDuty;
        summary["Earn Other Allow"] = earnedOtherAllow;
        summary["Emp PF"] = empPF;
        summary["Emp ESI"] = empESI;
        summary["LWF"] = lwf;
        summary["Total Deductions"] = totalDeduction;
        summary["Net Pay"] = netPay;
        summary["Earned Gross Pay"] = earnedGrossPay;

        return summary;
      });

      setSummaryData(merged);
      setExcelUploaded(true);
      setUploadError("");

      const month = "2025-08"; // Put your logic or input here for month

      // Save salary summaries to backend for all employees
      for (const empSummary of merged) {
        const employeeCode = empSummary["Employee Code"];
        const { "Employee Code": _, ...salaryDetails } = empSummary;

        try {
          await salarySummaryAPI.saveSalarySummary(
            employeeCode,
            month,
            salaryDetails
          );
        } catch (err) {
          console.warn(
            `Failed to save salary summary for ${employeeCode}`,
            err
          );
        }
      }
    } catch (err) {
      setUploadError("Failed to parse uploaded Excel file.");
      setSummaryData([]);
      setExcelUploaded(false);
    }
  };

  const handleBulkUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setUploadError("No file selected.");
      return;
    }
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      parseExcel(workbook);
    };

    reader.readAsArrayBuffer(file);
  };

  const generatePDF = (employee) => {
    setSelectedEmployee(employee);

    setTimeout(() => {
      const element = templateRef.current;
      if (!element) return;

      html2canvas(element, { scale: 2, useCORS: true }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(
          `${employee["Employee Code"] || employee.code}_${
            employee.Name || employee.personalDetails?.firstName || ""
          }_SalarySlip.pdf`
        );

        setSelectedEmployee(null);
      });
    }, 300);
  };

  const getSalaryDataForEmployee = (emp) => {
    return summaryData.find(
      (s) =>
        s["Employee Code"] === emp.code ||
        s["Employee Code"] === emp["Employee Code"] ||
        (emp.personalDetails?.firstName &&
          s.Name.toLowerCase() ===
            `${emp.personalDetails.firstName} ${
              emp.personalDetails.lastName || ""
            }`
              .trim()
              .toLowerCase())
    );
  };

  const [loadingEmployees, setLoadingEmployees] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const data = await candidateAPI.getAllCandidates({
          isEmployee: true,
          page: 1,
          limit: 1000,
        });
        setEmployeeList(data.candidates || []);
      } catch (err) {
        setEmployeeList([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loadingEmployees) return <div>Loading employees...</div>;

  return (
    <div className="salary-slips p-6">
      <h2 className="text-xl font-semibold mb-4">Salary Slips Summary</h2>
      {/* Upload Excel File Button */}
      <div className="mb-4">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleBulkUpload}
          ref={fileInputRef}
        />
        {!!uploadError && (
          <div className="text-red-600 mt-2">{uploadError}</div>
        )}
      </div>

      <div className="salary-slips-table-container overflow-x-auto">
        <table className="salary-slips-table w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Emp Code</th>
              <th className="p-2">Employee</th>
              <th className="p-2">Designation</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((emp, index) => {
              const salaryData = getSalaryDataForEmployee(emp);
              const empCode = emp.code || emp["Employee Code"] || "N/A";
              const empName = emp.personalDetails?.firstName
                ? `${emp.personalDetails.firstName} ${
                    emp.personalDetails.lastName || ""
                  }`.trim()
                : emp.Name || "N/A";
              const designation =
                emp.professionalDetails?.designation ||
                emp.Designation ||
                "N/A";

              return (
                <tr
                  key={emp._id || index}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-2 font-mono text-sm">{empCode}</td>
                  <td className="p-2">{empName}</td>
                  <td className="p-2">{designation}</td>
                  <td className="p-2">
                    {excelUploaded && salaryData ? (
                      <button
                        onClick={() => generatePDF(salaryData)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                      >
                        Generate Slip
                      </button>
                    ) : (
                      <button
                        disabled
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                        title="Upload Excel with salary data to enable"
                      >
                        Generate Slip
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Hidden template for PDF generation */}
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            zIndex: "-1",
          }}
        >
          {selectedEmployee && (
            <SalarySlipTemplate ref={templateRef} employee={selectedEmployee} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySlips;
