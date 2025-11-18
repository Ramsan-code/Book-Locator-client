import axios from "axios";

const API_URL = "https://book-link-api.vercel.app/api/readers";

export const getReader = async () => {
    console.log(API_URL);
    
    const response = await axios.get(API_URL);
    console.log(response);
    return response.data.reader;
};

export const getReaderById = async () => {
    const response = await axios.get(`${API_URL}`);
    return response.data.user;
};

export const createReader = async () => {
    const response = await axios.post(API_URL,);
    return response.data.user;
};

export const updateReader = async () => {
    const response = await axios.put(`${API_URL}`);
    return response.data.user;
};

export const deleteReader = async () => {
    await axios.delete(`${API_URL}`);
};
