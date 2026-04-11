import axios from 'axios';

// --- PASTE YOUR LIVE RENDER URL HERE ---
// This is the URL you copied from the Render dashboard
// const API_BASE_URL = 'https://smart-farmer-backend.onrender.com'; 
// const API_BASE_URL = 'https://smart-farmer-backend-1.onrender.com'; 
const API_BASE_URL='https://smart-farmer-backend-fheh.onrender.com/';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

export default apiClient;
