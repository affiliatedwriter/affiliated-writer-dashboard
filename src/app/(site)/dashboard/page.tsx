"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { isAuthed } from "@/lib/auth";

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
        const res = await api.get<Stats>("/api/admin/overview");
        setStats(res);
      } catch (e: any) {
        setErr(e.message || "Failed to load");
      }
    })();
  }, [r]);

  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!stats) return <p className="p-6 text-gray-500">Loading…</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl border p-4 text-center shadow-sm">
            <div className="text-gray-500 capitalize">{k}</div>
            <div className="text-3xl font-bold text-blue-600">{String(v)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
