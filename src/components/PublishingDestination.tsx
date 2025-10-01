"use client";

import { useEffect, useMemo, useState } from "react";
import usePublishOptions, {
  asOptions,
  WordPressSite,
  BloggerBlog,
} from "@/lib/usePublishOptions";

/** প্যারেন্ট থেকে যে শেপটা নেবো/দিবো */
export type PublishTarget =
  | { mode: "none" }
  | {
      mode: "wp";
      siteId: number | null;
      categoryId: number | null; // আপাতত default_category_id-ই দেখাবো
      status: "draft" | "publish";
      everyHours?: number | null; // schedule hours
    }
  | { mode: "blogger"; blogId: number | null; everyHours?: number | null };

type Props = {
  value?: PublishTarget;
  onChange: (v: PublishTarget) => void;
  className?: string;
};

const empty: PublishTarget = { mode: "none" };

export default function PublishingDestination({ value = empty, onChange, className }: Props) {
  const [tab, setTab] = useState<PublishTarget["mode"]>(value.mode ?? "none");

  useEffect(() => {
    setTab(value.mode ?? "none");
  }, [value.mode]);

  const { wp, blogger, loading, error, reload } = usePublishOptions();

  const wpOptions = useMemo(() => asOptions<WordPressSite>(wp), [wp]);
  const bloggerOptions = useMemo(() => asOptions<BloggerBlog>(blogger), [blogger]);

  const switchMode = (m: PublishTarget["mode"]) => {
    setTab(m);
    if (m === "wp")
      onChange({
        mode: "wp",
        siteId: null,
        categoryId: null,
        status: "draft",
        everyHours: null,
      });
    else if (m === "blogger")
      onChange({ mode: "blogger", blogId: null, everyHours: null });
    else onChange({ mode: "none" });
  };

  return (
    <div className={className}>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => switchMode("wp")}
          className={`px-3 py-1.5 rounded border ${
            tab === "wp" ? "bg-blue-50 border-blue-300" : "bg-white"
          }`}
        >
          WordPress
        </button>
        <button
          type="button"
          onClick={() => switchMode("blogger")}
          className={`px-3 py-1.5 rounded border ${
            tab === "blogger" ? "bg-blue-50 border-blue-300" : "bg-white"
          }`}
        >
          Blogger
        </button>
        <button
          type="button"
          onClick={() => switchMode("none")}
          className={`px-3 py-1.5 rounded border ${
            tab === "none" ? "bg-blue-50 border-blue-300" : "bg-white"
          }`}
        >
          Editor (Save only)
        </button>

        {error ? (
          <button
            type="button"
            className="ml-auto text-xs text-red-600 underline"
            onClick={() => reload()}
          >
            Retry load
          </button>
        ) : null}
      </div>

      {tab === "wp" && (
        <div className="space-y-3">
          {/* Site */}
          <div>
            <label className="text-sm font-medium">Select WordPress Website</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading}
              value={
                value.mode === "wp" && value.siteId != null ? String(value.siteId) : ""
              }
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                onChange({
                  mode: "wp",
                  siteId: v,
                  categoryId:
                    v != null
                      ? (wp.find((x) => x.id === v)?.default_category_id ?? null)
                      : null,
                  status: value.mode === "wp" ? value.status : "draft",
                  everyHours: value.mode === "wp" ? value.everyHours ?? null : null,
                });
              }}
            >
              <option value="">{loading ? "Loading…" : "— Choose Website —"}</option>
              {wpOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {(!loading && wpOptions.length === 0) && (
              <p className="mt-1 text-xs text-gray-500">
                No websites saved. Add from <b>Website And Api</b>.
              </p>
            )}
          </div>

          {/* Category (default only for now) */}
          <div>
            <label className="text-sm font-medium">Choose Category</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading || !(value.mode === "wp" && value.siteId)}
              value={
                value.mode === "wp" && value.categoryId != null
                  ? String(value.categoryId)
                  : ""
              }
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                if (value.mode === "wp")
                  onChange({ ...value, categoryId: v });
              }}
            >
              <option value="">
                {loading ? "Loading…" : "— Choose Category —"}
              </option>
              {value.mode === "wp" &&
                value.siteId != null && (
                  <option
                    value={
                      wp.find((x) => x.id === value.siteId)?.default_category_id ?? ""
                    }
                  >
                    Default Category
                  </option>
                )}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              (Category list API পরে যোগ করতে পারবেন। এখন default category থাকবে।)
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Publishing Status</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading || value.mode !== "wp"}
              value={value.mode === "wp" ? value.status : "draft"}
              onChange={(e) => {
                if (value.mode === "wp")
                  onChange({ ...value, status: e.target.value as "draft" | "publish" });
              }}
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
            </select>
          </div>

          {/* Schedule every N hours */}
          <div>
            <label className="text-sm font-medium">Schedule (every N hours)</label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 6"
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading || value.mode !== "wp"}
              value={
                value.mode === "wp" && value.everyHours != null
                  ? String(value.everyHours)
                  : ""
              }
              onChange={(e) => {
                const n = e.target.value ? Number(e.target.value) : null;
                if (value.mode === "wp") onChange({ ...value, everyHours: n });
              }}
            />
            <p className="mt-1 text-xs text-gray-500">
              শিডিউল দিলে সিস্টেম প্রতি <b>N</b> ঘন্টা পরপর কিউ করা পোস্ট পাবলিশ করবে।
            </p>
          </div>
        </div>
      )}

      {tab === "blogger" && (
        <div className="space-y-3">
          {/* Blog */}
          <div>
            <label className="text-sm font-medium">Select Blogger</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading}
              value={
                value.mode === "blogger" && value.blogId != null
                  ? String(value.blogId)
                  : ""
              }
              onChange={(e) => {
                const v = e.target.value ? Number(e.target.value) : null;
                onChange({ mode: "blogger", blogId: v, everyHours: value.everyHours ?? null });
              }}
            >
              <option value="">{loading ? "Loading…" : "— Choose Blog —"}</option>
              {bloggerOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {(!loading && bloggerOptions.length === 0) && (
              <p className="mt-1 text-xs text-gray-500">
                No blogger sites saved. Add from <b>Website And Api</b>.
              </p>
            )}
          </div>

          {/* Schedule every N hours */}
          <div>
            <label className="text-sm font-medium">Schedule (every N hours)</label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 6"
              className="w-full border rounded px-3 py-2 text-sm mt-1"
              disabled={loading || value.mode !== "blogger"}
              value={
                value.mode === "blogger" && value.everyHours != null
                  ? String(value.everyHours)
                  : ""
              }
              onChange={(e) => {
                const n = e.target.value ? Number(e.target.value) : null;
                if (value.mode === "blogger") onChange({ ...value, everyHours: n });
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
