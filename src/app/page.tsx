// src/app/page.tsx
'use client';

import { useState } from 'react';
import api, { apiGet, apiPost } from "@/lib/api";

export default function Home() {
  const [out, setOut] = useState<string>('—');
  const testPing = async () => {
    try {
      const data = await api.ping();
      setOut(JSON.stringify(data));
    } catch (e: any) {
      setOut(e.message);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Affiliated Writer Dashboard</h1>
      <p className="mt-2 text-sm text-gray-500">Backend ping test</p>
      <button
        onClick={testPing}
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
      >
        Ping DB
      </button>
      <pre className="mt-4 rounded bg-gray-100 p-3 text-sm">{out}</pre>
    </main>
  );
}
