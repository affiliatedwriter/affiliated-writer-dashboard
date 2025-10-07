// src/app/(admin)/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function AdminHome() {
  const { isAuthed, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthed) router.replace("/login");
    else if (user?.role !== "admin") router.replace("/dashboard");
  }, [mounted, isAuthed, user, router]);

  if (!mounted) return null;
  if (!isAuthed || user?.role !== "admin") return null;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Admin Panel</h1>
      <p className="mt-2 text-gray-600">Only admins can see this.</p>
    </div>
  );
}
