// src/app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Sidebar />       {/* ← একবারই এখানে */}
        <main>{children}</main>
      </body>
    </html>
  );
}
