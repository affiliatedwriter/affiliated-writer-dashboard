// src/lib/types.ts

/** ======== Publish Types (Unified) ========= */
export type PublishStatus = "draft" | "publish" | "schedule";
export type PublishMode = "none" | "editor" | "wp" | "blogger";

/** নতুন ইউনিফায়েড শেপ */
export type PublishTarget =
  | { mode: "none" }
  | { mode: "editor" }
  | {
      mode: "wp";
      siteId: number | null;
      categoryId: number | null;
      status: PublishStatus;
      everyHours?: number | null;
    }
  | {
      mode: "blogger";
      blogId: number | null;
      status: PublishStatus;
      everyHours?: number | null;
    };

/** ======== Legacy Shapes (পুরনো) ========= */
export type LegacyWp = {
  wordpress?: { websiteId: number | null; categoryId: number | null; status: PublishStatus };
  schedule?: { everyHours?: number | null };
};
export type LegacyBlogger = {
  blogger?: { blogId: number | null; status: PublishStatus };
  schedule?: { everyHours?: number | null };
};
export type LegacyEditor = { editor?: true };
export type LegacyNone = { mode?: undefined };

/** কিছু কোডে এই এলিয়াস ইউজ করা হয়েছে */
export type LegacyPublishTarget = LegacyWp | LegacyBlogger | LegacyEditor | LegacyNone;

/** পুরনো বা নতুন—যেটাই আসুক */
export type AnyPublishTarget = PublishTarget | (LegacyWp & LegacyBlogger & LegacyEditor & LegacyNone);

/**
 * toPublishTarget:
 * - যেকোনো ইনপুট (লেগেসি / নতুন) নিলেও PublishTarget বানিয়ে দেয়
 */
export function toPublishTarget(v: AnyPublishTarget | undefined | null): PublishTarget {
  if (!v) return { mode: "none" };

  // নতুন শেপ (mode আছে)
  if (typeof (v as any).mode === "string") {
    const x = v as PublishTarget;
    if (x.mode === "wp") {
      return {
        mode: "wp",
        siteId: x.siteId ?? null,
        categoryId: x.categoryId ?? null,
        status: x.status ?? "draft",
        everyHours: x.everyHours ?? null,
      };
    }
    if (x.mode === "blogger") {
      return {
        mode: "blogger",
        blogId: x.blogId ?? null,
        status: x.status ?? "draft",
        everyHours: x.everyHours ?? null,
      };
    }
    if (x.mode === "editor") return { mode: "editor" };
    return { mode: "none" };
  }

  // লেগেসি: wordpress / blogger অবজেক্ট থাকলে সেগুলো ম্যাপ করি
  const lv = v as LegacyWp & LegacyBlogger;
  if (lv.wordpress) {
    return {
      mode: "wp",
      siteId: lv.wordpress.websiteId ?? null,
      categoryId: lv.wordpress.categoryId ?? null,
      status: lv.wordpress.status ?? "draft",
      everyHours: lv.schedule?.everyHours ?? null,
    };
  }
  if (lv.blogger) {
    return {
      mode: "blogger",
      blogId: lv.blogger.blogId ?? null,
      status: lv.blogger.status ?? "draft",
      everyHours: lv.schedule?.everyHours ?? null,
    };
  }

  return { mode: "none" };
}

/** কিছু ফাইলে normalizePublishTarget নামে ইমপোর্ট করা হচ্ছে */
export const normalizePublishTarget = toPublishTarget;
