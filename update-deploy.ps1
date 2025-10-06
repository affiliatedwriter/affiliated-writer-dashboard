# ==== STEP 1: Navigate to project folder ====
cd "C:\affiliated-writer\affiliated-writer-dashboard"

# ==== STEP 2: Stage all changes ====
git add -A
Write-Host "`n✅ All modified files added to Git."

# ==== STEP 3: Commit with message ====
$commitMessage = "fix: update auth, sidebar, and admin/user access logic"
git commit -m "$commitMessage"
Write-Host "`n✅ Commit created: $commitMessage"

# ==== STEP 4: Push to GitHub ====
git push origin main
Write-Host "`n🚀 Code pushed to GitHub main branch."

# ==== STEP 5: Deploy to Vercel (force rebuild) ====
Write-Host "`n⚙️ Starting Vercel deployment..."
npx vercel --prod --force
Write-Host "`n✅ Deployment process triggered on Vercel."
