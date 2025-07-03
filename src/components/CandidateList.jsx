import React from 'react';
import './CandidateList.css';

const candidates = [
  { name: 'Ananya Desai', role: 'Frontend Developer', industry: 'Software', color: '#60A5FA' },
  { name: 'Kabir Malhotra', role: 'Chartered Accountant', industry: 'Finance', color: '#FBBF24' },
  { name: 'Sneha Iyer', role: 'Sales Manager', industry: 'Sales', color: '#34D399' },
  { name: 'Rohan Kapoor', role: 'Digital Marketer', industry: 'Marketing', color: '#EC4899' },
  { name: 'Tanvi Bansal', role: 'HR Executive', industry: 'Human Resources', color: '#A78BFA' }
];

const CandidateList = () => {
  return (
    <div className="candidate-list-container">
      <h3>Candidate List</h3>
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, index) => (
            <tr key={index}>
              <td className="candidate-info">
                <span className="avatar" style={{ backgroundColor: c.color }}>
                  {c.name.charAt(0)}
                </span>
                <div className="details">
                  <strong>{c.name}</strong>
                  <span className="role">{c.role}</span>
                </div>
              </td>
              <td>{c.industry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateList;
