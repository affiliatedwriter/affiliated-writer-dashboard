"use client";

import { ReactNode } from "react";
import Sidebar from "@/components/AdminSidebar";

/**
 * Admin layout:
 * - Only admin routes use this layout.
 * - Renders the AdminSidebar at the left and page content at the right.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-[240px] shrink-0 border-r bg-white">
        <Sidebar />
      </aside>

      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
