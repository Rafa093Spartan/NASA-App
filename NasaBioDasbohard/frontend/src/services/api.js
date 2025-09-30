import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const fetchPublications = () => axios.get(`${API_URL}/publications`);
export const searchPublications = (query) =>
  axios.get(`${API_URL}/search?q=${query}`);
