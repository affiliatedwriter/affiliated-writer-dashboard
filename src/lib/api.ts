// src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE!;
type JSONBody = Record<string, unknown> | undefined;

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    // কুকি/ক্রিডেনশিয়াল লাগলে: credentials: 'include',
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  // কিছু এন্ডপয়েন্ট empty body দিলে:
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? (await res.json()) as T : (undefined as unknown as T);
}

export async function apiGet<T = any>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' });
}

export async function apiPost<T = any>(path: string, body?: JSONBody): Promise<T> {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
}

export async function ping() {
  return apiGet<{ db: string; result?: unknown }>('/api/db/ping');
}

// default export (কিছু পেজে default import ব্যবহার হয়েছে)
const api = { get: apiGet, post: apiPost, ping };
export default api;
