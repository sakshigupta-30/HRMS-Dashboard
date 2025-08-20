import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdvancePayAPI, candidateAPI, OtherDeductionAPI } from "../services/api";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import AdvancedPaymentModal from "../components/AdvancePaymentModal";
import axios from "axios";
import OtherDeductionsModal from "../components/OtherDeductions";
dayjs.extend(customParseFormat);

const ITEMS_PER_PAGE = 20;

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // New states for search and location filtering
  const [searchText, setSearchText] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [agencyFilter, setAgencyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDeductionModal, setShowDeductionModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const excelDateToJSDate = (serial) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log("Fetching employees, page:", page);

      const data = await candidateAPI.getAllCandidates({
        page,
        limit: ITEMS_PER_PAGE,
        isEmployee: true,
      });

      setEmployees(data.candidates || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to load employees:", err);
      setError("Error fetching employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const handleCreatePayment = async (paymentData) => {
    // Replace with your actual API call
   try {
    console.log("Creating advance payment:", paymentData);
     await AdvancePayAPI.saveAdvancePayment(paymentData);
     alert("Advance payment created successfully!");
   }catch(e){
    console.error("Failed to create advance payment:", e);
   }
    // Optionally show a message or refresh data
  };
  const handleAddDeduction = async (paymentData) => {
    // Replace with your actual API call
   try {
     await OtherDeductionAPI.saveOtherDeductions(paymentData);
     alert("Added Other Deductions successfully!");
   }catch(e){
    console.error("Failed to Add Other Deductions:", e);
   }
    // Optionally show a message or refresh data
  };
  const isSelected = (id) => selectedIds.includes(id);

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedIds.length} selected employee(s)?`
    );
    if (!confirmDelete) return;

    try {
      await Promise.all(
        selectedIds.map((id) => candidateAPI.deleteCandidate(id))
      );
      setEmployees((prev) =>
        prev.filter((emp) => !selectedIds.includes(emp._id))
      );
      setSelectedIds([]);
      showMessage(`✅ ${selectedIds.length} employee(s) deleted`);
    } catch (err) {
      console.error("Error deleting selected employees:", err);
      showMessage("❌ Failed to delete selected employees");
    }
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

      const normalizedRows = rows.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key.trim().toLowerCase(),
            value,
          ])
        )
      );

      setUploadProgress({ done: 0, total: normalizedRows.length });

      let startCodeNum =
        employees.reduce((max, emp) => {
          const num = parseInt(emp.code?.replace("RAY", ""));
          return isNaN(num) ? max : Math.max(max, num);
        }, 0) + 1;

      for (let [index, row] of normalizedRows.entries()) {
        try {
          const fullName = String(row["name"] || "").trim();
          if (!fullName) continue;

          const [firstName, ...rest] = fullName.split(" ");
          const lastName = rest.join(" ");

          const location = String(row["location"] || "").trim();
          const dojRaw = String(row["doj"] || "").trim();

          let availableFromDate = null;
          if (dojRaw && dojRaw !== "-" && dojRaw.toLowerCase() !== "n/a") {
            if (!isNaN(dojRaw)) {
              availableFromDate = excelDateToJSDate(
                Number(dojRaw)
              ).toISOString();
            } else {
              const parsedDate = dayjs(dojRaw, "DD-MM-YYYY", true);
              if (parsedDate.isValid()) {
                availableFromDate = parsedDate.toISOString();
              }
            }
          }

          const generatedCode = `RAY${String(startCodeNum).padStart(3, "0")}`;
          startCodeNum++;

          const payload = {
            personalDetails: {
              firstName: firstName || "",
              lastName: lastName || "",
              phone: String(row["phone"] || "").trim(),
            },
            professionalDetails: {
              designation: String(row["designation"] || "").trim(),
              location,
              agency: String(row["agency"] || "").trim(),
              availableFrom: availableFromDate || null,
              salary: {
                basic: parseFloat(row["basic"]) || 0,
                hra: parseFloat(row["hra"]) || 0,
                retention: parseFloat(row["4 hrs retention"]) || 0,
                otherAllowances: parseFloat(row["other allowances"]) || 0,
                actualSalary: parseFloat(row["actual salary"]) || 0,
              },
            },
            client: {
              location: location || "Unknown",
            },
            code: generatedCode,
            role: "Employee",
            status: "Active",
            isEmployee: true,
          };

          await candidateAPI.addCandidate(payload);
        } catch (err) {
          console.error(`Failed to add: ${row["name"]}`, err);
        } finally {
          setUploadProgress({ done: index + 1, total: normalizedRows.length });
        }
      }

      await fetchEmployees();
      showMessage("✅ Bulk upload complete!");
      setUploadProgress({ done: 0, total: 0 });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDeleteEmployee = async (employeeId, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${name}?`
    );
    if (!confirmDelete) return;

    try {
      await candidateAPI.deleteCandidate(employeeId);
      setEmployees((prev) => prev.filter((emp) => emp._id !== employeeId));
      showMessage(`✅ ${name} deleted`);
    } catch (err) {
      console.error("Error deleting employee:", err);
      showMessage("❌ Failed to delete employee");
    }
  };
  const getExcelFile = () => {
    // Prepare data for Excel
    const exportData = filteredEmployees.map((emp) => ({
      Code: emp.code || "",
      Name: getDisplayName(emp),
      Phone: emp.personalDetails?.phone || "",
      Designation: getDesignation(emp),
      Client: getClient(emp),
      Location: getLocation(emp),
      "Join Date": getJoinDate(emp),
      Basic: emp.professionalDetails?.salary?.basic ?? "",
      HRA: emp.professionalDetails?.salary?.hra ?? "",
      Retention: emp.professionalDetails?.salary?.retention ?? "",
      Allowances: emp.professionalDetails?.salary?.otherAllowances ?? "",
      Salary: emp.professionalDetails?.salary?.actualSalary ?? "",
      Status: emp.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    XLSX.writeFile(wb, "employees.xlsx");
  }
  const getDisplayName = (emp) =>
    `${emp.personalDetails?.firstName || ""} ${emp.personalDetails?.lastName || ""
      }`.trim() || "Unknown";

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getRandomColor = (i) =>
    [
      "#60A5FA",
      "#FBBF24",
      "#34D399",
      "#EC4899",
      "#A78BFA",
      "#F87171",
      "#6EE7B7",
    ][i % 7];

  const getDesignation = (emp) =>
    emp.professionalDetails?.designation ||
    emp.role ||
    emp.designation ||
    "N/A";

  const getLocation = (emp) =>
    emp.client?.location || emp.clientLocation || "N/A";

  const getClient = (emp) =>
    emp.client?.name || emp.agency || "N/A";

  const getJoinDate = (emp) => {
    const date =
      emp.professionalDetails?.availableFrom || emp.joiningDate || emp.doj;
    return date ? dayjs(date).format("DD-MM-YYYY") : "N/A";
  };

  // Compute unique locations from employees for filter dropdown
  const uniqueLocations = Array.from(
    new Set(
      employees.map(
        (emp) => emp.client?.location || emp.clientLocation || "Unknown"
      )
    )
  );
  // Compute unique locations from employees for filter dropdown
  const uniqueAgencies = Array.from(
    new Set(
      employees.map(
        (emp) => emp.client?.name && emp.client?.name || "N/A"
      )
    )
  );

  // Filtering employees based on search, location, and optional agency filter
  const filteredEmployees = employees.filter((emp) => {
    const name = getDisplayName(emp).toLowerCase();
    const location = getLocation(emp)?.toLowerCase();
    const agency = getClient(emp)?.toLowerCase();
    const status = (emp.status || "").toLowerCase();

    const matchesName = name.includes(searchText.toLowerCase());
    const matchesLocation =
      !locationFilter || location === locationFilter.toLowerCase();
    const matchesAgency =
      !agencyFilter || agency === agencyFilter.toLowerCase();
    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active"
        ? status === "selected" || status === "active"
        : status === "inactive");

    return matchesStatus && matchesName && matchesLocation && matchesAgency;
  });
  if (loading) return <div className="p-8">Loading employees...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Employee Database
        </h3>
        <div className="flex gap-2 flex-wrap">
          <button
            className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 text-sm"
            onClick={() => navigate("/add-employee")}
          >
            + Add Employee
          </button>
          <button
            className="bg-yellow-500 text-white font-medium py-2 px-4 rounded-md hover:bg-yellow-600 text-sm"
            onClick={getExcelFile}
          >
            ⬇️ Download Excel
          </button>
          <button
            className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 text-sm"
            onClick={() => document.getElementById("bulk-upload-input").click()}
          >
            ⬆️ Bulk Upload
          </button>
          <input
            type="file"
            id="bulk-upload-input"
            accept=".xlsx, .xls"
            onChange={handleBulkUpload}
            className="hidden"
          />
          {selectedIds.length > 0 && (
            <button
              className="bg-red-500 text-white font-medium py-2 px-4 rounded-md hover:bg-red-600 text-sm"
              onClick={handleDeleteSelected}
            >
              🗑️ Delete Selected ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* Search and Location Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-blue-400 flex-grow max-w-[17rem]"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-blue-400 max-w-[17rem]"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select
          value={agencyFilter}
          onChange={(e) => setAgencyFilter(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-blue-400 max-w-[17rem]"
        >
          <option value="">All Agencies</option>
          {uniqueAgencies.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-blue-400 max-w-[17rem]"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {uploadProgress.total > 0 && (
        <div className="text-sm text-gray-600 mb-4">
          Uploading: {uploadProgress.done}/{uploadProgress.total}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800 font-medium border border-green-300">
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(filteredEmployees.map((emp) => emp._id));
                      } else {
                        setSelectedIds([]);
                      }
                    }}
                    checked={
                      filteredEmployees.length > 0 &&
                      selectedIds.length === filteredEmployees.length
                    }
                  />
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  CODE
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Employee
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Phone
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Designation
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Client
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Location
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Join Date
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Basic
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  HRA
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Retention
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Allowances
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Salary
                </th>
                <th className="p-4 text-left font-semibold text-gray-500 whitespace-nowrap">
                  Status
                </th>
                <th className="p-4 text-center font-semibold text-gray-500 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan="13"
                    className="text-center p-5 whitespace-nowrap"
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp, i) => {
                  const name = getDisplayName(emp);
                  return (
                    <tr key={emp._id || i}>
                      <td className="p-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected(emp._id)}
                          onChange={() => toggleSelect(emp._id)}
                        />
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.code || "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full text-white font-semibold flex items-center justify-center text-sm flex-shrink-0"
                            style={{ backgroundColor: getRandomColor(i) }}
                          >
                            {getInitials(name)}
                          </div>
                          <div>
                            <strong
                              className="cursor-pointer text-blue-600 hover:underline"
                              onClick={() => navigate(`/candidate/${emp._id}`)}
                            >
                              {name}
                            </strong>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.personalDetails?.phone}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getDesignation(emp)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getClient(emp)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getLocation(emp)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getJoinDate(emp)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.professionalDetails?.salary?.basic ?? "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.professionalDetails?.salary?.hra ?? "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.professionalDetails?.salary?.retention ?? "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.professionalDetails?.salary?.otherAllowances ??
                          "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {emp.professionalDetails?.salary?.actualSalary ?? "N/A"}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="inline-block py-1.5 px-3 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {emp.status==="Selected"||emp.status==="Active"?"Active":'Inactive' || "N/A"}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex gap-2">
                    {/* <button type='button' className="bg-blue-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-blue-600" onClick={()=>sendOfferLetter(emp.code)}>Send Offer letter</button> */}
                          <button
                            onClick={() => navigate(`/candidate/${emp._id}`)}
                            className="bg-blue-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-blue-600"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWorker(emp);
                              setShowPaymentModal(true);
                            }}
                            className="bg-purple-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-purple-600"
                          >
                            Advanced Payment
                          </button>
                          <button
                            onClick={() => {
                              setSelectedWorker(emp);
                              setShowDeductionModal(true);
                            }}
                            className="bg-purple-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-purple-600"
                          >
                            Other Deduction
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp._id, name)}
                            className="bg-red-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          {showPaymentModal && selectedWorker && (
            <AdvancedPaymentModal
              open={showPaymentModal}
              onClose={() => setShowPaymentModal(false)}
              worker={selectedWorker}
              onSubmit={handleCreatePayment}
            />
          )}
          {showDeductionModal && selectedWorker && (
            <OtherDeductionsModal
              open={showDeductionModal}
              onClose={() => setShowDeductionModal(false)}
              worker={selectedWorker}
              onSubmit={handleAddDeduction}
            />
          )}
        </div>
      </div>

      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
              } hover:bg-gray-300`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
