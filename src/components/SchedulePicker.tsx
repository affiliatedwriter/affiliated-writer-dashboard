"use client";
import { useEffect, useMemo, useState } from "react";
import { Schedule, IntervalUnit } from "@/types/schedule";
import { getNextRunISO } from "@/lib/schedule";

type Props = {
  value?: Schedule;
  onChange?: (v: Schedule) => void;
  className?: string;
};

const UNITS: { value: IntervalUnit; label: string }[] = [
  { value: "minute", label: "Minute" },
  { value: "hour",   label: "Hour" },
  { value: "day",    label: "Day" },
  { value: "week",   label: "Week" },
];

export default function SchedulePicker({ value, onChange, className }: Props) {
  const [enabled, setEnabled] = useState<boolean>(value?.enabled ?? false);
  const [amount, setAmount]   = useState<number>(value?.amount ?? 1);
  const [unit, setUnit]       = useState<IntervalUnit>(value?.unit ?? "hour");
  const [startAt, setStartAt] = useState<string | undefined>(value?.startAt ?? undefined);

  useEffect(() => {
    onChange?.({ enabled, amount, unit, startAt: startAt || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, amount, unit, startAt]);

  const nextRun = useMemo(() => {
    const s: Schedule = { enabled, amount, unit, startAt };
    return getNextRunISO(s);
  }, [enabled, amount, unit, startAt]);

  return (
    <div className={`border rounded-lg p-4 space-y-3 ${className || ""}`}>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          className="h-4 w-4"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="font-medium">Enable Scheduled Posting</span>
      </label>

      {enabled && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Interval</span>
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
                className="w-20 border rounded px-2 py-1"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as IntervalUnit)}
                className="border rounded px-2 py-1"
              >
                {UNITS.map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Start At</span>
              <input
                type="datetime-local"
                value={startAt ? localDatetime(startAt) : ""}
                onChange={(e) => {
                  const v = e.target.value;
                  setStartAt(v ? new Date(v).toISOString() : undefined);
                }}
                className="border rounded px-2 py-1"
              />
              <button
                type="button"
                className="text-xs text-gray-500 underline"
                onClick={() => setStartAt(undefined)}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded px-3 py-2">
            {amount} {unit}(s) interval selected.
            {" "}
            {nextRun ? <>Next run: <b>{pretty(nextRun)}</b></> : "Will run immediately."}
          </div>
        </>
      )}
    </div>
  );
}

// helpers
function localDatetime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function pretty(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
