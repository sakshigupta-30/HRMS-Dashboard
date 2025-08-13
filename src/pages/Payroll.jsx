import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Reusable style for each card
const cardClasses = "bg-white p-6 rounded-xl shadow-md";

// Reusable object for status badge styles
const statusStyles = {
  filed: "bg-green-500 text-white",
  pending: "bg-amber-400 text-black",
};

const Payroll = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(
          "https://hrms-backend-tawny.vercel.app/api/candidates",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCandidates(response.data);
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    fetchCandidates();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payslip Card */}
        <div className={cardClasses}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payslip Details
          </h3>
          <div className="space-y-1">
            <p>
              <strong>John Doe</strong> (EMP001)
            </p>
            <p className="text-sm text-gray-500">Apr 2023</p>
            <p className="mt-2">
              <strong>Net Pay</strong>
            </p>
            <h2 className="text-3xl font-bold text-gray-800">₹ 50,000</h2>
          </div>
        </div>

        {/* Salary Components Card */}
        <div className={cardClasses}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Salary Components
          </h3>
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2">Basic</td>
                <td className="py-2 text-right">₹ 30,000</td>
              </tr>
              <tr>
                <td className="py-2">HRA</td>
                <td className="py-2 text-right">₹ 15,000</td>
              </tr>
              <tr>
                <td className="py-2">Conveyance Allowance</td>
                <td className="py-2 text-right">₹ 2,000</td>
              </tr>
              <tr>
                <td className="py-2">Professional Tax</td>
                <td className="py-2 text-right">₹ 1,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payroll Summary Card (Spans full width on large screens) */}
        <div className={`${cardClasses} lg:col-span-2`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Payroll Summary
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="py-2 font-medium text-gray-500">Month</th>
                  <th className="py-2 font-medium text-gray-500">
                    Total Employees
                  </th>
                  <th className="py-2 font-medium text-gray-500">
                    Total Payout
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2">Apr 2023</td>
                  <td>25</td>
                  <td>₹ 12,50,000</td>
                </tr>
                <tr>
                  <td className="py-2">Mar 2023</td>
                  <td>25</td>
                  <td>₹ 12,40,000</td>
                </tr>
                <tr>
                  <td className="py-2">Feb 2023</td>
                  <td>25</td>
                  <td>₹ 12,45,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Filing Card */}
        <div className={cardClasses}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Compliance Filing
          </h3>
          <ul className="space-y-3 list-none p-0">
            <li className="flex justify-between items-center text-sm">
              <span>Provident Fund (PF) – Apr 2023</span>
              <span
                className={`py-1 px-3 rounded-lg text-xs font-medium ${statusStyles.filed}`}
              >
                Filed
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>ESI</span>
              <span
                className={`py-1 px-3 rounded-lg text-xs font-medium ${statusStyles.filed}`}
              >
                Filed
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Professional Tax (PT) – Apr 2023</span>
              <span
                className={`py-1 px-3 rounded-lg text-xs font-medium ${statusStyles.pending}`}
              >
                Pending
              </span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span>Labour Welfare Fund (LWF)</span>
              <span
                className={`py-1 px-3 rounded-lg text-xs font-medium ${statusStyles.pending}`}
              >
                Pending
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Payroll;
