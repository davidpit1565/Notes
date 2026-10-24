# Native iOS and App Store requirements research

Checked 25 October 2026. Apple requirements change; re-check all linked sources immediately before submission. This checklist is planning evidence, not an approval guarantee.

## Official Apple sources

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Before You Submit / App Review](https://developer.apple.com/app-store/review/)
- [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- [Manage app privacy in App Store Connect](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/)
- [Account deletion requirement](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [GitHub Pages deployment guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## Required work before native submission

### Product and binary
- A real Xcode project or supported native wrapper, with an explicit bundle identifier, version/build, launch behavior, signing and distribution configuration.
- Current supported iOS SDK/Xcode build; archive and upload validation.
- App icon asset catalog at the required sizes and appearances; launch screen; app display name; supported device layouts.
- Real iPhone testing, not just browser preview: installation, update, offline behavior, rotation/size changes where supported, Dynamic Type, VoiceOver, keyboard, and crash/error paths.

### Store listing and review
- Accurate name, subtitle, description, category, keywords, age-rating answers, copyright, screenshots for required device classes, and preview video if used.
- Public support URL and public privacy policy URL; both should remain available.
- Review notes that explain the actual feature set. Provide a working demo account or full demo mode if account-based features need review access.
- Do not advertise unimplemented calendar access, push reminders, cloud sync, or AI features in screenshots/metadata.

### Privacy and account
- Complete App Privacy disclosures in App Store Connect based on actual data flows and every included third-party SDK.
- Privacy policy must identify collected data, collection method, purpose, sharing, retention, deletion and how consent can be revoked.
- If the app supports account creation, Apple requires users to be able to initiate account deletion within the app. Deletion should remove the account and associated user data except data legally required to be retained.
- Supabase auth/data handling must be reflected in the privacy disclosures. Do not claim data is never sent to a server if cloud sync is enabled.
- Keep secrets out of the client bundle; a Supabase publishable/anon key may be client-visible only when Row Level Security is correctly configured. Never ship a service-role key.

### Calendar and notifications
- A website cannot silently access the full Apple Calendar database. Native calendar integration requires an explicit purpose, EventKit authorization, and clear denial behavior.
- Request notification permission in context. Test scheduled local notifications on real devices.
- If promising reminders while the app is closed, implement and test a supported delivery path; browser notification permission alone is not enough.

### TestFlight
- Archive and validate the native app in Xcode.
- Upload to App Store Connect; resolve processing and signing errors.
- Create a TestFlight build, add internal/external testers as appropriate, test install, sign-in, sync, reminders, upgrade, and deletion.
- TestFlight is beta distribution, not proof that App Review will approve the final release.

## Current Daymark status
- [x] Web-first product direction and initial responsive interface.
- [x] Local persistence, date picker, time blocks, tasks, notes, search.
- [x] PWA manifest, icon, offline app-shell service worker.
- [x] Initial GitHub Pages workflow added.
- [x] Release checklist and architecture risks documented.
- [x] Verify web typecheck/production build and GitHub Pages deployment on the merged commit.\n- [x] Add a native SwiftUI Xcode project and automated iOS Simulator build workflow (automated build passes; physical-device behavior remains unverified).
- [ ] Verify Supabase account sync on two physical devices; resolve simultaneous edit conflicts.
- [ ] Add real privacy policy and support contact before public release.
- [ ] Add account deletion flow before any native release that supports account creation.
- [x] Add a draft native app icon asset generation step and Xcode asset catalog.\n- [ ] Finalize app icon/brand and verify rendered icon in Xcode and on device.\n- [ ] Complete native shared cloud sync/auth, privacy/support URLs, signing, privacy declarations and TestFlight validation.

**Honest status:** the repository now contains both a web/PWA and a starter native SwiftUI iOS app. The web build/deployment and automated iOS Simulator build pass, but the product is not App Store-ready: native cross-device sync/auth, physical-device testing, final branding/name availability, privacy/support URLs, release signing and TestFlight remain outstanding. Apple approval cannot be guaranteed by an automated checklist.
