import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('govcare_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('govcare_token');
      localStorage.removeItem('govcare_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;