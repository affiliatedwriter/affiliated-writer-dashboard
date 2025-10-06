// src/app/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Affiliated Writer",
  description: "Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
