// src/app/(admin)/admin/layout.tsx
"use client";

// যদি আলাদা AdminSidebar না থাকে, নিচের লাইনটা বদলে নিন:
// import Sidebar from "@/components/Sidebar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <AdminSidebar />
        {/* <Sidebar /> // fallback হিসেবে ব্যবহার করতে পারেন */}
      </aside>
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
