import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Affiliated Writer Dashboard",
  description: "Manage your affiliated content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
