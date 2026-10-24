# Daymark — product brief

## User problem
A day contains timed commitments, flexible tasks, and notes that do not belong in a calendar slot. Separate calendar and notes tools make planning fragmented; conventional task managers can feel too heavy.

## Product decision
A date is the main context. Three item types coexist: **time block** (start/end), **task** (completion state), and **note** (free-form details). Daily view is the default; Upcoming, All tasks, and Notes provide alternate lenses. Search spans titles, details, and categories.

## Design direction
Quiet, warm, editorial, Apple-adjacent rather than imitation: warm off-white canvas, forest-green actions, muted sage panels, system typography, generous spacing, small restrained icons. Responsive navigation becomes a slide-out sidebar on phones. Native-feeling controls and keyboard access matter more than decorative glass effects.

## Assumptions
- First use case is personal/work planning for one person.
- A web app/PWA is the fastest useful first delivery across Mac and iPhone.
- Local mode must work without credentials; cross-device sync needs a real backend and account.
- A website does not automatically gain access to Apple Calendar or all device data.

## Out of scope for MVP
Recurring schedules, team collaboration, AI auto-scheduling, direct Apple Calendar access, and reliable background push reminders.

## Success criteria
Create/edit/delete items of each type, move between dates, search, complete tasks, persist after refresh, usable mobile layout, and clearly communicate whether data is local-only or cloud-synced.