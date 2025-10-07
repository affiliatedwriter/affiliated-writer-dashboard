"use client";

import { AuthProvider, isAuthed } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthed()) router.push("/login");
  }, []);

  return <AuthProvider>{children}</AuthProvider>;
}
