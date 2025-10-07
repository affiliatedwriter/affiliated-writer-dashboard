// src/lib/api.ts
export const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/$/, "");

type Json = Record<string, any>;

type FetchOpts = RequestInit & { json?: Json };

async function request(path: string, opts: FetchOpts = {}) {
  if (!API_BASE) throw new Error("API base missing (NEXT_PUBLIC_API_BASE).");

  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };

  const res = await fetch(url, {
    method: opts.method ?? (opts.json ? "POST" : "GET"),
    headers,
    body: opts.json ? JSON.stringify(opts.json) : (opts.body as BodyInit | null),
    credentials: "include",
    cache: "no-store",
    redirect: "follow",
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `${res.status} ${res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

export const apiGet = (path: string) => request(path, { method: "GET" });
export const apiPost = (path: string, json?: Json) =>
  request(path, { method: "POST", json });
export const apiLogout = () => request("/api/auth/logout", { method: "POST" });

// সম্পূর্ণ অবজেক্ট হিসেবে চাইলে আগের কোডও সাপোর্ট করবে
const api = { get: apiGet, post: apiPost, logout: apiLogout };
export default api;
