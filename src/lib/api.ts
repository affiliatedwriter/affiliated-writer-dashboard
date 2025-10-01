// src/lib/api.ts
// Axios-based tiny wrapper + helpers
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const client: AxiosInstance = axios.create({
  baseURL: BASE,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((cfg) => {
  const token = getClientToken();
  if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  return cfg;
});

function unwrap<T>(p: Promise<any>): Promise<T> {
  return p.then((r) => (r?.data ?? r)).catch((err: AxiosError<any>) => {
    const msg =
      (err.response?.data as any)?.error ||
      (err.response?.data as any)?.message ||
      err.message ||
      "Request failed";
    throw new Error(msg);
  });
}

const api = {
  get:  <T = any>(url: string, cfg?: AxiosRequestConfig) => unwrap<T>(client.get(url, cfg)),
  post: <T = any>(url: string, body?: any, cfg?: AxiosRequestConfig) => unwrap<T>(client.post(url, body, cfg)),
  put:  <T = any>(url: string, body?: any, cfg?: AxiosRequestConfig) => unwrap<T>(client.put(url, body, cfg)),
  delete:<T = any>(url: string, cfg?: AxiosRequestConfig) => unwrap<T>(client.delete(url, cfg)),
};

// Simple aliases if you like function style:
const apiGet  = <T=any>(path: string) => api.get<T>(path);
const apiPost = <T=any>(path: string, body?: any) => api.post<T>(path, body);

export default api;
export { apiGet, apiPost, getClientToken };
