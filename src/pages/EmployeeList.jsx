import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const data = await candidateAPI.getAllCandidates(page);
        const selected = data.candidates.filter((c) => c.status === 'Selected');
        setEmployees(selected);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load candidates:', err);
        setError('Error fetching employees.');
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [page]);

  const handleDeleteEmployee = async (employeeId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await candidateAPI.deleteCandidate(employeeId);
        const data = await candidateAPI.getAllCandidates(page);
        const selected = data.candidates.filter((c) => c.status === 'Selected');
        setEmployees(selected);
        setTotalPages(data.totalPages || 1);
        alert('Employee deleted successfully!');
      } catch (err) {
        console.error('Error deleting employee:', err);
        setError('Failed to delete employee. Please try again.');
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  const getDisplayName = (emp) =>
    `${emp.personalDetails?.firstName || ''} ${emp.personalDetails?.lastName || ''}`.trim() || 'Unknown';
  const getInitials = (name) => name.split(' ').map((n) => n.charAt(0)).join('').toUpperCase();
  const getRandomColor = (index) =>
    ['#60A5FA', '#FBBF24', '#34D399', '#EC4899', '#A78BFA', '#F87171', '#6EE7B7'][index % 7];
  const getDepartment = (emp) => emp.professionalDetails?.department || 'N/A';
  const getJobTitle = (emp) => emp.professionalDetails?.currentJobTitle || 'N/A';
  const getJoinDate = (emp) =>
    emp.professionalDetails?.availableFrom
      ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString()
      : 'N/A';

  if (loading) return <div className="p-8">Loading employees...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">Employee Database</h3>
        <button
          className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 transition-colors text-sm"
          onClick={() => navigate('/add-employee')}
        >
          + Add Employee
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-500">Employee</th>
                <th className="p-4 text-left font-semibold text-gray-500">Department</th>
                <th className="p-4 text-left font-semibold text-gray-500">Role</th>
                <th className="p-4 text-left font-semibold text-gray-500">Status</th>
                <th className="p-4 text-left font-semibold text-gray-500">Join Date</th>
                <th className="p-4 text-left font-semibold text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-5">
                    No employees found
                  </td>
                </tr>
              ) : (
                employees.map((emp, index) => {
                  const name = getDisplayName(emp);
                  return (
                    <tr key={emp._id || index}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full text-white font-semibold flex items-center justify-center text-sm flex-shrink-0"
                            style={{ backgroundColor: getRandomColor(index) }}
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
                            <div className="text-sm text-gray-500">{getJobTitle(emp)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle">{getDepartment(emp)}</td>
                      <td className="p-4 align-middle">{getJobTitle(emp)}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-block py-1.5 px-3 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {emp.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle">{getJoinDate(emp)}</td>
                      <td className="p-4 align-middle">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/candidate/${emp._id}`)}
                            className="bg-blue-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-blue-600 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp._id, name)}
                            className="bg-red-500 text-white py-1.5 px-2.5 text-xs rounded-md hover:bg-red-600 transition-colors"
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
        </div>
      </div>

      {/* Pagination Controls */}
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
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'} hover:bg-gray-300`}
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
