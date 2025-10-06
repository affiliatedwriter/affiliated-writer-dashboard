// src/app/(site)/layout.tsx
"use client";

import Sidebar from "@/components/Sidebar";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <Sidebar />
      </aside>
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
