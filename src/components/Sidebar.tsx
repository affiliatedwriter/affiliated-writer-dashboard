// File: src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/* ---------- Small helper ---------- */
function cx(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

/* ---------- A single nav row ---------- */
function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active =
    pathname === href ||
    (href !== "/" && pathname?.startsWith(href + "/"));

  return (
    <Link
      href={href}
      className={cx(
        "block rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-gray-100 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

/* ---------- Sidebar (User area only) ---------- */
export default function Sidebar() {
  const pathname = usePathname() || "/";

  // Safety: if somehow rendered under /admin, hide (admin has its own sidebar)
  if (pathname.startsWith("/admin")) return null;

  // Expand groups based on the current route
  const autoOpen = useMemo(() => {
    return {
      amazon:
        pathname.startsWith("/articles/single") ||
        pathname.startsWith("/articles/amazon"),
      info:
        pathname.startsWith("/articles/manual") ||
        pathname.startsWith("/articles/bulk"),
    };
  }, [pathname]);

  const [openAmazon, setOpenAmazon] = useState(autoOpen.amazon);
  const [openInfo, setOpenInfo] = useState(autoOpen.info);

  // Keep accordion state in sync when navigating
  useEffect(() => {
    setOpenAmazon(autoOpen.amazon);
    setOpenInfo(autoOpen.info);
  }, [autoOpen]);

  return (
    <aside className="h-screen w-64 bg-white border-r overflow-y-auto">
      {/* Brand */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-amber-500">⚡</span>
          <span>Affiliated</span>
          <span className="text-gray-500">Writer</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 pb-6 space-y-1">
        <NavItem href="/dashboard">Dashboard</NavItem>
        <NavItem href="/articles">Articles</NavItem>

        {/* Amazon group */}
        <button
          type="button"
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpenAmazon((v) => !v)}
          aria-expanded={openAmazon}
          aria-controls="nav-amazon"
        >
          Amazon Affiliated {openAmazon ? "▾" : "▸"}
        </button>
        {openAmazon && (
          <div id="nav-amazon" className="ml-3 space-y-1">
            <NavItem href="/articles/single">Single Product</NavItem>
            <NavItem href="/articles/amazon">Amazon (Bulk)</NavItem>
          </div>
        )}

        {/* Info group */}
        <button
          type="button"
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpenInfo((v) => !v)}
          aria-expanded={openInfo}
          aria-controls="nav-info"
        >
          Info Articles {openInfo ? "▾" : "▸"}
        </button>
        {openInfo && (
          <div id="nav-info" className="ml-3 space-y-1">
            <NavItem href="/articles/manual">Manual</NavItem>
            <NavItem href="/articles/bulk">Bulk Info Article</NavItem>
          </div>
        )}

        <NavItem href="/publish">Website And Api</NavItem>

        {/* Admin section links (still visible, but this is *user* sidebar).
            Clicking these navigates to /admin where the AdminSidebar takes over. */}
        <div className="mt-2 border-t pt-2 text-xs font-semibold text-gray-500 px-3">
          Admin
        </div>
        <NavItem href="/admin/settings">Settings</NavItem>
        <NavItem href="/admin/prompt-templates">Prompt Templates</NavItem>
        <NavItem href="/admin/feature-flags">Feature Flags</NavItem>
        <NavItem href="/admin/credits">Credits Manager</NavItem>
      </nav>
    </aside>
  );
}
