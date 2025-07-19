import axios from 'axios';



const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hrms-backend-50gj.onrender.com/api';



const api = axios.create({

  baseURL: API_BASE_URL,

  headers: { 

    'Content-Type': 'application/json',

    'Accept': 'application/json'

  },

  timeout: 60000 

});



console.log('API Base URL:', API_BASE_URL);



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



export const authAPI = {

  login: async (credentials) => {

    const response = await api.post('/auth/login', credentials);

    return response.data;

  },

  // ... other auth calls

};



export const candidateAPI = {

  // ✅ UPDATED THIS FUNCTION

  getAllCandidates: async (page = 1) => {

    // Now requests a specific page with a limit of 20

    const response = await api.get(`/candidates?page=${page}&limit=20`);

    return response.data;

  },

  // --- NO CHANGES to other functions ---

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