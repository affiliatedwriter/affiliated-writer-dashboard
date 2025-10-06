// File: src/lib/auth.ts
export type User = {
  name: string;
  email: string;
  role: "admin" | "user";
  token: string;
};

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const json = localStorage.getItem("user");
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export function isAuthed(): boolean {
  return !!getUser()?.token;
}

export function isAdmin(): boolean {
  return getUser()?.role === "admin";
}
