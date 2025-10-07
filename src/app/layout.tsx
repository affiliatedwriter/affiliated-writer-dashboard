import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "Affiliated Writer",
  description: "Dashboard and content management tool",
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
