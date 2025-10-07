import axios from "axios";

/**
 * ✅ Global Axios instance for API requests
 * Automatically picks up base URL from environment variable.
 * Example: NEXT_PUBLIC_API_BASE=https://affiliated-writer-backend.onrender.com
 */
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE ||
    "https://affiliated-writer-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // important for CORS + cookies
});

/* =========================================================
   Universal API Helpers (used everywhere)
   ========================================================= */

/** ✅ GET request */
export const apiGet = async (endpoint: string) => {
  const res = await api.get(endpoint);
  return res.data;
};

/** ✅ POST request */
export const apiPost = async (endpoint: string, data: any) => {
  const res = await api.post(endpoint, data);
  return res.data;
};

/** ✅ PUT (for updates) */
export const apiPut = async (endpoint: string, data: any) => {
  const res = await api.put(endpoint, data);
  return res.data;
};

/** ✅ DELETE (for removals) */
export const apiDelete = async (endpoint: string) => {
  const res = await api.delete(endpoint);
  return res.data;
};

export default api;
