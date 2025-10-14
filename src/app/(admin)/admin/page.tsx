"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function AdminHome() {
  // গুরুত্বপূর্ণ: isAuthed ডেস্ট্রাকচার করো না
  const { user, loading } = useAuth();
  const isAuthed = !!user;

  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!loading && !isAuthed) router.replace("/login");
  }, [mounted, loading, isAuthed, router]);

  if (!mounted || loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold">Loading…</h2>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="p-6">
        <p>Redirecting to login…</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          {user?.email ? `Signed in as ${user.email}` : `User ID: ${user?.id}`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/settings"
          className="rounded-xl border p-5 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-1">Settings</h3>
          <p className="text-sm text-gray-600">
            Manage site-wide settings and defaults.
          </p>
        </Link>

        <Link
          href="/admin/prompt-templates"
          className="rounded-xl border p-5 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-1">Prompt Templates</h3>
          <p className="text-sm text-gray-600">
            Create and manage AI prompt templates.
          </p>
        </Link>

        <Link
          href="/admin/feature-flags"
          className="rounded-xl border p-5 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-1">Feature Flags</h3>
          <p className="text-sm text-gray-600">
            Toggle experimental features on or off.
          </p>
        </Link>

        <Link
          href="/admin/credits"
          className="rounded-xl border p-5 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-1">Credits</h3>
          <p className="text-sm text-gray-600">
            View and adjust user credit balances.
          </p>
        </Link>

        <Link
          href="/admin/comparison-templates"
          className="rounded-xl border p-5 hover:bg-gray-50 transition"
        >
          <h3 className="font-semibold mb-1">Comparison Templates</h3>
          <p className="text-sm text-gray-600">
            Build and edit comparison table templates.
          </p>
        </Link>
      </div>
    </div>
  );
}
