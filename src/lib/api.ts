// /src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://affiliated-writer-backend.onrender.com";

export const api = {
  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async (endpoint: string, data: any) => {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

export default api; // ✅ Default export added (fix for Vercel build)
