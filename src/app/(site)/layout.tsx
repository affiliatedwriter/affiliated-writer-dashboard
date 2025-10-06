// src/app/(site)/layout.tsx
import type { ReactNode } from "react";
import ClientShell from "@/components/ClientShell";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <ClientShell>{children}</ClientShell>;
}
