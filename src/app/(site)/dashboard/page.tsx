"use client";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome {user?.name || "User"}!</h1>
        <p className="text-gray-600 mt-2">You are now logged in.</p>
      </div>
    </RequireAuth>
  );
}
