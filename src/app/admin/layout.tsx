// File: src/app/admin/layout.tsx
"use client";

import React from "react";
import AdminGuard from "@/components/admin/AdminGuard";

// ⛔ Sidebar এখানে নয়—Root layout-এ একবারই আছে
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <section className="p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-800">Admin</h1>
        </header>
        {children}
      </section>
    </AdminGuard>
  );
}
