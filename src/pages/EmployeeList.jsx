import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

const EmployeeList = () => {
  const { candidates, loading, refreshCandidates } = useCandidateContext();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const employees = candidates.filter(c => c.status === 'Selected');

  const handleDeleteEmployee = async (employeeId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        await candidateAPI.deleteCandidate(employeeId);
        await refreshCandidates();
        alert('Employee deleted successfully!');
      } catch (error) {
        console.error('Error deleting employee:', error);
        alert('Failed to delete employee. Please try again.');
      }
    }
  };

  // Helper functions remain the same
  const getDisplayName = (emp) => `${emp.personalDetails?.firstName || ''} ${emp.personalDetails?.lastName || ''}`.trim() || 'Unknown';
  const getInitials = (name) => name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  const getRandomColor = (index) => ['#60A5FA', '#FBBF24', '#34D399', '#EC4899', '#A78BFA', '#F87171', '#6EE7B7'][index % 7];
  const getDepartment = (emp) => emp.professionalDetails?.department || 'N/A';
  const getJobTitle = (emp) => emp.professionalDetails?.currentJobTitle || 'N/A';
  const getJoinDate = (emp) => emp.professionalDetails?.availableFrom ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString() : 'N/A';

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
                  <td colSpan="6" className="text-center p-5">No employees found</td>
                </tr>
              ) : (
                employees.map((emp, index) => {
                  const name = getDisplayName(emp);
                  return (
                    <tr key={emp._id || index}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-full text-white font-semibold flex items-center justify-center text-sm"
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
    </div>
  );
};

export default EmployeeList;