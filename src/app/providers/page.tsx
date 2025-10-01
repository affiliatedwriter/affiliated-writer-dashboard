"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function ProvidersPage() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/providers")
      .then((res) => setProviders(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Providers</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border bg-white shadow">
          <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Active</th>
            </tr>
          </thead>
          <tbody>
            {providers.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.is_active ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
