import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});


apiClient.interceptors.request.use(
    (config) => {
        // Token is now handled by HttpOnly cookie
        return config;
    },
    (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
