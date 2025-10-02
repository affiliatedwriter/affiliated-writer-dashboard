"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Flag = { id: number; name: string; enabled: 0 | 1 };

export default function FeatureFlagsPage() {
  const [rows, setRows] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await api.get<{ flags?: any[]; data?: any[] }>(
        "/api/admin/feature-flags"
      );
      const list = (res.flags ?? res.data ?? []).map((f: any) => ({
        id: Number(f.id),
        name: String(f.name),
        enabled: Number(f.enabled) as 0 | 1, // 👈 string → number
      }));
      setRows(list);
    } catch (e: any) {
      setErr(e.message || "Failed to load flags");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (f: Flag) => {
    try {
      // API থেকে যে ভ্যালু আসবে সেটাই ইউজ করি (fallback: লোকালি ফ্লিপ)
      const r = await api.post<{ id: number; enabled: number }>(
        `/api/admin/feature-flags/${f.id}/toggle`,
        {}
      );
      const newVal = (r?.enabled ?? (f.enabled ? 0 : 1)) as 0 | 1;
      setRows((old) =>
        old.map((x) => (x.id === f.id ? { ...x, enabled: newVal } : x))
      );
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  };
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Feature Flags</h2>

      <div className="rounded-xl border bg-white">
        <div className="grid grid-cols-3 gap-2 px-4 py-3 font-medium text-sm border-b">
          <div>Name</div>
          <div>Enabled</div>
          <div>Actions</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading…</div>
        ) : err ? (
          <div className="p-6 text-sm text-red-600">{err}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No flags</div>
        ) : (
          rows.map((f) => (
            <div
              key={f.id}
              className="grid grid-cols-3 gap-2 px-4 py-3 border-t text-sm"
            >
              <div className="font-medium">{f.name}</div>
              <div>
                <span
                  className={`px-2 py-1 rounded-full ${
                    f.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {f.enabled ? "On" : "Off"}
                </span>
              </div>
              <div>
                <button
                  className="border rounded px-3 py-1"
                  onClick={() => toggle(f)}
                >
                  Toggle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
