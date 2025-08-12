import axios from 'axios';
let API_BASE_URL;
if (window.location.hostname === "localhost") {
  API_BASE_URL = "http://localhost:5000/api"
} 
else {
  API_BASE_URL = "https://hrms-backend-50gj.onrender.com/api";
}
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
});

// Request interceptor for token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      console.warn('Authentication error - token may be expired. Logging out.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('isLoggedIn');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Candidate APIs
export const candidateAPI = {
  // Now supports flexible pagination, filtering, and search.
  getAllCandidates: async ({
    page = 1,
    limit = 20,
    isEmployee,
    ...restFilters
  } = {}) => {
    const params = { page, limit, ...restFilters };
    if (typeof isEmployee !== 'undefined') params.isEmployee = isEmployee;
    const response = await api.get('/candidates', { params });
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
    try {
      const response = await api.delete(`/candidates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete Candidate API Error:', error?.response?.data || error.message);
      throw error;
    }
  },

  bulkUploadCandidates: async (formData) => {
    const response = await api.post('/candidates/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Salary Summary APIs
export const salarySummaryAPI = {
  saveSalarySummary: async (employeeCode, month, salaryDetails) => {
    const response = await api.post('/salarysummary', {
      employeeCode,
      month,
      salaryDetails
    });
    return response.data;
  },

  getSalarySummary: async (employeeCode, month) => {
    const response = await api.get('/salarysummary', {
      params: { employeeCode, month }
    });
    return response.data;
  },
};


export default api; 