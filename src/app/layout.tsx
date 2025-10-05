// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Affiliated Writer",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased overflow-x-hidden">
        {/* ✅ Sidebar only ONCE here */}
        <div className="flex min-h-screen">
          <aside className="fixed inset-y-0 left-0 w-64 border-r bg-white">
            <Sidebar />
          </aside>

          {/* Content area */}
          <main className="flex-1 ml-64 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
