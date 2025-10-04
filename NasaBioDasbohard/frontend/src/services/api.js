// NasabioDasbohard/frontend/src/services/api.js (Versión final)

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

export const searchPublications = (query) => {
  return apiClient.get(`/search?q=${query}`);
};

// Se cambió el nombre de 'getWordCloudData' a 'getTopKeywordsData'
// y la URL de '/wordcloud' a '/top-keywords'
export const getTopKeywordsData = () => {
  return apiClient.get('/top-keywords');
};