import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeList.css';



const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/candidates'); // your API endpoint
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  fetchEmployees();
}, []);

  const filteredEmployees = employees.filter(emp => {
    return (
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (departmentFilter ? emp.department === departmentFilter : true) &&
      (statusFilter ? emp.status === statusFilter : true)
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
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <select onChange={e => setDepartmentFilter(e.target.value)}>
          <option value="">Department</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="Engineering">Engineering</option>
          <option value="Human Resources">Human Resources</option>
          <option value="Finance">Finance</option>
        </select>
        <select onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
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
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>
                <div className="employee-name">
                  <img src={emp.avatar} alt={emp.name} />
                  <span>{emp.name}</span>
                </div>
              </td>
              <td>{emp.id}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>
                <span className={`status-badge ${emp.status.toLowerCase()}`}>
                  {emp.status}
                </span>
              </td>
              <td>{emp.hireDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
