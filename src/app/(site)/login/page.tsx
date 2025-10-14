// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [msg, setMsg] = useState<string>('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('…');
    try {
      const data = await api.login(email, password);
      setMsg('Login OK: ' + JSON.stringify(data));
    } catch (e: any) {
      setMsg('Login failed: ' + e.message);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm space-y-3 rounded border p-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>
        <input
          className="w-full rounded border px-3 py-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
        <input
          className="w-full rounded border px-3 py-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
        />
        <button className="w-full rounded bg-blue-600 py-2 text-white">
          Login
        </button>
        <p className="text-sm text-red-600">{msg}</p>
      </form>
    </main>
  );
}
