import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import './CandidateDetail.css';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCandidateDetails();
  }, [id]);

  const fetchCandidateDetails = async () => {
    try {
      setLoading(true);
      const data = await candidateAPI.getCandidateById(id);
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      setError('Failed to load candidate details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await candidateAPI.updateCandidate(id, { ...candidate, status: newStatus });
      setCandidate(prev => ({ ...prev, status: newStatus }));
      alert('Status updated successfully!');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      display: 'inline-block'
    };

    switch (status) {
      case 'Applied':
        return { ...baseStyle, backgroundColor: '#e3f2fd', color: '#1976d2' };
      case 'Draft':
        return { ...baseStyle, backgroundColor: '#fff3e0', color: '#f57c00' };
      case 'Interview':
        return { ...baseStyle, backgroundColor: '#f3e5f5', color: '#7b1fa2' };
      case 'Selected':
        return { ...baseStyle, backgroundColor: '#e8f5e8', color: '#388e3c' };
      case 'Rejected':
        return { ...baseStyle, backgroundColor: '#ffebee', color: '#d32f2f' };
      case 'Screening':
        return { ...baseStyle, backgroundColor: '#e1f5fe', color: '#0277bd' };
      case 'On Hold':
        return { ...baseStyle, backgroundColor: '#fafafa', color: '#616161' };
      default:
        return { ...baseStyle, backgroundColor: '#f5f5f5', color: '#666' };
    }
  };

  if (loading) {
    return (
      <div className="candidate-detail-container">
        <div className="loading">
          <h2>Loading candidate details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-detail-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="candidate-detail-container">
        <div className="error">
          <h2>Candidate not found</h2>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="candidate-detail-container">
      {/* Header */}
      <div className="detail-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Dashboard
        </button>
        <div className="candidate-header">
          <div className="candidate-avatar">
            {(candidate.personalDetails?.firstName?.charAt(0) || '') +
              (candidate.personalDetails?.lastName?.charAt(0) || '')}
          </div>
          <div className="candidate-basic-info">
            <h1>
              {candidate.personalDetails?.firstName} {candidate.personalDetails?.lastName}
            </h1>
            <p className="job-title">
              {candidate.professionalDetails?.currentJobTitle || 'No title specified'}
            </p>
            <span style={getStatusBadgeStyle(candidate.status)}>
              {candidate.status || 'Applied'}
            </span>
          </div>
        </div>
        <div className="action-buttons">
          <select
            value={candidate.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            className="status-dropdown"
          >
            <option value="Applied">Applied</option>
            <option value="Screening">Screening</option>
            <option value="Interview">Interview</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
            <option value="On Hold">On Hold</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="detail-content">
        {/* Personal Details */}
        <div className="detail-section">
          <h3>Personal Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Full Name:</label>
              <span>{candidate.personalDetails?.firstName} {candidate.personalDetails?.lastName}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{candidate.personalDetails?.email || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Phone:</label>
              <span>{candidate.personalDetails?.phone || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Date of Birth:</label>
              <span>{formatDate(candidate.personalDetails?.dateOfBirth)}</span>
            </div>
            <div className="detail-item">
              <label>Gender:</label>
              <span>{candidate.personalDetails?.gender || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Nationality:</label>
              <span>{candidate.personalDetails?.nationality || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="detail-section">
          <h3>Address Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Street:</label>
              <span>{candidate.address?.street || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>City:</label>
              <span>{candidate.address?.city || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>State:</label>
              <span>{candidate.address?.state || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Country:</label>
              <span>{candidate.address?.country || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Zip Code:</label>
              <span>{candidate.address?.zipCode || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="detail-section">
          <h3>Professional Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Job Title:</label>
              <span>{candidate.professionalDetails?.currentJobTitle || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Department:</label>
              <span>{candidate.professionalDetails?.department || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Employment Type:</label>
              <span>{candidate.professionalDetails?.employmentType || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Current Salary:</label>
              <span>
                {candidate.professionalDetails?.currentSalary
                  ? `₹${candidate.professionalDetails.currentSalary.toLocaleString()}`
                  : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <label>Expected Salary:</label>
              <span>
                {candidate.professionalDetails?.expectedSalary
                  ? `₹${candidate.professionalDetails.expectedSalary.toLocaleString()}`
                  : 'N/A'}
              </span>
            </div>
            <div className="detail-item">
              <label>Available From:</label>
              <span>{formatDate(candidate.professionalDetails?.availableFrom)}</span>
            </div>
            <div className="detail-item full-width">
              <label>Skills:</label>
              <div className="skills-container">
                {candidate.professionalDetails?.skills?.length > 0 ? (
                  candidate.professionalDetails.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))
                ) : (
                  <span>No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Education */}
        {candidate.education?.length > 0 && (
          <div className="detail-section">
            <h3>Education</h3>
            {candidate.education.map((edu, index) => (
              <div key={index} className="education-item">
                <h4>{edu.degree || 'Degree not specified'}</h4>
                <p><strong>Institution:</strong> {edu.institution || 'N/A'}</p>
                <p><strong>Field of Study:</strong> {edu.fieldOfStudy || 'N/A'}</p>
                <p><strong>End Date:</strong> {formatDate(edu.endDate)}</p>
                <p><strong>Grade:</strong> {edu.grade || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {candidate.experience?.length > 0 && (
          <div className="detail-section">
            <h3>Work Experience</h3>
            {candidate.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <h4>{exp.position || 'Position not specified'}</h4>
                <p><strong>Company:</strong> {exp.company || 'N/A'}</p>
                <p><strong>Duration:</strong> {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}</p>
                {exp.description && <p><strong>Description:</strong> {exp.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Application Info */}
        <div className="detail-section">
          <h3>Application Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Application Date:</label>
              <span>{formatDate(candidate.applicationDate)}</span>
            </div>
            <div className="detail-item">
              <label>Last Updated:</label>
              <span>{formatDate(candidate.lastUpdated || candidate.updatedAt)}</span>
            </div>
            {candidate.notes && (
              <div className="detail-item full-width">
                <label>Notes:</label>
                <span>{candidate.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* ✅ Client Assignment - Only for Employees */}
        {candidate.isEmployee && (
          <div className="detail-section">
            <h3>Client Assignment</h3>
            <div className="detail-item">
              <label>Client Details:</label>
              <span>
                {candidate.client
                  ? `${candidate.personalDetails?.firstName || 'This employee'} is working with ${candidate.client}`
                  : `No client assigned to ${candidate.personalDetails?.firstName || 'this employee'} till now.`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetail;
