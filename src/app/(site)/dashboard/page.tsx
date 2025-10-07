"use client";

import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role === "admin") router.push("/admin");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold">Welcome, {user.name}!</h1>
      <p className="text-gray-600 mt-2">This is your user dashboard.</p>
    </div>
  );
}
