import React, { useState } from 'react';
import axios from 'axios';
import './AddCandidateForm.css'; // Reuse this CSS

const AddEmployee = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    currentJobTitle: '',
    availableFrom: '',
    clientName: '',
    clientLocation: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const newEmployee = {
      status: 'Selected',
      client: {
        name: formData.clientName || 'No client assigned',
        location: formData.clientLocation || ''
      },
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
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/v1/candidates`,
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError('Failed to add employee. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-page">
      <div className="form-header-section">
        <div className="form-header">
          <h2>Add Employee</h2>
          <button className="close-button" onClick={onClose}>✕</button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Employee Details</h3>
          <div className="form-grid">
            <div>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Current Job Title</label>
              <input
                type="text"
                name="currentJobTitle"
                value={formData.currentJobTitle}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Available From</label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Client Name</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Client Location</label>
              <input
                type="text"
                name="clientLocation"
                value={formData.clientLocation}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {error && <p className="form-error">{error}</p>}

        <div className="form-footer">
          <button type="button" className="secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
