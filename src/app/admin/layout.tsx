"use client";

import React from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
            <h1 className="text-lg font-semibold text-gray-800">Admin</h1>
          </header>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
