"use client";
import { useEffect, useState, Fragment } from "react";
import api, { apiGet, apiPost } from "@/lib/api";

/* ---------- Types ---------- */
type WP = {
  id?: number;
  title: string;
  base_url: string;
  username: string;
  app_password: string;
  default_category_id?: number | null;
  default_status: "draft" | "publish";
  is_active: 0 | 1;
};

type Blogger = {
  id?: number;
  title: string;
  blog_id: string;
  api_key: string;
  is_active: 0 | 1;
};

type AmazonCfg = {
  id?: number;
  title: string;
  access_key: string;
  secret_key?: string; // blank means keep previous
  partnerTag: string;  // UI uses camelCase
  country: string;
  is_active?: 0 | 1;
};

type Tab = "wordpress" | "blogger" | "amazon";

/* ---------- UI helpers ---------- */
const Pill = ({ on }: { on: boolean }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full ${
      on ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
    }`}
  >
    {on ? "On" : "Off"}
  </span>
);

/* safe extract array from different response shapes */
function pickArray<T = any>(o: any, ...keys: string[]): T[] {
  for (const k of keys) {
    const v = o?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return Array.isArray(o) ? (o as T[]) : [];
}

/* ---------- Empty forms ---------- */
const emptyWP: WP = {
  title: "",
  base_url: "",
  username: "",
  app_password: "",
  default_category_id: null,
  default_status: "draft",
  is_active: 1,
};
const emptyB: Blogger = { title: "", blog_id: "", api_key: "", is_active: 1 };
const emptyA: AmazonCfg = {
  title: "",
  access_key: "",
  secret_key: "",
  partnerTag: "",
  country: "amazon.com - United States (US)",
  is_active: 1,
};

export default function WebsiteAndApi() {
  const [tab, setTab] = useState<Tab>("wordpress");

  /* data stores */
  const [wrows, setWrows] = useState<WP[]>([]);
  const [brows, setBrows] = useState<Blogger[]>([]);
  const [arows, setArows] = useState<AmazonCfg[]>([]);

  /* forms */
  const [wform, setWform] = useState<WP>(emptyWP);
  const [bform, setBform] = useState<Blogger>(emptyB);
  const [aform, setAform] = useState<AmazonCfg>(emptyA);

  /* edit ids */
  const [wedit, setWedit] = useState<number | null>(null);
  const [bedit, setBedit] = useState<number | null>(null);
  const [aedit, setAedit] = useState<number | null>(null);

  /* flags */
  const [readOnly, setReadOnly] = useState<{ wp: boolean; bl: boolean; amz: boolean }>({
    wp: false,
    bl: false,
    amz: false,
  });

  /* ---------- Loaders ---------- */

  // Try CRUD endpoint; if fails, fallback to /api/publish/options
  const loadAll = async () => {
    // first try dedicated endpoints; if any fail, mark readOnly for that section
    await Promise.all([loadWP(), loadB(), loadA()]);

    // Fallback (ensures the tables at least show something)
    try {
      const opt = await apiGet<any>("/api/publish/options");
      // wordpressSites
      if (!wrows.length) {
        const wp = pickArray<WP>(opt, "wordpressSites", "items", "rows", "data");
        setWrows(
          (wp || []).map((x: any) => ({
            id: x.id,
            title: x.title,
            base_url: x.base_url ?? "",
            username: x.username ?? "",
            app_password: x.app_password ?? "",
            default_category_id: x.default_category_id ?? null,
            default_status: (x.default_status || "draft") as WP["default_status"],
            is_active: (x.is_active ?? 1) as 0 | 1,
          }))
        );
      }
      // bloggerBlogs
      if (!brows.length) {
        const bl = pickArray<Blogger>(opt, "bloggerBlogs", "items", "rows", "data");
        setBrows((bl || []) as Blogger[]);
      }
      // amazonApis
      if (!arows.length) {
        const am = pickArray<any>(opt, "amazonApis");
        setArows(
          (am || []).map((x: any) => ({
            id: x.id,
            title: x.title,
            access_key: x.access_key ?? "",
            secret_key: "", // never show actual
            partnerTag: x.partnerTag ?? x.partner_tag ?? "",
            country: x.country ?? "amazon.com - United States (US)",
            is_active: (x.is_active ?? 1) as 0 | 1,
          }))
        );
      }
    } catch {
      // ignore – options route might not exist on older builds
    }
  };

  const loadWP = async () => {
    try {
      const r = await apiGet<any>("/api/publish/wordpress");
      const list = pickArray<WP>(r, "data", "items", "rows");
      setWrows(list || []);
      setReadOnly((s) => ({ ...s, wp: false }));
    } catch {
      setReadOnly((s) => ({ ...s, wp: true })); // no CRUD route
    }
  };

  const loadB = async () => {
    try {
      const r = await apiGet<any>("/api/publish/blogger");
      const list = pickArray<Blogger>(r, "data", "items", "rows");
      setBrows(list || []);
      setReadOnly((s) => ({ ...s, bl: false }));
    } catch {
      setReadOnly((s) => ({ ...s, bl: true }));
    }
  };

  const loadA = async () => {
    try {
      const r = await apiGet<any>("/api/publish/amazon");
      const list = pickArray<any>(r, "data", "items", "rows");
      setArows(
        (list || []).map((x: any) => ({
          id: x.id,
          title: x.title,
          access_key: x.access_key ?? "",
          secret_key: "",
          partnerTag: x.partnerTag ?? x.partner_tag ?? "",
          country: x.country ?? "amazon.com - United States (US)",
          is_active: (x.is_active ?? 1) as 0 | 1,
        }))
      );
      setReadOnly((s) => ({ ...s, amz: false }));
    } catch {
      setReadOnly((s) => ({ ...s, amz: true }));
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- WordPress actions ---------- */
  const saveWP = async () => {
    if (readOnly.wp) return alert("This section is read-only on the current backend.");
    if (wedit) await api.put(`/api/publish/wordpress/${wedit}`, wform);
    else await api.post("/api/publish/wordpress", wform);
    setWform(emptyWP);
    setWedit(null);
    await loadWP();
  };
  const delWP = async (id: number) => {
    if (readOnly.wp) return alert("This section is read-only on the current backend.");
    if (!confirm("Delete WordPress site?")) return;
    await api.delete(`/api/publish/wordpress/${id}`);
    await loadWP();
  };
  const testWP = async (id: number) => {
    try {
      const r = await apiPost<{ ok: boolean; message: string }>(
        `/api/publish/wordpress/${id}/test`,
        {}
      );
      alert(r.message || (r.ok ? "OK" : "Failed"));
    } catch {
      alert("Test endpoint not available on this backend.");
    }
  };

  /* ---------- Blogger actions ---------- */
  const saveB = async () => {
    if (readOnly.bl) return alert("This section is read-only on the current backend.");
    if (bedit) await api.put(`/api/publish/blogger/${bedit}`, bform);
    else await api.post("/api/publish/blogger", bform);
    setBform(emptyB);
    setBedit(null);
    await loadB();
  };
  const delB = async (id: number) => {
    if (readOnly.bl) return alert("This section is read-only on the current backend.");
    if (!confirm("Delete Blogger config?")) return;
    await api.delete(`/api/publish/blogger/${id}`);
    await loadB();
  };
  const testB = async (id: number) => {
    try {
      const r = await apiPost<{ ok: boolean; message: string }>(
        `/api/publish/blogger/${id}/test`,
        {}
      );
      alert(r.message || (r.ok ? "OK" : "Failed"));
    } catch {
      alert("Test endpoint not available on this backend.");
    }
  };

  /* ---------- Amazon actions ---------- */
  const saveA = async () => {
    if (readOnly.amz) return alert("This section is read-only on the current backend.");
    const payload = { ...aform, partner_tag: aform.partnerTag }; // backend may expect snake_case
    if (aedit) await api.put(`/api/publish/amazon/${aedit}`, payload);
    else await api.post("/api/publish/amazon", payload);
    setAform(emptyA);
    setAedit(null);
    await loadA();
  };
  const delA = async (id: number) => {
    if (readOnly.amz) return alert("This section is read-only on the current backend.");
    if (!confirm("Delete Amazon API config?")) return;
    await api.delete(`/api/publish/amazon/${id}`);
    await loadA();
  };
  const testA = async (id: number) => {
    try {
      const r = await apiPost<{ ok: boolean; message: string }>(
        `/api/publish/amazon/${id}/test`,
        {}
      );
      alert(r.message || (r.ok ? "OK" : "Failed"));
    } catch {
      alert("Test endpoint not available on this backend.");
    }
  };

  /* ---------- Render ---------- */
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Website & API</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        {(["wordpress", "blogger", "amazon"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg border ${
              tab === t ? "bg-blue-600 text-white border-blue-600" : "bg-white"
            }`}
          >
            {t === "wordpress" ? "WordPress" : t === "blogger" ? "Blogger" : "Amazon API"}
          </button>
        ))}
      </div>

      {/* WORDPRESS */}
      {tab === "wordpress" && (
        <Fragment>
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {wedit ? "Edit WordPress Site" : "Add WordPress Site"}
              </h3>
              {readOnly.wp && (
                <span className="text-xs text-amber-600">
                  Read-only (backend doesn’t expose CRUD routes)
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={wform.title}
                  onChange={(e) => setWform({ ...wform, title: e.target.value })}
                  disabled={readOnly.wp}
                />
              </div>
              <div>
                <label className="text-sm">Base URL</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com"
                  value={wform.base_url}
                  onChange={(e) => setWform({ ...wform, base_url: e.target.value })}
                  disabled={readOnly.wp}
                />
              </div>
              <div>
                <label className="text-sm">Username</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={wform.username}
                  onChange={(e) => setWform({ ...wform, username: e.target.value })}
                  disabled={readOnly.wp}
                />
              </div>
              <div>
                <label className="text-sm">App Password</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  value={wform.app_password ?? ""}
                  onChange={(e) => setWform({ ...wform, app_password: e.target.value })}
                  disabled={readOnly.wp}
                />
              </div>
              <div>
                <label className="text-sm">Default Category ID</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={wform.default_category_id ?? ""}
                  onChange={(e) =>
                    setWform({
                      ...wform,
                      default_category_id: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  disabled={readOnly.wp}
                />
              </div>
              <div>
                <label className="text-sm">Default Status</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={wform.default_status}
                  onChange={(e) =>
                    setWform({
                      ...wform,
                      default_status: e.target.value as WP["default_status"],
                    })
                  }
                  disabled={readOnly.wp}
                >
                  <option value="draft">draft</option>
                  <option value="publish">publish</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!wform.is_active}
                  onChange={(e) => setWform({ ...wform, is_active: e.target.checked ? 1 : 0 })}
                  disabled={readOnly.wp}
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveWP}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                disabled={readOnly.wp}
              >
                Save
              </button>
              {wedit && (
                <button
                  onClick={() => {
                    setWedit(null);
                    setWform(emptyWP);
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">URL</th>
                  <th className="p-2">User</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {wrows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.base_url}</td>
                    <td className="p-2">{r.username}</td>
                    <td className="p-2">
                      <Pill on={!!r.is_active} />
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => {
                          setWedit(r.id!);
                          setWform({ ...emptyWP, ...r });
                        }}
                        disabled={readOnly.wp}
                      >
                        Edit
                      </button>
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => testWP(r.id!)}
                      >
                        Test
                      </button>
                      <button
                        className="border rounded px-2 py-1 text-red-600"
                        onClick={() => delWP(r.id!)}
                        disabled={readOnly.wp}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!wrows.length && (
                  <tr>
                    <td className="p-4" colSpan={5}>
                      No WordPress sites.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}

      {/* BLOGGER */}
      {tab === "blogger" && (
        <Fragment>
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{bedit ? "Edit Blogger" : "Add Blogger"}</h3>
              {readOnly.bl && (
                <span className="text-xs text-amber-600">Read-only (no CRUD routes)</span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={bform.title}
                  onChange={(e) => setBform({ ...bform, title: e.target.value })}
                  disabled={readOnly.bl}
                />
              </div>
              <div>
                <label className="text-sm">Blog ID</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={bform.blog_id}
                  onChange={(e) => setBform({ ...bform, blog_id: e.target.value })}
                  disabled={readOnly.bl}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">API Key</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={bform.api_key}
                  onChange={(e) => setBform({ ...bform, api_key: e.target.value })}
                  disabled={readOnly.bl}
                />
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!bform.is_active}
                  onChange={(e) => setBform({ ...bform, is_active: e.target.checked ? 1 : 0 })}
                  disabled={readOnly.bl}
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveB}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                disabled={readOnly.bl}
              >
                Save
              </button>
              {bedit && (
                <button
                  onClick={() => {
                    setBedit(null);
                    setBform(emptyB);
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Blog ID</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.blog_id}</td>
                    <td className="p-2">
                      <Pill on={!!r.is_active} />
                    </td>
                    <td className="p-2 space-x-2">
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => {
                          setBedit(r.id!);
                          setBform({ ...emptyB, ...r });
                        }}
                        disabled={readOnly.bl}
                      >
                        Edit
                      </button>
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => testB(r.id!)}
                      >
                        Test
                      </button>
                      <button
                        className="border rounded px-2 py-1 text-red-600"
                        onClick={() => delB(r.id!)}
                        disabled={readOnly.bl}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!brows.length && (
                  <tr>
                    <td className="p-4" colSpan={4}>
                      No Blogger configs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}

      {/* AMAZON */}
      {tab === "amazon" && (
        <Fragment>
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{aedit ? "Edit Amazon API" : "Add Amazon API"}</h3>
              {readOnly.amz && (
                <span className="text-xs text-amber-600">Read-only (no CRUD routes)</span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Title</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={aform.title}
                  onChange={(e) => setAform({ ...aform, title: e.target.value })}
                  disabled={readOnly.amz}
                />
              </div>
              <div>
                <label className="text-sm">Access Key</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={aform.access_key}
                  onChange={(e) => setAform({ ...aform, access_key: e.target.value })}
                  disabled={readOnly.amz}
                />
              </div>
              <div>
                <label className="text-sm">Secret Key</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  type="password"
                  value={aform.secret_key ?? ""}
                  onChange={(e) => setAform({ ...aform, secret_key: e.target.value })}
                  disabled={readOnly.amz}
                />
              </div>
              <div>
                <label className="text-sm">Partner Tag</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  value={aform.partnerTag}
                  onChange={(e) => setAform({ ...aform, partnerTag: e.target.value })}
                  disabled={readOnly.amz}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Country</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={aform.country}
                  onChange={(e) => setAform({ ...aform, country: e.target.value })}
                  disabled={readOnly.amz}
                >
                  <option>amazon.com - United States (US)</option>
                  <option>amazon.co.uk - United Kingdom</option>
                  <option>amazon.de - Germany</option>
                  <option>amazon.in - India</option>
                </select>
              </div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!aform.is_active}
                  onChange={(e) => setAform({ ...aform, is_active: e.target.checked ? 1 : 0 })}
                  disabled={readOnly.amz}
                />
                Active
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveA}
                className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                disabled={readOnly.amz}
              >
                Save
              </button>
              {aedit && (
                <button
                  onClick={() => {
                    setAedit(null);
                    setAform(emptyA);
                  }}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="p-2">Title</th>
                  <th className="p-2">Partner Tag</th>
                  <th className="p-2">Country</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {arows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="p-2">{r.title}</td>
                    <td className="p-2">{r.partnerTag}</td>
                    <td className="p-2">{r.country}</td>
                    <td className="p-2 space-x-2">
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => {
                          setAedit(r.id!);
                          setAform({ ...emptyA, ...r, secret_key: "" });
                        }}
                        disabled={readOnly.amz}
                      >
                        Edit
                      </button>
                      <button
                        className="border rounded px-2 py-1"
                        onClick={() => testA(r.id!)}
                      >
                        Test
                      </button>
                      <button
                        className="border rounded px-2 py-1 text-red-600"
                        onClick={() => delA(r.id!)}
                        disabled={readOnly.amz}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!arows.length && (
                  <tr>
                    <td className="p-4" colSpan={4}>
                      No Amazon API configs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Fragment>
      )}
    </div>
  );
}
