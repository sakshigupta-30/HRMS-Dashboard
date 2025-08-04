import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./SalarySlips.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { createRoot } from "react-dom/client";
import SalarySlipTemplate from "../components/SalarySlipTemplate";

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

      // Add the actual fixed monthly wage rates to summary to show in template
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
      const earnedOtherAllow = Math.round((otherAllow / monthDays) * paidDays);

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

      const attendanceBonus = paidDays >= 31 ? 1000 : 0;

      const emprPF = Math.round(earnedBasic * 0.13);
      const emprESI =
        earnedGrossPay < 21001 ? Math.ceil(earnedGrossPay * 0.0325) : 0;
      const emplLWF = lwf * 2;

      const totalCTC =
        earnedGrossPay + emprPF + emprESI + emplLWF + attendanceBonus;
      const serviceCharge = Math.round(totalCTC * 0.04);
      const subTotal = totalCTC + serviceCharge;
      const gst = Math.round(subTotal * 0.18);
      const grandTotal = subTotal + gst;

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
      summary["Take Home Pay"] = netPay;

      summary["Earned Gross Pay"] = earnedGrossPay;
      summary["Net Pay"] = netPay;
      summary["Grand Total"] = grandTotal;

      return summary;
    });

    setSummaryData(merged);
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName =
        workbook.SheetNames.find((name) => name.toLowerCase() === "wages") ||
        workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      // Optional progress tracking (commented out for now)
      // setUploadProgress({ done: 0, total: rows.length });

      let startCode = 1;

      for (let [index, row] of rows.entries()) {
        try {
          const fullName = String(row["NAME"] || "").trim();
          if (!fullName) continue;

          const [firstName, ...rest] = fullName.split(" ");
          const lastName = rest.join(" ");

          let availableFromDate = null;
          const dojRaw = String(row["DoJ"] || "").trim();
          if (dojRaw && dojRaw !== "-" && dojRaw.toLowerCase() !== "n/a") {
            const parsedDate = new Date(dojRaw);
            if (!isNaN(parsedDate.getTime())) {
              availableFromDate = parsedDate.toISOString();
            } else {
              console.warn(`Invalid DoJ date at row ${index + 2}:`, dojRaw);
            }
          }

          const generatedCode = `RAY${String(startCode).padStart(3, "0")}`;
          startCode++;

          const payload = {
            personalDetails: {
              firstName: firstName || "",
              lastName: lastName || "",
            },
            professionalDetails: {
              designation: String(row["Designation"] || "").trim(),
              location: String(row["Location"] || "").trim(),
              availableFrom: availableFromDate || null,
              salary: {
                basic: parseFloat(row["Basic"]) || 0,
                hra: parseFloat(row["HRA"]) || 0,
                retention: parseFloat(row["4 Hrs Retention"]) || 0,
                otherAllowances: parseFloat(row["Other Allowances"]) || 0,
                actualSalary: parseFloat(row["Actual Salary"]) || 0,
              },
            },
            code: generatedCode,
            role: "Employee",
            status: "Selected",
            isEmployee: true,
          };

          await candidateAPI.addCandidate(payload);
        } catch (err) {
          console.error(`❌ Failed to add: ${row["NAME"]}`, err);
        } finally {
          // setUploadProgress({ done: index + 1, total: rows.length });
        }
      }

      alert("✅ Bulk upload complete!");
      // await fetchEmployees();
      // setUploadProgress({ done: 0, total: 0 });

      parseExcel(workbook); // Generate slips after upload
    };

    reader.readAsArrayBuffer(file);
  };

  const generatePDF = (employee) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.top = "-10000px";
    document.body.appendChild(wrapper);

    const root = createRoot(wrapper);
    root.render(<SalarySlipTemplate employee={employee} />);

    setTimeout(() => {
      html2canvas(wrapper, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(
          `${employee["Employee Code"]}_${employee.Name}_SalarySlip.pdf`
        );

        root.unmount();
        document.body.removeChild(wrapper);
      });
    }, 300);
  };

  return (
    <div className="salary-slips p-6">
      <h2 className="text-xl font-semibold mb-4">Salary Slips Summary</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleBulkUpload}
        className="mb-4"
      />

      {summaryData.length > 0 && (
        <div className="salary-slips-table-container overflow-x-auto">
          <table className="salary-slips-table w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Emp Code</th>
                <th className="p-2">Employee</th>
                <th className="p-2">Earned Gross Pay</th>
                <th className="p-2">Net Pay</th>
                <th className="p-2">Grand Total</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono text-sm">
                    {row["Employee Code"]}
                  </td>
                  <td className="p-2">
                    <div className="font-medium">{row.Name}</div>
                    <div className="text-sm text-gray-500">
                      {row.Designation}
                    </div>
                  </td>
                  <td className="p-2">₹ {row["Earned Gross Pay"]}</td>
                  <td className="p-2">₹ {row["Net Pay"]}</td>
                  <td className="p-2 font-bold">₹ {row["Grand Total"]}</td>
                  <td className="p-2">
                    <button
                      onClick={() => generatePDF(row)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                    >
                      Generate Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalarySlips;
