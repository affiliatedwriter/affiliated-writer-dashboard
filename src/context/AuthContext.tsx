// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase, type AppUser } from "@/lib/supabase";

export type AuthContextType = {
  user: AppUser | null;
  isAuthed: boolean;
  loading: boolean;
  // দরকার হলে UI থেকে ব্যবহার করবে
  signInWithOtp: (email: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // প্রথমে কারেন্ট ইউজার ফেচ করো
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // eslint-disable-next-line no-console
          console.warn("supabase.getUser error:", error.message);
          setUser(null);
        } else {
          const u = data.user
            ? { id: data.user.id, email: data.user.email ?? null }
            : null;
          setUser(u);
        }
      } finally {
        setLoading(false);
      }
    })();

    // auth state listening
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? null });
      } else {
        setUser(null);
      }
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithOtp = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Unknown error" };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthed: !!user,
      loading,
      signInWithOtp,
      signOut,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
