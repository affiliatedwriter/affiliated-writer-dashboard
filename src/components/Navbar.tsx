"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const title = useMemo(() => {
    if (pathname.startsWith("/admin")) return "Admin Dashboard";
    if (pathname.startsWith("/articles")) return "Articles";
    if (pathname.startsWith("/publish")) return "Website & API";
    return "Dashboard";
  }, [pathname]);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex items-center justify-between px-6 h-14">
        <h1 className="font-semibold text-lg">{title}</h1>
        <button
          onClick={signOut}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
