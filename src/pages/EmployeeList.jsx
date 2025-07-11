import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

const EmployeeList = () => {
  const { candidates, loading, refreshCandidates } = useCandidateContext();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const employees = candidates.filter(
    (c) => c.status === 'Selected' &&
      getDisplayName(c).toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteEmployee = async (id, name) => {
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
      try {
        await candidateAPI.deleteCandidate(id);
        await refreshCandidates();
        alert('Employee deleted!');
      } catch {
        alert('Delete failed. Try again.');
      }
    }
  };

  const getDisplayName = (emp) =>
    `${emp.personalDetails?.firstName || ''} ${emp.personalDetails?.lastName || ''}`.trim();

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase();

  const getDepartment = (emp) => emp.professionalDetails?.department || 'N/A';
  const getJobTitle = (emp) => emp.professionalDetails?.currentJobTitle || 'N/A';
  const getJoinDate = (emp) =>
    emp.professionalDetails?.availableFrom
      ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2>Employee Database</h2>
        <button className="add-employee-btn" onClick={() => navigate('/candidate/add')}>
          Add Employee
        </button>
      </div>

      <div className="employee-filters">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select>
          <option>Department</option>
        </select>
        <select>
          <option>All Status</option>
        </select>
      </div>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Employee ID</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Date of Hire</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="7">Loading...</td></tr>
          ) : employees.length === 0 ? (
            <tr><td colSpan="7" style={{ textAlign: 'center' }}>No employees found</td></tr>
          ) : (
            employees.map((emp, index) => {
              const name = getDisplayName(emp);
              return (
                <tr key={emp._id}>
                  <td className="employee-name">
                    <div className="avatar" style={{ backgroundColor: '#60A5FA' }}>
                      {getInitials(name)}
                    </div>
                    <span>{name}</span>
                  </td>
                  <td>{emp.employeeId || `EMP${index + 1}`}</td>
                  <td>{getDepartment(emp)}</td>
                  <td>{getJobTitle(emp)}</td>
                  <td>
                    <span className="status-badge">Active</span>
                  </td>
                  <td>{getJoinDate(emp)}</td>
                  <td>
                    <button onClick={() => navigate(`/candidate/${emp._id}`)}>View</button>
                    <button onClick={() => handleDeleteEmployee(emp._id, name)}>Delete</button>
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
