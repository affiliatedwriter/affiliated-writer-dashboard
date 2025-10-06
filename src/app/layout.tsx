// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata: Metadata = {
  title: "Affiliated Writer",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
