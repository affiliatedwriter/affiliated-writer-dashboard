// src/components/Navbar.tsx
"use client";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-14 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="hidden sm:inline">Welcome 👋</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-red-600 hover:text-red-700"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
