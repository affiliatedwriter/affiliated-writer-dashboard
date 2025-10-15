// src/components/PublishingDestination.tsx
"use client";

import React from "react";
import type { PublishTarget, PublishStatus } from "@/lib/types";

type Props = {
  value: PublishTarget;
  onChange: (next: PublishTarget) => void;
};

const statuses: PublishStatus[] = ["draft", "publish", "schedule"];

export default function PublishingDestination({ value, onChange }: Props) {
  return (
    <div className="space-y-4">
      {/* প্ল্যাটফর্ম */}
      <div className="grid md:grid-cols-3 gap-3">
        <button
          className={`border rounded px-3 py-2 ${value.mode === "none" ? "bg-gray-100" : ""}`}
          onClick={() => onChange({ mode: "none" })}
        >
          None
        </button>
        <button
          className={`border rounded px-3 py-2 ${value.mode === "editor" ? "bg-gray-100" : ""}`}
          onClick={() => onChange({ mode: "editor" })}
        >
          Editor
        </button>
        <button
          className={`border rounded px-3 py-2 ${value.mode === "wp" ? "bg-gray-100" : ""}`}
          onClick={() =>
            onChange({
              mode: "wp",
              siteId: value.mode === "wp" ? value.siteId : null,
              categoryId: value.mode === "wp" ? value.categoryId : null,
              status: value.mode === "wp" ? value.status : "draft",
            })
          }
        >
          WordPress
        </button>
        <button
          className={`border rounded px-3 py-2 ${value.mode === "blogger" ? "bg-gray-100" : ""}`}
          onClick={() =>
            onChange({
              mode: "blogger",
              blogId: value.mode === "blogger" ? value.blogId : null,
              status: value.mode === "blogger" ? value.status : "draft",
            })
          }
        >
          Blogger
        </button>
      </div>

      {/* কমন স্টেটাস (wp/blogger হলে দেখাই) */}
      {(value.mode === "wp" || value.mode === "blogger") && (
        <div className="flex items-center gap-3">
          <label className="text-sm">Status</label>
          <select
            className="border rounded px-2 py-1"
            value={value.status}
            onChange={(e) => {
              const s = e.target.value as PublishStatus;
              if (value.mode === "wp") onChange({ ...value, status: s });
              if (value.mode === "blogger") onChange({ ...value, status: s });
            }}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* wp extra */}
      {value.mode === "wp" && (
        <div className="grid md:grid-cols-2 gap-3">
          <input
            className="border rounded px-2 py-1"
            type="number"
            placeholder="WordPress Site ID"
            value={value.siteId ?? ""}
            onChange={(e) => onChange({ ...value, siteId: Number(e.target.value) || null })}
          />
          <input
            className="border rounded px-2 py-1"
            type="number"
            placeholder="Category ID"
            value={value.categoryId ?? ""}
            onChange={(e) => onChange({ ...value, categoryId: Number(e.target.value) || null })}
          />
        </div>
      )}

      {/* blogger extra */}
      {value.mode === "blogger" && (
        <div>
          <input
            className="border rounded px-2 py-1"
            type="number"
            placeholder="Blogger Blog ID"
            value={value.blogId ?? ""}
            onChange={(e) => onChange({ ...value, blogId: Number(e.target.value) || null })}
          />
        </div>
      )}

      {/* schedule extra (optionally) */}
      {(value.mode === "wp" || value.mode === "blogger") && value.status === "schedule" && (
        <div className="flex items-center gap-3">
          <label className="text-sm">Every (hours)</label>
          <input
            className="border rounded px-2 py-1"
            type="number"
            min={1}
            value={(value as any).everyHours ?? ""}
            onChange={(e) => {
              const hours = Number(e.target.value) || null;
              if (value.mode === "wp") onChange({ ...value, everyHours: hours });
              if (value.mode === "blogger") onChange({ ...value, everyHours: hours });
            }}
          />
        </div>
      )}
    </div>
  );
}
