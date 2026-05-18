import axios from "axios";

const api = axios.create({
  // Fallback to Render URL for production if Vercel ENV is missing
  baseURL: import.meta.env.VITE_API_URL || "https://askdoc-telehealth.onrender.com/api/v1",
  timeout: 60000, // 60 seconds — long enough for a cold start
});

export default api;