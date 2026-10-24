# Architecture

## Web app
- React + TypeScript + Vite.
- Responsive PWA hosted as a static site on GitHub Pages at `/Notes/`.
- Planner entries stored in browser local storage only.
- No Supabase package, login, database, analytics, or server-side sync.
- The website is independent of the native iOS app; data does not transfer between them.

## Native iOS
- SwiftUI app in `ios/Daymark.xcodeproj`.
- Local planner persistence on device.
- Local event notifications using UserNotifications.
- App display name: Dailume; bundle identifier currently configured as `com.davidpitchkhadze.dailume`.
- CloudKit/iCloud synchronization is not yet implemented. This is a blocker for cross-device continuity.

## Planner data model
An item has an ID, date, title, details, kind (event/task/note), start/end times, completion status, category, and creation timestamp.

## Important limits
- Browser local storage can be cleared and is specific to a browser/device.
- Native local storage is specific to the installation/device.
- Website and native data are not shared.
- Native reminders require notification permission and physical-device verification.
- GitHub Pages is static hosting; it does not provide a database, authentication, or scheduled push delivery.
- Apple Calendar access is not implemented. A native app would need a clear purpose and EventKit authorization before accessing it.
