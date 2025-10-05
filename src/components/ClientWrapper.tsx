"use client";

import React from "react";
import { usePathname } from "next/navigation";
// ⛔ এখানে Sidebar/Nabar রেন্ডার হবে না (Root layout-ই শেল সামলাবে)

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === "/login";

  // Public routes (যেমন: /login) — মিনিমাল ভিউ
  if (isPublic) {
    return <main className="min-h-screen flex items-center justify-center">{children}</main>;
  }

  // Protected routes — শুধু children; শেল/Sidebar root layout-এ আছে
  return <>{children}</>;
}
