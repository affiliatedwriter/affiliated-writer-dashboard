// src/lib/api.ts

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "https://affiliated-writer-backend.onrender.com";

/* ===========================
    API GET Request
=========================== */
export async function apiGet(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ===========================
    API POST Request
=========================== */
export async function apiPost(endpoint: string, body: any) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* ===========================
    LOGOUT
=========================== */
export async function logout() {
  await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/* ===========================
    DEFAULT EXPORT
=========================== */
const api = { apiGet, apiPost, logout };
export default api;
