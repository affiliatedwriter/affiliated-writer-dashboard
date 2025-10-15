"use client";

import React from "react";
import {
  PublishTarget,
  PublishMode,
  PublishStatus,
  isWp,
  isBlogger,
} from "@/lib/types";

type Props = {
  value: PublishTarget;
  onChange: (next: PublishTarget) => void;
};

const statuses: PublishStatus[] = ["draft", "publish"];

export default function PublishingDestination({ value, onChange }: Props) {
  const setMode = (m: PublishMode) => {
    if (m === value.mode) return;

    if (m === "none") return onChange({ mode: "none" });

    if (m === "wp") {
      // full WP shape so that TS happy everywhere
      return onChange({
        mode: "wp",
        siteId: null,
        categoryId: null,
        status: "draft",
        everyHours: null,
      });
    }

    // blogger
    return onChange({
      mode: "blogger",
      blogId: null,
      status: "draft",
      everyHours: null,
    });
  };

  const setStatus = (s: PublishStatus) => {
    if (isWp(value)) onChange({ ...value, status: s });
    else if (isBlogger(value)) onChange({ ...value, status: s });
  };

  const setEveryHours = (hrs: number | null) => {
    if (isWp(value)) onChange({ ...value, everyHours: hrs });
    else if (isBlogger(value)) onChange({ ...value, everyHours: hrs });
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        {/* Mode */}
        <div>
          <label className="block text-sm mb-1">Publish to</label>
          <select
            className="w-full rounded-lg border px-3 py-2"
            value={value.mode}
            onChange={(e) => setMode(e.target.value as PublishMode)}
          >
            <option value="none">Editor only</option>
            <option value="wp">WordPress</option>
            <option value="blogger">Blogger</option>
          </select>
        </div>

        {/* Status (wp/blogger) */}
        {(isWp(value) || isBlogger(value)) && (
          <div>
            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full rounded-lg border px-3 py-2"
              value={value.status}
              onChange={(e) => setStatus(e.target.value as PublishStatus)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Schedule hours (optional, shared) */}
        {(isWp(value) || isBlogger(value)) && (
          <div>
            <label className="block text-sm mb-1">Every Hours (optional)</label>
            <input
              type="number"
              min={0}
              className="w-full rounded-lg border px-3 py-2"
              value={value.everyHours ?? 0}
              onChange={(e) => {
                const num = Number(e.target.value);
                setEveryHours(Number.isFinite(num) && num > 0 ? num : null);
              }}
            />
          </div>
        )}
      </div>

      {/* WP specific inputs */}
      {isWp(value) && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">WP Site ID</label>
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2"
              value={value.siteId ?? ""}
              onChange={(e) =>
                onChange({ ...value, siteId: numOrNull(e.target.value) })
              }
              placeholder="e.g. 123"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">WP Category ID</label>
            <input
              type="number"
              className="w-full rounded-lg border px-3 py-2"
              value={value.categoryId ?? ""}
              onChange={(e) =>
                onChange({ ...value, categoryId: numOrNull(e.target.value) })
              }
              placeholder="e.g. 5"
            />
          </div>
        </div>
      )}

      {/* Blogger specific inputs */}
      {isBlogger(value) && (
        <div>
          <label className="block text-sm mb-1">Blogger Blog ID</label>
          <input
            type="number"
            className="w-full rounded-lg border px-3 py-2"
            value={value.blogId ?? ""}
            onChange={(e) =>
              onChange({ ...value, blogId: numOrNull(e.target.value) })
            }
            placeholder="e.g. 987654321"
          />
        </div>
      )}
    </div>
  );
}

function numOrNull(v: string): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
