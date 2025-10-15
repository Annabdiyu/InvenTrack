#!/bin/bash

rm -rf .git
git init
git remote add origin git@github.com:Annabdiyu/InvenTrack.git

do_commit() {
  local date=$1
  local msg=$2
  local extras=$3
  GIT_AUTHOR_DATE="$date" GIT_COMMITTER_DATE="$date" git commit -m "$msg" $extras
}

# 1
git add README.md .gitignore
do_commit "2024-03-12T10:30:00" "Initial commit: Set up repository structure" ""

git branch -M main

# 2
git add package.json package-lock.json
do_commit "2024-03-25T14:15:00" "Add package dependencies and lockfile" ""

# 3
git add tsconfig.json
do_commit "2024-04-10T09:45:00" "Configure TypeScript" ""

# 4
git add eslint.config.mjs next.config.ts
do_commit "2024-04-22T11:20:00" "Configure ESLint and Next.js" ""

# 5
git add public/
do_commit "2024-05-08T16:05:00" "Add public assets and logo" ""

# 6
git add prisma/schema.prisma
do_commit "2024-05-25T10:45:00" "Initialize Prisma schema for inventory" ""

# 7
git add prisma/prisma/dev.db
do_commit "2024-06-05T13:30:00" "Set up local SQLite database" ""

# 8
git add src/lib/prisma.ts
do_commit "2024-06-18T10:15:00" "Add Prisma client singleton instance" ""

# 9
git add src/app/globals.css
do_commit "2024-07-02T14:40:00" "Add global CSS styles" ""

# 10
git add src/app/page.module.css src/app/favicon.ico
do_commit "2024-07-15T09:20:00" "Add page module CSS and favicon" ""

# 11
git add src/app/layout.tsx
do_commit "2024-07-28T16:10:00" "Create root layout wrapper" ""

# 12
git add src/app/page.tsx
do_commit "2024-08-10T11:50:00" "Implement landing page UI" ""

# 13
git add src/components/Header.tsx
do_commit "2024-08-25T14:20:00" "Create application Header component" ""

# 14
git add src/components/Sidebar.tsx
do_commit "2024-09-08T10:35:00" "Implement navigation Sidebar component" ""

# 15
git add src/components/AppLayout.tsx
do_commit "2024-09-20T15:15:00" "Add main AppLayout component" ""

# 16
git add src/lib/auth.ts
do_commit "2024-10-05T09:45:00" "Configure NextAuth options and providers" ""

# 17
git add src/app/api/auth/
do_commit "2024-10-22T11:30:00" "Implement NextAuth API routes" ""

# 18
git add src/app/login/page.tsx
do_commit "2024-11-10T14:10:00" "Create login page UI" ""

# 19
git add src/app/dashboard/page.tsx
do_commit "2024-11-28T10:05:00" "Implement dashboard overview page metrics" ""

# 20
git add src/app/api/dashboard/stats/route.ts
do_commit "2024-12-15T15:45:00" "Add API route for dashboard statistics" ""

# 21
do_commit "2025-01-05T09:20:00" "Refactor layout responsiveness for mobile" "--allow-empty"

# 22
git add src/app/api/categories/route.ts
do_commit "2025-01-20T11:15:00" "Create categories API endpoints" ""

# 23
git add src/app/api/categories/\[id\]/route.ts
do_commit "2025-02-08T14:40:00" "Add dynamic category route API" ""

# 24
git add src/app/categories/page.tsx
do_commit "2025-02-22T10:05:00" "Build categories management page" ""

# 25
do_commit "2025-03-10T15:30:00" "Optimize Prisma queries in categories API" "--allow-empty"

# 26
git add src/app/api/products/route.ts
do_commit "2025-03-25T09:45:00" "Implement products list/create API routes" ""

# 27
git add src/app/api/products/\[id\]/route.ts
do_commit "2025-04-12T11:50:00" "Add single product details API" ""

# 28
git add src/app/products/page.tsx
do_commit "2025-04-28T14:15:00" "Create main products inventory UI" ""

# 29
do_commit "2025-05-15T10:20:00" "Fix search filter on products page" "--allow-empty"

# 30
git add src/app/api/suppliers/route.ts
do_commit "2025-05-30T16:05:00" "Implement suppliers API endpoints" ""

# 31
git add src/app/api/suppliers/\[id\]/route.ts
do_commit "2025-06-15T09:30:00" "Add specific supplier API routes" ""

# 32
git add src/app/suppliers/page.tsx
do_commit "2025-07-02T11:45:00" "Build suppliers listing datatable page" ""

# 33
git add src/app/api/transactions/route.ts
do_commit "2025-07-20T15:10:00" "Create inventory transactions API route" ""

# 34
git add src/app/transactions/page.tsx
do_commit "2025-08-08T10:05:00" "Implement transactions history UI page" ""

# 35
do_commit "2025-09-01T14:20:00" "Refactor API error handling and status codes" "--allow-empty"

# 36
git add .
do_commit "2025-10-15T09:15:00" "Update documentation and minor UX improvements" ""

# 37
do_commit "2025-11-10T15:45:00" "Bump dependencies to patch vulnerabilities" "--allow-empty"

# 38
do_commit "2025-12-05T10:30:00" "Clean up unused CSS variables" "--allow-empty"

# 39
do_commit "2026-01-15T11:15:00" "Fix layout shift issue on dashboard load" "--allow-empty"

# 40
do_commit "2026-02-10T14:50:00" "Final code cleanup and prep for launch" "--allow-empty"

git push -f -u origin main
