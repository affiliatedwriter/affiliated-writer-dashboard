// src/lib/types.ts
export type PublishStatus = "draft" | "publish" | "schedule";
export type PublishMode   = "none" | "editor" | "wp" | "blogger";

// WordPress
export type WpTarget = {
  mode: "wp";
  siteId: number | null;
  categoryId: number | null;
  status: PublishStatus;
  everyHours?: number | null;
};

// Blogger
export type BloggerTarget = {
  mode: "blogger";
  blogId: number | null;
  status: PublishStatus;
  everyHours?: number | null;
};

// শুধু এডিটরে সেভ করার জন্য
export type EditorTarget = { mode: "editor" };

// কিছুই সিলেক্ট না থাকলে
export type NoneTarget   = { mode: "none" };

// চূড়ান্ত টাইপ
export type PublishTarget = WpTarget | BloggerTarget | EditorTarget | NoneTarget;
