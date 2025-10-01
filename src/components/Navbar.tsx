"use client";
import SignOutButton from "@/components/SignOutButton";

export default function Navbar() {
  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 border-b">
      <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Welcome 👋</span>
        <SignOutButton />
      </div>
    </header>
  );
}
