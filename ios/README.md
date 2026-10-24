# Daymark native iOS app

This folder contains a separate SwiftUI iOS app, not a website wrapper. Open Daymark.xcodeproj in Xcode on a Mac, select the Daymark scheme, choose an iPhone simulator, and build/run.

## Current native scope
- Native SwiftUI interface using system navigation and iOS 26 Liquid Glass for the action layer.
- Local on-device planner items and date selection.
- Universal iPhone/iPad layout foundations.

## Not production-ready yet
- Native Supabase sign-in and shared cloud sync are not implemented in this first native scaffold; native data currently remains on that device.
- Native local event notifications are implemented but not yet tested on a physical iPhone. Browser/PWA reminders are still not implemented.\n- Account/cloud sync, privacy/support URLs, final App Store icon/branding review, signing, and TestFlight are not completed.
- The web app's Supabase backend currently stores one JSON document per user, which is vulnerable to lost updates under concurrent edits. Fix the data model and conflict strategy before relying on cross-device sync.
- Build with current Xcode, test on real devices, and complete the checklists in docs/RELEASE_CHECKLIST.md and docs/APP_STORE_REQUIREMENTS.md.

Do not market the native target as having cloud sync or reminders until those features are implemented and verified.
