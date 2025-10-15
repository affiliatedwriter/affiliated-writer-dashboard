// src/app/(site)/articles/manual/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import ModelSelector from "@/components/ModelSelector";
import PublishingDestination from "@/components/PublishingDestination";
import { apiPost } from "@/lib/api";
import type {
  PublishTarget,
  LegacyPublishTarget,
  PublishStatus,
} from "@/lib/types";

type SchemaType = "Review" | "BlogPosting" | "Article";
type ImageSource = "google" | "stock";

/** Component expects: PublishTarget | LegacyPublishTarget | undefined */
type AnyPublish = PublishTarget | LegacyPublishTarget | undefined;

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

  /* ===== Publish (match component prop types) ===== */
  const [publish, setPublish] = useState<AnyPublish>(undefined);

  /* ===== UI ===== */
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  /* ===== Derived ===== */
  const hasTopic = useMemo(() => topic.trim().length > 0, [topic]);

  /* helpers to read common fields from new/legacy shapes */
  const readMode = (p: AnyPublish): string | undefined =>
    p ? (p as any).mode ?? ((p as any).wordpress ? "wordpress" : undefined) : undefined;

  const readStatus = (p: AnyPublish): PublishStatus | undefined =>
    p
      ? (p as any).status ??
        (p as any).wordpress?.status ??
        (p as any).blogger?.status
      : undefined;

  const readEveryHours = (p: AnyPublish): number | undefined =>
    p ? (p as any).everyHours ?? (p as any).schedule?.everyHours : undefined;

  /* ===== Validation ===== */
  const validate = (): string | null => {
    if (!hasTopic) return "Please enter a topic/title.";
    if (sections < 3 || sections > 20) return "Sections must be between 3 and 20.";
    if (faqs < 0 || faqs > 20) return "FAQs must be between 0 and 20.";

    if (publish) {
      const mode = readMode(publish);
      const status = readStatus(publish);

      // Only the "new" shape supports schedule status; guard by status string
      if ((mode === "wp" || mode === "wordpress" || mode === "blogger") && status === "schedule") {
        const hrs = readEveryHours(publish) ?? 0;
        if (!hrs || hrs <= 0) return "Enter a valid schedule time in hours (> 0).";
      }

      // Minimal sanity checks for IDs (both shapes)
      if (mode === "wp") {
        const siteId = (publish as any).siteId ?? null;
        const categoryId = (publish as any).categoryId ?? null;
        if (siteId == null) return "Select a WordPress Site ID.";
        if (categoryId == null) return "Select a WordPress Category ID.";
      } else if (mode === "wordpress") {
        const wp = (publish as any).wordpress || {};
        if (wp.websiteId == null) return "Select a WordPress Site.";
        if (wp.categoryId == null) return "Select a WordPress Category.";
      } else if (mode === "blogger") {
        const blogId =
          (publish as any).blogId != null
            ? (publish as any).blogId
            : (publish as any).blogger?.blogId ?? null;
        if (blogId == null) return "Select a Blogger Blog ID.";
      }
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
        // send-through (new or legacy) – backend side already adapted
        integrations: { publish },
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
            <ModelSelector value={model} onChange={setModel} />

            <div>
              <label className="block text-sm mb-1">Topic / Title</label>
              <input
                className="w-full rounded-lg border px-3 py-2"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Best laptops for students in 2025"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Outline (optional)</label>
              <textarea
                rows={6}
                className="w-full rounded-lg border px-3 py-2"
                value={outline}
                onChange={(e) => setOutline(e.target.value)}
                placeholder={`- Intro
- Key features
- Pros & Cons
- Conclusion`}
              />
            </div>

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
