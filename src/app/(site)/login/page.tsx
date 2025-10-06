// File: src/app/(site)/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/api";

type LoginRes = {
  token: string;
  user?: { name: string; email: string };
};

export default function LoginPage() {
  const r = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState<string>("");
  const [busy, setBusy] = useState(false);

  // already logged-in? send to dashboard
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) r.replace("/dashboard");
  }, [r]);

  const validate = (): string | null => {
    if (!email.trim() || !password.trim()) return "Email এবং Password দিন।";
    // very light email check
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()))
      return "সঠিক ইমেইল দিন।";
    if (password.length < 6) return "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
    return null;
  };

  const friendlyError = (e: unknown): string => {
    // axios-like error shape
    const ax = e as any;
    return (
      ax?.response?.data?.message ||
      ax?.message ||
      "Login ব্যর্থ হয়েছে। একটু পরে চেষ্টা করুন।"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");

    const v = validate();
    if (v) {
      setErr(v);
      return;
    }

    try {
      setBusy(true);

      // helper নিজে থেকেই /api প্রিফিক্স ম্যানেজ করবে
      const res = await apiPost<LoginRes>("/auth/login", {
        email: email.trim(),
        password,
      });

      localStorage.setItem("token", res.token);
      // চাইলে ইউজার ইনফোও ক্যাশে রাখতে পারো
      if (res.user) localStorage.setItem("user", JSON.stringify(res.user));

      r.replace("/dashboard");
    } catch (e) {
      setErr(friendlyError(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
        <p className="mt-1 text-sm text-gray-500">
          আপনার ড্যাশবোর্ডে প্রবেশ করতে সাইন ইন করুন।
        </p>

        {err ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-sm text-gray-500"
                aria-label={showPass ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          সমস্যায় পড়লে অ্যাডমিনের সাথে যোগাযোগ করুন।
        </p>
      </div>
    </div>
  );
}
