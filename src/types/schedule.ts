export type IntervalUnit = "minute" | "hour" | "day" | "week";

export type Schedule = {
  enabled: boolean;
  amount: number;         // 1..n
  unit: IntervalUnit;     // minute | hour | day | week
  startAt?: string | null; // ISO datetime (optional)
};
