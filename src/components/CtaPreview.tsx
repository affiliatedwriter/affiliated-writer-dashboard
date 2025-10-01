"use client";
import React from "react";

type Props = {
  styleId: string;
  onStyleChange: (v: string) => void;
  btnColor: string;
  onBtnColor: (v: string) => void;
  textColor: string;
  onTextColor: (v: string) => void;
};

const CTA_STYLES = [
  { id: "solid", label: "Solid" },
  { id: "outline", label: "Outline" },
  { id: "soft", label: "Soft" },
];

export default function CtaPreview({
  styleId, onStyleChange, btnColor, onBtnColor, textColor, onTextColor,
}: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium">CTA Style</label>
        <div className="flex gap-2">
          {CTA_STYLES.map(s => (
            <button
              key={s.id}
              type="button"
              onClick={() => onStyleChange(s.id)}
              className={`px-3 py-1.5 rounded-full border text-sm ${styleId===s.id ? "border-blue-600 text-blue-600" : "border-gray-300 text-gray-600"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium">Button Color</label>
            <input type="color" value={btnColor} onChange={e=>onBtnColor(e.target.value)} className="h-10 w-full rounded-md border" />
          </div>
          <div>
            <label className="block text-sm font-medium">Text Color</label>
            <input type="color" value={textColor} onChange={e=>onTextColor(e.target.value)} className="h-10 w-full rounded-md border" />
          </div>
        </div>
      </div>

      {/* live preview – as if inside article */}
      <div className="rounded-xl border p-4 bg-white">
        <h4 className="font-semibold mb-2">Live Preview</h4>
        <div className="prose">
          <p className="text-sm text-gray-600">Sample article paragraph…</p>
          <div className="mt-3">
            <a
              href="#"
              style={{
                background: styleId==="outline" ? "transparent" : btnColor,
                color: textColor,
                borderColor: btnColor,
                borderWidth: 2,
              }}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium ${styleId==="outline" ? "border" : ""} ${styleId==="soft" ? "opacity-90" : ""}`}
            >
              Buy on Amazon →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
