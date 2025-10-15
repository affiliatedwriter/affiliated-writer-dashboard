// Shared publish types used by pages + components

export type PublishStatus = "draft" | "publish";
export type PublishMode = "none" | "wp" | "blogger";

export type LegacySchedule = {
  /** optional hours when scheduling is used */
  everyHours?: number | null;
};

/** WordPress target */
export type WpTarget = {
  mode: "wp";
  siteId: number | null;
  categoryId: number | null;
  status: PublishStatus;
} & LegacySchedule;

/** Blogger target */
export type BloggerTarget = {
  mode: "blogger";
  blogId: number | null;
  status: PublishStatus;
} & LegacySchedule;

/** No external publish – just editor preview/save */
export type NoneTarget = {
  mode: "none";
};

export type PublishTarget = WpTarget | BloggerTarget | NoneTarget;

// Type guards
export const isWp = (v: PublishTarget): v is WpTarget => v.mode === "wp";
export const isBlogger = (v: PublishTarget): v is BloggerTarget =>
  v.mode === "blogger";
