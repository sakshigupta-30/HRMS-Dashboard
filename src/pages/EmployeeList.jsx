import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';
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

  const getDisplayName = (emp) => {
    const firstName = emp.personalDetails?.firstName || '';
    const lastName = emp.personalDetails?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = ['#60A5FA', '#FBBF24', '#34D399', '#EC4899', '#A78BFA', '#F87171', '#6EE7B7'];
    return colors[index % colors.length];
  };

  const getDepartment = (emp) => emp.professionalDetails?.department || 'N/A';
  const getJobTitle = (emp) => emp.professionalDetails?.currentJobTitle || 'N/A';
  const getJoinDate = (emp) =>
    emp.professionalDetails?.availableFrom
      ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString()
      : 'N/A';

  if (loading) {
    return (
      <div className="employee-container">
        <h3>Employee Database</h3>
        <p>Loading employees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="employee-container">
        <h3>Employee Database</h3>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h3>Employee Database</h3>
        <button 
          className="add-button" 
          onClick={() => navigate('/add-employee')}
        >
          + Add Employee
        </button>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((emp, index) => {
              const name = getDisplayName(emp);
              const department = getDepartment(emp);
              const jobTitle = getJobTitle(emp);
              const status = emp.status;
              const joinDate = getJoinDate(emp);

              return (
                <tr key={emp._id || index}>
                  <td className="employee-info">
                    <span className="avatar" style={{ backgroundColor: getRandomColor(index) }}>
                      {getInitials(name)}
                    </span>
                    <div className="details">
                      <strong 
                        style={{ cursor: 'pointer', color: '#007bff' }} 
                        onClick={() => navigate(`/candidate/${emp._id}`)}
                      >
                        {name}
                      </strong>
                      <span className="role">{jobTitle}</span>
                    </div>
                  </td>
                  <td>{department}</td>
                  <td>{jobTitle}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: '#e8f5e8',
                        color: '#388e3c'
                      }}
                    >
                      {status}
                    </span>
                  </td>
                  <td>{joinDate}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/candidate/${emp._id}`)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteEmployee(emp._id, name)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
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
  );
};

export default EmployeeList;
