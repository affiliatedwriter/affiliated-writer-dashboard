// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase =
  (globalThis as any).__supabase__ ?? createClient(url, anon);

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).__supabase__ = supabase;
}
