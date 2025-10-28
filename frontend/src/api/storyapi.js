import axios from 'axios';

const API_URL ='http://localhost:5000/api';

export const fetchStories = () => axios.get(`${API_URL}/stories`);
export const fetchStory = (id) => axios.get(`${API_URL}/stories/${id}`);
export const createStory = (formData) => axios.post(`${API_URL}/stories`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateStory = (id, formData) => axios.put(`${API_URL}/stories/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteStory = (id) => axios.delete(`${API_URL}/stories/${id}`);
