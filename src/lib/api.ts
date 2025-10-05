// src/lib/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

function getClientToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

// Read API base (Vercel env). Trim trailing slash.
const RAW_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").trim();
export const API_BASE = RAW_BASE.replace(/\/+$/, "");

// Normalize to /api/...
function toApiPath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  let p = path.startsWith("/") ? path : `/${path}`;
  if (!p.startsWith("/api/")) p = `/api${p}`;
  return p;
}

const client: AxiosInstance = axios.create({
  // In prod: absolute Render base, in dev: empty -> same origin (dev proxy can handle)
  baseURL: API_BASE || "",
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.request.use((cfg) => {
  const token = getClientToken();
  if (token) {
    cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  }
  return cfg;
});

function unwrap<T>(p: Promise<any>): Promise<T> {
  return p
    .then((r) => (r?.data ?? r))
    .catch((err: AxiosError<any>) => {
      const msg =
        (err.response?.data as any)?.error ||
        (err.response?.data as any)?.message ||
        err.message ||
        "Request failed";
      throw new Error(msg);
    });
}

/** Named helpers (to keep old imports working) */
export const apiGet = <T = any>(url: string, cfg?: AxiosRequestConfig) =>
  unwrap<T>(client.get(toApiPath(url), cfg));
export const apiPost = <T = any>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
  unwrap<T>(client.post(toApiPath(url), body, cfg));
export const apiPut = <T = any>(url: string, body?: any, cfg?: AxiosRequestConfig) =>
  unwrap<T>(client.put(toApiPath(url), body, cfg));
export const apiDelete = <T = any>(url: string, cfg?: AxiosRequestConfig) =>
  unwrap<T>(client.delete(toApiPath(url), cfg));

/** Default object style (optional) */
const api = { get: apiGet, post: apiPost, put: apiPut, delete: apiDelete };
export default api;
