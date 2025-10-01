"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: React.ReactNode;
  mode?: "user" | "admin"; // ডিফল্ট user
};

export default function AuthGuard({ children, mode = "user" }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/login");
      return;
    }

    if (mode === "admin" && role !== "admin") {
      router.push("/login");
      return;
    }

    setAuthorized(true);
  }, [router, mode]);

  if (!authorized) return null; // লোডিং/রিডাইরেক্ট হওয়ার সময় কিছু না দেখানো

  return <>{children}</>;
}
