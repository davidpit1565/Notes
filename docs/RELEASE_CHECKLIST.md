# Dailume release checklist

This checklist distinguishes automated evidence from work that still requires a real Apple account or physical device.

## Confirmed on the previous main-branch revision
- [x] Web TypeScript + Vite production build passed in GitHub Actions.
- [x] GitHub Pages deployment workflow completed successfully.
- [x] Native iOS project compiled for iOS Simulator in GitHub Actions.
- [ ] Re-run all workflows after the current Dailume/no-Supabase branch is merged.

## Web / PWA
- [ ] Confirm Pages is configured to use GitHub Actions.
- [ ] Verify the homepage, CSS/JS assets, PWA manifest, icon, privacy page and support page load publicly.
- [ ] Test Mac Safari/Chrome and iPhone Safari at narrow widths.
- [ ] Test create/edit/delete, date navigation, search, completion and persistence after refresh.
- [ ] Test offline/reconnect and clearing browser storage.
- [ ] Check keyboard navigation, focus visibility, VoiceOver and reduced motion.
- [ ] Website data is local to each browser; there is no website/native or cross-device sync.
- [ ] Website reminders are not implemented; UI must not imply they work.

## Native SwiftUI / iOS
- [x] Native SwiftUI project exists and has a configured display name, bundle identifier, and app icon asset catalog.
- [x] Local planner persistence and local event notification scheduling are implemented in code.
- [x] In-app Privacy Policy and Support links are present.
- [ ] Re-run iOS Simulator build on the latest commit.
- [ ] Inspect the generated AppIcon in Xcode and on device; finalize the brand artwork.
- [ ] Confirm bundle ID availability and create the matching app record in App Store Connect.
- [ ] Configure signing and capabilities for the correct Apple Developer team.
- [ ] Verify local notification permission and delivery on a physical iPhone, including when the app is closed and after timezone changes.
- [ ] Test create/edit/delete/completion, persistence across app relaunch, layout, keyboard, Dynamic Type and VoiceOver on a physical iPhone.
- [ ] Implement CloudKit/iCloud sync if cross-device sync remains required. It is not implemented; native and web data currently do not sync.
- [ ] Decide whether Apple Calendar integration is required; if so, implement EventKit with an explicit purpose and permission flow.
- [ ] Run an Xcode Archive for Any iOS Device, validate it, upload it, and confirm Apple processes the build.
- [ ] Complete TestFlight beta description, test information, review notes, and invite internal testers. External testing may require beta review.
- [ ] Install the actual TestFlight build on the iPhone and test update/upgrade behavior.

## App Store Connect / legal
- [x] Draft public privacy policy at `public/privacy.html`.
- [x] Draft public support page at `public/support.html`.
- [ ] Confirm both URLs are publicly accessible after deployment and policy matches the final shipped data flows.
- [ ] Confirm unique app name availability in App Store Connect and check trademark/domain conflicts.
- [ ] Confirm app icon and display name are consistent across the native app, website, screenshots and metadata.
- [ ] Fill in description, subtitle, keywords, category, age-rating answers, copyright and review notes.
- [ ] Prepare required screenshots for supported device sizes using the actual app.
- [ ] Complete App Privacy disclosures in App Store Connect based on the final binary and actual SDK/data flows.
- [ ] Confirm privacy policy URL and support URL in App Store Connect.
- [x] No account creation exists in the current prototype; account deletion is not applicable unless account creation is added.
- [ ] Re-check Apple's current App Review Guidelines immediately before submission.

## Release gate
Do not call this App Store/TestFlight ready until the unchecked native and App Store items above are completed and a real TestFlight install has been tested. Automated CI cannot verify Apple account setup, signing credentials, physical-device behavior, or Apple's processing/review outcome.
