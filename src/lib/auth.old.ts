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

  useEffect(() => {
    const stored = localStorage.getItem("authUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    router.push(data.user?.role === "admin" ? "/admin" : "/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
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

// ✅ Helper functions
export const isAuthed = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("authUser");
};

export const isAdmin = () => {
  if (typeof window === "undefined") return false;
  const user = JSON.parse(localStorage.getItem("authUser") || "{}");
  return user?.role === "admin";
};
