import axios from "axios";

/**
 * The base URL for all backend API calls.
 * Sourced exclusively from the VITE_API_URL environment variable.
 * Set this in your .env file:
 *   VITE_API_URL=http://localhost:3000
 * For production:
 *   VITE_API_URL=https://api.yourdomain.com
 */
export const API_BASE_URL = "https://api.sumoraai.in";

/**
 * Pre-configured axios instance pointing at /api on the backend.
 * All components should import this instead of creating their own instances.
 */
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export default api;
