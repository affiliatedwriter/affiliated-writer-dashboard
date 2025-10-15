// src/app/(site)/articles/manual/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import ModelSelector from "@/components/ModelSelector";
import PublishingDestination from "@/components/PublishingDestination";
import api, { apiPost } from "@/lib/api";
import type { PublishTarget, PublishStatus } from "@/lib/types";

type SchemaType = "Review" | "BlogPosting" | "Article";
type ImageSource = "google" | "stock";

export default function ManualArticlePage() {
  /* ===== Inputs (single article) ===== */
  const [model, setModel] = useState("chatgpt");
  const [topic, setTopic] = useState("");
  const [outline, setOutline] = useState("");
  const [sections, setSections] = useState(6);
  const [faqs, setFaqs] = useState(4);

  /* ===== Meta & images ===== */
  const [schema, setSchema] = useState<SchemaType>("BlogPosting");
  const [useMeta, setUseMeta] = useState(true);
  const [imageSource, setImageSource] = useState<ImageSource>("google");
  const [imageCredit, setImageCredit] = useState("");

  /* ===== Publish (union shape) ===== */
  const [publish, setPublish] = useState<PublishTarget>({ mode: "editor" });

  /* ===== UI ===== */
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /* ===== Derived ===== */
  const hasTopic = useMemo(() => topic.trim().length > 0, [topic]);

  /* ===== Validation ===== */
  const validate = (): string | null => {
    if (!hasTopic) return "Please enter a topic/title.";
    if (sections < 3 || sections > 20) return "Sections must be between 3 and 20.";
    if (faqs < 0 || faqs > 20) return "FAQs must be between 0 and 20.";
    if ((publish.mode === "wp" || publish.mode === "blogger") && publish.status === "schedule") {
      const hrs = (publish as any).everyHours ?? 0;
      if (!hrs || hrs <= 0) return "Enter a valid schedule time in hours (> 0).";
    }
    // উদাহরণ: wp হলে siteId/categoryId null না হওয়া ভাল
    if (publish.mode === "wp") {
      if (publish.siteId == null) return "Select a WordPress Site ID.";
      if (publish.categoryId == null) return "Select a WordPress Category ID.";
    }
    if (publish.mode === "blogger") {
      if (publish.blogId == null) return "Select a Blogger Blog ID.";
    }
    return null;
  };

  /* ===== Start job ===== */
  const startJob = async () => {
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setBusy(true);

      const payload = {
        type: "manual_article",
        model,
        options: {
          topic,
          outline: outline || null,
          sections,
          faqs,
          schema_type: schema,
          meta_mode: useMeta ? "auto" : "off",
          image_source: imageSource,
          image_credit: imageCredit || null,
        },
        integrations: { publish }, // নতুন union শেপ 그대로 পাঠানো হবে
      };

      await apiPost("/api/jobs/start", payload);
      alert("✅ Manual article job created successfully!");
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Failed to start the job.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Manual Article Generator</h2>

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

            {/* Topic / Title */}
            <div>
              <label className="block text-sm mb-1">Topic / Title</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Best laptops for students in 2025"
              />
            </div>

            {/* Optional outline */}
            <div>
              <label className="block text-sm mb-1">Outline (optional)</label>
              <textarea
                rows={6}
                className="w-full rounded-lg border px-3 py-2"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder="- Intro
- Key features
- Pros & Cons
- Conclusion"
              />
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

            {/* Schema + meta */}
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

            {/* Image settings */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Image Source</label>
                <select
                  value={imageSource}
                  onChange={(e) => setImageSource(e.target.value as ImageSource)}
                  className="w-full rounded-lg border px-3 py-2"
                >
                  <option value="google">Google</option>
                  <option value="stock">Stock</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Image Credit (optional)</label>
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
              This will generate the article and optionally publish based on the
              selection above.
            </p>
            <button
              onClick={startJob}
              disabled={busy}
              className="mt-3 w-full rounded-lg bg-green-600 text-white py-2 disabled:opacity-60"
            >
              {busy ? "Starting…" : "Generate Article"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
