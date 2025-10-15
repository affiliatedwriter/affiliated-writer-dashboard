// src/lib/types.ts

/** ================= Common ================= */
export type PublishStatus = "draft" | "publish" | "schedule";
export type PublishMode = "none" | "editor" | "wp" | "blogger";

/** ------------ New (Normalized) shape ------------ */
export type WpTarget = {
  mode: "wp";
  siteId: number | null;
  categoryId: number | null;
  status: PublishStatus;
  everyHours?: number | null;
};

export type BloggerTarget = {
  mode: "blogger";
  blogId: number | null;
  status: PublishStatus;
  everyHours?: number | null;
};

export type EditorTarget = {
  mode: "editor";
};

export type NoneTarget = {
  mode: "none";
};

export type PublishTarget = WpTarget | BloggerTarget | EditorTarget | NoneTarget;

/** ------------ Legacy (Older pages use this) ------------ */
/** পুরনো পেজে publish.wordpress / publish.blogger ইত্যাদি থাকে।
 *  ফিল্ডগুলোকে optional রাখা হয়েছে যাতে আগের অসম্পূর্ণ shape-ও কমপাইল পাস করে।
 */
export type LegacyWp = {
  wordpress?: {
    websiteId?: number | null;
    categoryId?: number | null;
    status: PublishStatus;
    everyHours?: number | null;
  };
};
export type LegacyBlogger = {
  blogger?: {
    blogId?: number | null;
    status: PublishStatus;
    everyHours?: number | null;
  };
};
export type LegacyBase = {
  /** পুরোনো কোডে schedule আলাদা থাকে */
  schedule?: { everyHours?: number | null };
};
export type LegacyPublishTarget = LegacyBase & LegacyWp & LegacyBlogger & {
  /** কিছু পেজে একদমই mode থাকে না; optional */
  mode?: PublishMode;
};

/** ------------ Type Helpers ------------ */
export function isPublishTarget(v: any): v is PublishTarget {
  return v && typeof v === "object" && typeof v.mode === "string";
}

export function toPublishTarget(v: PublishTarget | LegacyPublishTarget | undefined): PublishTarget {
  if (!v) return { mode: "none" };
  if (isPublishTarget(v)) return v;

  // Legacy → New normalize
  if (v.wordpress) {
    return {
      mode: "wp",
      siteId: v.wordpress.websiteId ?? null,
      categoryId: v.wordpress.categoryId ?? null,
      status: v.wordpress.status ?? "draft",
      everyHours: v.wordpress.everyHours ?? v.schedule?.everyHours ?? null,
    };
  }
  if (v.blogger) {
    return {
      mode: "blogger",
      blogId: v.blogger.blogId ?? null,
      status: v.blogger.status ?? "draft",
      everyHours: v.blogger.everyHours ?? v.schedule?.everyHours ?? null,
    };
  }
  return { mode: v.mode ?? "none" };
}

/** নতুন → Legacy (যদি পুরনো payload দরকার হয়) */
export function toLegacy(v: PublishTarget): LegacyPublishTarget {
  switch (v.mode) {
    case "wp":
      return {
        wordpress: {
          websiteId: v.siteId ?? null,
          categoryId: v.categoryId ?? null,
          status: v.status,
          everyHours: v.everyHours ?? null,
        },
      };
    case "blogger":
      return {
        blogger: {
          blogId: v.blogId ?? null,
          status: v.status,
          everyHours: v.everyHours ?? null,
        },
      };
    case "editor":
      return { mode: "editor" };
    default:
      return { mode: "none" };
  }
}
