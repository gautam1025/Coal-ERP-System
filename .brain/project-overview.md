# Current Codebase Overview

## Repository Purpose
The repository is currently a Vite + React single-page app that still contains an older fuel / vehicle workflow. It is being refactored into a Coal Deal Management ERP demo.

## Current Tech Stack
- React 18
- Vite
- React Router DOM 6
- Tailwind CSS
- Lucide React
- Zustand
- react-hot-toast
- Recharts is present in the intended spec but not yet wired in the current coal refactor path

## Main Constraints
- Keep the existing layout shell intact.
- Do not redesign CSS or rebuild the component library.
- Use local demo data only.
- No backend, no API, no database, no auth redesign.
- Track the work around one demo deal: `DEAL-2026-001`.
- Update `src/App.jsx` after every batch so progress is visible.
- Keep each batch to at most 5 files.

## Current App Shell
- `src/App.jsx` initializes storage and renders the router inside `Providers`.
- `src/main.jsx` mounts the app and installs a fetch shim for Google Apps Script calls.
- `src/app/layout.jsx` controls the authenticated layout with sidebar, header, content area, and footer.
- `src/app/providers.jsx` forces light theme and installs toast support.

## Current Routing Situation
The app still routes to the old fuel/vehicle modules.

Current route surface before refactor:
- `/login`
- `/dashboard`
- `/profile`
- `/employee-logs/approval`
- `/employee-logs/payment`
- `/office-logs/advance-payment`
- `/office-logs/actual-filling`
- `/master`
- `/settings`

The refactor will replace this with coal ERP routes while preserving the layout shell.

## Existing Files That Matter
- `src/App.jsx`
- `src/app/routes.jsx`
- `src/app/layout.jsx`
- `src/app/providers.jsx`
- `src/main.jsx`
- `src/utils/storageManager.js`
- `src/store/authStore.js`
- `src/components/*`
- `src/pages/dashboard/Dashboard.jsx`
- `src/pages/profile/profile.jsx`
- `src/pages/auth/Login.jsx`
- `src/pages/Settings.jsx`

## Important Behavioral Notes
- `layout.jsx` blocks unauthenticated access with a redirect to `/login`.
- `authStore.js` reads and writes `localStorage.user`.
- `storageManager.js` resets localStorage once using `dummy_data_cleaned_v1` and seeds users.
- The current dashboard file is still tied to the old vehicle/fuel data services and will be replaced.
- The current sidebar and header are still branded for the old system and will be left alone for now unless route labels need to be adapted later.

## Relevant Current Data and State
- Default users are seeded in local storage by `initializeStorage()`.
- `App.jsx` currently calls `initializeStorage()` on mount.
- `index.html` already sets the page title to `Coal ERP System`.
- The workspace already has a `COAL_ERP_IMPLEMENTATION_PLAN.md` file describing the batch strategy.
