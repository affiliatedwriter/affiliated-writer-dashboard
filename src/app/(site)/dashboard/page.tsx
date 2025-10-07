// src/app/(site)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { isAuthed, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isAuthed) router.replace("/login");
  }, [mounted, isAuthed, router]);

  if (!mounted) return null; // hydration-safe
  if (!isAuthed) return null;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome {user?.name || user?.email || "user"}!
      </p>
    </div>
  );
}
