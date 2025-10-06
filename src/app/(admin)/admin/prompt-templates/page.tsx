"use client";
import { Fragment, useEffect, useState } from "react";
import api from "@/lib/api";

type Prompt = { id?: number; name: string; section: string; ai_provider_id: number | null; template: string; is_active: number; };
type Provider = { id: number; name: string; model_name: string; };

const empty: Prompt = { name: "", section: "info_article", ai_provider_id: null, template: "", is_active: 1 };

const Toast = ({ message, type, onDismiss }: { message: string, type: 'success' | 'error', onDismiss: () => void }) => {
  useEffect(() => { const t = setTimeout(onDismiss, 2500); return () => clearTimeout(t); }, [onDismiss]);
  return <div className={`fixed bottom-5 right-5 text-white px-4 py-2 rounded ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{message}</div>;
};

export default function PromptTemplates() {
  const [items, setItems] = useState<Prompt[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [form, setForm] = useState<Prompt>(empty);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const load = async () => {
    try {
      const { data: prompts } = await api.get<{ data: Prompt[] }>("/api/admin/prompt-templates");
      const { data: provs   } = await api.get<{ data: Provider[] }>("/api/admin/providers");
      setItems(Array.isArray(prompts) ? prompts : []);
      setProviders(Array.isArray(provs) ? provs : []);
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' });
    }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      const endpoint = form.id ? `/api/admin/prompt-templates/${form.id}` : "/api/admin/prompt-templates";
      const method = form.id ? 'put' : 'post';
      await api[method](endpoint, form);
      setForm(empty);
      await load();
      setToast({ message: "Template Saved!", type: 'success' });
    } catch (e: any) {
      setToast({ message: e.message, type: 'error' });
    }
  };

  const del = async () => {
    if (itemToDelete === null) return;
    try {
      await api.delete(`/api/admin/prompt-templates/${itemToDelete}`);
      await load();
      setToast({ message: "Template Deleted!", type: 'success' });
    } catch (e: any) {
      setToast({ message: "Delete failed.", type: 'error' });
    } finally {
      setItemToDelete(null);
    }
  };

  return (
    <Fragment>
      {toast && <Toast {...toast} onDismiss={() => setToast(null)} />}

      {itemToDelete !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-bold">Delete Template?</h3>
            <p className="my-2 text-gray-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-3">
              <button onClick={() => setItemToDelete(null)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold">📝 Prompt Templates</h1>
          <p className="text-gray-500 mt-1">Create and manage prompt templates for different article types.</p>
        </div>

        <div className="bg-white p-6 border rounded-lg space-y-4">
          <h2 className="text-xl font-semibold">{form.id ? 'Edit Template' : 'Add New Template'}</h2>

          <input className="border rounded px-3 py-2 w-full" placeholder="Template Name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

          <div className="grid md:grid-cols-2 gap-4">
            <select className="border rounded px-3 py-2 w-full" value={form.section} onChange={e => setForm({ ...form, section: e.target.value })}>
              <option value="info_article">Info Article</option>
              <option value="amazon_review">Amazon Review (Bulk)</option>
              <option value="manual_review">Manual Review</option>
              <option value="single_product_review">Single Product Review</option>
            </select>

            <select className="border rounded px-3 py-2 w-full"
              value={form.ai_provider_id ?? ''} onChange={e => setForm({ ...form, ai_provider_id: e.target.value ? parseInt(e.target.value) : null })}>
              <option value="">-- Select AI Provider --</option>
              {providers.map(p => <option key={p.id} value={p.id}>{p.name} - {p.model_name}</option>)}
            </select>
          </div>

          <textarea rows={8} className="border rounded px-3 py-2 w-full font-mono text-sm"
            placeholder="Template text... (use {{keyword}} for replacement)"
            value={form.template} onChange={e => setForm({ ...form, template: e.target.value })} />

          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={!!form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} /> Active
          </label>

          <div className="flex gap-3 pt-2">
            <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded">Save Template</button>
            <button onClick={() => setForm(empty)} className="border px-4 py-2 rounded">Reset</button>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Saved Templates</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-600 border-b">
              <th className="p-2">Name</th><th className="p-2">Section</th><th className="p-2">Status</th><th className="p-2">Actions</th>
            </tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t odd:bg-gray-50">
                  <td className="p-2 font-medium">{p.name}</td>
                  <td className="p-2">{p.section}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${p.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-2">
                    <button onClick={() => setForm(p)} className="mr-2 border px-3 py-1 rounded">Edit</button>
                    <button onClick={() => setItemToDelete(p.id!)} className="border px-3 py-1 text-red-600 rounded">Delete</button>
                  </td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={4} className="text-center py-8 text-gray-500">No templates configured yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
}
