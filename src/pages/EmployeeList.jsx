import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeList.css';

axios.defaults.baseURL = 'https://hrms-backend-50gj.onrender.com/api';

const EmployeeList = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    department: '',
    jobTitle: '',
    availableFrom: '',
  });

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/candidates/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/candidates',
        {
          personalDetails: {
            firstName: newEmployee.firstName,
            lastName: newEmployee.lastName,
          },
          professionalDetails: {
            department: newEmployee.department,
            currentJobTitle: newEmployee.jobTitle,
            availableFrom: newEmployee.availableFrom,
          },
          status: 'Selected', // ensures they become employee
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFormVisible(false);
      setNewEmployee({ firstName: '', lastName: '', department: '', jobTitle: '', availableFrom: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  return (
    <div className="employee-container">
      <div className="employee-header">
        <h2>Employee Database</h2>
        <button className="add-btn" onClick={() => setFormVisible(!formVisible)}>
          {formVisible ? 'Close Form' : 'Add Employee'}
        </button>
      </div>

      {formVisible && (
        <form className="employee-form" onSubmit={handleAddEmployee}>
          <input type="text" name="firstName" placeholder="First Name" value={newEmployee.firstName} onChange={handleInputChange} required />
          <input type="text" name="lastName" placeholder="Last Name" value={newEmployee.lastName} onChange={handleInputChange} required />
          <input type="text" name="department" placeholder="Department" value={newEmployee.department} onChange={handleInputChange} required />
          <input type="text" name="jobTitle" placeholder="Job Title" value={newEmployee.jobTitle} onChange={handleInputChange} required />
          <input type="date" name="availableFrom" value={newEmployee.availableFrom} onChange={handleInputChange} required />
          <button type="submit">Submit</button>
        </form>
      )}

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Emp ID</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr key={emp._id}>
              <td>{emp.personalDetails?.firstName} {emp.personalDetails?.lastName}</td>
              <td>{emp.empId || `EMP${String(index + 1).padStart(3, '0')}`}</td>
              <td>{emp.professionalDetails?.department || '-'}</td>
              <td>{emp.professionalDetails?.currentJobTitle || '-'}</td>
              <td>{emp.status || '-'}</td>
              <td>{emp.professionalDetails?.availableFrom ? new Date(emp.professionalDetails.availableFrom).toLocaleDateString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
