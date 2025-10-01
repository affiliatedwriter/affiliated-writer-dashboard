"use client";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => { clearToken(); router.replace("/login"); }}
      className="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}
