import axios from 'axios';
import { parseCookies } from 'nookies';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

api.interceptors.request.use(
  (config) => {
    const cookies = parseCookies(); // Utilisation de nookies pour obtenir les cookies côté client

    const token = cookies.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
