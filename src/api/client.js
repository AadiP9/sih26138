import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const predictFuel = (data) => api.post('/predict', data);
export const optimizeFleet = (data) => api.post('/optimize', data);
export const runBenchmark = (data) => api.post('/benchmark', data);
export const analyzeScenario = (data) => api.post('/scenario', data);
export const getVessels = () => api.get('/vessels');
export const getRoutes = () => api.get('/routes');

export default api;
