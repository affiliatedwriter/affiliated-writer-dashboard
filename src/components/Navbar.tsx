// File: src/components/Navbar.tsx
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

/** রুটভিত্তিক শিরোনাম */
function titleFromPath(path: string): string {
  // ঠিক মিল
  const exact: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/articles": "Articles",
    "/articles/single": "Amazon: Single Product",
    "/articles/amazon": "Amazon: Bulk",
    "/articles/bulk": "Info Article: Bulk",
    "/articles/manual": "Info Article: Manual",
    "/publish": "Website & API",
    "/admin": "Admin",
    "/admin/settings": "Admin • Settings",
    "/admin/prompt-templates": "Admin • Prompt Templates",
    "/admin/feature-flags": "Admin • Feature Flags",
    "/admin/credits": "Admin • Credits Manager",
  };
  if (exact[path]) return exact[path];

  // প্রিফিক্স-ভিত্তিক (যদি নেস্টেড রুট থাকে)
  if (path.startsWith("/admin")) return "Admin";
  if (path.startsWith("/articles")) return "Articles";
  return "Dashboard";
}

export default function Navbar({ title }: { title?: string }) {
  const pathname = usePathname();
  const computed = useMemo(() => title ?? titleFromPath(pathname), [title, pathname]);

  const signOut = () => {
    try {
      localStorage.removeItem("token");
    } catch {}
    // হার্ড রিডাইরেক্ট যাতে স্টেট ক্লিয়ার হয়
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <h1 className="text-lg font-semibold truncate">{computed}</h1>

        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline text-gray-600">Welcome 👋</span>
          <button
            onClick={signOut}
            className="text-red-600 hover:text-red-700"
            aria-label="Sign out"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
