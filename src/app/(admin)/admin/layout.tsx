// src/app/(admin)/admin/layout.tsx
import type { ReactNode } from "react";
// AdminSidebar না থাকলে নিচের লাইনে Sidebar ইমপোর্ট করতে পারেন
import AdminSidebar from "@/components/AdminSidebar"; // fallback: import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <AdminSidebar /> {/* fallback হলে <Sidebar /> */}
      </aside>
      <main className="min-h-dvh p-6">{children}</main>
    </div>
  );
}
