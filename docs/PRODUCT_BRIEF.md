# Daymark — product brief and research notes

## 1. The problem we are solving

A real day contains three different kinds of information:
- **Time-bound commitments:** appointments, work sessions, classes, calls.
- **Flexible actions:** tasks that matter today but do not need an exact calendar slot.
- **Free-form context:** notes, instructions, ideas, links, and details attached to the day or an item.

A calendar handles the first well, but often makes the other two feel rigid. A notes app captures context but does not give it a daily plan or completion state. A conventional to-do list can separate tasks from the time they actually need. Daymark makes the day the home for all three without forcing every thought into a time slot.

## 2. Existing products and what they teach us

Research snapshot: 25 October 2026. Feature/pricing claims can change; verify vendor pages before making future commercial decisions.

| Product | Strength / pattern worth learning from | Gap relative to Daymark's initial goal |
|---|---|---|
| [Structured](https://structured.app/) | A visual daily timeline mixing tasks and events; low-friction day view | Advanced features may be paid; availability differs by platform |
| [Tiimo](https://www.tiimoapp.com/) | Visual planning, task breakdown and time awareness | More opinionated visual/attention-support approach than a quiet general-purpose workspace |
| [Sunsama](https://www.sunsama.com/) | Guided daily planning rituals and realistic workload reflection | More process-heavy and paid-oriented |
| [Akiflow](https://akiflow.com/) | Fast capture and time-blocking across work tools | More workflow integrations and complexity than a lightweight personal planner needs |
| [Google Calendar](https://calendar.google.com/) | Reliable event/time model and reminders | Notes and flexible work details are not the central experience |
| [Notion](https://www.notion.so/) | Flexible pages and databases | Flexibility can become setup overhead when the user simply wants to plan tomorrow |

A recent public discussion on Reddit described wanting a calendar entry to show a title, time, several lines of detail, tags, and a status without building a complex workspace: [r/ProductivityApps discussion](https://www.reddit.com/r/ProductivityApps/comments/1v1q1hk/looking_for_an_app_that_is_a_combination_of/). This is anecdotal evidence, not proof of broad demand, but it closely matches the use case here.

## 3. Product decision

**Date first; three equal item types.**
- **Time block:** start/end time, details, category.
- **Task:** completion state, details, category, no mandatory time.
- **Note:** free-form text and date association, no forced task structure.

The daily view is the default. Upcoming, All tasks, and Notes are alternate lenses over the same data, not separate silos. Search spans title, details and category. Users can navigate to any date and add an item there.

## 4. Page-by-page structure

1. **My Day:** selected date, gentle progress summary, timeline/plan list, quick actions for Time block / Task / Note.
2. **Date picker:** month navigation, jump to a date, visual dots for dates with saved items, one-tap return to today.
3. **Item editor:** type switcher, title, date, optional details, category, and start/end times only for time blocks.
4. **Upcoming:** chronological view across future dates.
5. **All Tasks:** all tasks, completion status, search and edit.
6. **Notes:** date-linked notes with full details, search and edit.
7. **Search:** one search across the content the user has saved.
8. **Workspace/account panel:** clearly states local-only versus cloud account status; email sign-in only when backend credentials are configured.
9. **Notifications entry:** explain permission and its limitations before asking for it. The current browser prototype does not promise closed-app scheduled delivery.
10. **Future native settings:** calendar permissions, notification schedule, account/data export/deletion, privacy and support.

## 5. Visual design system

- **Mood:** quiet, warm, editorial, precise; more like a calm desk than a productivity dashboard.
- **Canvas:** warm off-white (#F7F6F2); white/ivory cards (#FFFEFA).
- **Primary action:** deep forest green (#304735); sage surfaces (#E8EDE3).
- **Supporting colors:** muted grey-green for secondary text, restrained lavender for time blocks, pale sand for notes.
- **Typography:** native system stack on web; SF system fonts on Apple devices. Use hierarchy, spacing and weight rather than many font families.
- **Layout:** persistent sidebar on desktop, slide-out navigation on iPhone, broad touch targets, minimal borders and soft shadows.
- **Interaction:** fast keyboard shortcut for new item, obvious save/cancel, accessible focus states, reduced-motion support, no drag-and-drop dependency for the core workflow.

## 6. Technical approach and trade-offs

- Web first: React + TypeScript + Vite; static hosting on GitHub Pages is inexpensive and works across Mac and iPhone browsers.
- Local-first fallback: items remain usable without account setup. Browser local storage is device/profile-specific and can be cleared.
- Optional cloud account: Supabase email OTP + Postgres Row Level Security. GitHub is source control and static hosting, not a database.
- Current cloud prototype stores the full item array in one row per account. That is simple, but simultaneous edits from two devices can overwrite each other. Before production, use one row per item and conflict/version handling.
- iPhone home-screen install is a web app, not a native App Store binary. A website cannot silently read the entire Apple Calendar; use an explicit calendar integration or native EventKit permission.
- Browser notification permission is not equivalent to reliable background reminders. Closed-app delivery needs push infrastructure or native local notifications.

## 7. Assumptions and exclusions

Assumptions: one primary user; a mix of work and personal planning; low-cost first delivery; clarity and reliability matter more than a long feature list.

Out of scope for MVP: team collaboration, recurring rules, AI auto-scheduling, full calendar two-way sync, complex projects, and guaranteed closed-app reminders.

## 8. Success criteria

- Add/edit/delete time blocks, tasks, and notes on any date.
- Tasks can be completed without assigning a time.
- Data persists after refresh on the same browser.
- Search and date navigation do not lose entries.
- Desktop and iPhone layouts remain usable at 320px+.
- The app never labels local-only data as cloud-synced.
- Cloud login and two-device sync are only considered verified after real account and device tests.
- Native/App Store readiness is only claimed after an Xcode build, device tests, privacy metadata, icons, signing, TestFlight and App Store Connect validation.
