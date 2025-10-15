// src/components/PublishingDestination.tsx
"use client";

import React from "react";
import {
  PublishTarget,
  LegacyPublishTarget,
  toPublishTarget,
  isPublishTarget,
  PublishStatus,
} from "@/lib/types";

/**
 * এই কম্পোনেন্ট এখন legacy + new—দুই শেপই গ্রহণ/রিটার্ন করে।
 * তাই পেজগুলোতে পুরনো স্টেট (publish.wordpress...) থাকলেও বিল্ড ফেল হবে না।
 */

type Props = {
  /** পুরনো বা নতুন যেকোনো শেপ */
  value: PublishTarget | LegacyPublishTarget | undefined;
  /**
   * onChange: পেজে setPublish (useState setter) সরাসরি পাঠানো থাকলেও কাজ করবে,
   * অথবা (next)=>{} ফাংশন দিলেও কাজ করবে।
   */
  onChange:
    | ((next: PublishTarget | LegacyPublishTarget) => void)
    | React.Dispatch<React.SetStateAction<PublishTarget | LegacyPublishTarget | undefined>>;
};

export default function PublishingDestination({ value, onChange }: Props) {
  const normalized = toPublishTarget(value);

  // setter/callback—যেটাই পাঠানো হোক, নিরাপদে চালানো হবে
  const emit = (next: PublishTarget) => {
    if (typeof onChange === "function") {
      try {
        // যদি পেজে setter দেয়া থাকে (prev=>...), তাও হ্যান্ডেল করি
        (onChange as any)(next);
      } catch {
        (onChange as any)(() => next);
      }
    }
  };

  const setMode = (mode: PublishTarget["mode"]) => {
    if (mode === "wp") emit({ mode: "wp", siteId: null, categoryId: null, status: "draft" });
    else if (mode === "blogger") emit({ mode: "blogger", blogId: null, status: "draft" });
    else if (mode === "editor") emit({ mode: "editor" });
    else emit({ mode: "none" });
  };

  const setStatus = (status: PublishStatus) => {
    const v = normalized;
    if (v.mode === "wp") emit({ ...v, status });
    else if (v.mode === "blogger") emit({ ...v, status });
    // editor/none হলে status প্রয়োগ নেই
  };

  const setWpSite = (siteId: number | null) => {
    const v = normalized;
    if (v.mode === "wp") emit({ ...v, siteId });
    else emit({ mode: "wp", siteId, categoryId: null, status: "draft" });
  };
  const setWpCategory = (categoryId: number | null) => {
    const v = normalized;
    if (v.mode === "wp") emit({ ...v, categoryId });
    else emit({ mode: "wp", siteId: null, categoryId, status: "draft" });
  };

  const setBlogger = (blogId: number | null) => {
    const v = normalized;
    if (v.mode === "blogger") emit({ ...v, blogId });
    else emit({ mode: "blogger", blogId, status: "draft" });
  };

  const setEveryHours = (hrs: number | null) => {
    const v = normalized;
    if (v.mode === "wp") emit({ ...v, everyHours: hrs ?? null });
    else if (v.mode === "blogger") emit({ ...v, everyHours: hrs ?? null });
  };

  /** UI — এখানে মিনিমাল কন্ট্রোল দেয়া হলো; তুমি আগের UI রেখে শুধু হ্যান্ডলারগুলো মেপ করে দিও */
  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <label className="text-sm w-28">Platform</label>
        <select
          className="border rounded px-2 py-1"
          value={normalized.mode}
          onChange={(e) => setMode(e.target.value as PublishTarget["mode"])}
        >
          <option value="none">None</option>
          <option value="editor">Editor</option>
          <option value="wp">WordPress</option>
          <option value="blogger">Blogger</option>
        </select>
      </div>

      {normalized.mode === "wp" && (
        <>
          <div className="flex gap-2 items-center">
            <label className="text-sm w-28">WP Site ID</label>
            <input
              className="border rounded px-2 py-1 w-48"
              type="number"
              value={normalized.siteId ?? ""}
              onChange={(e) => setWpSite(e.target.value === "" ? null : Number(e.target.value))}
              placeholder="e.g. 12"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm w-28">WP Category</label>
            <input
              className="border rounded px-2 py-1 w-48"
              type="number"
              value={normalized.categoryId ?? ""}
              onChange={(e) =>
                setWpCategory(e.target.value === "" ? null : Number(e.target.value))
              }
              placeholder="e.g. 5"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm w-28">Status</label>
            <select
              className="border rounded px-2 py-1"
              value={normalized.status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="schedule">Schedule</option>
            </select>
          </div>

          {normalized.status === "schedule" && (
            <div className="flex gap-2 items-center">
              <label className="text-sm w-28">Every (hrs)</label>
              <input
                className="border rounded px-2 py-1 w-32"
                type="number"
                min={1}
                value={normalized.everyHours ?? ""}
                onChange={(e) =>
                  setEveryHours(e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </div>
          )}
        </>
      )}

      {normalized.mode === "blogger" && (
        <>
          <div className="flex gap-2 items-center">
            <label className="text-sm w-28">Blog ID</label>
            <input
              className="border rounded px-2 py-1 w-48"
              type="number"
              value={normalized.blogId ?? ""}
              onChange={(e) => setBlogger(e.target.value === "" ? null : Number(e.target.value))}
              placeholder="e.g. 123456"
            />
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm w-28">Status</label>
            <select
              className="border rounded px-2 py-1"
              value={normalized.status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
              <option value="schedule">Schedule</option>
            </select>
          </div>

          {normalized.status === "schedule" && (
            <div className="flex gap-2 items-center">
              <label className="text-sm w-28">Every (hrs)</label>
              <input
                className="border rounded px-2 py-1 w-32"
                type="number"
                min={1}
                value={normalized.everyHours ?? ""}
                onChange={(e) =>
                  setEveryHours(e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
