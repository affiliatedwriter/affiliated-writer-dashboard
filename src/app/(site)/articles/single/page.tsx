// File: src/app/articles/single/page.tsx
"use client";

import { useEffect, useState } from "react";
import ModelSelector from "@/components/ModelSelector";
import CtaPreview from "@/components/CtaPreview";
import AmazonPicker from "@/components/AmazonPicker";
import api from "@/lib/api";

/* ---------- Types ---------- */
type SlugMode = "keyword" | "title";
type PublishMode = "editor" | "wordpress" | "blogger";
type PublishStatus = "draft" | "publish" | "schedule";

type WpSite = {
  id: number;
  title: string;
  base_url?: string | null;
  default_category_id: number | null;
  default_status: string;
};
type WpCategory = { id: number; name: string };
type BloggerBlog = { id: number; title: string; blog_id: string };

type PublishTarget = {
  mode: PublishMode;
  wordpress?: { websiteId: number | null; categoryId: number | null; status: PublishStatus };
  blogger?: { blogId: number | null; status: PublishStatus };
  schedule?: { everyHours: number };
};

export default function AmazonSinglePage() {
  /* ========= Model & CTA ========= */
  const [model, setModel] = useState<string>("chatgpt");
  const [ctaStyle, setCtaStyle] = useState<string>("solid");
  const [btnColor, setBtnColor] = useState<string>("#22c55e");
  const [txtColor, setTxtColor] = useState<string>("#ffffff");

  /* ========= Inputs ========= */
  const [keyword, setKeyword] = useState<string>("");
  const [asin, setAsin] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [affiliate, setAffiliate] = useState<string>("");

  const [autoTitle, setAutoTitle] = useState<boolean>(true);
  const [slugMode, setSlugMode] = useState<SlugMode>("keyword");

  /* ========= Amazon source ========= */
  const [useSavedApi, setUseSavedApi] = useState<boolean>(true);
  const [apiId, setApiId] = useState<number | "">("");
  const [fallbackTag, setFallbackTag] = useState<string>("");
  const [fallbackCountry, setFallbackCountry] = useState<string>(
    "amazon.com - United States (US)"
  );

  /* ========= Publishing ========= */
  const [publish, setPublish] = useState<PublishTarget>({
    mode: "editor",
    wordpress: { websiteId: null, categoryId: null, status: "draft" },
    blogger: { blogId: null, status: "draft" },
    schedule: { everyHours: 6 },
  });

  const [wpSites, setWpSites] = useState<WpSite[]>([]);
  const [wpCats, setWpCats] = useState<WpCategory[]>([]);
  const [blogs, setBlogs] = useState<BloggerBlog[]>([]);

  /* ========= UI ========= */
  const [busy, setBusy] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");

  /* ---------- Load destinations ---------- */
  useEffect(() => {
    (async () => {
      try {
        const wp = await api.get<{ data?: WpSite[]; items?: WpSite[]; rows?: WpSite[] }>(
          "/api/publish/wordpress"
        );
        const list = (wp?.data ?? wp?.items ?? wp?.rows ?? []) as WpSite[];
        setWpSites(Array.isArray(list) ? list : []);
      } catch {
        setWpSites([]);
      }
      try {
        const bl = await api.get<{ data?: BloggerBlog[]; items?: BloggerBlog[] }>(
          "/api/publish/blogger"
        );
        const list = (bl?.data ?? bl?.items ?? []) as BloggerBlog[];
        setBlogs(Array.isArray(list) ? list : []);
      } catch {
        setBlogs([]);
      }
    })();
  }, []);

  /* ---------- Load WP categories when site changes ---------- */
  useEffect(() => {
    const wid = publish.wordpress?.websiteId ?? null;
    if (!wid) {
      setWpCats([]);
      setPublish((p) => ({
        ...p,
        wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }), categoryId: null },
      }));
      return;
    }
    (async () => {
      try {
        const res = await api.get<{ categories?: WpCategory[]; data?: WpCategory[]; items?: WpCategory[] }>(
          `/api/publish/wp-categories/${wid}`
        );
        const cats = (res?.categories ?? res?.data ?? res?.items ?? []) as WpCategory[];
        setWpCats(Array.isArray(cats) ? cats : []);
        // prefill with site's default category, if any
        const site = wpSites.find((w) => w.id === wid);
        setPublish((p) => ({
          ...p,
          wordpress: {
            ...(p.wordpress || { status: "draft", websiteId: wid }),
            websiteId: wid,
            categoryId: p.wordpress?.categoryId ?? site?.default_category_id ?? null,
          },
        }));
      } catch {
        setWpCats([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publish.wordpress?.websiteId]);

  /* ---------- Helpers ---------- */
  const setWpStatus = (status: PublishStatus) =>
    setPublish((p) => ({ ...p, wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }), status } }));

  const setBlogStatus = (status: PublishStatus) =>
    setPublish((p) => ({ ...p, blogger: { ...(p.blogger || { blogId: null }), status } }));

  const validate = (): string | null => {
    if (!asin.trim() && !url.trim()) return "Provide ASIN or Product URL.";
    if (useSavedApi && (apiId === "" || Number.isNaN(Number(apiId))))
      return "Choose a saved Amazon API or uncheck the option.";
    if (!useSavedApi && fallbackTag.trim() === "") return "Enter your Amazon tracking ID.";

    if (publish.mode === "wordpress") {
      const wid = publish.wordpress?.websiteId ?? null;
      if (!wid) return "Choose a WordPress website.";
      if (publish.wordpress?.status === "schedule" && (publish.schedule?.everyHours ?? 0) <= 0)
        return "Enter schedule hours (> 0).";
    }
    if (publish.mode === "blogger") {
      const bid = publish.blogger?.blogId ?? null;
      if (!bid) return "Choose a Blogger blog.";
      if (publish.blogger?.status === "schedule" && (publish.schedule?.everyHours ?? 0) <= 0)
        return "Enter schedule hours (> 0).";
    }
    return null;
  };

  /* ---------- Start job ---------- */
  const start = async () => {
    setErr("");
    const v = validate();
    if (v) {
      setErr(v);
      return;
    }
    setBusy(true);
    try {
      const payload = {
        type: "amazon_single",
        model,
        options: {
          keyword: keyword.trim() || null,
          asin: asin.trim() || null,
          product_url: url.trim() || null,
          affiliate_link: affiliate.trim() || null,
          auto_title: autoTitle ? 1 : 0,
          slug_mode: slugMode,
          cta_style: ctaStyle,
          cta_color: btnColor,
          cta_text_color: txtColor,
        },
        integrations: {
          amazon: useSavedApi
            ? { integration_id: Number(apiId) }
            : { tracking_id: fallbackTag.trim(), country: fallbackCountry, surcharge: 100 },
          publish,
        },
      };
      await api.post("/api/jobs/start", payload);
      alert("Job created!");
    } catch (e: any) {
      setErr(e?.message || "Failed to create job");
    } finally {
      setBusy(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Amazon Single Product Review</h2>

      {err && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {err}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-4 space-y-4">
            <ModelSelector value={model} onChange={setModel} />

            <input
              className="w-full rounded-lg border px-3 py-2"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Primary keyword (optional)"
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={asin}
              onChange={(e) => setAsin(e.target.value)}
              placeholder="ASIN (e.g. B0CXXXXXXX)"
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Amazon Product URL (optional if ASIN provided)"
            />
            <input
              className="w-full rounded-lg border px-3 py-2"
              value={affiliate}
              onChange={(e) => setAffiliate(e.target.value)}
              placeholder="Affiliate link override (optional)"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoTitle}
                  onChange={(e) => setAutoTitle(e.target.checked)}
                />
                Auto-generate Title
              </label>

              <select
                value={slugMode}
                onChange={(e) => setSlugMode(e.target.value as SlugMode)}
                className="w-full rounded-lg border px-3 py-2"
              >
                <option value="keyword">Slug from keyword</option>
                <option value="title">Slug from title</option>
              </select>
            </div>

            <CtaPreview
              styleId={ctaStyle}
              onStyleChange={setCtaStyle}
              btnColor={btnColor}
              onBtnColor={setBtnColor}
              textColor={txtColor}
              onTextColor={setTxtColor}
            />
          </div>

          {/* Amazon Source */}
          <div className="rounded-xl border bg-white p-4 space-y-3">
            <h3 className="font-semibold">Amazon Source</h3>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={useSavedApi}
                onChange={(e) => setUseSavedApi(e.target.checked)}
              />
              Use Saved Amazon API (recommended)
            </label>

            {useSavedApi ? (
              <AmazonPicker value={apiId} onChange={setApiId} />
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Amazon Store/Tracking ID
                  </label>
                  <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={fallbackTag}
                    onChange={(e) => setFallbackTag(e.target.value)}
                    placeholder="mystore-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={fallbackCountry}
                    onChange={(e) => setFallbackCountry(e.target.value)}
                  >
                    <option>amazon.com - United States (US)</option>
                    <option>amazon.co.uk - United Kingdom</option>
                    <option>amazon.de - Germany</option>
                    <option>amazon.in - India</option>
                  </select>
                </div>
                <div className="md:col-span-2 text-xs text-amber-600">
                  Without Amazon API, system will use tracking ID only and charge <b>+100 credits</b>.
                </div>
              </div>
            )}
          </div>

          {/* Publishing */}
          <div className="rounded-xl border bg-white p-4 space-y-4">
            <h3 className="font-semibold text-lg">Publishing</h3>

            <div className="flex gap-2">
              {(["wordpress", "blogger", "editor"] as PublishMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setPublish((p) => ({ ...p, mode: m }))}
                  className={`rounded border px-3 py-1.5 text-sm ${
                    publish.mode === m ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* WordPress */}
            {publish.mode === "wordpress" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select WordPress Website
                  </label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.wordpress?.websiteId ?? ""}
                    onChange={(e) =>
                      setPublish((p) => ({
                        ...p,
                        wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }) },
                          websiteId: e.target.value ? Number(e.target.value) : null,
                          categoryId: p.wordpress?.categoryId ?? null,
                        },
                      }));
                    >
                    <option value="">— Select —</option>
                    {wpSites.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Category</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.wordpress?.categoryId ?? ""}
                    onChange={(e) =>
                      setPublish((p) => ({
                        ...p,
                        wordpress: {
                          ...(p.wordpress || { websiteId: null, status: "draft" }),
                          categoryId: e.target.value === "" ? null : Number(e.target.value),
                        },
                      }));
                    }
                    disabled={!wpCats.length}
                  >
                    <option value="">— Select —</option>
                    {wpCats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Status</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={publish.wordpress?.status ?? "draft"}
                      onChange={(e) => setWpStatus(e.target.value as PublishStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="schedule">Schedule</option>
                    </select>
                  </div>

                  {publish.wordpress?.status === "schedule" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Every (hours)</label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border px-3 py-2"
                        value={publish.schedule?.everyHours ?? 6}
                        onChange={(e) =>
                          setPublish((p) => ({
                            ...p,
                            schedule: { everyHours: Math.max(1, Number(e.target.value || 6)) },
                          }));
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Blogger */}
            {publish.mode === "blogger" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Select Blogger Blog
                  </label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.blogger?.blogId ?? ""}
                    onChange={(e) =>
                      setPublish((p) => ({
                        ...p,
                        blogger: {
                          ...(p.blogger || { status: "draft" }),
                          blogId: e.target.value ? Number(e.target.value) : null,
                        },
                      }));
                    >
                    <option value="">— Select —</option>
                    {blogs.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Status</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={publish.blogger?.status ?? "draft"}
                      onChange={(e) => setBlogStatus(e.target.value as PublishStatus)}
                    >
                      <option value="draft">Draft</option>
                      <option value="publish">Publish</option>
                      <option value="schedule">Schedule</option>
                    </select>
                  </div>

                  {publish.blogger?.status === "schedule" && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Every (hours)</label>
                      <input
                        type="number"
                        min={1}
                        className="w-full rounded-lg border px-3 py-2"
                        value={publish.schedule?.everyHours ?? 6}
                        onChange={(e) =>
                          setPublish((p) => ({
                            ...p,
                            schedule: { everyHours: Math.max(1, Number(e.target.value || 6)) },
                          }));
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {publish.mode === "editor" && (
              <div className="text-sm text-gray-600">
                The article will be generated and saved in the editor only.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Ready?</h4>
            <p className="text-sm text-gray-600">
              Provide ASIN or URL, then click Start. Images & ALT will auto-apply.
            </p>
            <button
              onClick={start}
              disabled={busy}
              className="mt-3 w-full rounded-lg bg-green-600 text-white py-2 disabled:opacity-60"
            >
              {busy ? "Starting…" : "Start"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
