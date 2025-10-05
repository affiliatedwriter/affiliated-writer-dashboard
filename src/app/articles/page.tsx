// File: src/app/articles/page.tsx
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

type Article = {
  id: number;
  title: string;
  platform: string;
  status: string;
  updated_at: string;
};

type ListResp = { articles?: Article[] } | Article[];

export default function ArticlesPage() {
  const [rows, setRows] = useState<Article[]>([]);
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const load = async () => {
    setErr("");
    setLoading(true);
    try {
      // Authorization header auto-attaches from api.ts interceptor
      const resp = await api.get<ListResp>("/api/articles");
      const list = Array.isArray(resp) ? resp : resp.articles ?? [];
      setRows(list);
    } catch (e: any) {
      setErr(e?.message || "Failed to fetch");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (err) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to fetch: {err.slice(0, 400)}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Article History</h2>

      <div className="rounded-lg border divide-y bg-white">
        <div className="grid grid-cols-4 gap-4 p-3 font-medium bg-gray-50">
          <div>Title</div>
          <div>Platform</div>
          <div>Status</div>
          <div>Updated</div>
        </div>

        {loading ? (
          <div className="p-4 text-gray-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-4 text-gray-500">No articles found.</div>
        ) : (
          rows.map((a) => (
            <div key={a.id} className="grid grid-cols-4 gap-4 p-3">
              <div className="truncate">{a.title}</div>
              <div>{a.platform}</div>
              <div>{a.status}</div>
              <div className="text-sm text-gray-600">{a.updated_at}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
