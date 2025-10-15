#!/usr/bin/env bash
set -euo pipefail

# কোন কোন ফাইলে চালাবো: (site)/articles/*/page.tsx সবগুলো
mapfile -t PAGES < <(find "src/app/(site)/articles" -type f -name "page.tsx")

echo "Will patch ${#PAGES[@]} files..."

for f in "${PAGES[@]}"; do
  echo "Patching: $f"

  # কেস-১:  p.wordpress || { status: "draft" }  -> must include websiteId/categoryId
  perl -0777 -i -pe \
's/\{\s*\.\.\.\(p\.wordpress\s*\|\|\s*\{\s*status:\s*"draft"\s*\}\s*\)/{ ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }) }/g' \
    "$f"

  # কেস-২:  ...(p.wordpress || { websiteId: wid }) -> categoryId/status ensure
  perl -0777 -i -pe \
's/\.\.\.\(p\.wordpress\s*\|\|\s*\{\s*websiteId:\s*([a-zA-Z0-9_]+)\s*\}\s*\)/...(p.wordpress || { websiteId: \1, categoryId: null, status: "draft" })/g' \
    "$f"

  # কেস-৩:  ...(p.wordpress || { websiteId: null }) -> categoryId/status ensure
  perl -0777 -i -pe \
's/\.\.\.\(p\.wordpress\s*\|\|\s*\{\s*websiteId:\s*null\s*\}\s*\)/...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" })/g' \
    "$f"

  # কেস-৪:  wordpress: { ...(p.wordpress || { status: "draft" }), categoryId: null }
  #           -> wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }), categoryId: null }
  perl -0777 -i -pe \
's/wordpress:\s*\{\s*\.\.\.\(p\.wordpress\s*\|\|\s*\{\s*status:\s*"draft"\s*\}\s*\)\s*,\s*categoryId:\s*null\s*\}/wordpress: { ...(p.wordpress || { websiteId: null, categoryId: null, status: "draft" }), categoryId: null }/g' \
    "$f"
done

echo "✓ Defaults for wordpress(site/category/status) patched."
