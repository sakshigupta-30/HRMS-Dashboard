import React, { useState } from "react";
import axios from "axios";
import "./AddEmployee.css";

const AddEmployee = ({
  onSuccess = () => {},
  onClose = () => window.history.back(),
}) => {
  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      gender: "",
      phone: "",
    },
    professionalDetails: {
      designation: "",
      department: "",
      dateOfJoining: "",
      agency: "",
      salary: {
        basic: "",
        hra: "",
        retention: "",
        otherAllowances: "",
        actualSalary: "",
      },
    },
    client: {
      name: "",
      location: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Deep update of nested formData based on dot notation keys in name attribute
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const keys = name.split(".");
      let nested = { ...prev };
      let current = nested;
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return nested;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Prepare payload exactly matching backend model
    const newEmployee = {
      isEmployee: true,
      status: "Selected",
      client: formData.client,
      personalDetails: formData.personalDetails,
      professionalDetails: formData.professionalDetails,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/candidates`,
        newEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error||"Failed to add employee. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Add Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Details */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="personalDetails.firstName"
            placeholder="First Name"
            value={formData.personalDetails.firstName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="personalDetails.lastName"
            placeholder="Last Name"
            value={formData.personalDetails.lastName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        <select
          name="personalDetails.gender"
          value={formData.personalDetails.gender}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="tel"
          name="personalDetails.phone"
          placeholder="Phone Number"
          value={formData.personalDetails.phone}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        {/* Professional Details */}
        <select
          name="professionalDetails.designation"
          value={formData.professionalDetails.designation}
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
          type="text"
          name="professionalDetails.department"
          placeholder="Department"
          value={formData.professionalDetails.department}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          name="professionalDetails.agency"
          placeholder="Agency Name"
          value={formData.professionalDetails.agency}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <input
          type="date"
          name="professionalDetails.dateOfJoining"
          value={formData.professionalDetails.dateOfJoining}
          onChange={handleChange}
          required
          className="border p-2 rounded w-full"
        />

        {/* Client Details */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="client.name"
            placeholder="Client Name"
            value={formData.client.name}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="client.location"
            placeholder="Client Location"
            value={formData.client.location}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        {/* Salary Details */}
        <h3 className="text-lg font-medium mb-2 mt-4">Salary Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="professionalDetails.salary.basic"
            placeholder="Basic Salary"
            value={formData.professionalDetails.salary.basic}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="professionalDetails.salary.hra"
            placeholder="HRA"
            value={formData.professionalDetails.salary.hra}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="professionalDetails.salary.retention"
            placeholder="Retention"
            value={formData.professionalDetails.salary.retention}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="professionalDetails.salary.otherAllowances"
            placeholder="Other Allowances"
            value={formData.professionalDetails.salary.otherAllowances}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="professionalDetails.salary.actualSalary"
            placeholder="Actual Salary"
            value={formData.professionalDetails.salary.actualSalary}
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
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
