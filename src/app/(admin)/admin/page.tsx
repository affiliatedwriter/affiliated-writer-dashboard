"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
    else if (user.role !== "admin") router.push("/dashboard");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-semibold text-blue-600">
        Admin Control Panel
      </h1>
      <p className="text-gray-600 mt-2">
        Manage system, users, and global content.
      </p>
    </div>
  );
}
