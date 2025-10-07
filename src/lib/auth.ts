"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface UserType {
  id?: string;
  email?: string;
  role?: "admin" | "user";
}

interface AuthContextType {
  user: UserType | null;
  login: (data: any) => void;
  logout: () => void;
  isAuthed: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  // restore user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (data: any) => {
    setUser(data.user);
    localStorage.setItem("authUser", JSON.stringify(data.user));
    // redirect based on role
    if (data.user?.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
    router.push("/login");
  };

  const isAuthed = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthed }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
