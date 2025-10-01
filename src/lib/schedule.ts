import { Schedule } from "@/types/schedule";

// পরের রান কখন হবে (UI preview দেখানোর জন্য)
export function getNextRunISO(s: Schedule, from: Date = new Date()): string | null {
  if (!s.enabled) return null;

  const d = new Date(from);
  const amt = Math.max(1, s.amount || 1);

  switch (s.unit) {
    case "minute": d.setMinutes(d.getMinutes() + amt); break;
    case "hour":   d.setHours(d.getHours() + amt);     break;
    case "day":    d.setDate(d.getDate() + amt);       break;
    case "week":   d.setDate(d.getDate() + (7 * amt)); break;
  }
  return d.toISOString();
}

// ব্যাকএন্ডে পাঠানোর শেপ – তুমি API তে 그대로 নাও
export function serializeSchedule(s: Schedule) {
  if (!s.enabled) return { enabled: false };
  return {
    enabled: true,
    every: { amount: s.amount, unit: s.unit }, // {amount: 2, unit: 'hour'}
    startAt: s.startAt ?? null,                // optional
    nextRunAt: getNextRunISO(s),               // client side hint
  };
}
