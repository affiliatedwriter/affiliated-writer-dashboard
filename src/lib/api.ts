const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://affiliated-writer-backend.onrender.com";

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  post: async (path: string, data?: any) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST", // ✅ Ensure POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {}),
      credentials: "include",
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};
