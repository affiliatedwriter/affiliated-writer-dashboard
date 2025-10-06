"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUserRole } from "@/lib/auth";
import { useEffect, useState } from "react";

function NavItem({ href, label }: { href: string; label: string }) {
  const path = usePathname();
  const active = path === href || path.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`block px-3 py-2 text-sm rounded-md transition ${
        active
          ? "bg-gray-100 font-semibold text-gray-900"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const [role, setRole] = useState<"admin" | "user">("user");

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  return (
    <aside className="h-screen w-64 bg-white border-r overflow-y-auto">
      <div className="px-4 py-4 flex items-center gap-2 font-semibold text-lg">
        ⚡ <span>Affiliated</span> <span className="text-gray-500">Writer</span>
      </div>

      <nav className="px-2 space-y-1">
        <NavItem href="/dashboard" label="Dashboard" />
        <NavItem href="/articles" label="Articles" />
        <NavItem href="/publish" label="Website & API" />

        {role === "admin" && (
          <>
            <div className="mt-2 border-t pt-2 text-xs font-semibold text-gray-500 px-3">
              Admin
            </div>
            <NavItem href="/admin/settings" label="Settings" />
            <NavItem href="/admin/prompt-templates" label="Prompt Templates" />
            <NavItem href="/admin/feature-flags" label="Feature Flags" />
            <NavItem href="/admin/credits" label="Credits Manager" />
          </>
        )}
      </nav>
    </aside>
  );
}
