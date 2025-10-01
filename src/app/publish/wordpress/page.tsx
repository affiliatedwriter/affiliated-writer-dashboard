"use client";
import { useState } from "react";

export default function WordPressPage() {
  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");

  const handleSave = () => {
    console.log("Saving WordPress site:", { siteName, siteUrl, username, appPassword });
    alert(`WordPress site "${siteName}" saved successfully!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Connect WordPress Site</h1>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Site Name (Optional)"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Site URL"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="WordPress Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="password"
          placeholder="Application Password"
          value={appPassword}
          onChange={(e) => setAppPassword(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Verify & Save
        </button>
      </div>
    </div>
  );
}
