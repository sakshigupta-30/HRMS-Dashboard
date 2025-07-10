import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payroll = () => {
  const [candidates, setCandidates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('https://hrms-backend-50gj.onrender.com/api/candidates', {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
    });

        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  const handleClick = (id) => {
    navigate(`/payroll/${id}`);
  };

  return (
    <div className="payroll-page">
      <h2>Payroll & Expenses</h2>
      <ul className="candidate-list">
        {candidates.map(candidate => (
          <li 
            key={candidate._id} 
            className="candidate-item"
            onClick={() => handleClick(candidate._id)}
            style={{ 
              padding: '1rem',
              margin: '0.5rem 0',
              background: '#fff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <strong>{candidate.personalDetails.firstName} {candidate.personalDetails.lastName}</strong><br />
            <small>{candidate.personalDetails.email}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Payroll;
