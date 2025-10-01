// File: affiliated-writer/affiliated-writer-dashboard/src/app/articles/amazon/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import ModelSelector from "@/components/ModelSelector";
import CtaPreview from "@/components/CtaPreview";
import { apiGet, apiPost } from "@/lib/api";

/* -------------------- Types -------------------- */
type SlugMode = "keyword" | "title";
type SchemaType = "Review" | "BlogPosting" | "Article";
type Availability = "any" | "in_stock";

type WpSite = {
  id: number;
  title: string;
  base_url?: string | null;
  default_category_id: number | null;
  default_status: string;
};
type WpCategory = { id: number; name: string };
type BloggerBlog = { id: number; title: string; blog_id: string };
type AmazonApi = { id: number; title: string; partnerTag?: string; country?: string };

type PublishMode = "editor" | "wordpress" | "blogger";
type PublishStatus = "draft" | "publish" | "schedule";
type PublishTarget = {
  mode: PublishMode;
  wordpress?: { websiteId: number | null; categoryId: number | null; status: PublishStatus };
  blogger?: { blogId: number | null; status: PublishStatus };
  schedule?: { everyHours: number };
};

/* -------------------- Utils -------------------- */
function pickArray<T = any>(obj: any, ...keys: string[]): T[] {
  for (const k of keys) {
    const v = obj?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

/* ==================== Component ==================== */
export default function AmazonBulkPage() {
  /* Model */
  const [model, setModel] = useState<string>("chatgpt");

  /* Article options */
  const [keywords, setKeywords] = useState<string>("");
  const [autoTitle, setAutoTitle] = useState<boolean>(true);
  const [slugMode, setSlugMode] = useState<SlugMode>("keyword");
  const [schema, setSchema] = useState<SchemaType>("Review");

  // Meta description (new)
  const [includeMeta, setIncludeMeta] = useState<boolean>(true);
  const [metaNote, setMetaNote] = useState<string>(""); // optional guidance

  /* CTA */
  const [ctaStyle, setCtaStyle] = useState<string>("solid");
  const [btnColor, setBtnColor] = useState<string>("#22c55e");
  const [txtColor, setTxtColor] = useState<string>("#ffffff");

  /* Amazon source */
  const [useSavedApi, setUseSavedApi] = useState<boolean>(true);
  const [apiId, setApiId] = useState<number | "">("");
  const [amazonApis, setAmazonApis] = useState<AmazonApi[]>([]);

  // Fallback (only tracking id)
  const [fallbackTag, setFallbackTag] = useState<string>("");
  const [fallbackCountry, setFallbackCountry] = useState<string>("amazon.com - United States (US)");

  /* Filters */
  const [perArticle, setPerArticle] = useState<number>(10);
  const [minRating, setMinRating] = useState<number>(4);
  const [availability, setAvailability] = useState<Availability>("any");
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);

  /* Publish */
  const [publish, setPublish] = useState<PublishTarget>({
    mode: "editor",
    wordpress: { websiteId: null, categoryId: null, status: "draft" },
    blogger: { blogId: null, status: "draft" },
    schedule: { everyHours: 6 },
  });
  const [wpSites, setWpSites] = useState<WpSite[]>([]);
  const [wpCats, setWpCats] = useState<WpCategory[]>([]);
  const [blogs, setBlogs] = useState<BloggerBlog[]>([]);

  /* UI */
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  /* -------- Load publishing options (single call) -------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<any>("/api/publish/options");
        setAmazonApis(pickArray<AmazonApi>(res, "amazonApis", "data", "items", "rows"));
        setWpSites(pickArray<WpSite>(res, "wordpressSites", "data", "items", "rows"));
        setBlogs(pickArray<BloggerBlog>(res, "bloggerBlogs", "data", "items", "rows"));
      } catch {
        setAmazonApis([]); setWpSites([]); setBlogs([]);
      }
    })();
  }, []);

  /* -------- Load WP categories when site changes -------- */
  useEffect(() => {
    const wid = publish.wordpress?.websiteId ?? null;
    if (!wid) {
      setWpCats([]);
      setPublish(p => ({ ...p, wordpress: { ...(p.wordpress || { status: "draft" }), categoryId: null } }));
      return;
    }
    (async () => {
      try {
        const res = await apiGet<any>(`/api/publish/wp-categories/${wid}`);
        const cats = pickArray<WpCategory>(res, "categories", "data", "items");
        setWpCats(Array.isArray(cats) ? cats : []);
        const site = wpSites.find(w => w.id === wid);
        setPublish(p => ({
          ...p,
          wordpress: {
            ...(p.wordpress || { status: "draft" }),
            websiteId: wid,
            categoryId: p.wordpress?.categoryId ?? (site?.default_category_id ?? null),
            status: p.wordpress?.status ?? "draft",
          },
        }));
      } catch {
        setWpCats([]);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publish.wordpress?.websiteId]);

  /* Derived */
  const keywordList = useMemo(
    () => keywords.split("\n").map(s => s.trim()).filter(Boolean),
    [keywords]
  );

  /* Validate */
  const validate = (): string | null => {
    if (keywordList.length === 0) return "Add at least one keyword.";
    if (useSavedApi && (apiId === "" || Number.isNaN(Number(apiId))))
      return "Please choose a saved Amazon API or uncheck the option.";
    if (!useSavedApi && fallbackTag.trim() === "")
      return "Please enter your Amazon tracking ID (store/partner tag).";

    if (publish.mode === "wordpress") {
      const wid = publish.wordpress?.websiteId ?? null;
      if (!wid) return "Choose a WordPress website.";
      const st = publish.wordpress?.status ?? "draft";
      if (st === "schedule" && (publish.schedule?.everyHours ?? 0) <= 0)
        return "Enter schedule hours (> 0).";
    } else if (publish.mode === "blogger") {
      const bid = publish.blogger?.blogId ?? null;
      if (!bid) return "Choose a Blogger blog.";
      const st = publish.blogger?.status ?? "draft";
      if (st === "schedule" && (publish.schedule?.everyHours ?? 0) <= 0)
        return "Enter schedule hours (> 0).";
    }
    if (priceMin != null && priceMax != null && priceMin > priceMax)
      return "Price range is invalid (Min should be <= Max).";
    return null;
  };

  /* Helpers to set statuses */
  const setWpStatus = (status: PublishStatus) =>
    setPublish(p => ({ ...p, wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null }), status } }));
  const setBlogStatus = (status: PublishStatus) =>
    setPublish(p => ({ ...p, blogger: { ...(p.blogger || { blogId: null }), status } }));

  /* Start job */
  const start = async () => {
    setError("");
    const v = validate();
    if (v) { setError(v); return; }

    setBusy(true);
    try {
      const payload = {
        type: "amazon_bulk",
        model,
        options: {
          auto_title: autoTitle ? 1 : 0,
          slug_mode: slugMode,
          schema_type: schema,
          include_meta: includeMeta ? 1 : 0,
          meta_note: metaNote || null,
          cta_style: ctaStyle,
          cta_color: btnColor,
          cta_text_color: txtColor,
          keywords: keywordList,
          filter: {
            per_article: perArticle,
            min_rating: minRating,
            availability,
            price_min: priceMin,
            price_max: priceMax,
          },
        },
        integrations: {
          amazon: useSavedApi
            ? { integration_id: Number(apiId) }
            : { tracking_id: fallbackTag.trim(), country: fallbackCountry, surcharge: 100 },
          publish,
        },
      };
      await apiPost("/api/jobs/start", payload);
      alert("Job created!");
    } catch (e: any) {
      setError(e?.message || "Failed to start job");
    } finally {
      setBusy(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Amazon Review Article (Bulk)</h2>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* === Model + Meta === */}
          <div className="rounded-xl border bg-white p-4 space-y-4">
            <ModelSelector value={model} onChange={setModel} />

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">AI Generated Title</label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={autoTitle} onChange={e => setAutoTitle(e.target.checked)} />
                  Auto-generate
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug Mode</label>
                <select
                  value={slugMode}
                  onChange={e => setSlugMode(e.target.value as SlugMode)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="keyword">Use keyword</option>
                  <option value="title">Use title</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Schema</label>
                <select
                  value={schema}
                  onChange={e => setSchema(e.target.value as SchemaType)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="Review">Review</option>
                  <option value="BlogPosting">Blog</option>
                  <option value="Article">Information</option>
                </select>
              </div>
            </div>

            {/* Meta Description */}
            <div className="grid md:grid-cols-3 gap-4">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={includeMeta} onChange={e => setIncludeMeta(e.target.checked)} />
                Include Meta Description
              </label>
              <div className="md:col-span-2">
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  placeholder="(Optional) guidance for meta description…"
                  value={metaNote}
                  onChange={(e) => setMetaNote(e.target.value)}
                  disabled={!includeMeta}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Keywords (1 per line)</label>
              <textarea
                rows={10}
                className="w-full rounded-lg border px-3 py-2"
                placeholder={"Best car camera for night vision\n4k webcam for streaming\n…"}
                value={keywords}
                onChange={e => setKeywords(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CTA Button</label>
              <CtaPreview
                styleId={ctaStyle}
                onStyleChange={setCtaStyle}
                btnColor={btnColor}
                onBtnColor={setBtnColor}
                textColor={txtColor}
                onTextColor={setTxtColor}
              />
            </div>
          </div>

          {/* === Amazon Source === */}
          <div className="rounded-xl border bg-white p-4 space-y-4">
            <h3 className="font-semibold text-lg">Amazon Source</h3>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useSavedApi} onChange={e => setUseSavedApi(e.target.checked)} />
              Use Saved Amazon API (recommended)
            </label>

            {useSavedApi ? (
              <div>
                <label className="block text-sm font-medium mb-1">Select Amazon API</label>
                <select
                  className="w-full rounded-lg border px-3 py-2"
                  value={apiId}
                  onChange={(e) => setApiId(e.target.value ? Number(e.target.value) : "")}
                >
                  <option value="">— Choose API —</option>
                  {amazonApis.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.title}{a.partnerTag ? ` — ${a.partnerTag}` : ""}
                    </option>
                  ))}
                </select>
                {!amazonApis.length && (
                  <p className="text-xs text-amber-600 mt-1">
                    No saved Amazon API found. You can add one from <b>Website And Api → Amazon API</b>.
                  </p>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Amazon Store/Tracking ID</label>
                  <input
                    className="w-full rounded-lg border px-3 py-2"
                    value={fallbackTag}
                    onChange={e => setFallbackTag(e.target.value)}
                    placeholder="mystore-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={fallbackCountry}
                    onChange={e => setFallbackCountry(e.target.value)}
                  >
                    <option>amazon.com - United States (US)</option>
                    <option>amazon.co.uk - United Kingdom</option>
                    <option>amazon.de - Germany</option>
                    <option>amazon.in - India</option>
                  </select>
                </div>
                <div className="md:col-span-2 text-xs text-amber-600">
                  Without Amazon API, system will use tracking ID only and charge <b>+100 credits</b> per article.
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-1">Products per article</label>
                <input
                  type="number" min={3} max={20}
                  value={perArticle}
                  onChange={e => setPerArticle(Number(e.target.value || 10))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Product availability</label>
                <select
                  value={availability}
                  onChange={e => setAvailability(e.target.value as Availability)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="any">Any</option>
                  <option value="in_stock">In Stock only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Minimum rating</label>
                <select
                  value={minRating}
                  onChange={e => setMinRating(Number(e.target.value || 4))}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  {[3, 3.5, 4, 4.5, 5].map(r => <option key={r} value={r}>{r}+</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Price range</label>
                <div className="flex gap-2">
                  <input
                    type="number" placeholder="Min"
                    value={priceMin ?? ""}
                    onChange={e => setPriceMin(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                  <input
                    type="number" placeholder="Max"
                    value={priceMax ?? ""}
                    onChange={e => setPriceMax(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* === Publishing === */}
          <div className="rounded-xl border bg-white p-4 space-y-4">
            <h3 className="font-semibold text-lg">Publishing</h3>

            {/* Mode tabs */}
            <div className="flex gap-2">
              {(["wordpress", "blogger", "editor"] as PublishMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setPublish(p => ({ ...p, mode: m }))}
                  className={`rounded border px-3 py-1.5 text-sm ${publish.mode === m ? "bg-gray-100" : "hover:bg-gray-50"}`}
                >
                  {m[0].toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>

            {/* WordPress */}
            {publish.mode === "wordpress" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Select WordPress Website</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.wordpress?.websiteId ?? ""}
                    onChange={e =>
                      setPublish(p => ({
                        ...p,
                        wordpress: {
                          ...(p.wordpress || { status: "draft" }),
                          websiteId: e.target.value ? Number(e.target.value) : null,
                          categoryId: p.wordpress?.categoryId ?? null,
                        },
                      }))
                    }
                  >
                    <option value="">— Select —</option>
                    {wpSites.map(w => <option key={w.id} value={w.id}>{w.title}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Select Category</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.wordpress?.categoryId ?? ""}
                    onChange={e =>
                      setPublish(p => ({
                        ...p,
                        wordpress: {
                          ...(p.wordpress || { websiteId: null, status: "draft" }),
                          categoryId: e.target.value === "" ? null : Number(e.target.value),
                        },
                      }))
                    }
                    disabled={!wpCats.length}
                  >
                    <option value="">— Select —</option>
                    {wpCats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Status</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={publish.wordpress?.status ?? "draft"}
                      onChange={e => setWpStatus(e.target.value as PublishStatus)}
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
                        type="number" min={1}
                        className="w-full rounded-lg border px-3 py-2"
                        value={publish.schedule?.everyHours ?? 6}
                        onChange={e => setPublish(p => ({ ...p, schedule: { everyHours: Math.max(1, Number(e.target.value || 6)) } }))}
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
                  <label className="block text-sm font-medium mb-1">Select Blogger Blog</label>
                  <select
                    className="w-full rounded-lg border px-3 py-2"
                    value={publish.blogger?.blogId ?? ""}
                    onChange={e => setPublish(p => ({ ...p, blogger: { ...(p.blogger || { status: "draft" }), blogId: e.target.value ? Number(e.target.value) : null } }))}
                  >
                    <option value="">— Select —</option>
                    {blogs.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Post Status</label>
                    <select
                      className="w-full rounded-lg border px-3 py-2"
                      value={publish.blogger?.status ?? "draft"}
                      onChange={e => setBlogStatus(e.target.value as PublishStatus)}
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
                        type="number" min={1}
                        className="w-full rounded-lg border px-3 py-2"
                        value={publish.schedule?.everyHours ?? 6}
                        onChange={e => setPublish(p => ({ ...p, schedule: { everyHours: Math.max(1, Number(e.target.value || 6)) } }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {publish.mode === "editor" && (
              <div className="text-sm text-gray-600">Articles will be generated and saved in the editor only.</div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Ready?</h4>
            <p className="text-sm text-gray-600">Click start to create article jobs. Images are taken from Amazon automatically.</p>
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
