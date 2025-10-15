"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("…");

    try {
      // আপনার ব্যাকএন্ডে যেটা আছে সেটা দিন:
      // common: /api/auth/login  অথবা /api/login
      const data = await api.post("/api/auth/login", { email, password });
      setMsg("Login OK");
      // সফল হলে যেখানে যেতে চান:
      router.replace("/dashboard"); // বা "/admin"
    } catch (e: any) {
      setMsg(e?.message || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full rounded border px-3 py-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full rounded bg-green-600 text-white py-2">Sign in</button>
      </form>
      {msg && <p className="text-sm mt-3">{msg}</p>}
    </div>
  );
}
