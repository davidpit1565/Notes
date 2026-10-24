# Setup and deployment

## Run locally
Install Node.js 20+, then `npm install` and `npm run dev`. Open the URL Vite prints. Data is saved in this browser.

## GitHub Pages
1. Open repository Settings → Pages.
2. Select GitHub Actions as the source.
3. Push to `main`; wait for the workflow to finish.
4. Open the published URL shown in Pages settings (expected project path `/Notes/`).

## Account and cloud sync
Cloud login is not yet implemented in this first scaffold. To enable it safely, create a Supabase project, add email OTP authentication, create a per-user planner table with row-level security, and implement client auth + sync. Never expose a Supabase service-role key in browser code. Keep the app's status truthful: local storage is not cross-device sync.

## iPhone
Open the published site in Safari and use Share → Add to Home Screen. This is a home-screen web app shortcut, not a native App Store application. Test on a real iPhone before relying on it.