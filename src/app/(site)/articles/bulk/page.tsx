"use client";

import React, { useMemo, useState } from "react";
import ModelSelector from "@/components/ModelSelector";
import PublishingDestination from "@/components/PublishingDestination";
import { PublishTarget } from "@/lib/types";
import { apiPost } from "@/lib/api";

/* ============== Local UI-only types ============== */
type SchemaType = "Review" | "BlogPosting" | "Article";
type ImageSource = "google" | "stock";

/* ============== Page Component ============== */
export default function BulkArticlePage() {
  /* ----- Inputs ----- */
  const [model, setModel] = useState("chatgpt");
  const [keywords, setKeywords] = useState("");
  const [sections, setSections] = useState(5);
  const [faqs, setFaqs] = useState(5);

  /* ----- Schema & Meta ----- */
  const [schema, setSchema] = useState<SchemaType>("BlogPosting");
  const [useMeta, setUseMeta] = useState(true);

  /* ----- Images ----- */
  const [imageSource, setImageSource] = useState<ImageSource>("google");
  const [imageCredit, setImageCredit] = useState("");

  /* ----- Publish (NEW TYPES) ----- */
  // IMPORTANT: no union with undefined here.
  const [publish, setPublish] = useState<PublishTarget>({ mode: "none" });

  /* ----- UI State ----- */
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /* ----- Derived ----- */
  const keywordList = useMemo(
    () =>
      keywords
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    [keywords]
  );
  const count = keywordList.length;

  /* ----- Validation ----- */
  const validate = (): string | null => {
    if (!count) return "Please add at least one keyword.";
    if (sections < 3 || sections > 20)
      return "Sections must be between 3 and 20.";
    if (faqs < 0 || faqs > 20) return "FAQs must be between 0 and 20.";

    // schedule হলে ঘণ্টা > 0 হতে হবে (wp/blogger উভয় কেসে)
    if (publish.mode !== "none" && publish.everyHours !== undefined) {
      if (publish.everyHours !== null && publish.everyHours <= 0) {
        return "Enter a valid schedule time in hours (> 0).";
      }
    }
    return null;
  };

  /* ----- Start Job ----- */
  const startJob = async () => {
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setBusy(true);

      const payload = {
        type: "bulk_article",
        model,
        options: {
          keywords: keywordList,
          sections,
          faqs,
          schema_type: schema,
          meta_mode: useMeta ? "auto" : "off",
          image_source: imageSource,
          image_credit: imageCredit || null,
        },
        integrations: { publish }, // <-- নতুন PublishTarget সরাসরি যাবে
      };

      await apiPost("/api/jobs/start", payload);
      alert("✅ Bulk article job created successfully!");
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Failed to start the job.");
    } finally {
      setBusy(false);
    }
  };

  /* ----- Render ----- */
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Bulk Article Generator</h2>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-white p-4 space-y-4">
            {/* Model */}
            <ModelSelector value={model} onChange={setModel} />

            {/* Keywords */}
            <div>
              <label className="block text-sm mb-1">Keywords (1 per line)</label>
              <textarea
                rows={8}
                className="w-full rounded-lg border px-3 py-2"
                placeholder="Enter keywords (one per line)"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>You can paste 1000+ lines — each line = 1 article</span>
                <span>
                  {count} keyword{count !== 1 && "s"}
                </span>
              </div>
            </div>

            {/* Sections & FAQs */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Sections</label>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={sections}
                  onChange={(e) => setSections(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">FAQs</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={faqs}
                  onChange={(e) => setFaqs(Number(e.target.value))}
                  className="w-full rounded-lg border px-3 py-2"
                />
              </div>
            </div>

            {/* Schema + Meta */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Schema Type</label>
                <select
                  value={schema}
                  onChange={(e) => setSchema(e.target.value as SchemaType)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="Review">Review</option>
                  <option value="BlogPosting">Blog</option>
                  <option value="Article">Information</option>
                </select>
              </div>

              <label className="flex items-center gap-2 md:mt-6">
                <input
                  type="checkbox"
                  checked={useMeta}
                  onChange={(e) => setUseMeta(e.target.checked)}
                />
                <span className="text-sm">Include Meta Description</span>
              </label>
            </div>

            {/* Image Settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Image Source</label>
                <select
                  value={imageSource}
                  onChange={(e) =>
                    setImageSource(e.target.value as ImageSource)
                  }
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="google">Google</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">
                  Image Credit (optional)
                </label>
                <input
                  className="w-full rounded-lg border px-3 py-2"
                  value={imageCredit}
                  onChange={(e) => setImageCredit(e.target.value)}
                  placeholder="e.g. Image courtesy of Unsplash"
                />
              </div>
            </div>
          </div>

          {/* Publishing Settings */}
          <div className="rounded-xl border bg-white p-4">
            <PublishingDestination value={publish} onChange={setPublish} />
          </div>
        </div>

        {/* RIGHT */}
        <aside className="space-y-4">
          <div className="rounded-xl border bg-white p-4">
            <h4 className="font-semibold mb-2">Ready?</h4>
            <p className="text-sm text-gray-600">
              This will auto-apply meta, schema, and images (if selected).
            </p>
            <button
              onClick={startJob}
              disabled={busy}
              className="mt-3 w-full rounded-lg bg-green-600 text-white py-2 disabled:opacity-60"
            >
              {busy ? "Starting…" : "Start Bulk Job"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
