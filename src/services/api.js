import axios from 'axios';

// Use environment variable if available, fallback to hardcoded URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hrms-backend-50gj.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Temporarily disable credentials for testing
  timeout: 10000 // 10 second timeout
});

// Log API base URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration and CORS errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors (including CORS)
    if (!error.response) {
      console.error('Network Error:', error.message);
      if (error.message.includes('CORS')) {
        console.error('CORS Error detected. Check if backend is running and CORS is configured.');
      }
      // Don't auto-logout on network errors
      return Promise.reject(error);
    }
    
    // Handle authentication errors - but only for actual API calls, not login attempts
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Authentication error - token may be expired');
      // Don't auto-logout immediately, let the auth context handle it
      // localStorage.removeItem('token');
      // sessionStorage.removeItem('isLoggedIn');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Candidate API calls
export const candidateAPI = {
  getAllCandidates: async () => {
    const response = await api.get('/candidates');
    return response.data;
  },
  
  getCandidateById: async (id) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
  
  addCandidate: async (candidateData) => {
    const response = await api.post('/candidates', candidateData);
    return response.data;
  },
  
  updateCandidate: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData);
    return response.data;
  },
  
  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`);
    return response.data;
  },
};

export default api;
