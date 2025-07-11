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
  withCredentials: true,
  timeout: 30000 // Increased timeout for slower responses
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

// Enhanced response interceptor with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting (429) and network errors with retry
    if (
      (error.response?.status === 429 || !error.response) && 
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      
      // Wait before retrying (exponential backoff)
      const delay = error.response?.status === 429 ? 5000 : 3000;
      console.log(`Retrying request in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      
      try {
        return await api.request(originalRequest);
      } catch (retryError) {
        console.error('Retry failed:', retryError.message);
        return Promise.reject(retryError);
      }
    }

    // Handle network errors (including CORS)
    if (!error.response) {
      console.error('Network Error:', error.message);
      if (error.message.includes('CORS')) {
        console.error('CORS Error detected. Check if backend is running and CORS is configured.');
      }
      return Promise.reject(error);
    }
    
    // Handle authentication errors - but only for protected routes, not login attempts
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Authentication error - token may be expired');
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Helper function for making requests with custom retry logic
const makeRequestWithRetry = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait longer for each retry
      const delay = (i + 1) * 2000;
      console.log(`Request failed, retrying in ${delay}ms... (${i + 1}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Auth API calls with retry logic
export const authAPI = {
  login: async (credentials) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    });
  },
  
  register: async (userData) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    });
  },
};

// Candidate API calls with retry logic
export const candidateAPI = {
  getAllCandidates: async () => {
    return await makeRequestWithRetry(async () => {
      const response = await api.get('/candidates');
      return response.data;
    });
  },
  
  getCandidateById: async (id) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.get(`/candidates/${id}`);
      return response.data;
    });
  },
  
  addCandidate: async (candidateData) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.post('/candidates', candidateData);
      return response.data;
    });
  },
  
  updateCandidate: async (id, candidateData) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.put(`/candidates/${id}`, candidateData);
      return response.data;
    });
  },
  
  deleteCandidate: async (id) => {
    return await makeRequestWithRetry(async () => {
      const response = await api.delete(`/candidates/${id}`);
      return response.data;
    });
  },
};

export default api;