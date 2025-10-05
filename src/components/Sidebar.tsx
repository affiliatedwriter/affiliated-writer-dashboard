// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LinkItem = {
  href?: string;
  label: string;
  icon?: string;
  children?: LinkItem[];
};

const LINKS: LinkItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/articles", label: "Articles", icon: "📰" },
  {
    label: "Amazon Affiliated",
    icon: "🛒",
    children: [
      { href: "/articles/amazon", label: "Amazon Review" },
      { href: "/articles/manual", label: "Manual Review" },
      { href: "/articles/single", label: "Single Product Review" },
    ],
  },
  { label: "Info Articles", icon: "📘", children: [{ href: "/articles/bulk", label: "Bulk Info Article" }] },
  { href: "/publish/manage", label: "Website And Api", icon: "🌐" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
  { href: "/admin/prompt-templates", label: "Prompt Templates", icon: "📝" },
  { href: "/admin/feature-flags", label: "Feature Flags", icon: "🚩" },
  { href: "/admin/credits", label: "Credits Manager", icon: "💳" },
];

function SidebarLink({ link }: { link: LinkItem }) {
  const pathname = usePathname();
  const isActiveHref = (href?: string) => !!href && (pathname === href || pathname?.startsWith(href + "/"));

  if (link.children?.length) {
    const active = useMemo(() => link.children!.some((c) => isActiveHref(c.href)), [pathname, link.children]);
    const [open, setOpen] = useState<boolean>(active);
    useEffect(() => setOpen(active), [active]);
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium
            ${active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
        >
          <span>{link.icon} {link.label}</span>
          <span className={`transition ${open ? "rotate-180" : ""}`}>▾</span>
        </button>
        <div className={`${open ? "block" : "hidden"} ml-3 mt-1 space-y-1`}>
          {link.children.map((c) => {
            const childActive = isActiveHref(c.href);
            return (
              <Link
                key={c.href}
                href={c.href!}
                className={`block rounded-md px-3 py-1.5 text-sm
                  ${childActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                {c.label}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const active = isActiveHref(link.href);
  return (
    <Link
      href={link.href || "#"}
      className={`block rounded-md px-3 py-2 text-sm font-medium
        ${active ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {link.icon} {link.label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen">
      <div className="px-6 py-5">
        <div className="text-2xl font-bold">
          <span className="text-orange-500">⚡</span> <span>Affiliated</span>{" "}
          <span className="text-gray-500">Writer</span>
        </div>
      </div>
      <nav className="px-3 space-y-1">
        {LINKS.map((link) => <SidebarLink key={link.label} link={link} />)}
      </nav>
    </aside>
  );
}
