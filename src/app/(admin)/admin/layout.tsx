// If you don't have AdminSidebar, replace with: import Sidebar from "@/components/Sidebar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <AdminSidebar />
      </aside>
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}