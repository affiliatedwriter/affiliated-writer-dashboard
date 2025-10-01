"use client";
import { useState } from "react";

type Props = {
  aiProvider: string;
  setAiProvider: (val: string) => void;
  meta: string;
  setMeta: (val: string) => void;
  schema: string;
  setSchema: (val: string) => void;
  ctaColor: string;
  setCtaColor: (val: string) => void;
  ctaTextColor: string;
  setCtaTextColor: (val: string) => void;
};

export default function ArticleOptionsPanel({
  aiProvider,
  setAiProvider,
  meta,
  setMeta,
  schema,
  setSchema,
  ctaColor,
  setCtaColor,
  ctaTextColor,
  setCtaTextColor,
}: Props) {
  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow">
      {/* AI Provider */}
      <div>
        <label className="block text-sm font-medium">AI Provider</label>
        <select
          value={aiProvider}
          onChange={(e) => setAiProvider(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="chatgpt">ChatGPT (Recommended)</option>
          <option value="gemini">Gemini</option>
        </select>
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium">Meta Description</label>
        <textarea
          rows={3}
          value={meta}
          onChange={(e) => setMeta(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {/* Schema */}
      <div>
        <label className="block text-sm font-medium">Schema Type</label>
        <select
          value={schema}
          onChange={(e) => setSchema(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="BlogPosting">BlogPosting</option>
          <option value="HowTo">HowTo</option>
          <option value="FAQPage">FAQPage</option>
        </select>
      </div>

      {/* CTA Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">CTA Button Color</label>
          <input
            type="color"
            value={ctaColor}
            onChange={(e) => setCtaColor(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">CTA Text Color</label>
          <input
            type="color"
            value={ctaTextColor}
            onChange={(e) => setCtaTextColor(e.target.value)}
            className="mt-1 h-10 w-full rounded-md border"
          />
        </div>
      </div>
    </div>
  );
}
