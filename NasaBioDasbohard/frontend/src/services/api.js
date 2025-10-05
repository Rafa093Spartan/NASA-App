import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
});

export const searchPublications = (query) => {
  return apiClient.get(`/search?q=${query}`);
};

export const getTopKeywordsData = () => {
  return apiClient.get('/top-keywords');
};

export const summarizeText = (textToSummarize) => {
  return apiClient.post('/summarize', { text: textToSummarize });
};

// --- CHAT ---
export const sendChatMessage = (history, question, context) => {
  return apiClient.post('/chat', {
    history: history,
    question: question,
    context: context
  });
};

// --- NUEVA FUNCIÓN: BÚSQUEDA CON IA ---
export const searchPublicationsAI = (query) => {
  return apiClient.post('/search-ai', { text: query });
};
