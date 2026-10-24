# Dailume native iOS app

This folder contains a native SwiftUI iOS app, not a website wrapper. Open `Daymark.xcodeproj` in Xcode on a Mac, select the `Daymark` scheme, choose an iPhone simulator, and build/run. The installed app display name is **Dailume**.

## Current native scope
- SwiftUI interface using system navigation and native iOS materials.
- Local on-device planner items, date selection, tasks, time blocks, notes, search, and completion.
- Native local notifications for upcoming event starts (requires permission).
- iPhone and iPad layout foundations.

## Important limitations
- The native app currently stores planner data locally on this device. It does not yet sync to the website or other Apple devices; iCloud/CloudKit sync is a release blocker if cross-device sync is required.
- The website is a separate local-only PWA. Website data and native app data do not sync.
- Local notifications are implemented but not verified on a physical iPhone; browser/PWA reminders are not implemented.
- Final name availability, App Store icon rendering, privacy/support links, signing, App Store Connect setup, archive upload and TestFlight review remain unverified.
- Do not describe the app as cloud-synced or TestFlight-ready until these blockers are resolved.
