"use client";

import { useEffect, useState } from "react";
import api, { apiGet, apiPost } from "@/lib/api";

type UserRow = {
  id: number;
  name?: string | null;
  email: string;
  credits: number;
  credits_expiry: string | null;
};

type UsersResp =
  | UserRow[]
  | { users?: UserRow[]; data?: UserRow[]; items?: UserRow[] };

export default function CreditsPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // inline edit state
  const [editing, setEditing] = useState<{
    id: number;
    credits: number;
    expiry: string; // "" or YYYY-MM-DD
  } | null>(null);

  const normalize = (r: UsersResp): UserRow[] =>
    Array.isArray(r) ? r : r.users ?? r.data ?? r.items ?? [];

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);
      const data = await apiGet<UsersResp>("/api/admin/users");
      setRows(normalize(data));
    } catch (e: any) {
      setErr(e?.message || "Failed to load users");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (id: number, delta: number) => {
    try {
      await apiPost("/api/admin/credits/adjust", { user_id: id, delta });
      await load();
    } catch {
      try {
        await api.post(`/api/admin/credits/${id}`, { delta });
        await load();
      } catch (e: any) {
        alert(e?.message || "Failed to update credits");
      }
    }
  };

  const startEdit = (u: UserRow) =>
    setEditing({
      id: u.id,
      credits: Number(u.credits || 0),
      expiry: u.credits_expiry ?? "",
    });

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await api.put(`/api/admin/users/${editing.id}`, {
        credits: editing.credits,
        credits_expiry: editing.expiry || null,
      });
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e?.message || "Save failed");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Credits Manager</h2>

      <div className="rounded-xl border bg-white overflow-hidden">
        <div className="grid grid-cols-6 gap-2 px-4 py-3 font-medium text-sm border-b bg-gray-50">
          <div>User</div>
          <div>Credits</div>
          <div>Expiry</div>
          <div className="col-span-2">Adjust</div>
          <div>Action</div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading…</div>
        ) : err ? (
          <div className="p-6 text-sm text-red-600">{err}</div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No users found</div>
        ) : (
          rows.map((u) => {
            const isEditing = editing?.id === u.id;
            return (
              <div
                key={u.id}
                className="grid grid-cols-6 gap-2 px-4 py-3 border-t text-sm items-center"
              >
                <div>
                  <div className="font-medium">{u.name || `User #${u.id}`}</div>
                  <div className="text-gray-500">{u.email}</div>
                </div>

                {/* Credits cell */}
                <div>
                  {isEditing ? (
                    <input
                      type="number"
                      className="w-28 border rounded px-2 py-1"
                      value={editing!.credits}
                      onChange={(e) =>
                        setEditing((s) =>
                          s ? { ...s, credits: Number(e.target.value) } : s
                        )
                      }
                    />
                  ) : (
                    u.credits
                  )}
                </div>

                {/* Expiry cell */}
                <div>
                  {isEditing ? (
                    <input
                      type="date"
                      className="border rounded px-2 py-1"
                      value={editing!.expiry ?? ""}
                      onChange={(e) =>
                        setEditing((s) =>
                          s ? { ...s, expiry: e.target.value } : s
                        )
                      }
                    />
                  ) : (
                    u.credits_expiry || "—"
                  )}
                </div>

                {/* Quick adjust */}
                <div className="col-span-2 flex gap-2">
                  <button
                    className="rounded border px-2 py-1 hover:bg-gray-50"
                    onClick={() => adjust(u.id, +100)}
                    disabled={isEditing}
                  >
                    +100
                  </button>
                  <button
                    className="rounded border px-2 py-1 hover:bg-gray-50"
                    onClick={() => adjust(u.id, -100)}
                    disabled={isEditing}
                  >
                    -100
                  </button>
                </div>

                {/* Action */}
                <div>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-blue-600 text-white"
                        onClick={saveEdit}
                      >
                        Save
                      </button>
                      <button
                        className="px-3 py-1 rounded border"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => startEdit(u)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
