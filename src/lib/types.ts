// File: src/lib/types.ts

export type PublishMode = "editor" | "wordpress" | "blogger";
export type PublishStatus = "draft" | "publish" | "schedule";

export type PublishTarget = {
  mode: PublishMode;
  wordpress?: { websiteId: number | null; categoryId: number | null; status: PublishStatus };
  blogger?: { blogId: number | null; status: PublishStatus };
  schedule?: { everyHours: number };
};

/** ---- Legacy shapes (আগের প্রজেক্টের) ---- */
export type LegacyWp = {
  mode: "wp";
  siteId: number | null;
  categoryId: number | null;
  status: Exclude<PublishStatus, "schedule">; // তখন schedule আলাদা ফিল্ডে ছিল
  everyHours?: number | null;
};

export type LegacyBlogger = {
  mode: "blogger";
  blogId: number | null;
  everyHours?: number | null;
  status?: PublishStatus;
};

export type LegacyNone = { mode: "none" };

export type LegacyPublishTarget = LegacyWp | LegacyBlogger | LegacyNone;

/** ---- Normalizer: যেকোনো লিগ্যাসি/নতুন ইনপুট থেকে PublishTarget বানায় ---- */
export function normalizePublishTarget(
  next: PublishTarget | LegacyPublishTarget,
  prev?: PublishTarget
): PublishTarget {
  // যদি ইতিমধ্যেই নতুন শেপ হয়, সরাসরি রিটার্ন (কপি)
  if (typeof (next as any)?.mode === "string" && (next as any).mode !== "wp" && (next as any).mode !== "none") {
    const t = next as PublishTarget;
    return {
      mode: t.mode,
      wordpress: t.wordpress
        ? {
            websiteId: t.wordpress.websiteId ?? null,
            categoryId: t.wordpress.categoryId ?? null,
            status: t.wordpress.status ?? "draft",
          }
        : prev?.wordpress,
      blogger: t.blogger
        ? { blogId: t.blogger.blogId ?? null, status: t.blogger.status ?? "draft" }
        : prev?.blogger,
      schedule: t.schedule ?? prev?.schedule ?? { everyHours: 6 },
    };
  }

  // লিগ্যাসি শেপ → নতুন শেপ
  const legacy = next as LegacyPublishTarget;
  if (legacy.mode === "wp") {
    const hours = legacy.everyHours ?? prev?.schedule?.everyHours ?? 6;
    return {
      mode: "wordpress",
      wordpress: {
        websiteId: legacy.siteId ?? null,
        categoryId: legacy.categoryId ?? null,
        status: legacy.status ?? "draft",
      },
      blogger: prev?.blogger ?? { blogId: null, status: "draft" },
      schedule: { everyHours: hours },
    };
  }
  if (legacy.mode === "blogger") {
    const hours = legacy.everyHours ?? prev?.schedule?.everyHours ?? 6;
    return {
      mode: "blogger",
      blogger: { blogId: legacy.blogId ?? null, status: legacy.status ?? "draft" },
      wordpress: prev?.wordpress ?? { websiteId: null, categoryId: null, status: "draft" },
      schedule: { everyHours: hours },
    };
  }
  // mode: "none" বা অজানা কিছু হলে editor-এ নামিয়ে দিই
  return {
    mode: "editor",
    wordpress: prev?.wordpress ?? { websiteId: null, categoryId: null, status: "draft" },
    blogger: prev?.blogger ?? { blogId: null, status: "draft" },
    schedule: prev?.schedule ?? { everyHours: 6 },
  };
}
