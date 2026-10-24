# Dailume — your day, with room to think

Dailume combines a daily schedule, flexible tasks, and date-linked notes in one calm workspace.

## What is in this repository

- A responsive web app / PWA for Mac, iPhone, and iPad.
- A separate native SwiftUI iOS project in `ios/Daymark.xcodeproj`.
- Timed events, tasks, notes, date navigation, search, completion, and local persistence.
- Native local notifications for scheduled event starts (not yet validated on physical hardware).
- Public privacy and support pages.
- GitHub Actions workflows for web build/deploy and iOS Simulator compilation.

## Data and sync — important

There is **no Supabase dependency or account system** in this release branch. The website saves entries in that browser's local storage. The native iOS app saves entries locally on that device. They do **not** sync with each other or across devices yet. Native iCloud/CloudKit sync is a separate engineering step and must be implemented and tested before promising cross-device sync.

## Run the website locally

Requires Node.js 20+.

```sh
npm install
npm run dev
```

## Publish the website

The repository's GitHub Actions workflow builds and deploys to GitHub Pages. The expected project URL is:

https://davidpit1565.github.io/Notes/

If it does not load, check repository Settings → Pages and confirm **GitHub Actions** is selected as the source, then inspect the latest deployment in Actions.

## Open the native app

On a Mac with Xcode installed, open `ios/Daymark.xcodeproj`, choose the `Daymark` scheme, select an iPhone Simulator, and build. The installed app display name is **Dailume**. To distribute through TestFlight, a signed archive must be uploaded through an authorized Apple Developer / App Store Connect session; GitHub Actions does not upload a signed build.

## Public pages

- Privacy policy: https://davidpit1565.github.io/Notes/privacy.html
- Support: https://davidpit1565.github.io/Notes/support.html
- App Store readiness checklist: [docs/APP_STORE_REQUIREMENTS.md](docs/APP_STORE_REQUIREMENTS.md)
- Release checklist: [docs/RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md)

## Current status

The web production build, GitHub Pages deployment, and automated iOS Simulator build have passed on a recent main-branch commit. This does not prove physical-device behavior or App Store readiness. Remaining blockers include CloudKit sync if required, real iPhone testing, final icon/brand review, signing/archive validation, App Store Connect metadata/privacy declarations, and TestFlight processing.
