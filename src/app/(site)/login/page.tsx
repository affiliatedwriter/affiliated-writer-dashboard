// File: src/app/(site)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setBusy(true);
    try {
      // api.login নেই, তাই api.post ব্যবহার করি
      const res = await api.post("/api/auth/login", { email, password });

      // চাইলে টোকেন/ইউজার লোকালস্টোরেজে রাখতে পারো
      // localStorage.setItem("auth", JSON.stringify(res));

      setMsg("✅ Login successful");
      // লগইন হলে ড্যাশবোর্ডে পাঠাতে চাইলে:
      router.push("/dashboard");
    } catch (err: any) {
      setMsg(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="mb-4 text-xl font-semibold">Sign in</h1>

      {msg && (
        <div className="mb-3 rounded border px-3 py-2 text-sm">
          {msg}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded bg-green-600 px-3 py-2 text-white disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
