// src/lib/api.ts
// Small fetch wrapper for talking to the PHP backend on Render

export type JSONBody = Record<string, any> | undefined;

const BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, "") ||
  "";

/**
 * Low-level fetch with JSON convenience.
 */
async function request<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  body?: JSONBody
): Promise<T> {
  const url = `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    // credentials: "include", // প্রয়োজন হলে কুকি সহ পাঠাতে আনকমেন্ট করো
    body: body ? JSON.stringify(body) : undefined,
    // কিছু হোস্টে ক্যাশিং সমস্যা এড়াতে চাইলে:
    // cache: "no-store",
  });

  // Non-2xx হলে একটি ভালো এরর থ্রো করবো
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let parsed: any = text;
    try {
      parsed = JSON.parse(text);
    } catch {}
    const err = new Error(
      `HTTP ${res.status} ${res.statusText} – ${typeof parsed === "string" ? parsed : JSON.stringify(parsed)}`
    );
    // @ts-expect-error attach
    (err as any).status = res.status;
    throw err;
  }

  // empty response হলে {} রিটার্ন
  if (res.status === 204) return {} as T;

  // JSON ধরেই নিলাম (আমাদের ব্যাকএন্ড সব JSON রিটার্ন করে)
  return (await res.json()) as T;
}

/** Shorthand helpers */
async function get<T = any>(path: string): Promise<T> {
  return request<T>("GET", path);
}
async function post<T = any>(path: string, body?: JSONBody): Promise<T> {
  return request<T>("POST", path, body);
}
async function put<T = any>(path: string, body?: JSONBody): Promise<T> {
  return request<T>("PUT", path, body);
}
async function del<T = any>(path: string, body?: JSONBody): Promise<T> {
  return request<T>("DELETE", path, body);
}

/** Health/DB check – uses our backend route /api/db/ping */
async function ping(): Promise<{ db: string; result?: unknown }> {
  return get("/api/db/ping");
}

/**
 * Default export: api object
 *  - api.get('/path')
 *  - api.post('/path', {...})
 *  - api.put('/path', {...})
 *  - api.delete('/path')
 *  - api.ping()
 */
const api = {
  get,
  post,
  put,
  delete: del,
  ping,
};

export default api;

// Named exports (older imports in pages/components will continue to work)
export { get as apiGet, post as apiPost, put as apiPut, del as apiDelete, del as apiDel, ping };
