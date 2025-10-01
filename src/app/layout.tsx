// src/app/layout.tsx
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Navbar />
          <div className="p-6">{children}</div>
        </main>
      </body>
    </html>
  );
}
