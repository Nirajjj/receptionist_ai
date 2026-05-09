import axios from 'axios';
import { toast } from 'react-hot-toast';

export const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  withCredentials: true,
});
// ✅ 2. Request interceptor
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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
