"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};
const MODELS = [
  { id: "chatgpt", label: "ChatGPT (Recommended)" },
  { id: "gemini", label: "Gemini" },
];

export default function ModelSelector({ value, onChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">AI Provider</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>{m.label}</option>
        ))}
      </select>
    </div>
  );
}
