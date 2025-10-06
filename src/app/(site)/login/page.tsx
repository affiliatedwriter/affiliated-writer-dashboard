"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

export default function LoginPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) r.replace("/dashboard");
  }, [r]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    try {
      setBusy(true);
      const res = await apiPost("/auth/login", { email, password });
      localStorage.setItem("token", res.token);
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));
      r.replace("/dashboard");
    } catch (e: any) {
      setErr(e.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-xl border shadow-sm w-full max-w-md p-6">
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        {err && <div className="text-red-600 mb-2 text-sm">{err}</div>}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg p-2"
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium"
          >
            {busy ? "Please wait…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
