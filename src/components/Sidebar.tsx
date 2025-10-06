"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "user" | null>(null);

  // user info read from localStorage
  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) {
        const parsed = JSON.parse(u);
        if (parsed?.email?.includes("admin")) setRole("admin");
        else setRole("user");
      } else setRole(null);
    } catch {
      setRole(null);
    }
  }, []);

  const NavItem = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        href={href}
        className={`block rounded-md px-3 py-2 text-sm ${
          active ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="h-screen w-64 border-r bg-white overflow-y-auto">
      <div className="px-4 py-4 font-bold text-lg flex items-center gap-1">
        <span className="text-blue-500">⚡</span> Affiliated <span className="text-gray-500">Writer</span>
      </div>
      <nav className="px-3 space-y-1">
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
