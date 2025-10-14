// src/app/providers.tsx
"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";

// গ্লোবাল প্রোভাইডার—এখন শুধু AuthProvider আছে; দরকার হলে থিম/কুয়েরি/টুলটিপ ইত্যাদি এখানে যোগ করো
export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
