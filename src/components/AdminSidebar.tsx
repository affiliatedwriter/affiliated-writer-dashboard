"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AdminSidebar() {
  return (
    <aside className="h-screen w-64 bg-white border-r overflow-y-auto">
      <div className="p-4 font-semibold text-lg">⚡ Admin Panel</div>
      <nav className="px-2 space-y-1">
        <NavItem href="/admin/settings" label="Settings" />
        <NavItem href="/admin/prompt-templates" label="Prompt Templates" />
        <NavItem href="/admin/feature-flags" label="Feature Flags" />
        <NavItem href="/admin/credits" label="Credits Manager" />
      </nav>
    </aside>
  );
}
