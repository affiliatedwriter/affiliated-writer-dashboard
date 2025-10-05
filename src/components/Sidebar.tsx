// src/components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/articles", label: "Articles" },
  { href: "/amazon", label: "Amazon Affiliated" },
  { href: "/info-articles", label: "Info Articles" },
  { href: "/publish", label: "Website And Api" },
  { href: "/settings", label: "Settings" },
  { href: "/admin/prompt-templates", label: "Prompt Templates" },
  { href: "/admin/feature-flags", label: "Feature Flags" },
  { href: "/credits", label: "Credits Manager" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const active = useMemo(() => pathname?.split("?")[0] ?? "", [pathname]);

  return (
    <nav className="h-full overflow-y-auto px-4 py-6">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <span className="text-amber-500">⚡</span>
          <span>Affiliated</span>
        </div>
        <div className="px-2 text-sm text-gray-500">Writer</div>
      </div>

      <ul className="space-y-1">
        {items.map((it) => {
          const isActive = active === it.href;
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={[
                  "block rounded-md px-3 py-2 text-sm",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                ].join(" ")}
                prefetch={false}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
