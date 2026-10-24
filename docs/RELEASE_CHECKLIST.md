# Release readiness checklist

This is a checklist, not a claim that the product is App Store ready.

## Web/PWA
- [ ] GitHub Pages workflow succeeds on a clean build.
- [ ] Test desktop Safari/Chrome and iPhone Safari at narrow widths.
- [ ] Test create/edit/delete, search, date navigation, completion, refresh persistence.
- [ ] Test no-network use and recovery.
- [ ] Test Supabase email login, sign-out, per-user RLS, and sync on two devices.
- [ ] Resolve multi-device concurrent-write conflicts before relying on cloud data.
- [ ] Add a real privacy policy and contact/support page before public launch.
- [ ] Verify PWA install, icons, manifest paths, and accessibility/keyboard behavior.
- [ ] Test time zones and daylight-saving transitions.

## Notifications
- [ ] Define reminder semantics and timezone handling.
- [x] Add native local notifications for scheduled event starts (implementation only).\n- [ ] Test notification permission, timezone behavior and delivery while the app is closed on a physical iPhone.\n- [ ] Implement browser/PWA reminders if they remain a product requirement.
- [ ] Explain permission purpose before asking for notification permission.

## Native iOS / App Store (scaffold exists; release still blocked)
- [ ] Decide native SwiftUI vs Capacitor wrapper; a website is not an Xcode app by itself.
- [x] Add a starter SwiftUI Xcode project to `ios/Daymark.xcodeproj` (not yet build-verified).\n- [ ] Build the Xcode project with current Xcode/SDK and fix any compiler/project issues.
- [ ] Create app icon asset catalog (all required sizes/appearances), launch experience, bundle ID, version/build.
- [ ] Configure signing, entitlements, privacy manifest as applicable, and required-reason API declarations if applicable.
- [ ] Implement native notification scheduling and request permissions contextually.
- [ ] Implement Apple Calendar access only after explicit EventKit permission and clear user value.
- [ ] Add privacy policy URL, support URL, app description, keywords, age rating, screenshots for required device sizes, and review notes.
- [ ] Complete App Privacy disclosures accurately, including any third-party SDKs/data collection.
- [ ] Validate account deletion in-app if account creation is supported, and provide required privacy disclosures.
- [ ] Run automated tests and manual tests on real iPhone hardware; test VoiceOver, Dynamic Type, offline and auth expiry.
- [ ] Archive in Xcode, validate upload, distribute via TestFlight, test installation/update, then submit for review.
- [ ] Re-check current Apple App Review Guidelines and App Store Connect requirements at release time.
