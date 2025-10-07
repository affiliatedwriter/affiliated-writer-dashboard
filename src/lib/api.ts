import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://affiliated-writer-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ✅ Universal GET
export const apiGet = async (url: string) => {
  const res = await api.get(url);
  return res.data;
};

// ✅ Universal POST
export const apiPost = async (url: string, data: any) => {
  const res = await api.post(url, data);
  return res.data;
};

export default api;
