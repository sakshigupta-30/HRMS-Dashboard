import React, { useState, useEffect, useRef } from "react";
import * as XLSX from "xlsx";
import SalarySlipTemplate from "../components/SalarySlipTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AdvancePayAPI, candidateAPI, OtherDeductionAPI, salarySummaryAPI, sendSalarySlip } from "../services/api";

const SalarySlips = () => {
  const [summaryData, setSummaryData] = useState([]); // parsed salary summaries for selected month
  const [employeeList, setEmployeeList] = useState([]); // master employee list (from API / localStorage)
  const [uploadError, setUploadError] = useState("");
  const [excelUploaded, setExcelUploaded] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // used to feed SalarySlipTemplate for PDF
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Month/Year selection (keeps your Select UI)
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const templateRef = useRef();
  const fileInputRef = useRef(null);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Helper to build storage key for month-year
  const getMonthKey = (year, monthName) => {
    if (!year || !monthName) return null;
    const monthIndex = months.indexOf(monthName) + 1; // 1-based
    if (monthIndex <= 0) return null;
    return `${year}-${String(monthIndex).padStart(2, "0")}`; // e.g. 2025-08
  };

  // Load employeeList from localStorage or API on mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem("employeeListData");
    if (savedEmployees) {
      try {
        const parsed = JSON.parse(savedEmployees);
        setEmployeeList(parsed || []);
        setLoadingEmployees(false);
      } catch {
        // fallback to fetch
        fetchEmployees();
      }
    } else {
      fetchEmployees();
    }

    // also if there's a previously selected month saved, restore selection (optional)
    const lastSelectedMonth = localStorage.getItem("salarySlips-selectedMonth");
    const lastSelectedYear = localStorage.getItem("salarySlips-selectedYear");
    if (lastSelectedMonth && lastSelectedYear) {
      setSelectedMonth(lastSelectedMonth);
      setSelectedYear(Number(lastSelectedYear));
    }
  }, []);

  // Whenever selected month/year changes, load that month's saved summary (if present)
  useEffect(() => {
    const monthKey = getMonthKey(selectedYear, selectedMonth);
    if (!monthKey) {
      setSummaryData([]);
      return;
    }

    // persist selection so refresh restores it
    localStorage.setItem("salarySlips-selectedMonth", selectedMonth);
    localStorage.setItem("salarySlips-selectedYear", String(selectedYear));
    console.log("Fetching salary summaries for month:", monthKey);
    // After fetching from API
    const fetchSalarySummaries = async () => {
      try {
        const summaries = await salarySummaryAPI.getSalarySummaries(monthKey);
        // Flatten salaryDetails into the root object for each summary
        const flatSummaries = (summaries || []).map(s =>
          s.salaryDetails
            ? { ...s.salaryDetails, "Employee Code": s.employeeCode }
            : s
        );
        setSummaryData(flatSummaries);
      } catch (err) {
        console.warn("Failed to fetch salary summaries from backend", err);
        setSummaryData([]);
      }
    };
    fetchSalarySummaries();
  }, [selectedMonth, selectedYear]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const data = await candidateAPI.getAllCandidates({
        isEmployee: true,
        page: 1,
        limit: 1000,
      });
      setEmployeeList(data.candidates || []);
      localStorage.setItem(
        "employeeListData",
        JSON.stringify(data.candidates || [])
      );
    } catch (err) {
      console.warn("Failed to fetch employees", err);
      setEmployeeList([]);
    } finally {
      setLoadingEmployees(false);
    }
  };

  // parse workbook (your original parsing logic preserved) and save month-keyed data
  const parseExcel = async (workbook) => {
    try {
      if (!selectedMonth || !selectedYear) {
        setUploadError("Please select month and year first.");
        return;
      }

      const sheet1 = workbook.Sheets[workbook.SheetNames[0]];
      const attendanceData = XLSX.utils.sheet_to_json(sheet1, { defval: "" });

      const wagesSheet = workbook.Sheets["WAGES"];
      if (!wagesSheet) {
        setUploadError("WAGES sheet not found in the uploaded Excel.");
        return;
      }
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
          "Paid Leave": parseInt(row["__EMPTY_10"] || 0) || 0,
          "Com Off": parseInt(row["__EMPTY_11"] || 0) || 0,
          "Working on Holiday": parseInt(row["__EMPTY_12"] || 0) || 0,
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
            String(summary.Name || "")
              .toLowerCase()
              .trim()
        );
        if (!wageEntry) {
          // If wages row not found, keep the attendance-only summary
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

        // Additional fields you previously wanted (attendance bonus, take home, employer contributions, CTC etc)
        const attendanceBonus2 =
          (summary["Total Paid Days"] || 0) >= 31 ? 1000 : 0;
        const takeHomePay = netPay + attendanceBonus2;
        const emprPF = Math.round(earnedBasic * 0.13);
        const emprESI =
          earnedGrossPay < 21001 ? Math.round(earnedGrossPay * 0.0325) : 0;
        const emplLWF = Math.round(lwf * 2);
        const totalCTC = Math.round(
          earnedGrossPay + emprPF + emprESI + emplLWF + attendanceBonus2
        );
        const serviceCharge = +(totalCTC * 0.04).toFixed(2);
        const subTotal = +(totalCTC + serviceCharge).toFixed(2);
        const gst = +(subTotal * 0.18).toFixed(2);
        const grandTotal = +(subTotal + gst).toFixed(2);

        // attach calculated fields
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

        // extended fields
        summary["Attendance Bonus2"] = attendanceBonus2;
        summary["Take Home Pay"] = takeHomePay;
        summary["Empr PF"] = emprPF;
        summary["Empr ESI"] = emprESI;
        summary["Empl LWF"] = emplLWF;
        summary["Total CTC"] = totalCTC;
        summary["Service Charge"] = serviceCharge;
        summary["SUB TOTAL"] = subTotal;
        summary["GST 18%"] = gst;
        summary["Grand Total"] = grandTotal;

        // include original wages entry for reference (optional)
        summary["_wageRow"] = wageEntry;

        return summary;
      });

      // save month-specific data
      const monthKey = getMonthKey(selectedYear, selectedMonth);
      if (!monthKey) {
        setUploadError("Invalid month/year selection.");
        return;
      }

      setSummaryData(merged);
      localStorage.setItem(`salarySlips-${monthKey}`, JSON.stringify(merged));
      setExcelUploaded(true);
      setUploadError("");

      // optionally save to backend salarySummaryAPI per employee (as you had)
      for (const empSummary of merged) {
        const employeeCode = empSummary["Employee Code"];
        const { "Employee Code": _, ...salaryDetails } = empSummary;

        try {
          // best-effort: send to backend but don't block UI
          await salarySummaryAPI.saveSalarySummary(
            employeeCode,
            monthKey,
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
      console.error("parseExcel error:", err);
      setUploadError("Failed to parse uploaded Excel file.");
      setSummaryData([]);
      setExcelUploaded(false);
    }
  };
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleSendSlip = async (employeeSummary) => {
    setLoading(true);
    setSelectedEmployee(employeeSummary);
    console.log(employeeSummary);
    console.log("Here")
    const result = await sendSalarySlip({
      employeeCode: employeeSummary["Employee Code"], // or phone
      month: selectedMonth,
      year: selectedYear,
    });
    alert(result.message)
    setStatus(result.message);
    setLoading(false);
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
  const [advanced, setAdvanced] = React.useState(0);
  const [otherDeductions, setOtherDeductions] = React.useState(0);
  const getAdvancedAmount = async (code,month) => {
    try {
      const data = await AdvancePayAPI.getAdvancedByMonth(code, month);
        setAdvanced(data.amount||0);
    }
    catch (e) {
      console.error("Error fetching advanced amount:", e);
    }
  }
  const getOtherDeductions = async (code,month) => {
    try {
      const data = await OtherDeductionAPI.getOtherDesuctionsByMonth(code, month);
        setOtherDeductions(data.amount||0);
    }
    catch (e) {
      console.error("Error fetching other deductions amount:", e);
    }
  }
  // Use the same approach you had: render hidden SalarySlipTemplate with selectedEmployee ref and then capture with html2canvas
  const generatePDF = async(employeeSummary) => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select month and year before generating PDF");
      return;
    }
    const month = getMonthKey(selectedYear, selectedMonth);
    await getAdvancedAmount(employeeSummary["Employee Code"],month);
    await getOtherDeductions(employeeSummary["Employee Code"],month);
    // selectedEmployee is the parsed summary object (not the API employee object)
    setSelectedEmployee(employeeSummary);

    // small timeout to let the hidden template render into DOM
    setTimeout(() => {
      const element = templateRef.current;
      if (!element) {
        setSelectedEmployee(null);
        return;
      }

      html2canvas(element, { scale: 2, useCORS: true })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

          const fileName = `${employeeSummary["Employee Code"] || employeeSummary.code || "EMP"
            }_${employeeSummary.Name || employeeSummary.name || ""
            }_${selectedMonth}_${selectedYear}_SalarySlip.pdf`;

          pdf.save(fileName);
        })
        .catch((err) => {
          console.error("Failed to generate PDF:", err);
          setUploadError("Failed to generate PDF.");
        })
        .finally(() => {
          setSelectedEmployee(null);
        });
    }, 300);
  };

  // find salary summary for an employee (works across your employee shapes)
  const getSalaryDataForEmployee = (emp) => {
    if (!summaryData || summaryData.length === 0) return undefined;

    return summaryData.find(
      (s) =>
        s["Employee Code"] === emp.code ||
        s["Employee Code"] === emp["Employee Code"] ||
        (emp.personalDetails?.firstName &&
          s.Name &&
          s.Name.toLowerCase() ===
          `${emp.personalDetails.firstName} ${emp.personalDetails.lastName || ""
            }`
            .trim()
            .toLowerCase())
    );
  };

  if (loadingEmployees) return <div>Loading employees...</div>;

  return (
    <div className="salary-slips p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Salary Slips Summary</h2>
        <input
          type="text"
          placeholder="Search by Employee Code or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-64"
        />
      </div>

      {/* Month/Year Selection */}
      <div className="flex gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Month</option>
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 6 }, (_, i) => {
            const year = new Date().getFullYear() - 3 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>

      {/* Upload Excel File */}
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
        {excelUploaded && (
          <div className="text-green-600 mt-2">
            Excel parsed & saved for {getMonthKey(selectedYear, selectedMonth)}
          </div>
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
            {employeeList
              .filter((emp) => {
                const empCode = emp.code || emp["Employee Code"] || "";
                const empName = emp.personalDetails?.firstName
                  ? `${emp.personalDetails.firstName} ${emp.personalDetails.lastName || ""
                    }`.trim()
                  : emp.Name || "";

                return (
                  empCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  empName.toLowerCase().includes(searchTerm.toLowerCase())
                );
              })
              .map((emp, index) => {
                const salaryData = getSalaryDataForEmployee(emp);
                const empCode = emp.code || emp["Employee Code"] || "N/A";
                const empName = emp.personalDetails?.firstName
                  ? `${emp.personalDetails.firstName} ${emp.personalDetails.lastName || ""
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
                      {salaryData ? (
                        <div className="flex gap-2 ">
                          <button
                            onClick={() => generatePDF(salaryData)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                          >
                            Download Slip
                          </button>
                          <button
                            onClick={() => handleSendSlip(salaryData)}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            disabled={loading&& selectedEmployee["Employee Code"] === emp.code }
                          >
                            {loading && selectedEmployee["Employee Code"] === emp.code ? "Sending..." : "Send Salary Slip"}
                          </button>
                        </div>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-not-allowed"
                          title={
                            selectedMonth
                              ? "No salary data for this employee in selected month"
                              : "Select month & upload Excel"
                          }
                        >
                          Download Slip
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
            <div ref={templateRef}>
              <SalarySlipTemplate employee={selectedEmployee} advanced={advanced} otherDeductions={otherDeductions}/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalarySlips;
