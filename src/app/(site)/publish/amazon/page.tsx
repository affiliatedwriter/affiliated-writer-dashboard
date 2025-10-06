"use client";
import { useState } from "react";

export default function AmazonAPIPage() {
  const [apiName, setApiName] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [country, setCountry] = useState("US");

  const handleSave = () => {
    console.log("Saving Amazon API:", { apiName, accessKey, secretKey, trackingId, country });
    alert(`Amazon API "${apiName}" saved successfully!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Connect Amazon API</h1>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="API Name (For Reference)"
          value={apiName}
          onChange={(e) => setApiName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Access Key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="w-full border rounded p-2"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="US">Amazon.com - United States</option>
          <option value="UK">Amazon.co.uk - United Kingdom</option>
          <option value="IN">Amazon.in - India</option>
          <option value="CA">Amazon.ca - Canada</option>
        </select>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Verify & Save
        </button>
      </div>
    </div>
  );
}
