// File: affiliated-writer/affiliated-writer-dashboard/src/app/admin/comparison-templates/page.tsx
"use client";

import { useEffect, useState } from "react";
import api, { apiGet, apiPost } from "@/lib/api";

type CT = { id: number; name: string; html: string; is_active: 0 | 1; created_at?: string };
type ListResp = CT[] | { data?: CT[]; items?: CT[]; templates?: CT[] };

export default function ComparisonTemplatesPage() {
  const [rows, setRows] = useState<CT[]>([]);
  const [form, setForm] = useState<Partial<CT>>({ name: "", html: "", is_active: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const normalize = (r: ListResp): CT[] =>
    Array.isArray(r) ? r : r.data ?? r.items ?? r.templates ?? [];

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const resp = await apiGet<ListResp>("/api/admin/comparison-templates");
      setRows(normalize(resp));
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ name: "", html: "", is_active: 1 });
    setEditingId(null);
  };

  const save = async () => {
    try {
      if (!form.name?.trim()) return alert("Name is required");
      if (!form.html?.trim()) return alert("HTML is required");

      if (editingId) {
        await api.put(`/api/admin/comparison-templates/${editingId}`, form);
      } else {
        await apiPost(`/api/admin/comparison-templates`, form);
      }
      resetForm();
      await load();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    }
  };

  const edit = (r: CT) => {
    setEditingId(r.id);
    setForm({ name: r.name, html: r.html, is_active: r.is_active });
  };

  const del = async (id: number) => {
    if (!confirm("Delete this template?")) return;
    try {
      await api.delete(`/api/admin/comparison-templates/${id}`);
      await load();
    } catch (e: any) {
      alert(e?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Comparison Templates</h1>

      <div className="card space-y-3">
        <div className="grid gap-3">
          <label className="text-sm font-medium">Name</label>
          <input
            className="input"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. 3-Product Comparison v1"
          />

          <label className="text-sm font-medium">HTML</label>
          <textarea
            className="input min-h-[160px]"
            value={form.html || ""}
            onChange={(e) => setForm({ ...form, html: e.target.value })}
            placeholder={`<table> ... your comparison markup ... </table>`}
          />

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={(form.is_active ?? 1) === 1}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
            />
            Active
          </label>

          <div className="flex gap-2">
            <button className="btn-primary" onClick={save}>
              {editingId ? "Update" : "Create"}
            </button>
            {editingId && (
              <button
                className="btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <p>Loading…</p>
        ) : err ? (
          <p className="text-red-600">{err}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Name</th>
                <th className="p-2">Active</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.is_active ? "✅" : "❌"}</td>
                  <td className="p-2 space-x-2">
                    <button className="text-indigo-600" onClick={() => edit(r)}>
                      Edit
                    </button>
                    <button className="text-red-600" onClick={() => del(r.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="p-2" colSpan={4}>
                    No templates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
