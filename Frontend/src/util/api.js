import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000", // Change to your backend URL
    headers: { "Content-Type": "application/json" },
});

// Request interceptor: Automatically add token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to catch expired tokens globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");  // Clear token
            localStorage.removeItem("role");  // Clear token
            window.location.href = "/login";  // Redirect user to login page
        }
        return Promise.reject(error);
    }
);

export default api;
