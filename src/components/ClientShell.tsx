"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // সেফগার্ড: ভুলে admin রুটে পড়লে সাইডবার দেখাবে না
  if (isAdmin) return <>{children}</>;

  return (
    <div className="min-h-dvh grid grid-cols-[260px_1fr]">
      <aside className="border-r bg-white">
        <Sidebar />
      </aside>
      <main className="min-h-dvh">{children}</main>
    </div>
  );
}
