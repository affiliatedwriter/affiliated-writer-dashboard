"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === "/login";

  if (isPublic) {
    // Login ইত্যাদি পাবলিক রুটে Sidebar/Navbar ছাড়াই কনটেন্ট দেখাই
    return <main className="min-h-screen flex items-center justify-center">{children}</main>;
  }

  // Protected app shell
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
