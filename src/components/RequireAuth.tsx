"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useAuth } from "@/lib/auth"; // প্রয়োজনে পাথটা অ্যাডজাস্ট করো

type Props = {
  children: ReactNode;
  /**
   * শুধু অ্যাডমিনদের অ্যাক্সেস দিতে চাইলে:
   * <RequireAuth adminOnly>...</RequireAuth>
   */
  adminOnly?: boolean;
  /** না দিলে ডিফল্টে /login এ রিডাইরেক্ট হবে */
  redirectTo?: Route;
};

/**
 * Simple auth guard:
 * - লোডিং হলে কিছু দেখায় না
 * - ইউজার না থাকলে redirect
 * - adminOnly হলে role/admin ফ্ল্যাগ দেখে redirect
 */
export default function RequireAuth({
  children,
  adminOnly = false,
  redirectTo = "/login" as Route,
}: Props) {
  const router = useRouter();
  const { user, loading } = useAuth() as { user: any; loading?: boolean };

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    // লগইন না থাকলে
    if (!user) {
      router.replace(redirectTo);
      return;
    }

    // শুধু অ্যাডমিনদের জন্য
    if (adminOnly) {
      const isAdmin =
        user?.role === "admin" || user?.is_admin === true || user?.isAdmin === true;
      if (!isAdmin) {
        router.replace("/" as Route); // নন-অ্যাডমিন হলে হোমে ফেরত পাঠাও
        return;
      }
    }

    setReady(true);
  }, [user, loading, adminOnly, router, redirectTo]);

  // গার্ড ফাইনাল না হওয়া পর্যন্ত কিছু রেন্ডার করব না
  if (!ready) return null;

  return <>{children}</>;
}
