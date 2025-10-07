"use client";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthed } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed) router.push("/login");
  }, [isAuthed, router]);

  if (!isAuthed) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Welcome, {user?.email}</h1>
      <p>This is your dashboard.</p>
    </div>
  );
}
