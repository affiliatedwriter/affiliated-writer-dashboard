// File: src/components/AuthGuard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
  /** ডিফল্ট: "user" — admin পেজে দিলে "admin" পাঠাও */
  mode?: "user" | "admin";
  /** টোকেন/রোল না পেলে কোথায় পাঠাবে (ডিফল্ট: /login) */
  redirectTo?: string;
};

export default function AuthGuard({
  children,
  mode = "user",
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<null | boolean>(null); // null = unknown/loading

  useEffect(() => {
    // SSR-সেফ: window/localStorage গার্ড
    if (typeof window === "undefined") return;

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role"); // "admin" দিলে admin গার্ড পাস করবে

      // not logged in
      if (!token) {
        router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
        setAuthorized(false);
        return;
      }

      // role check (only for admin mode)
      if (mode === "admin" && role !== "admin") {
        router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
        setAuthorized(false);
        return;
      }

      setAuthorized(true);
    } catch {
      router.replace(`${redirectTo}?next=${encodeURIComponent(pathname)}`);
      setAuthorized(false);
    }
  }, [mode, redirectTo, pathname, router]);

  // লোডিং/রিডাইরেক্টের সময়ে হালকা স্কেলেটন/স্পিনার
  if (authorized === null) {
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="flex items-center gap-3 text-gray-600">
          <span className="animate-spin inline-block h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full" />
          <span>Checking permission…</span>
        </div>
      </div>
    );
  }

  if (authorized === false) return null;

  return <>{children}</>;
}
