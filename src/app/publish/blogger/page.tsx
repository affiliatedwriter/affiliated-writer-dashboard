"use client";
import { useState } from "react";

export default function BloggerPage() {
  const [siteName, setSiteName] = useState("");
  const [googleAccount, setGoogleAccount] = useState("");

  const handleSave = () => {
    console.log("Saving Blogger site:", { siteName, googleAccount });
    alert(`Blogger site "${siteName}" connected successfully!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Connect Blogger Site</h1>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Site Name (Optional)"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          placeholder="Google Account Email"
          value={googleAccount}
          onChange={(e) => setGoogleAccount(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSave}
          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Verify & Save
        </button>
      </div>
    </div>
  );
}
