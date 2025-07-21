import React, { useState } from 'react';
import axios from 'axios';
import './AddEmployee.css';

const AddEmployee = ({ 
  onSuccess = () => {}, 
  onClose = () => window.history.back() 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    
    designation: '',
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
        
        designation: formData.designation,
        availableFrom: formData.availableFrom
      }
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${import.meta.env.VITE_API_URL}/candidates`,
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
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

<select
  name="designation"
  value={formData.designation}
  onChange={handleChange}
  required
  className="border p-2 rounded w-full"
>
  <option value="">Select Designation</option>
        <option value="Picker&Packar">Picker&Packar</option>
        <option value="SG">SG</option>
        <option value="HK">HK</option>
      </select>

        <input
          type="date"
          name="availableFrom"
          value={formData.availableFrom}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="clientLocation"
            placeholder="Client Location"
            value={formData.clientLocation}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;