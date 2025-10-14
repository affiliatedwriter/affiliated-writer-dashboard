// src/lib/auth.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type AuthUser = {
  id: string;
  email: string;
} | null;

export type AuthContextType = {
  isAuthed: boolean;
  user: AuthUser;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const isAuthed = !!user;

  // TODO: real session check (optional)
  useEffect(() => {
    // উদাহরণস্বরূপ লোকালস্টোরেজ বা কুকি চেক করতে পারো
    // setUser(null);
  }, []);

  const login = async (email: string, _password: string) => {
    // TODO: বাস্তব API কল লাগলে এখানে করো: await apiPost('/api/auth/login', { email, password })
    setUser({ id: 'demo', email }); // ডেমো ইউজার; পরে ব্যাকএন্ড যুক্ত করবো
  };

  const logout = async () => {
    // TODO: await apiPost('/api/auth/logout')
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthed, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
