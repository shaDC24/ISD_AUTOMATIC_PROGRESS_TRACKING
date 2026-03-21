import axios from 'axios';

const studentAPI = axios.create({
    baseURL: import.meta.env.VITE_STUDENT_API_URL || 'http://localhost:5000/api',
});

// Add token to every request automatically
studentAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const registerUser = (data) => studentAPI.post('/auth/register', data);
export const loginUser = (data) => studentAPI.post('/auth/login', data);
export const getEnrolledCourses = () => studentAPI.get('/progress/enrolled/courses');

export default studentAPI;