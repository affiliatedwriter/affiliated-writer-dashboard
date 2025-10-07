"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Restore user from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("authUser");
      if (saved) setUser(JSON.parse(saved));
    }
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    if (typeof window !== "undefined") {
      localStorage.setItem("authUser", JSON.stringify(data.user));
    }
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser");
    }
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Helper functions for protection
export const isAuthed = () =>
  typeof window !== "undefined" && !!localStorage.getItem("authUser");

export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  const u = localStorage.getItem("authUser");
  if (!u) return false;
  try {
    const parsed = JSON.parse(u);
    return parsed?.role === "admin";
  } catch {
    return false;
  }
};
