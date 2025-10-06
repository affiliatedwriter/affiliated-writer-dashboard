// File: src/app/(site)/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // not logged in → kick to /login
    if (!isAuthed()) {
      router.replace("/login");
      return;
    }

    const ac = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // helper অনুযায়ী '/api' প্রিফিক্স থাকলে ঠিক যেমন আছে তেমনই রাখুন
        const res = await api.get<ApiResp>("/api/admin/overview", {
          signal: ac.signal as any,
        });
        if (!ac.signal.aborted) setData(res);
      } catch (e: any) {
        if (ac.signal.aborted) return;

        // 401/403 → টোকেন ক্লিয়ার করে লগইনে পাঠাই
        const status = e?.response?.status;
        if (status === 401 || status === 403) {
          try {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          } catch {}
          router.replace("/login");
          return;
        }

        setErr(e?.message || "Failed to load");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    };

    load();
    return () => ac.abort();
  }, [router]);

  const cards = useMemo(
    () =>
      data
        ? [
            { label: "Articles", value: data.articles },
            { label: "Prompts", value: data.prompts },
            { label: "Providers", value: data.providers },
            { label: "Credits Left", value: data.credits_left },
            { label: "Credits Expiry", value: data.credits_expiry ?? "N/A" },
          ]
        : [],
    [data]
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white p-4 shadow-sm animate-pulse"
          >
            <div className="h-3 w-24 rounded bg-gray-200" />
            <div className="mt-3 h-6 w-16 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  if (err) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-700">
        {err}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label} title={c.label} value={String(c.value)} />
        ))}
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
