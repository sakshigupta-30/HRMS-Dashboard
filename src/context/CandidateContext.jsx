import React, { createContext, useContext, useState, useEffect } from "react";
import { candidateAPI } from "../services/api";

export const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
  const [candidates, setCandidates] = useState([]);
  const [candidateCount, setCandidateCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // default false — don’t block render

  const fetchCandidates = async (currentPage = page) => {
    setLoading(true);
    try {
      const data = await candidateAPI.getAllCandidates(currentPage);
      setCandidates(data?.candidates || []);
      setCandidateCount(data?.totalCandidates || 0);
      setTotalPages(data?.totalPages || 1);
      setPage(currentPage);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <CandidateContext.Provider
      value={{
        candidates,
        candidateCount,
        page,
        totalPages,
        loading,
        setPage: fetchCandidates,
        refreshCandidates: () => fetchCandidates(page),
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidateContext = () => useContext(CandidateContext);
