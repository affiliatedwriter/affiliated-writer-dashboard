// src/components/ClientShell.tsx
"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { isAuthed } from "@/lib/auth"; // localStorage ভিত্তিক চেক

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const ok = isAuthed();        // localStorage.getItem("token") ইত্যাদি
    setAuthed(!!ok);
    setChecked(true);

    // যদি লগইন না করা থাকে এবং বর্তমান পেজ login না হয় → login এ পাঠাও
    if (!ok && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router]);

  // চেক শেষ না হওয়া পর্যন্ত কিছুই দেখাবো না (ফ্লিকার এড়াতে)
  if (!checked) return null;

  // লগইন পেজ সর্বদা শেল ছাড়া (সেন্টার করা)
  if (pathname === "/login") {
    return <main className="min-h-screen grid place-items-center bg-gray-50">{children}</main>;
  }

  // লগইন না থাকলে কোনো শেল/সাইডবার নয় (উপরে useEffect ইতিমধ্যে রিডাইরেক্ট করেছে)
  if (!authed) {
    return null;
  }

  // লগইন থাকলে—Sidebar + Navbar সহ পুরো অ্যাপ শেল
  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white">
        <Sidebar />
      </aside>
      <div className="ml-64 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
