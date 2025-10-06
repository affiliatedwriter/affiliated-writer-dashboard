import axios from "axios";
import { logout } from "./auth";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://your-backend-url.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) logout();
    return Promise.reject(err);
  }
);

export default api;
