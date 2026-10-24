# Dailume — native iOS and App Store readiness

Checked 25 October 2026. This checklist records implementation and verification status; it does not guarantee Apple approval.

## Official Apple references
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- [Manage app privacy in App Store Connect](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/)
- [Account deletion requirement](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Upload builds to App Store Connect](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds/)
- [TestFlight](https://developer.apple.com/testflight/)
- [Privacy manifests](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
- [Required-reason APIs](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)
- [CloudKit and Core Data](https://developer.apple.com/documentation/coredata/setting-up-core-data-with-cloudkit)
- [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Identity and URLs
- Working display name: **Dailume**. This avoids the Daymark name variants found in App Store search, but availability and trademark clearance are not confirmed until checked in App Store Connect and appropriate trademark sources.
- Bundle identifier in Xcode: `com.davidpitchkhadze.dailume`. Confirm availability under the active Apple Developer team and create a matching App Store Connect app record.
- Privacy policy: https://davidpit1565.github.io/Notes/privacy.html
- Support page: https://davidpit1565.github.io/Notes/support.html
- These pages are committed under `public/`; confirm the public URLs after the next successful Pages deployment.

## Implemented in repository
- [x] Native SwiftUI project scaffold.
- [x] Display name and bundle identifier configured.
- [x] Draft AppIcon asset catalog and deterministic icon generation build phase.
- [x] Local event-notification scheduling code.
- [x] Public draft privacy policy and support page.
- [x] In-app links to Privacy Policy and Support.
- [x] `PrivacyInfo.xcprivacy` declares UserDefaults required-reason API use for app-owned preferences (CA92.1).
- [x] No account creation or third-party analytics SDK in the current native prototype.
- [x] Web build/deployment and iOS Simulator compilation passed on a previous main-branch commit.

## Must be completed before TestFlight is considered ready
- [ ] Merge the current Dailume branch and confirm web build, Pages deployment and iOS Simulator build pass on the final commit.
- [ ] Confirm privacy/support URLs are publicly accessible and accurately describe the shipped app.
- [ ] Confirm app name availability and create the app record in App Store Connect.
- [ ] Confirm bundle identifier, signing team, capabilities, and App Store Connect app record match.
- [ ] Open the project in Xcode and inspect the actual generated app icon; polish/finalize branding if needed.
- [ ] Run an archive for Any iOS Device, validate it, upload it, and confirm Apple processes the build.
- [ ] Test on a physical iPhone: startup, create/edit/delete, completion, relaunch persistence, notification permission/delivery, timezone changes, VoiceOver, Dynamic Type and layout.
- [ ] Fill in TestFlight beta description, test information, contact details and review notes. Invite internal testers; external testers may require Beta App Review.
- [ ] Install the actual TestFlight build and test an update from one build to the next.
- [ ] Complete App Privacy declarations in App Store Connect based on the final binary and actual data flows.
- [ ] Add App Store description, subtitle, keywords, category, age rating, copyright and actual-device screenshots before App Store submission.
- [ ] Re-check Apple's current App Review Guidelines immediately before submission.

## Explicit product limitations
- Native planner data is currently local to that installation/device. CloudKit/iCloud sync is not implemented.
- The website is a separate local-only PWA. Website and native data do not sync.
- Native local notifications are implemented but have not been verified on physical hardware.
- Website scheduled reminders are not implemented.
- Apple Calendar/EventKit integration is not implemented.
- No app archive has been uploaded and no TestFlight build is currently confirmed available.

## Privacy and account requirements
- The current prototype has no account creation, so in-app account deletion is not applicable. If account creation is added, Apple requires an in-app way to initiate account deletion.
- The native prototype stores planner data locally and does not include analytics or a third-party data SDK. App Privacy declarations must be checked against the exact final binary and any changes before submission.
- The privacy manifest declares the UserDefaults API reason used to save app-owned planner data. Review it again if the storage implementation changes.

**Release gate:** Do not call this app TestFlight-ready until the unchecked items are completed and the actual uploaded TestFlight build has been installed and tested. Automated CI cannot verify developer-account setup, signing credentials, Apple processing, physical-device behavior, or review outcomes.
