import React, { createContext, useContext, useState, useEffect } from 'react';
import { candidateAPI } from '../services/api';

const CandidateContext = createContext();

export const useCandidateContext = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidateContext must be used within a CandidateProvider');
  }
  return context;
};

export const CandidateProvider = ({ children }) => {
  const [candidateCount, setCandidateCount] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const data = await candidateAPI.getAllCandidates();
      setCandidates(data);
      setCandidateCount(data.length);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshCandidates = () => {
    fetchCandidates();
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const value = {
    candidateCount,
    candidates,
    loading,
    refreshCandidates,
    fetchCandidates
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};
