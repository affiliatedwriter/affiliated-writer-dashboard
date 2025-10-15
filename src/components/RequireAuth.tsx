"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

type Props = {
  children: ReactNode;
  adminOnly?: boolean;
  redirectTo?: string;
};

export default function RequireAuth({
  children,
  adminOnly = false,
  redirectTo = "/login",
}: Props) {
  const router = useRouter();
  const { user, loading } = useAuth() as { user: any; loading?: boolean };
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (adminOnly) {
      const isAdmin =
        user?.role === "admin" || user?.is_admin === true || user?.isAdmin === true;
      if (!isAdmin) {
        router.replace("/");
        return;
      }
    }

    setReady(true);
  }, [user, loading, adminOnly, router, redirectTo]);

  if (!ready) return null;
  return <>{children}</>;
}
