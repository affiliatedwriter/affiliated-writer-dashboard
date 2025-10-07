"use client";

import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  // 🔐 Role-based access view
  if (user.role === "admin") {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard</h1>
        <p className="text-gray-600 text-center">
          Welcome {user.name}! You have full access to all management tools.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center">User Dashboard</h1>
      <p className="text-gray-600 text-center">
        Welcome {user.name}! You can view your articles and analytics.
      </p>
    </div>
  );
}
