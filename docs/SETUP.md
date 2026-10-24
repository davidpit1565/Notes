# Setup: run, publish, and enable account sync

## 1. Run locally
Install Node.js 20+, then:
```sh
npm install
cp .env.example .env.local
npm run dev
```
Open the local URL printed by Vite. With blank Supabase variables, data stays in this browser.

## 2. Publish the website
1. Open repository Settings → Pages.
2. Choose **GitHub Actions** as the deployment source.
3. Push to `main`; the workflow builds and deploys the site.
4. After the workflow succeeds, open the Pages URL shown in repository Settings. It should use the project path `/Notes/`.

## 3. Enable login and sync
1. Create a Supabase project at https://supabase.com/dashboard.
2. In Project Settings → API, copy the Project URL and the publishable/anon client key.
3. In Supabase SQL Editor, run the contents of `supabase/schema.sql`.
4. In Authentication → URL Configuration, add your published Pages URL to Site URL and Redirect URLs.
5. In GitHub Settings → Secrets and variables → Actions → Variables, add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your publishable/anon key
6. Re-run the deployment workflow (or push a new commit).
7. In the app, choose My workspace → enter your email → open the sign-in link on the same browser/device where you want to sign in.

These are client-side public configuration values. **Never put a Supabase service-role key in Vite variables or browser code.** RLS policies in the supplied SQL restrict each row to its owner.

## 4. Cross-device sign-in
Repeat sign-in on the other device with the same email. After the account loads, the cloud state should appear there. Test a new item on device A, wait for sync, then refresh device B. The current MVP stores one JSON state per user; avoid simultaneous editing until conflict handling is upgraded.

## 5. Install on iPhone
Open the published URL in Safari → Share → Add to Home Screen. This installs a web app shortcut, not a native App Store app. iOS notification support depends on OS version, installation method, permissions, and the implementation; this build does not promise background scheduled reminders.

## Troubleshooting
- A blank page: inspect the GitHub Actions build/deploy run; confirm Pages source is GitHub Actions.
- 404 on assets: check that the repository is named `Notes` and the Vite base is `/Notes/`.
- Login link fails: add the exact Pages URL to Supabase redirect allow-list.
- Sync unavailable: verify the two Actions variables and the SQL schema/RLS.
