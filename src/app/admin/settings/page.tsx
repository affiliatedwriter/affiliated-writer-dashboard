"use client";
import { useEffect, useState, Fragment } from "react";
import api from "@/lib/api";

type ProviderKey = {
  id?: number;
  name: string;
  base_url: string;
  model_name: string;
  api_key: string;
  temperature: number;
  priority: number;
  assigned_section: string;
  is_active: number;
  status?: string;
};

// ------- helpers to keep inputs controlled -------
const s = (v: string | null | undefined, d = "") => (v ?? d);         // string
const n = (v: number | null | undefined, d: number) => {              // number
  const num = typeof v === "number" ? v : Number(v);
  return Number.isFinite(num) ? num : d;
};

const empty: ProviderKey = {
  name: "OpenRouter",
  base_url: "https://openrouter.ai/api/v1",
  model_name: "",
  api_key: "",
  temperature: 0.7,
  priority: 10,
  assigned_section: "general",
  is_active: 1,
};

const Toast = ({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) => {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className={`fixed bottom-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg text-sm ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

export default function AdminSettings() {
  const [keys, setKeys] = useState<ProviderKey[]>([]);
  const [form, setForm] = useState<ProviderKey>(empty);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<number | null>(null);

  // Normalize any provider row before putting into state
  const normalize = (p: Partial<ProviderKey>): ProviderKey => ({
    id: p.id,
    name: s(p.name, ""),
    base_url: s(p.base_url, ""),
    model_name: s(p.model_name, ""),
    api_key: s(p.api_key, ""),
    temperature: n(p.temperature, 0.7),
    priority: n(p.priority, 10),
    assigned_section: s(p.assigned_section, "general"),
    is_active: n(p.is_active, 1) ? 1 : 0,
    status: s(p.status, undefined as any),
  });

  // Load providers
  const loadProviders = async () => {
    setLoading(true);
    try {
      // our api wrapper returns parsed body (not axios response)
      const body = await api.get<{ data: ProviderKey[] }>("/api/admin/providers");
      const list = Array.isArray(body?.data) ? body.data.map(normalize) : [];
      setKeys(list);
    } catch (e: any) {
      setToast({ message: e?.message || "Failed to load providers", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  // Save or Update
  const saveProvider = async () => {
    setLoading(true);
    try {
      const payload = normalize(form);
      const endpoint = payload.id ? `/api/admin/providers/${payload.id}` : "/api/admin/providers";
      const method = payload.id ? "put" : "post";
      const saved = await (api as any)[method]<{ data: ProviderKey }>(endpoint, payload);

      const row = normalize(saved?.data || payload);
      setKeys((prev) => {
        const idx = prev.findIndex((x) => x.id === row.id);
        if (idx >= 0) {
          const cp = prev.slice();
          cp[idx] = row;
          return cp;
        }
        return [...prev, row];
      });

      setForm(empty);
      setToast({ message: "Provider saved successfully!", type: "success" });
    } catch (e: any) {
      setToast({ message: e?.message || "Save failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p: ProviderKey) => setForm(normalize(p));

  // Delete
  const deleteProvider = async () => {
    if (keyToDelete == null) return;
    try {
      await api.delete(`/api/admin/providers/${keyToDelete}`);
      setKeys((prev) => prev.filter((x) => x.id !== keyToDelete));
      setToast({ message: "Provider deleted successfully!", type: "success" });
    } catch (e: any) {
      setToast({ message: e?.message || "Delete failed", type: "error" });
    } finally {
      setKeyToDelete(null);
    }
  };

  // Toggle Active/Inactive
  const toggleStatus = async (p: ProviderKey) => {
    try {
      const updated = { ...p, is_active: p.is_active ? 0 : 1 };
      const body = await api.put<{ data: ProviderKey }>(`/api/admin/providers/${p.id}`, updated);
      const row = normalize(body?.data || updated);
      setKeys((prev) => prev.map((x) => (x.id === row.id ? row : x)));
    } catch (e: any) {
      setToast({ message: e?.message || "Toggle failed", type: "error" });
    }
  };

  // Test API Key
  const testKey = async (provider: ProviderKey) => {
    setToast({ message: "Testing key…", type: "success" });
    try {
      const r = await api.post<{ ok: boolean; message?: string }>(
        `/api/admin/providers/${provider.id}/test`,
        {}
      );
      setToast({ message: r?.message || (r?.ok ? "Key is valid" : "Invalid key"), type: r?.ok ? "success" : "error" });
    } catch (e: any) {
      setToast({ message: e?.message || "Testing failed", type: "error" });
    }
  };

  return (
    <Fragment>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {/* Delete Confirm */}
      {keyToDelete !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-bold">Are you sure?</h3>
            <p className="my-2 text-gray-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setKeyToDelete(null)} className="px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={deleteProvider} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 max-w-6xl mx-auto py-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">AI Provider Settings</h1>
          <p className="text-gray-500 mt-1">Manage API keys and set priorities for the auto-failover system.</p>
        </div>

        {/* Form */}
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {form.id ? "Edit AI Provider" : "Add New AI Provider"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Provider Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={s(form.name)}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm">Model Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. gpt-4o, meta-llama/…, gemini-1.5-pro"
                value={s(form.model_name)}
                onChange={(e) => setForm({ ...form, model_name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">Base URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={s(form.base_url)}
                onChange={(e) => setForm({ ...form, base_url: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm">API Key</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={s(form.api_key)}
                onChange={(e) => setForm({ ...form, api_key: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm">Temperature</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="2"
                className="w-full border rounded px-3 py-2"
                value={n(form.temperature, 0.7)}
                onChange={(e) => setForm({ ...form, temperature: n(Number(e.target.value), 0.7) })}
              />
            </div>

            <div>
              <label className="text-sm">Priority</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={n(form.priority, 10)}
                onChange={(e) => setForm({ ...form, priority: n(Number(e.target.value), 10) })}
              />
            </div>

            <div>
              <label className="text-sm">Assigned Section</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={s(form.assigned_section, "general")}
                onChange={(e) => setForm({ ...form, assigned_section: e.target.value })}
              >
                <option value="general">General (default)</option>
                <option value="info_article">Info Articles</option>
                <option value="amazon_review">Amazon Review</option>
                <option value="single_product_review">Single Product Review</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="is_active"
                type="checkbox"
                checked={!!n(form.is_active, 1)}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })}
              />
              <label htmlFor="is_active" className="text-sm">Enabled</label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              disabled={loading}
              onClick={saveProvider}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            >
              {form.id ? "Update" : "Save"}
            </button>
            <button
              className="px-4 py-2 rounded border"
              onClick={() => setForm(empty)}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-600">
                <th className="p-4">Priority</th>
                <th className="p-4">Provider</th>
                <th className="p-4">Model</th>
                <th className="p-4">Assigned Section</th>
                <th className="p-4">Active</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {keys.map((p) => (
                <tr key={p.id ?? `${p.name}-${p.model_name}`}>
                  <td className="p-4 font-bold">{p.priority}</td>
                  <td className="p-4 font-medium text-gray-800">{p.name}</td>
                  <td className="p-4 text-gray-600">{p.model_name}</td>
                  <td className="p-4 text-gray-600">{p.assigned_section}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                        p.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                      onClick={() => toggleStatus(p)}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2">
                    <button className="px-3 py-1 border rounded" onClick={() => startEdit(p)}>Edit</button>
                    <button className="px-3 py-1 border rounded" onClick={() => testKey(p)}>Test</button>
                    <button className="px-3 py-1 border rounded text-red-600" onClick={() => setKeyToDelete(p.id!)}>Delete</button>
                  </td>
                </tr>
              ))}
              {!keys.length && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">No AI providers configured yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
