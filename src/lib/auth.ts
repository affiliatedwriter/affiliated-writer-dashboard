// File: affiliated-writer/affiliated-writer-dashboard/src/lib/auth.ts
export const getToken = () =>
  (typeof window !== "undefined" ? localStorage.getItem("token") : null);
export const setToken = (t: string) => localStorage.setItem("token", t);
export const clearToken = () => localStorage.removeItem("token");
export const isAuthed = () => !!getToken();
