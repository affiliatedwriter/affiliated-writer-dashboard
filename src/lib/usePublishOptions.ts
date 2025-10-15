// src/lib/usePublishOptions.ts
"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";

/** ===== Types exposed from this hook ===== */
export type AmazonCfg = {
  id: number;
  title: string;
  partnerTag?: string;
  country?: string;
};

export type WpSite = {
  id: number;
  title: string;
  base_url?: string | null;
  default_category_id: number | null;
  default_status?: string;
};

export type BloggerBlog = {
  id: number;
  title: string;
  blog_id: string;
};

type OptionsResponse = {
  amazonApis?: AmazonCfg[]; // preferred
  wordpressSites?: WpSite[];
  bloggerBlogs?: BloggerBlog[];

  // sometimes APIs return these keys:
  data?: any;
  items?: any;
  rows?: any;
};

/** ছোট হেল্পার: যেকোনো অ্যারে -> {value,label} অপশন  */
export function asOptions<T extends Record<string, any>>(
  list: T[] | undefined | null,
  labelKey: keyof T = "title",
  valueKey: keyof T = "id"
) {
  if (!Array.isArray(list)) return [];
  return list.map((it) => ({
    label: String(it[labelKey] ?? ""),
    value: it[valueKey] as unknown as string | number,
    raw: it,
  }));
}

/** internal helper: প্রথম ম্যাচিং কী থেকে অ্যারে বের করো */
function pickArray<T = any>(obj: any, ...keys: string[]): T[] {
  for (const k of keys) {
    const v = obj?.[k];
    if (Array.isArray(v)) return v as T[];
  }
  return [];
}

/**
 * usePublishOptions:
 * - /api/publish/options থেকে একবারেই Amazon APIs, WP Sites, Blogger Blogs নিয়ে আসে
 * - AmazonPicker, Publishing screens—এগুলো সহজে এই হুক থেকে ডেটা নেবে
 */
export default function usePublishOptions() {
  const [amazonApis, setAmazonApis] = useState<AmazonCfg[]>([]);
  const [wpSites, setWpSites] = useState<WpSite[]>([]);
  const [blogs, setBlogs] = useState<BloggerBlog[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get<OptionsResponse>("/api/publish/options");

        const apis =
          res?.amazonApis ??
          pickArray<AmazonCfg>(res, "data", "items", "rows", "apis");
        const sites =
          res?.wordpressSites ??
          pickArray<WpSite>(res, "wordpress", "sites", "data", "items", "rows");
        const blgs =
          res?.bloggerBlogs ??
          pickArray<BloggerBlog>(res, "blogger", "blogs", "data", "items");

        if (!mounted) return;
        setAmazonApis(Array.isArray(apis) ? apis : []);
        setWpSites(Array.isArray(sites) ? sites : []);
        setBlogs(Array.isArray(blgs) ? blgs : []);
        setErr("");
      } catch (e: any) {
        if (!mounted) return;
        setAmazonApis([]);
        setWpSites([]);
        setBlogs([]);
        setErr(e?.message || "Failed to load publishing options");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const amazonOptions = useMemo(() => asOptions(amazonApis), [amazonApis]);
  const wpSiteOptions = useMemo(() => asOptions(wpSites), [wpSites]);
  const blogOptions = useMemo(() => asOptions(blogs), [blogs]);

  return {
    loading,
    error: err,

    amazonApis,
    wpSites,
    blogs,

    amazonOptions,
    wpSiteOptions,
    blogOptions,
  };
}
