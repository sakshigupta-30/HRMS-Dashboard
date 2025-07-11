import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';
import './AddEmployee.css';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    currentJobTitle: '',
    availableFrom: '',
  });

  const navigate = useNavigate();
  const { refreshCandidates } = useCandidateContext();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      status: 'Selected',
      personalDetails: {
        firstName: formData.firstName,
        lastName: formData.lastName
      },
      professionalDetails: {
        department: formData.department,
        currentJobTitle: formData.currentJobTitle,
        availableFrom: formData.availableFrom
      }
    };

    try {
      await candidateAPI.addCandidate(newEmployee);
      await refreshCandidates();
      alert('Employee added successfully!');
      navigate('/employees');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h3>Add New Employee</h3>
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        <input name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
        <input name="currentJobTitle" placeholder="Job Title" value={formData.currentJobTitle} onChange={handleChange} required />
        <input type="date" name="availableFrom" value={formData.availableFrom} onChange={handleChange} required />
        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
