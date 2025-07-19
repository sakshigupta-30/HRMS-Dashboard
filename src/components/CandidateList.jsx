import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { candidateAPI } from '../services/api';
import { useCandidateContext } from '../context/CandidateContext';

// Helper object for status badge styling
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
  const navigate = useNavigate();

  // Your existing state and helper functions (handleDelete, getDisplayName, etc.) remain unchanged.
  // [NOTE: Your logic functions are omitted for brevity but should be kept in your file.]

  if (loading) return <div className="p-4">Loading candidates...</div>;

  return (
    <div className="bg-white rounded-lg">
      <h3 className="text-xl font-bold p-4">Candidate List</h3>
      <div className="overflow-x-auto">
        {/* The main changes are in this table element and its children */}
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-slate-200">
            <tr>
              <th className="p-4 font-medium text-slate-500 w-[40%]">Candidate</th>
              <th className="p-4 font-medium text-slate-500 w-[20%]">Department</th>
              <th className="p-4 font-medium text-slate-500 w-[20%]">Status</th>
              <th className="p-4 font-medium text-slate-500 w-[20%]">Actions</th>
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
                
                return (
                  <tr key={candidate._id || index}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-[35px] h-[35px] rounded-full text-white font-bold flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: getRandomColor(index) }}
                        >
                          {getInitials(name)}
                        </div>
                        <div className="min-w-0"> {/* Wrapper to allow truncation */}
                          <strong 
                            className="block truncate cursor-pointer text-blue-600 hover:underline"
                            onClick={() => navigate(`/candidate/${candidate._id}`)}
                          >
                            {name}
                          </strong>
                          <div className="truncate text-sm text-slate-500">{jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 align-middle truncate">{getDepartment(candidate)}</td>
                    <td className="p-4 align-middle">
                      <span 
                        className={`inline-block whitespace-nowrap px-2 py-1 rounded-full text-xs font-bold ${statusStyles[candidate.status] || statusStyles.default}`}
                      >
                        {candidate.status || 'Applied'}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => navigate(`/candidate/${candidate._id}`)}
                          className="bg-blue-500 text-white px-3 py-2 text-xs rounded-md hover:bg-blue-600 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleDeleteCandidate(candidate._id, name)}
                          className="bg-red-500 text-white px-3 py-2 text-xs rounded-md hover:bg-red-600 transition-colors"
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