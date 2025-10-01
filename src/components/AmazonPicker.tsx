"use client";

import usePublishOptions, { asOptions, AmazonCfg } from "@/lib/usePublishOptions";
import { useMemo } from "react";

type Props = {
  value?: number | "";
  onChange: (id: number | "") => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
};

export default function AmazonPicker({
  value = "",
  onChange,
  placeholder = "Choose API",
  disabled,
  className,
  required,
}: Props) {
  const { amazon, loading, error, reload } = usePublishOptions();

  const options = useMemo(() => asOptions<AmazonCfg>(amazon), [amazon]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium">Select Amazon API</label>
        {error ? (
          <button
            type="button"
            className="text-xs text-red-600 underline"
            onClick={() => reload()}
          >
            Retry
          </button>
        ) : null}
      </div>

      <select
        className="w-full border rounded px-3 py-2 text-sm"
        value={value === "" ? "" : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? "" : Number(v));
        }}
        disabled={disabled || loading}
        required={required}
      >
        <option value="">{loading ? "Loading…" : placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {(!loading && !error && options.length === 0) && (
        <p className="mt-1 text-xs text-gray-500">
          No saved API found. Please add one from <b>Website And Api</b>.
        </p>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
