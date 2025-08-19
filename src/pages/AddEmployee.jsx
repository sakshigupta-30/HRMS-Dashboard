import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateDetails from "../components/AddCandidates/CandidateDetails";
import AddressSection from "../components/AddCandidates/AddressSection";
import ProfessionalDetails from "../components/AddCandidates/ProfessionalDetails";
import EducationSection from "../components/AddCandidates/EducationSection";
import ExperienceSection from "../components/AddCandidates/ExperienceSection";
import SalarySection from "../components/AddCandidates/SalarySection";
import axios from "axios";
import "./AddEmployee.css";
import { candidateAPI } from "../services/api";
import { BankDetailsSection } from "../components/AddCandidates/BankSection";
import { ClientSection } from "../components/AddCandidates/ClientSection";

const AddEmployee = ({
  onSuccess = () => { },
  onClose = () => window.history.back(),
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      nationality: "Indian",
      uanNumber: "",
      officialEmail: "",
      aadhaarNumber: "",
      panNumber: "",
    },
    address: {
      present: {
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        country: "",
        state: "",
      },
      permanent: {
        address1: "",
        address2: "",
        city: "",
        postalCode: "",
        country: "",
        state: "",
      },
      sameAsPresent: false,
    },
    professionalDetails: {
      designation: "",
      department: "",
      experience: "",
      location: "",
      sourceOfHire: "",
      title: "",
      skillSet: "",
      currentSalary: "",
      highestQualification: "",
      additionalInformation: "",
      tentativeJoiningDate: "",
      agency: "",
      dateOfJoining: "",
    },
    salary: {
      basic: "",
      hra: "",
      retention: "",
      otherAllowances: "",
      actualSalary: "",
    },
    education: [
      {
        schoolName: "",
        degree: "",
        fieldOfStudy: "",
        dateOfCompletion: "",
        additionalNotes: "",
      },
    ],
    experience: [
      {
        occupation: "",
        company: "",
        summary: "",
        duration: "",
        currentlyWorkHere: false,
      },
    ],
    client: {
      name: "",
      location: "",
    },
  });

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const validateForm = () => {
    const { personalDetails } = formData;
    if (!personalDetails.firstName || !personalDetails.lastName || !personalDetails.email) {
      setError("Please fill in required fields: First Name, Last Name, Email");
      return false;
    }
    return true;
  };

  const prepareDataForBackend = () => {
    // Flatten and prepare the payload as per backend requirements
    return {
      isEmployee: true,
      status: "Selected",
      client: formData.client,
      personalDetails: formData.personalDetails,
      address: {
        street: formData.address.present.address1 + " " + formData.address.present.address2,
        city: formData.address.present.city,
        state: formData.address.present.state,
        country: formData.address.present.country,
        zipCode: formData.address.present.postalCode,
      },
      professionalDetails: {
        ...formData.professionalDetails,
        salary: formData.salary,
      },
      education: formData.education,
      experience: formData.experience,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const payload = prepareDataForBackend();
      await axios.post(
        `${import.meta.env.VITE_API_URL}/candidates`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccess("Employee added successfully!");
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add employee. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const [aadhaarCheck, setAadhaarCheck] = useState({
    checked: false,
    loading: false,
    error: "",
    exists: false,
  });

  // Aadhaar check logic moved here
  const handleAadhaarCheck = async (aadhaarNumber) => {
    setAadhaarCheck({ ...aadhaarCheck, loading: true, error: "", exists: false });
    try {
      const res = await candidateAPI.checkAadhar(aadhaarNumber);
      if (res.exists) {
        setAadhaarCheck({
          checked: true,
          loading: false,
          error: "Aadhaar already exists in the system.",
          exists: true,
        });
      } else {
        setAadhaarCheck({
          checked: true,
          loading: false,
          error: "",
          exists: false,
        });
      }
    } catch (err) {
      setAadhaarCheck({
        checked: true,
        loading: false,
        error: "Error checking Aadhaar. Please try again.",
        exists: false,
      });
    }
  };

  // Disable all fields except Aadhaar until Aadhaar is validated and unique
  const fieldsDisabled = !aadhaarCheck.checked || aadhaarCheck.exists;

  return (
    <div className="add-employee-page">
      <div className="form-section form-header-section">
        <div className="form-header">
          <h2>Add Employee</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <CandidateDetails
          data={formData.personalDetails}
          updateData={(data) => updateFormData("personalDetails", data)}
          aadhaarCheck={aadhaarCheck}
          handleAadhaarCheck={handleAadhaarCheck}
        />
        <AddressSection
          data={formData.address}
          updateData={(data) => updateFormData("address", data)}
          fieldsDisabled={fieldsDisabled}
        />
        <ProfessionalDetails
          data={formData.professionalDetails}
          updateData={(data) => updateFormData("professionalDetails", data)}
          fieldsDisabled={fieldsDisabled}
        />
        <BankDetailsSection
          data={formData}
          updateData={(data) => updateFormData("bankDetails", data)}
          fieldsDisabled={false}
        />

        <ClientSection
          data={formData}
          updateData={(data) => updateFormData("clientDetails", data)}
          fieldsDisabled={false}
        />
        <SalarySection
          data={formData.salary}
          updateData={(data) => updateFormData("salary", data)}
          fieldsDisabled={fieldsDisabled}
        />
        <EducationSection
          data={formData.education}
          updateData={(data) => updateFormData("education", data)}
          fieldsDisabled={fieldsDisabled}
        />
        <ExperienceSection
          data={formData.experience}
          updateData={(data) => updateFormData("experience", data)}
          fieldsDisabled={fieldsDisabled}
        />
        <div className="form-footer">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
          <button type="button" className="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;