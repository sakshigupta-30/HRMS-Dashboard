import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddCandidate.css';
import CandidateDetails from '../components/AddCandidates/CandidateDetails';
import AddressSection from '../components/AddCandidates/AddressSection';
import ProfessionalDetails from '../components/AddCandidates/ProfessionalDetails';
import EducationSection from '../components/AddCandidates/EducationSection';
import ExperienceSection from '../components/AddCandidates/ExperienceSection';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

const AddCandidate = () => {
  const navigate = useNavigate();
  const { refreshCandidates } = useCandidateContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    personalDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: '',
      nationality: 'Indian',
      uanNumber: '',
      officialEmail: '',
      aadhaarNumber: '',
      panNumber: ''
    },
    address: {
      present: {
        address1: '',
        address2: '',
        city: '',
        postalCode: '',
        country: '',
        state: ''
      },
      permanent: {
        address1: '',
        address2: '',
        city: '',
        postalCode: '',
        country: '',
        state: ''
      },
      sameAsPresent: false
    },
    professionalDetails: {
      experience: '',
      location: '',
      sourceOfHire: '',
      title: '',
      skillSet: '',
      currentSalary: '',
      highestQualification: '',
      department: '',
      additionalInformation: '',
      tentativeJoiningDate: ''
    },
    education: [{
      schoolName: '',
      degree: '',
      fieldOfStudy: '',
      dateOfCompletion: '',
      additionalNotes: ''
    }],
    experience: [{
      occupation: '',
      company: '',
      summary: '',
      duration: '',
      currentlyWorkHere: false
    }]
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const validateForm = () => {
    const { personalDetails } = formData;
    if (!personalDetails.firstName || !personalDetails.lastName || !personalDetails.email) {
      setError('Please fill in required fields: First Name, Last Name, Email');
      return false;
    }
    return true;
  };

  const prepareDataForBackend = (isDraft = false) => {
    const getValue = (value, defaultValue = null) => {
      if (isDraft) return value || null;
      return value || defaultValue;
    };

    const backendData = {
      personalDetails: {
        firstName: getValue(formData.personalDetails.firstName),
        lastName: getValue(formData.personalDetails.lastName),
        email: getValue(formData.personalDetails.email),
        phone: getValue(formData.personalDetails.phone),
        dateOfBirth: getValue(formData.personalDetails.dateOfBirth),
        gender: getValue(formData.personalDetails.gender),
        nationality: getValue(formData.personalDetails.nationality, 'Indian')
      },
      address: {
        street: isDraft
          ? getValue(formData.address.present.address1 + ' ' + formData.address.present.address2)
          : (formData.address.present.address1 + ' ' + formData.address.present.address2) || 'Not specified',
        city: getValue(formData.address.present.city, 'Not specified'),
        state: getValue(formData.address.present.state, 'Not specified'),
        country: getValue(formData.address.present.country, 'India'),
        zipCode: getValue(formData.address.present.postalCode, '000000')
      },
      professionalDetails: {
        designation: getValue(formData.professionalDetails.designation, null), // FIXED HERE
        department: getValue(formData.professionalDetails.department, null),
        expectedSalary: formData.professionalDetails.currentSalary ? parseInt(formData.professionalDetails.currentSalary) : (isDraft ? null : 0),
        currentSalary: formData.professionalDetails.currentSalary ? parseInt(formData.professionalDetails.currentSalary) : (isDraft ? null : 0),
        availableFrom: getValue(formData.professionalDetails.tentativeJoiningDate, new Date().toISOString().split('T')[0]),
        employmentType: 'Full-time',
        skills: formData.professionalDetails.skillSet
          ? formData.professionalDetails.skillSet.split(',').map(s => s.trim())
          : []
      },
      education: isDraft
        ? formData.education.map(edu => ({
            degree: getValue(edu.degree),
            institution: getValue(edu.schoolName),
            fieldOfStudy: getValue(edu.fieldOfStudy),
            startDate: '',
            endDate: getValue(edu.dateOfCompletion),
            grade: '',
            isCompleted: false
          }))
        : formData.education.filter(edu => edu.schoolName || edu.degree).map(edu => ({
            degree: edu.degree || '',
            institution: edu.schoolName || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            startDate: '',
            endDate: edu.dateOfCompletion || '',
            grade: '',
            isCompleted: true
          })),
      experience: isDraft
        ? formData.experience.map(exp => ({
            company: getValue(exp.company),
            position: getValue(exp.occupation),
            startDate: '',
            endDate: '',
            isCurrentJob: exp.currentlyWorkHere || false,
            description: getValue(exp.summary)
          }))
        : formData.experience.filter(exp => exp.company || exp.occupation).map(exp => ({
            company: exp.company || '',
            position: exp.occupation || '',
            startDate: '',
            endDate: '',
            isCurrentJob: exp.currentlyWorkHere || false,
            description: exp.summary || ''
          })),
      status: isDraft ? 'Draft' : 'Applied'
    };

    return backendData;
  };

  const handleSubmit = async (submitAndNew = false) => {
    setError('');
    setSuccess('');
    if (!validateForm()) return;

    setLoading(true);

    try {
      const backendData = prepareDataForBackend();
      await candidateAPI.addCandidate(backendData);
      await refreshCandidates();
      setSuccess('Candidate added successfully!');
      setTimeout(() => {
        submitAndNew ? window.location.reload() : navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError(error.response?.data?.error || 'Failed to add candidate');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const backendData = prepareDataForBackend(true);
      await candidateAPI.addCandidate(backendData);
      await refreshCandidates();
      setSuccess('Draft saved successfully!');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setError(error.response?.data?.error || 'Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-candidate-page">
      <div className="form-section form-header-section">
        <div className="form-header">
          <h2>Add Candidate</h2>
          <button className="close-button" onClick={() => navigate('/')}>&times;</button>
        </div>
      </div>

      {error && <div className="error-message" style={{ color: 'red', margin: '1rem', padding: '1rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}
      {success && <div className="success-message" style={{ color: 'green', margin: '1rem', padding: '1rem', backgroundColor: '#e6ffe6', borderRadius: '4px' }}>{success}</div>}

      <CandidateDetails
        data={formData.personalDetails}
        updateData={(data) => updateFormData('personalDetails', data)}
      />
      <AddressSection
        data={formData.address}
        updateData={(data) => updateFormData('address', data)}
      />
      <ProfessionalDetails
        data={formData.professionalDetails}
        updateData={(data) => updateFormData('professionalDetails', data)}
      />
      <EducationSection
        data={formData.education}
        updateData={(data) => updateFormData('education', data)}
      />
      <ExperienceSection
        data={formData.experience}
        updateData={(data) => updateFormData('experience', data)}
      />

      <div className="form-footer">
        <button className="primary" onClick={() => handleSubmit(false)} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        <button className="primary" onClick={() => handleSubmit(true)} disabled={loading}>
          Submit and New
        </button>
        <button className="secondary" onClick={handleSaveDraft} disabled={loading}>
          Save Draft
        </button>
        <button className="secondary" onClick={() => navigate('/')} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddCandidate;
