# Architecture

## Current web app
- React + TypeScript + Vite; responsive, browser-first UI.
- PWA manifest and app icon for home-screen installation.
- Local storage is the zero-setup fallback.
- Optional Supabase Auth (email OTP) and Postgres JSON state row per user.
- Static hosting is possible through GitHub Pages; Pages does not provide a database, authentication, or scheduled push delivery.

## Data model
A planner item has: `id`, `date` (local YYYY-MM-DD), `title`, `details`, `kind` (`event | task | note`), `start`, `end`, `done`, `category`, `createdAt`.

The first cloud implementation stores the full item array in one row per account. This is suitable for a small personal MVP, but it is not a conflict-free multi-device database: simultaneous edits from two devices can overwrite each other. Before production, migrate to one row per item, add updated_at/version handling, and test offline/reconnect conflict resolution.

## Important limits
- Local storage is browser/device-specific and can be cleared by the user/browser.
- Browser notifications are permission-gated; scheduled reminders are not reliable when a PWA is closed or the operating system suspends it.
- Apple Calendar data is not automatically accessible to a website. A web app must use an explicit calendar integration/permission flow, or a native iOS app must request EventKit authorization.
- GitHub Pages deployment uses a project path `/Notes/`; custom domains and alternative hosting require updating Vite base and PWA paths.
