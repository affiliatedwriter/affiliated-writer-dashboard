"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    setReady(true);
  }, [router, pathname]);

  if (!ready) return null;
  return <>{children}</>;
}
