import axios from "axios";

const API_URL = "https://book-link-api.vercel.app/api/books";

export const getBooks = async () => {
  const response = await axios.get(API_URL);
  console.log("Full response:", response.data);
  
  // If the books are nested in a data property
  return response.data.data || response.data.books || response.data;
};

export const getBookById = async (id: string) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data.book;
};

export const createBook = async (data: any) => {
  const response = await axios.post(API_URL, data);
  return response.data.book;
};

export const updateBook = async (id: string, data: any) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data.book;
};

export const deleteBook = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`);
};
