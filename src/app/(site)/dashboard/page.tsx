// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthed } from "@/lib/auth";

type ApiResp = {
  articles: number;
  prompts: number;
  providers: number;
  credits_left: number;
  credits_expiry: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<ApiResp | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const res = await api.get<ApiResp>("/api/admin/overview");
        setData(res);
      } catch (e: any) {
        setErr(e?.message || "Failed to load");
      }
    })();
  }, [router]);

  if (err) return <p className="text-red-600">{err}</p>;
  if (!data) return <p className="text-gray-500">Loading…</p>;

  const cards = [
    { label: "Articles", value: data.articles },
    { label: "Prompts", value: data.prompts },
    { label: "Providers", value: data.providers },
    { label: "Credits Left", value: data.credits_left },
    { label: "Credits Expiry", value: data.credits_expiry ?? "N/A" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className="card-title">{c.label}</div>
            <div className="card-value">{String(c.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
