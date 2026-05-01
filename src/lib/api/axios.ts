import axios from 'axios';
import { toast } from 'react-hot-toast';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});
// ✅ 2. Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ 3. Response interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';

    toast.error(message);

    // 🔥 handle global cases
    if (error.response?.status === 401) {
      // optional: redirect to login
      console.log('Unauthorized - redirect user');
    }

    return Promise.reject(error);
  },
);
