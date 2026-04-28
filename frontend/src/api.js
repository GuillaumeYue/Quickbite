import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const api = axios.create({
  baseURL: baseURL + '/api'
});

api.interceptors.request.use(function(config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default api;
export { baseURL };
