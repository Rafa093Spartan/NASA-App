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

// --- AÑADE ESTA NUEVA FUNCIÓN PARA EL CHAT ---
export const sendChatMessage = (history, question, context) => {
  return apiClient.post('/chat', {
    history: history,
    question: question,
    context: context
  });
};