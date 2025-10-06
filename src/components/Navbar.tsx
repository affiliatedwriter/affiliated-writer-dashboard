// File: src/components/Navbar.tsx
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

/** Map routes → readable titles */
function titleFromPath(path: string): string {
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
  if (path.startsWith("/admin")) return "Admin";
  if (path.startsWith("/articles")) return "Articles";
  return "Dashboard";
}

export default function Navbar({ title }: { title?: string }) {
  const pathname = usePathname();
  const computed = useMemo(
    () => title ?? titleFromPath(pathname || "/"),
    [title, pathname]
  );

  const signOut = () => {
    try {
      localStorage.removeItem("token");
    } catch {
      /* ignore */
    }
    // Hard redirect to clear all in-memory state
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-6 md:px-8 h-14 flex items-center justify-between">
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
