# Daymark — your day, with room to think

Daymark combines a daily schedule, flexible tasks, and date-linked notes in one calm workspace. It is designed for people whose plans contain both timed commitments and untimed thinking.

## Current delivery

- Native SwiftUI iOS project scaffold in `ios/Daymark.xcodeproj` (local-only prototype; not App Store ready)

- Responsive web app / Progressive Web App (Mac, iPhone, iPad)
- Daily timeline with timed blocks and flexible tasks
- Notes attached to a date
- Local-first storage for immediate use
- Optional Supabase authentication and cross-device sync
- GitHub Pages deployment workflow

**Honesty about sync:** local mode stores data on the current browser/device only. Cross-device sync and account login require a Supabase project and environment secrets; these are documented in `docs/SETUP.md`. Do not enter sensitive notes on a shared device.

## Run locally

Requirements: Node.js 20+.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Without Supabase environment values, the app runs in local-only mode. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to enable email authentication and cloud sync.

## Deploy

Enable GitHub Pages with **GitHub Actions** as the build/deployment source in repository Settings → Pages. The included workflow builds the Vite app and deploys it from `main`.

For cloud sync, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as repository Actions variables (Settings → Secrets and variables → Actions → Variables). These are public client configuration values, not service-role secrets. Never expose a Supabase service-role key in a browser app.

## Product direction

See [product brief](docs/PRODUCT_BRIEF.md), [architecture](docs/ARCHITECTURE.md), [setup](docs/SETUP.md), and [release checklist](docs/RELEASE_CHECKLIST.md).

## Status

Early implementation. GitHub Pages, auth, sync, reminders, and native packaging must be validated in their target environments before claiming production readiness.
