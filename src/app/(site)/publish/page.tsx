"use client";
import { useState } from "react";

type Destination = {
  id: number;
  name: string;
  type: "wordpress" | "blogger" | "editor";
  status: "active" | "inactive";
};

export default function ManageAllDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([
    { id: 1, name: "My WordPress Site", type: "wordpress", status: "active" },
    { id: 2, name: "My Blogger Site", type: "blogger", status: "inactive" },
    { id: 3, name: "Editor Mode", type: "editor", status: "active" },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Publishing Destinations</h1>
      <table className="w-full border rounded-lg text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2 text-left">Platform</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="p-2 capitalize">{d.type}</td>
              <td className="p-2">{d.name}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    d.status === "active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {d.status}
                </span>
              </td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline mr-2">
                  Edit
                </button>
                <button className="text-red-600 hover:underline">Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
