#!/usr/bin/env bash
set -euo pipefail

# সব TS/TSX ফাইল নিন
mapfile -t FILES < <(find src -type f \( -name '*.ts' -o -name '*.tsx' \))

for f in "${FILES[@]}"; do
  # 1) import { ... } from '@/lib/api'  -> import api, { ... } from '@/lib/api'
  # 2) import { ... } from '@/lib/api.ts' -> import api, { ... } from '@/lib/api'
  # 3) 'from "@/lib/api.ts"' -> 'from "@/lib/api"'
  perl -0777 -i -pe '
    s/import\s*\{([^}]*)\}\s*from\s*["'\''"]@\/lib\/api(?:\.ts)?["'\''"]/import api, { \1 } from "@\/lib\/api"/g;
    s/from\s*["'\''"]@\/lib\/api\.ts["'\''"]/from "@\/lib\/api"/g;
  ' "$f"
done

echo "✓ api imports normalized."
