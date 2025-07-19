import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

// Helper object for status badge styling. This is much cleaner than inline conditional styles.
const statusStyles = {
  Applied: 'bg-blue-100 text-blue-800',
  Draft: 'bg-amber-100 text-amber-800',
  Interview: 'bg-purple-100 text-purple-800',
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  default: 'bg-slate-100 text-slate-800',
};

const CandidateList = () => {
  const { candidates, loading, refreshCandidates } = useCandidateContext();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (window.confirm(`Are you sure you want to delete ${candidateName}? This action cannot be undone.`)) {
      try {
        await candidateAPI.deleteCandidate(candidateId);
        await refreshCandidates();
        alert('Candidate deleted successfully!');
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('Failed to delete candidate. Please try again.');
      }
    }
  };

  // Helper functions remain the same
  const getDisplayName = (candidate) => `${candidate.personalDetails?.firstName || ''} ${candidate.personalDetails?.lastName || ''}`.trim() || 'Unknown';
  const getJobTitle = (candidate) => candidate.professionalDetails?.currentJobTitle || 'N/A';
  const getDepartment = (candidate) => candidate.professionalDetails?.department || 'N/A';
  const getInitials = (name) => name.split(' ').map(n => n.charAt(0)).join('').toUpperCase();
  const getRandomColor = (index) => ['#60A5FA', '#FBBF24', '#34D399', '#EC4899', '#A78BFA', '#F87171', '#6EE7B7'][index % 7];

  if (loading) return <div className="p-4">Loading candidates...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <h3 className="text-xl font-bold p-4">Candidate List</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium text-slate-500">Candidate</th>
              <th className="p-4 font-medium text-slate-500">Department</th>
              <th className="p-4 font-medium text-slate-500">Status</th>
              <th className="p-4 font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center p-5">No candidates found</td>
              </tr>
            ) : (
              candidates.map((candidate, index) => {
                const name = getDisplayName(candidate);
                const jobTitle = getJobTitle(candidate);
                const department = getDepartment(candidate);
                
                return (
                  <tr key={candidate._id || index}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-[35px] h-[35px] rounded-full text-white font-bold flex items-center justify-center" 
                          style={{ backgroundColor: getRandomColor(index) }}
                        >
                          {getInitials(name)}
                        </div>
                        <div>
                          <strong 
                            className="cursor-pointer text-blue-600 hover:underline"
                            onClick={() => navigate(`/candidate/${candidate._id}`)}
                          >
                            {name}
                          </strong>
                          <div className="text-sm text-slate-500">{jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle">{department}</td>
                    <td className="p-4 align-middle">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyles[candidate.status] || statusStyles.default}`}
                      >
                        {candidate.status || 'Applied'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/candidate/${candidate._id}`)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteCandidate(candidate._id, name)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-xs hover:bg-red-600 transition-colors"
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
    </div>
  );
};

export default CandidateList;