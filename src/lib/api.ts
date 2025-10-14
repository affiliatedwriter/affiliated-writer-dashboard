// src/lib/api.ts
// Simple fetch wrapper for our backend (Render)

const BASE = process.env.NEXT_PUBLIC_API_BASE;
if (!BASE) {
  // Build time guard – helps on Vercel
  // eslint-disable-next-line no-console
  console.warn("NEXT_PUBLIC_API_BASE is not set!");
}

type JSONLike = Record<string, any>;

async function fetchJSON<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = `${BASE?.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;

  // Default headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers || {}),
  };

  const res = await fetch(url, {
    ...init,
    headers,
    // credentials: "include",  // কুকি দরকার হলে অন করুন (CORS credentials true + non-* origin লাগবে)
    // mode: "cors",            // ব্রাউজারে ডিফল্ট; রাখতে চাইলে রাখুন
  });

  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : (undefined as unknown as T);

  if (!res.ok) {
    const msg =
      (data && (data as any).message) ||
      res.statusText ||
      `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// Named helpers
export function apiGet<T = any>(path: string): Promise<T> {
  return fetchJSON<T>(path, { method: "GET" });
}

export function apiPost<T = any>(path: string, body?: JSONLike): Promise<T> {
  return fetchJSON<T>(path, {
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiPut<T = any>(path: string, body?: JSONLike): Promise<T> {
  return fetchJSON<T>(path, {
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export function apiDelete<T = any>(path: string): Promise<T> {
  return fetchJSON<T>(path, { method: "DELETE" });
}

// Default export so that `import api, { apiGet } from "@/lib/api"` works.
const api = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
};
export default api;
