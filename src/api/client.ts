
import axios from 'axios';

// Development vs Production API URL
// In production (cPanel), the API is served from the same domain under /api
const API_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Auth headers
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized here if needed
    if (error.response?.status === 401) {
       // Optional: Redirect to login or clear local state
       // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
