# Product brief — Daymark

## The job to be done
Plan a day in one place when some items need a specific time, some are flexible tasks, and some are notes that would be awkward in a calendar. The app should feel lighter than project-management software and more structured than a notes app.

## Research synthesis and product choices
- Calendar apps excel at timed commitments but are awkward for free-form thinking and task details.
- Notes apps excel at free-form capture but do not naturally provide a day timeline and completion state.
- Task managers are good at checklists but often force a project/task hierarchy onto small personal plans.
- Daymark therefore treats a date as the primary context and supports three first-class item types: time block, task, and note.
- The default view is one day, with upcoming, all tasks, and notes as adjacent views.
- Timed items are ordered by time; untimed tasks and notes remain easy to access rather than being forced into calendar slots.

## Assumptions
1. Initial user is a single person planning personal and work days.
2. Mobile browser/PWA is the first cross-device delivery; native iOS is a later wrapper or separate SwiftUI implementation.
3. Local-first use should work before cloud credentials are configured.
4. Cloud sync requires an explicit account and backend; GitHub alone is not a sync database.

## Out of scope for first release
- Reading or editing the user's full Apple Calendar database.
- Automatic AI scheduling, shared team workspaces, recurring rules, and complex project dependencies.
- Reliable background push reminders without a service worker push backend and permission setup.
- Claiming native App Store readiness before an Xcode project, privacy declarations, icons, signing, device tests, and App Store Connect metadata are verified.

## Success criteria
- A user can add/edit/delete timed blocks, tasks, and notes for any date.
- Task completion persists after refresh in the same browser.
- Mobile layout is usable at 320px width and on desktop.
- Search and date navigation work without losing entries.
- Optional email auth and per-user cloud sync work after documented backend setup.
- The app clearly communicates local-only versus cloud-synced status.
