import AdminSidebar from "@/components/AdminSidebar"; // না থাকলে নিজের Admin সাইডবার কম্পোনেন্ট দিন
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <AdminSidebar />
      </aside>
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
