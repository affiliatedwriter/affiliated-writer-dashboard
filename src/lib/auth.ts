// File: affiliated-writer/affiliated-writer-dashboard/src/lib/auth.ts
export const isAuthed = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

export function getUserRole(): "admin" | "user" {
  if (typeof window === "undefined") return "user";
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.role === "admin" ? "admin" : "user";
  } catch {
    return "user";
  }
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
