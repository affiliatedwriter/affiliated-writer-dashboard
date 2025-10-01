"use client";
import { clearToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const r = useRouter();
  return (
    <button
      onClick={() => {
        clearToken();
        r.replace("/login");
      }}
      className="text-sm text-gray-500 hover:text-red-600"
    >
      Sign out
    </button>
  );
}
