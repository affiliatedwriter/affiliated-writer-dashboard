// src/components/ClientShell.tsx
"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // কোনোভাবে admin রুটে পড়লে সাইডবার দেখাবো না (guard)
  if (pathname?.startsWith("/admin")) return <>{children}</>;

  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <Sidebar />
      </aside>
      <main className="min-h-dvh p-6">{children}</main>
    </div>
  );
}
