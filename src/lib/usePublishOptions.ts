"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";

/** ====== server shapes (routes.php অনুযায়ী) ====== */
export interface AmazonCfg {
  id: number;
  title: string;
  partnerTag: string;
  country: string;
  is_active?: number;
}
export interface WordPressSite {
  id: number;
  title: string;
  base_url: string;
  default_category_id: number | null;
  default_status: string;
  is_active?: number;
}
export interface BloggerBlog {
  id: number;
  title: string;
  blog_id: string;
  is_active?: number;
}

type FetchState<T> = { data: T; loading: boolean; error: string | null };

function safeArr<T>(x: any): T[] {
  return Array.isArray(x) ? (x as T[]) : [];
}

/**
 * একবারেই Amazon / WordPress / Blogger— তিনটা লিস্ট ফেচ করে দেয়
 * এবং ভাঙা/পুরনো এন্ডপয়েন্টের জন্যও fallback রাখা হয়েছে।
 */
export default function usePublishOptions() {
  const [amazon, setAmazon] = useState<FetchState<AmazonCfg[]>>({
    data: [],
    loading: true,
    error: null,
  });
  const [wp, setWp] = useState<FetchState<WordPressSite[]>>({
    data: [],
    loading: true,
    error: null,
  });
  const [blogger, setBlogger] = useState<FetchState<BloggerBlog[]>>({
    data: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    // Amazon
    try {
      setAmazon((s) => ({ ...s, loading: true, error: null }));
      // নতুন রুট
      const a1 = await apiGet<{ data?: AmazonCfg[] }>("/api/publish/amazon");
      let items = safeArr<AmazonCfg>(a1?.data);
      // পুরোনো/ফলব্যাক
      if (items.length === 0) {
        const a2 = await apiGet<AmazonCfg[]>("/publish/amazon");
        items = safeArr<AmazonCfg>(a2);
      }
      setAmazon({ data: items, loading: false, error: null });
    } catch (e: any) {
      setAmazon({ data: [], loading: false, error: e?.message || "Failed" });
    }

    // WordPress
    try {
      setWp((s) => ({ ...s, loading: true, error: null }));
      const w = await apiGet<{ data?: WordPressSite[] }>("/api/publish/wordpress");
      setWp({ data: safeArr<WordPressSite>(w?.data), loading: false, error: null });
    } catch (e: any) {
      setWp({ data: [], loading: false, error: e?.message || "Failed" });
    }

    // Blogger
    try {
      setBlogger((s) => ({ ...s, loading: true, error: null }));
      const b = await apiGet<{ data?: BloggerBlog[] }>("/api/publish/blogger");
      setBlogger({ data: safeArr<BloggerBlog>(b?.data), loading: false, error: null });
    } catch (e: any) {
      setBlogger({ data: [], loading: false, error: e?.message || "Failed" });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    amazon: amazon.data,
    wp: wp.data,
    blogger: blogger.data,
    loading: amazon.loading || wp.loading || blogger.loading,
    error: amazon.error || wp.error || blogger.error,
    reload: load,
  };
}

/** সিলেক্টের জন্য হেল্পার (id,value,label) */
export function asOptions<T extends { id: number; title: string }>(rows: T[]) {
  return rows.map((r) => ({ value: r.id, label: r.title, row: r }));
}
