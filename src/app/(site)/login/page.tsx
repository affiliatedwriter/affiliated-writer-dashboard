"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api"; // ✅ Correct named import

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Correct endpoint with /api prefix
      const res = await api.post("/api/auth/login", { email, password });

      if (res?.token) {
        console.log("✅ Login successful:", res);
        router.push("/dashboard"); // Redirect after success
      } else {
        setError(res?.message || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err?.message || "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">
        <h2 className="text-center text-2xl font-semibold mb-4">Login</h2>

        {error && <p className="text-red-500 text-center mb-3">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2 mb-3 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 mb-5 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
