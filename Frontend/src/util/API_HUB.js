import { toast } from 'sonner';
import baseAPI from '../util/api'
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// -----------------------------------------------------------------------[Register API]
const RegisterNewPassenger = async (NewPassengerData) => {
    try {
        const response = await axios.post(`http://localhost:3000/user/register`, NewPassengerData, {
            headers: {
                "Content-type": "Application/json",
            }
        });

        if (response.status === 201) {
            const token = await response.data.token;
            const decoded = jwtDecode(token);
            localStorage.setItem("token", token);
            localStorage.setItem("role", decoded.roles);

            return response.status;
        }

    } catch (error) {
        console.error('Error in Create Item:', error);
    }
};

// -----------------------------------------------------------------------[Create API]
const createItem = async (ItemURL, NewItemData) => {
    try {
        const response = await baseAPI.post(`/${ItemURL}/add`, NewItemData);
        return response.status;
    } catch (error) {
        console.error('Error in Create Item:', error);
    }
};

// -----------------------------------------------------------------------[List API]
const listItem = async (ItemURL) => {
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
const deleteItem = async (ItemURL, id) => {
    try {

        const response = await baseAPI.delete(`/${ItemURL}/delete/${id}`);
        return response.status;

    } catch (error) {
        console.error('Error in Delete Item:', error);
    }
};

// -----------------------------------------------------------------------[Get data of an item API]
const GetItemById = async (ItemURL, id) => {
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
const updateItem = async (ItemURL, id, updateData) => {

    try {

        let response = await baseAPI.put(`/${ItemURL}/update/${id}`, updateData);
        return response.status;

    } catch (error) {
        console.log("Passenger Update " + error);
    }
};

// -----------------------------------------------------------------------[Export All API's]

export { listItem, createItem, deleteItem, GetItemById, updateItem, RegisterNewPassenger };
