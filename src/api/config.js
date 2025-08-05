import axios from 'axios';

// const BASE_URL = import.meta.env.VITE_APP_MODE !== "deployment" ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:5400'
const BASE_URL = 'http://localhost:5400'
export const publicRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateRequest = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateRequest.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ FormData version of privateRequest (for file uploads)
export const PrivateRequestFormData = axios.create({
  baseURL: BASE_URL,
});

PrivateRequestFormData.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Do NOT set Content-Type manually here
    return config;
  },
  (error) => Promise.reject(error)
);
