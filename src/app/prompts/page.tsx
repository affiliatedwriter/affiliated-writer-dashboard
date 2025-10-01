"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import api from "@/lib/api";

type Prompt = {
  id: number;
  name: string;
  platform?: string | null;
  job_type?: string | null;
  prompt_text: string;
  is_active?: number | boolean;
};

export default function PromptsPage() {
  const [rows, setRows] = useState<Prompt[]>([]);
  const [form, setForm] = useState<Partial<Prompt>>({ name: "", platform: "generic", job_type: "", prompt_text: "", is_active: 1 });
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<{ data: Prompt[] }>("/api/prompts");
      setRows(Array.isArray(res?.data) ? res.data : []);
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const reset = () => { setForm({ name: "", platform: "generic", job_type: "", prompt_text: "", is_active: 1 }); setEditing(null); };

  const create = async () => {
    if (!form.name?.trim() || !form.prompt_text?.trim()) return alert("name and prompt_text required");
    await api.post("/api/prompts", {
      name: form.name, platform: form.platform, job_type: form.job_type, prompt_text: form.prompt_text, is_active: form.is_active ? 1 : 0
    });
    reset(); load();
  };

  const update = async () => {
    if (!editing) return;
    await api.put(`/api/prompts/${editing.id}`, {
      name: editing.name, platform: editing.platform, job_type: editing.job_type,
      prompt_text: editing.prompt_text, is_active: editing.is_active ? 1 : 0
    });
    reset(); load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this prompt?")) return;
    await api.delete(`/api/prompts/${id}`);
    load();
  };

  return (
    <RequireAuth adminOnly>
      <h2 className="text-xl font-semibold mb-4">Prompt Templates</h2>

      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name"
                 value={editing ? editing.name : (form.name || "")}
                 onChange={e => editing ? setEditing({ ...editing!, name: e.target.value }) : setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="border rounded px-3 py-2" placeholder="Platform (e.g. amazon/generic)"
                 value={editing ? (editing.platform || "") : (form.platform || "")}
                 onChange={e => editing ? setEditing({ ...editing!, platform: e.target.value }) : setForm(f => ({ ...f, platform: e.target.value }))} />
          <input className="border rounded px-3 py-2" placeholder="Job type (e.g. amazon_api/info_bulk)"
                 value={editing ? (editing.job_type || "") : (form.job_type || "")}
                 onChange={e => editing ? setEditing({ ...editing!, job_type: e.target.value }) : setForm(f => ({ ...f, job_type: e.target.value }))} />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={editing ? !!editing.is_active : !!form.is_active}
                   onChange={e => editing ? setEditing({ ...editing!, is_active: e.target.checked }) : setForm(f => ({ ...f, is_active: e.target.checked }))} />
            Active
          </label>
          <textarea className="border rounded px-3 py-2 md:col-span-4" rows={4} placeholder="Prompt text (with {{variables}})"
                    value={editing ? (editing.prompt_text || "") : (form.prompt_text || "")}
                    onChange={e => editing ? setEditing({ ...editing!, prompt_text: e.target.value }) : setForm(f => ({ ...f, prompt_text: e.target.value }))} />
        </div>
        <div className="mt-3 flex gap-2">
          {editing ? (
            <>
              <button onClick={update} className="btn btn-primary">Update</button>
              <button onClick={reset} className="btn btn-outline">Cancel</button>
            </>
          ) : (
            <button onClick={create} className="btn btn-primary">Create</button>
          )}
        </div>
      </div>

      {loading ? <p>Loading…</p> : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-3 py-2 border">ID</th>
              <th className="px-3 py-2 border">Name</th>
              <th className="px-3 py-2 border">Platform</th>
              <th className="px-3 py-2 border">Job Type</th>
              <th className="px-3 py-2 border">Active</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td className="px-3 py-2 border">{p.id}</td>
                <td className="px-3 py-2 border">{p.name}</td>
                <td className="px-3 py-2 border">{p.platform}</td>
                <td className="px-3 py-2 border">{p.job_type}</td>
                <td className="px-3 py-2 border">{p.is_active ? "Yes" : "No"}</td>
                <td className="px-3 py-2 border space-x-2">
                  <button onClick={() => setEditing({ ...p })} className="px-3 py-1 rounded bg-gray-800 text-white">Edit</button>
                  <button onClick={() => remove(p.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </RequireAuth>
  );
}
