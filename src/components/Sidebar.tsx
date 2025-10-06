"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { isAdmin } from "@/lib/auth";

function NavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-gray-100 text-gray-900 font-medium"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [openAmazon, setOpenAmazon] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    setAdmin(isAdmin());
    setOpenAmazon(
      pathname.startsWith("/articles/single") ||
        pathname.startsWith("/articles/amazon")
    );
    setOpenInfo(
      pathname.startsWith("/articles/manual") ||
        pathname.startsWith("/articles/bulk")
    );
  }, [pathname]);

  return (
    <aside className="h-screen w-64 bg-white border-r overflow-y-auto">
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-amber-500">⚡</span>
          <span>Affiliated</span>
          <span className="text-gray-500">Writer</span>
        </div>
      </div>

      <nav className="px-3 pb-6 space-y-1">
        <NavItem href="/dashboard">Dashboard</NavItem>
        <NavItem href="/articles">Articles</NavItem>

        {/* Amazon */}
        <button
          type="button"
          onClick={() => setOpenAmazon((v) => !v)}
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Amazon Affiliated {openAmazon ? "▾" : "▸"}
        </button>
        {openAmazon && (
          <div className="ml-3 space-y-1">
            <NavItem href="/articles/single">Single Product</NavItem>
            <NavItem href="/articles/amazon">Amazon (Bulk)</NavItem>
          </div>
        )}

        {/* Info */}
        <button
          type="button"
          onClick={() => setOpenInfo((v) => !v)}
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Info Articles {openInfo ? "▾" : "▸"}
        </button>
        {openInfo && (
          <div className="ml-3 space-y-1">
            <NavItem href="/articles/manual">Manual</NavItem>
            <NavItem href="/articles/bulk">Bulk Info Article</NavItem>
          </div>
        )}

        <NavItem href="/publish">Website & API</NavItem>

        {/* Admin-only section */}
        {admin && (
          <>
            <div className="mt-2 border-t pt-2 text-xs font-semibold text-gray-500 px-3">
              Admin
            </div>
            <NavItem href="/admin/settings">Settings</NavItem>
            <NavItem href="/admin/prompt-templates">Prompt Templates</NavItem>
            <NavItem href="/admin/feature-flags">Feature Flags</NavItem>
            <NavItem href="/admin/credits">Credits Manager</NavItem>
          </>
        )}
      </nav>
    </aside>
  );
}
