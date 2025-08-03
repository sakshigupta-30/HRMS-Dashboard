import React, { useEffect, useState } from "react";
import { candidateAPI } from "../services/api";

const OfferLetter = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all employee candidates (can implement pagination or fetch all depending on backend)
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // Get all employee candidates, here assuming you want all without pagination:
      // If you want paginated, add page and limit params.
      const data = await candidateAPI.getAllCandidates({
        isEmployee: true,
        page: 1,
        limit: 1000,
      });
      setEmployees(data.candidates || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleGenerateOfferLetter = (candidate) => {
    // Placeholder function — implement PDF generation here later
    alert(
      `Generate offer letter for ${
        candidate.personalDetails?.firstName || ""
      } ${candidate.personalDetails?.lastName || ""}`
    );
  };

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="mb-4 text-xl font-semibold">Generate Offer Letters</h2>
      {employees.length === 0 ? (
        <div>No employee candidates found.</div>
      ) : (
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="p-3 border-b">Code</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Designation</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const fullName =
                `${emp.personalDetails?.firstName || ""} ${
                  emp.personalDetails?.lastName || ""
                }`.trim() || "Unknown";
              return (
                <tr
                  key={emp._id}
                  className="text-center border-b hover:bg-gray-50"
                >
                  <td className="p-3">{emp.code || "N/A"}</td>
                  <td className="p-3">{fullName}</td>
                  <td className="p-3">
                    {emp.professionalDetails?.designation || "N/A"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleGenerateOfferLetter(emp)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Generate Offer Letter
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OfferLetter;
