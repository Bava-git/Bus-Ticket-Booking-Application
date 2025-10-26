import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const baseAPI = axios.create({
    baseURL: "http://localhost:3000", // Change to your backend URL
    headers: { "Content-Type": "application/json" },
});

// Request interceptor: Automatically add token
baseAPI.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add a response interceptor to catch expired tokens globally
baseAPI.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            alert("Session expired. Please log in again.");
            sessionStorage.removeItem("token");  // Clear token
            sessionStorage.removeItem("role");  // Clear token
            window.location.href = "/login";  // Redirect user to login page
        }
        return Promise.reject(error);
    }
);

// -----------------------------------------------------------------------[Register API]
export const RegisterNewPassenger = async (NewPassengerData) => {
    try {
        const response = await axios.post(`http://localhost:3000/user/register`, NewPassengerData, {
            headers: {
                "Content-type": "Application/json",
            }
        });

        if (response.status === 201) {
            const token = await response.data.token;
            const decoded = jwtDecode(token);
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("role", decoded.roles);

            return response.status;
        }

    } catch (error) {
        console.error('Error in Create Item:', error);
    }
};

// -----------------------------------------------------------------------[Create API]
export const createItem = async (ItemURL, NewItemData) => {
    try {
        const response = await baseAPI.post(`/${ItemURL}/add`, NewItemData);
        return response.status;
    } catch (error) {
        console.error('Error in Create Item:', error);
    }
};

// -----------------------------------------------------------------------[List API]
export const listItem = async (ItemURL) => {
    try {

        const response = await baseAPI.get(`/${ItemURL}`);
        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in List Item:', error);
    }
};

// -----------------------------------------------------------------------[Delete API]
export const deleteItem = async (ItemURL, id) => {
    try {

        const response = await baseAPI.delete(`/${ItemURL}/delete/${id}`);
        return response.status;

    } catch (error) {
        console.error('Error in Delete Item:', error);
    }
};

// -----------------------------------------------------------------------[Get data of an item API]
export const GetItemById = async (ItemURL, id) => {
    try {

        const response = await baseAPI.get(`/${ItemURL}/id/${id}`);
        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in Get List of Item:', error);
    }
};

// -----------------------------------------------------------------------[Update API]
export const updateItem = async (ItemURL, id, updateData) => {

    try {

        let response = await baseAPI.put(`/${ItemURL}/update/${id}`, updateData);
        return response.status;

    } catch (error) {
        console.log("Passenger Update " + error);
    }
};

// -----------------------------------------------------------------------[Update API]
export const saveAllItem = async (ItemURL, allData) => {

    try {

        let response = await baseAPI.post(`/${ItemURL}`, allData);
        return response.status;

    } catch (error) {
        console.log("Passenger Update " + error);
    }
};