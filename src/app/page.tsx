// File: src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthed } from "@/lib/auth";

type OverviewApi = {
  articles: number;
  prompts: number;
  providers: number;
  credits_left: number;
  credits_expiry: string | null;
};

type Stats = {
  articles: number;
  prompts: number;
  providers: number;
  credits: number;
  expiry: string | null;
};

export default function DashboardPage() {
  const r = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isAuthed()) {
      r.replace("/login");
      return;
    }
    (async () => {
      try {
        // ✅ Backend route matches your Slim API
        const res = await api.get<OverviewApi>("/api/admin/overview");
        setStats({
          articles: res.articles ?? 0,
          prompts: res.prompts ?? 0,
          providers: res.providers ?? 0,
          credits: res.credits_left ?? 0,
          expiry: res.credits_expiry ?? null,
        });
      } catch (e: any) {
        setErr(e.message || "Failed to load");
      }
    })();
  }, [r]);

  if (err) {
    return <p className="text-red-600 p-6">Failed to load: {err}</p>;
  }
  if (!stats) {
    return <p className="text-gray-500 p-6">Loading…</p>;
  }

  const cards = [
    { label: "Articles", value: stats.articles },
    { label: "Prompts", value: stats.prompts },
    { label: "Providers", value: stats.providers },
    { label: "Credits Left", value: stats.credits },
    { label: "Credits Expiry", value: stats.expiry || "N/A" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white rounded-xl border shadow-sm p-6 text-center"
          >
            <div className="text-gray-500">{c.label}</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
