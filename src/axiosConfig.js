import axios from 'axios';
import { auth } from './firebase';

// --- PASTE YOUR LIVE RENDER URL HERE ---
// This is the URL you copied from the Render dashboard
// const API_BASE_URL = 'https://smart-farmer-backend.onrender.com';
// const API_BASE_URL = 'https://smart-farmer-backend-1.onrender.com';
const API_BASE_URL='https://smart-farmer-backend-fheh.onrender.com/';
const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Attach the logged-in user's Firebase ID token to every request.
// The backend now requires this to authorize user and admin endpoints.
apiClient.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;
