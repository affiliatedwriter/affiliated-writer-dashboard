// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE!;
type Json = Record<string, any>;

async function req<T>(
  path: string,
  opts: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    cache: 'no-store',
    ...opts,
  });

  // CORS/Network ডিবাগ সহজ করার জন্য
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${txt || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  ping: () => req<{ db?: string; result?: unknown; ok?: boolean }>('/api/db/ping'),
  login: (email: string, password: string) =>
    req<Json>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};

export { BASE as API_BASE };
