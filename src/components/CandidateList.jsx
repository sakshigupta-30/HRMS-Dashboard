import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CandidateList.css';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

const CandidateList = () => {
  const { candidates, loading, refreshCandidates } = useCandidateContext();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (window.confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
      try {
        await candidateAPI.deleteCandidate(candidateId);
        // Refresh the candidate list and count
        await refreshCandidates();
        alert('Candidate deleted successfully!');
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('Failed to delete candidate. Please try again.');
      }
    }
  };

  const getDisplayName = (candidate) => {
    const firstName = candidate.personalDetails?.firstName || '';
    const lastName = candidate.personalDetails?.lastName || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown';
  };

  const getJobTitle = (candidate) => {
    return candidate.professionalDetails?.currentJobTitle || 'N/A';
  };

  const getDepartment = (candidate) => {
    return candidate.professionalDetails?.department || 'N/A';
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  };

  const getRandomColor = (index) => {
    const colors = ['#60A5FA', '#FBBF24', '#34D399', '#EC4899', '#A78BFA', '#F87171', '#6EE7B7'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="candidate-list-container">
        <h3>Candidate List</h3>
        <p>Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="candidate-list-container">
        <h3>Candidate List</h3>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }
  return (
    <div className="candidate-list-container">
      <h3>Candidate List</h3>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                No candidates found
              </td>
            </tr>
          ) : (
            candidates.map((candidate, index) => {
              const name = getDisplayName(candidate);
              const jobTitle = getJobTitle(candidate);
              const department = getDepartment(candidate);
              
              return (
                <tr key={candidate._id || index}>
                  <td className="candidate-info">
                    <span className="avatar" style={{ backgroundColor: getRandomColor(index) }}>
                      {getInitials(name)}
                    </span>
                    <div className="details">
                      <strong 
                        style={{ cursor: 'pointer', color: '#007bff' }} 
                        onClick={() => navigate(`/candidate/${candidate._id}`)}
                      >
                        {name}
                      </strong>
                      <span className="role">{jobTitle}</span>
                    </div>
                  </td>
                  <td>{department}</td>
                  <td>
                    <span 
                      className="status-badge" 
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: 
                          candidate.status === 'Applied' ? '#e3f2fd' :
                          candidate.status === 'Draft' ? '#fff3e0' :
                          candidate.status === 'Interview' ? '#f3e5f5' :
                          candidate.status === 'Selected' ? '#e8f5e8' :
                          candidate.status === 'Rejected' ? '#ffebee' : '#f5f5f5',
                        color:
                          candidate.status === 'Applied' ? '#1976d2' :
                          candidate.status === 'Draft' ? '#f57c00' :
                          candidate.status === 'Interview' ? '#7b1fa2' :
                          candidate.status === 'Selected' ? '#388e3c' :
                          candidate.status === 'Rejected' ? '#d32f2f' : '#666'
                      }}
                    >
                      {candidate.status || 'Applied'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => navigate(`/candidate/${candidate._id}`)}
                        style={{
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleDeleteCandidate(candidate._id, name)}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#f44336'}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;
