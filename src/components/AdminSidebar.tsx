"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type UserRole = "admin" | "user";

/** ডেমো: লোকালস্টোরেজ থেকে রোল পড়া */
function getUserRole(): UserRole {
  if (typeof window === "undefined") return "user";
  const token = localStorage.getItem("token");
  // 👇 উদাহরণ হিসেবে 'admin' সেট করা আছে, বাস্তবে API দিয়ে নির্ধারণ করবে
  const role = localStorage.getItem("role");
  return (role as UserRole) || (token ? "admin" : "user");
}

function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm transition ${
        active
          ? "bg-gray-100 text-gray-900 font-semibold"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </Link>
  );
}

export default function AdminSidebar() {
  const [role, setRole] = useState<UserRole>("user");
  const [openAmazon, setOpenAmazon] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setRole(getUserRole());
  }, []);

  // রুট পরিবর্তন হলে সাবমেনু টগল বন্ধ রাখো
  useEffect(() => {
    setOpenAmazon(false);
    setOpenInfo(false);
  }, [pathname]);

  return (
    <aside className="h-screen w-64 border-r bg-white flex flex-col">
      {/* ব্র্যান্ড */}
      <div className="p-4 border-b flex items-center gap-2 font-semibold text-lg">
        <span className="text-amber-500">⚡</span>
        <span>Affiliated</span>
        <span className="text-gray-500">Writer</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavItem href="/dashboard" label="Dashboard" />

        {/* ✏️ User Articles Section */}
        <button
          type="button"
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpenAmazon((v) => !v)}
          aria-expanded={openAmazon}
        >
          Amazon Affiliated {openAmazon ? "▾" : "▸"}
        </button>
        {openAmazon && (
          <div className="ml-3 space-y-1">
            <NavItem href="/articles/single" label="Single Product" />
            <NavItem href="/articles/amazon" label="Amazon (Bulk)" />
          </div>
        )}

        <button
          type="button"
          className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={() => setOpenInfo((v) => !v)}
          aria-expanded={openInfo}
        >
          Info Articles {openInfo ? "▾" : "▸"}
        </button>
        {openInfo && (
          <div className="ml-3 space-y-1">
            <NavItem href="/articles/manual" label="Manual" />
            <NavItem href="/articles/bulk" label="Bulk Info Article" />
          </div>
        )}

        <NavItem href="/publish" label="Website And API" />

        {/* 👑 শুধুমাত্র Admin এর জন্য */}
        {role === "admin" && (
          <>
            <div className="mt-2 border-t pt-2 text-xs font-semibold text-gray-500 px-3">
              Admin Panel
            </div>
            <NavItem href="/admin/settings" label="Settings" />
            <NavItem href="/admin/prompt-templates" label="Prompt Templates" />
            <NavItem href="/admin/feature-flags" label="Feature Flags" />
            <NavItem href="/admin/credits" label="Credits Manager" />
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="border-t p-3">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            window.location.href = "/login";
          }}
          className="w-full text-left text-red-600 hover:text-red-700 text-sm"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
