// src/app/(site)/login/page.tsx
"use client";

import { useState } from "react";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // ✅ backend route: /api/auth/login
      const res = await apiPost("/api/auth/login", { email, password });

      // backend থেকে যদি role না আসে, ডিফল্ট user ধরা হলো
      const user = { role: "user", ...(res?.user || {}), email };
      login({ user });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow rounded-xl p-8 w-[400px]">
        <h2 className="text-center text-2xl font-semibold mb-4">Login</h2>
        {error && (
          <p className="text-red-600 text-center text-sm mb-3">{error}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            autoComplete="username"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            autoComplete="current-password"
            className="w-full border px-4 py-2 rounded-md"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
