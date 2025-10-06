"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

/**
 * ClientShell:
 * - App-wide shell for non-admin pages.
 * - Hides the public Sidebar when path starts with "/admin"
 *   because admin pages already render their own sidebar
 *   via src/app/admin/layout.tsx.
 */
export default function ClientShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen flex bg-gray-50">
      {!isAdmin && (
        <aside className="w-[240px] shrink-0 border-r bg-white">
          <Sidebar />
        </aside>
      )}

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
