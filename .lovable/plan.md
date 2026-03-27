

# Beudox HR — Sprint A0 Foundation Plan

## Overview
Build the complete foundation: design system, logo component, login screen with Supabase Auth, app shell (sidebar + topbar), empty dashboard, logout, forgot password flow, and RLS policies for the tables needed at login time.

## Database Changes

### 1. RLS Policies for Authentication Flow
Create policies on the tables queried during login/dashboard:

- **employees**: Authenticated users can SELECT their own row (`auth_user_id = auth.uid()`)
- **employee_roles**: Authenticated users can SELECT their own roles (`employee_id` matches their employee record)
- **roles**: Authenticated users can SELECT roles in their company
- **companies**: Authenticated users can SELECT their own company

Create a `get_employee_by_auth_id` security-definer function that returns the employee row + role name for the logged-in user (avoids RLS recursion issues).

### 2. Reset Password Page Route
No DB changes needed — uses `supabase.auth.updateUser()`.

---

## Frontend Files to Create/Modify

### Design System & Global Styles
- **`src/index.css`** — Replace entirely: import Syne + DM Sans fonts, define all `--bx-*` CSS custom variables, override shadcn CSS variables to map to Beudox tokens, set body font to DM Sans, headings to Syne

### Components
- **`src/components/BeudoxLogo.tsx`** — SVG logo component with `variant` prop (`default` | `sidebar`), renders mark + wordmark per spec
- **`public/favicon.svg`** — Logo mark only, 32x32

### Auth
- **`src/hooks/useAuth.tsx`** — Auth context provider: manages Supabase session via `onAuthStateChange`, fetches employee record + role on login, exposes `{ user, employee, role, company, signOut, loading }`
- **`src/pages/Login.tsx`** — Split-panel login screen (left: form card on `#F6F5FF`, right: dark panel with dot grid pattern + taglines). Email/password form with inline validation on blur, forgot password link, Supabase `signInWithPassword`
- **`src/pages/ForgotPassword.tsx`** — Email input, calls `resetPasswordForEmail` with redirect to `/reset-password`
- **`src/pages/ResetPassword.tsx`** — New password form, detects `type=recovery` in URL hash, calls `updateUser({ password })`

### App Shell
- **`src/components/layout/AppSidebar.tsx`** — 240px/64px collapsible sidebar on `#1A1240` with: logo area, nav sections with Lucide icons (Dashboard only active for now, rest visible but placeholder), user zone at bottom with name/role/logout
- **`src/components/layout/TopBar.tsx`** — 64px white bar with page title (Syne 700 26px), breadcrumb
- **`src/components/layout/AppLayout.tsx`** — Wraps sidebar + topbar + content area (`#F6F5FF` bg, 24px padding, max-width 1280px). Uses SidebarProvider

### Dashboard
- **`src/pages/Dashboard.tsx`** — "Welcome back, [Name]" heading (Syne 700), today's date formatted, empty state card

### Routing
- **`src/App.tsx`** — Update routes: `/` redirects to `/dashboard` if authed or `/login` if not. Add `/login`, `/forgot-password`, `/reset-password`, `/dashboard`. Protected route wrapper checks auth context

---

## Architecture Decisions

- Auth context wraps the entire app; checks session on mount
- Employee data (name, role, company_id) fetched once on auth and stored in context — no repeated queries
- Navigation items defined as a config array filtered by role (future-ready), but for now all items shown
- Sidebar collapse state stored in local state (not persisted)
- All pages wrapped in `AppLayout` except login/auth pages

## File Count
~12 new files, ~3 modified files. No mock data. No features beyond what's listed.

