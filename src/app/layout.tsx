// File: src/app/layout.tsx
import "./globals.css"; // থাকলে

export const metadata = {
  title: "Affiliated Writer",
  description: "Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* এখানে কখনও Sidebar/ClientShell দেবেন না */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
