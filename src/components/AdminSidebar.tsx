"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

type Item = { label: string; href: Route<string> };

const NAV: Item[] = [
  { label: "Dashboard", href: "/admin" as Route<string> },
  { label: "Settings",  href: "/admin/settings" as Route<string> },
  { label: "Credits",   href: "/admin/credits" as Route<string> },
  { label: "Prompts",   href: "/prompts" as Route<string> },
  { label: "Feature Flags", href: "/admin/feature-flags" as Route<string> },
  { label: "Templates", href: "/admin/comparison-templates" as Route<string> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r bg-white p-3">
      <nav className="space-y-1">
        {NAV.map((it) => {
          const active = pathname === it.href || pathname?.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`block px-3 py-2 text-sm rounded-md transition ${
                active ? "bg-gray-100 font-semibold text-gray-900" : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
