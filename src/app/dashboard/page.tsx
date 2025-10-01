"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { apiGet } from "@/lib/api";
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
        // primary
        const res = await api.get<ApiResp>("/api/admin/overview");
        setData(res);
      } catch {
        // fallback if your backend only exposes /api/dashboard
        try {
          const res2 = await apiGet<ApiResp>("/api/dashboard");
          setData(res2);
        } catch (e: any) {
          setErr(e?.message || "Failed to load");
        }
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
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border shadow-sm p-6 text-center">
            <div className="text-gray-500">{c.label}</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">{String(c.value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
