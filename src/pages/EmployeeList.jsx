import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

axios.defaults.baseURL = 'https://hrms-backend-50gj.onrender.com/api';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/candidates/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.personalDetails?.firstName || ''} ${emp.personalDetails?.lastName || ''}`;
    const department = emp.professionalDetails?.department || '';
    const status = emp.status || '';

    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter ? department === departmentFilter : true) &&
      (statusFilter ? status === statusFilter : true)
    );
  });

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2>Employee Database</h2>
        <button className="add-btn" onClick={() => navigate('/add-candidate')}>
          Add Employee
        </button>
      </div>

      <div className="employee-filters">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setDepartmentFilter(e.target.value)} value={departmentFilter}>
          <option value="">Department</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Finance">Finance</option>
        </select>
        <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
          <option value="">All Status</option>
          <option value="Selected">Selected</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
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
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp, index) => {
            const empId = `EMP${String(index + 1).padStart(3, '0')}`;
            return (
              <tr key={emp._id}>
                <td>
                  <div className="employee-name">
                    <img
                      src={emp.avatar || '/default-avatar.png'}
                      alt={`${emp.personalDetails?.firstName || ''} ${emp.personalDetails?.lastName || ''}`}
                    />
                    <span>
                      {emp.personalDetails?.firstName || ''} {emp.personalDetails?.lastName || ''}
                    </span>
                  </div>
                </td>
                <td>{empId}</td>
                <td>{emp.professionalDetails?.department || '—'}</td>
                <td>{emp.professionalDetails?.currentJobTitle || '—'}</td>
                <td>
                  <span className={`status-badge ${emp.status?.toLowerCase() || 'unknown'}`}>
                    {emp.status || 'Unknown'}
                  </span>
                </td>
                <td>
                  {emp.professionalDetails?.availableFrom
                    ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
