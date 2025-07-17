import axios from 'axios';

const BASE_URL = 'http://localhost:5400';

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
