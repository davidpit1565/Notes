# Dailume competitor audit — product decisions

Research snapshot: 25 October 2026. This is a decision-oriented comparison of representative competitors, not a claim to have exhaustively tested every app or every current App Store review. Feature availability and pricing can vary by OS, region, and plan.

## Competitor landscape

| Product | Where it is strong | Trade-offs / opportunity for Dailume | Product decision |
|---|---|---|---|
| Apple Reminders | Free, Siri, system-level reminders, shared lists, tags and Smart Lists; familiar to iPhone users | Best for users already inside Apple; can feel like a list manager rather than a calm daily overview | Use native EventKit integration on iOS, with clear consent and no duplicate task database unless the user chooses it |
| Things 3 | Highly polished, focused Apple-only personal workflow, thoughtful navigation and quick entry | Apple-only, no real-time collaboration, no web app, some reminder/workflow limits | Learn from restraint and information hierarchy; do not copy its proprietary visual design |
| Todoist | Cross-platform, flexible projects/filters, integrations and mature task workflows | Some useful reminders and advanced features are paid; flexibility can add complexity | Keep Dailume quick to use; don't add projects/filters unless user research proves they are needed |
| TickTick | Broad feature set, calendar, focus/Pomodoro, habits, recurring reminders, free-tier breadth | More options and a steeper learning curve than simpler apps; calendar view can become dense | Avoid feature bloat; add integrations only when they make the day easier to understand |
| Structured | Visual daily timeline and time-blocking | Timeline-centric model is not ideal for all tasks or deep project organization | Preserve simple Today / Upcoming / Notes navigation; consider timeline only if testing identifies a clear need |
| Google Tasks | Minimal, easy for Google ecosystem users, calendar adjacency | Less suited to complex task organization | Consider Google Calendar/Tasks only after the Apple workflow is stable and account/security architecture is chosen |

## Evidence and source quality

- Wirecutter, “The 3 Best To-Do List Apps of 2025,” updated 10 December 2025: recommends Todoist for most users, TickTick for value/free breadth, and Things 3 for Apple users. It specifically evaluates intuitive navigation, reliable reminders, fair pricing, privacy, syncing and support.
  - https://www.nytimes.com/wirecutter/reviews/best-to-do-list-app/
- iTechGuides, “Best To-Do List Apps for iPhone and iPad,” 12 August 2026: compares Reminders, Todoist, Things, TickTick, Structured and OmniFocus, including their main workflow trade-offs.
  - https://www.itechguides.com/best-to-do-list-apps-for-iphone-and-ipad-choose-the-right-workflow/
- Apple Human Interface Guidelines:
  - https://developer.apple.com/design/human-interface-guidelines
- Apple typography guidance emphasizes legibility, semantic hierarchy, system fonts and Dynamic Type:
  - https://developer.apple.com/design/human-interface-guidelines/typography

This snapshot does not substitute for a current, region-specific App Store review export or hands-on testing of each competitor on the same devices. Review themes should be collected with dates and platform/version context before treating them as representative.

## Design skills worth using during implementation

- Apple HIG-based reviewer: https://github.com/dickwu/apple-design-skill
- iOS interface design skill for SwiftUI/UIKit: https://github.com/tn/ios-interface-design
- SwiftUI anti-sloppiness and five-dimension review skill: https://github.com/wholiver/swiftui-design-skill
- Apple HIG agent skill with refreshable reference set: https://github.com/ykswang/apple-hig-skill

These are third-party community tools, not Apple-endorsed products. Their advice must be checked against Apple's current official guidance and actual behavior on supported OS versions.

## Design direction selected for Dailume

1. Content first: show the user's tasks and notes, not decorative progress cards.
2. One accent color; no gradient-filled dashboard cards, ornamental badges, or shadows without a functional reason.
3. Prefer simple separators and clear type hierarchy over a stack of floating rounded cards.
4. Keep a visible, understandable primary action; avoid duplicate calls to action competing with navigation.
5. Dark mode must be deliberately designed, not just invert the light palette.
6. Respect 44pt/touch-sized targets, keyboard focus, reduced motion, contrast and Dynamic Type.
7. Local-only storage must be described honestly. No account or cross-device sync is claimed until a real backend, authentication, recovery, privacy and security model exists.
8. Calendar/Reminders integration should be permission-led, reversible, and tested for duplicate events, edits, deletions, denied permissions, time zones and daylight-saving transitions.

## Community review signals (anecdotal, not representative)

Recent user discussions reinforce the core trade-off between restraint and breadth:

- A June 2025 r/ProductivityApps post praises Todoist's clean quick capture but says TickTick can feel cluttered as tags and controls accumulate: https://www.reddit.com/r/ProductivityApps/comments/1l7yhum/tried_5_popular_productivity_apps_heres_my_honest_take/
- A Things 3 discussion from April 2025 praises its simple, polished UI and Apple/iPad workflow, while noting that users wanting time-blocking/calendar workflows may need TickTick or Fantastical: https://www.reddit.com/r/thingsapp/comments/1jw7aqz/should_i_move_from_things3_to_ticktick_or_todoist/
- A November 2025 Todoist migration discussion includes complaints about reliability/sync and frustration with AI features that users felt did not solve core planning needs: https://www.reddit.com/r/todoist/comments/1onrx0o/migrating_off_of_todoist/
- A January 2026 discussion shows some users moving to Apple Reminders for value, while others find its quick-entry/keyboard workflow clumsy: https://www.reddit.com/r/todoist/comments/1qgqqc8/how_many_of_you_quit_todoist_after_the_price_hike/

Interpretation: these are self-selected posts, not a statistical sample or verified bug counts. The recurring product lesson is to prioritize fast capture, trustworthy persistence/sync, and a quiet interface before adding AI, analytics, or complexity. Dailume currently has local-only persistence, so reliability and data portability matter more than marketing claims about sync.


## Additional Reddit review signals checked on 25 October 2026

These are individual public discussions and should be treated as qualitative signals, not a representative review sample:

- TickTick calendar integration: a September 2026 thread reports confusion between calendar subscription and two-way integration; commenters describe date shifts and recurring-event issues, while another user says it works well for them. This is conflicting anecdotal evidence, not proof of a universal defect: https://www.reddit.com/r/ticktick/comments/1wdle21/google_calendar_ticktick_sync_confusion/
- Apple Reminders reliability: an October 2026 thread describes cross-device completion state drifting and slow/blank startup; the author attributed the cause to old devices still linked to their Apple Account. This illustrates how sync problems can undermine trust even when the app is built into the OS: https://www.reddit.com/r/AppleReminders/comments/1xa4tlf/apple_reminders_i_solved_severe_sync_start/
- Apple Reminders workflow gaps: a September 2026 thread says overdue/tomorrow filtering and rescheduling unfinished tasks required extra steps, and that unfinished items do not automatically roll forward as the user expected: https://www.reddit.com/r/AppleReminders/comments/1wfadng/trying_to_reembrace_reminders/
- Things 3 calendar gap: a March 2025 discussion asks for a proper calendar/time visualization and describes workarounds for keeping tasks and calendar events together. Other commenters prefer keeping appointments and tasks separate, demonstrating that a combined view is not universally preferable: https://www.reddit.com/r/thingsapp/comments/1ji7f6o/how_are_you_using_a_calendar_with_things3/
- Todoist pricing/AI sentiment: a November 2025 thread contains users objecting to price increases and AI features they did not value, while other commenters defend the price. This is a product-positioning signal, not a consensus measure: https://www.reddit.com/r/todoist/comments/1otkeah/those_of_you_most_vocal_to_the_negative_about_the_price_hike/
- Productivity app trust and reliability: a December 2025 thread compares Things, Todoist and TickTick and mentions concerns about update regressions, reminder visibility and limitations: https://www.reddit.com/r/ProductivityApps/comments/1pp4xg4/task_reminder_apps_opinion/

## Dailume audit — confirmed gaps vs intentional omissions

### Fixed in the latest code pass (verification still required for newest commit)

- [x] Imported backup file had no size limit; a large JSON file could consume excessive memory before parsing. Added a 5 MB guard.
- [x] Imported planner items accepted unbounded title/details/category and ID strings. Added length and non-empty validation before restore.
- [x] Moving a native event to another date could leave its stored start Date on the old day; sorting by the full timestamp could then order items incorrectly. Native day sorting now compares hour/minute and uses title as a stable tie-breaker.
- [x] Unreadable native UserDefaults data previously failed decoding silently and could be overwritten by the next save. The original bytes are now copied to a recovery key before returning an empty state.
- [x] Native date heading used a fixed point size; changed it to a semantic Dynamic Type font.
- [x] Event notification refresh previously attempted to schedule every event without prioritizing the next upcoming events. The scheduler now removes its own stale pending requests, orders future events by trigger date, and schedules a bounded next-60 set.
- [x] Duplicate primary add actions and several decorative native UI surfaces were removed in the prior pass.

### Still open — product or release blockers

- [ ] **No cross-device sync/account.** Website items are stored in browser localStorage; native iOS items are stored separately in UserDefaults. They do not sync to each other or across devices. This is an explicit limitation, not a working feature.
- [x] **One-way Apple Calendar / Reminders export added to native iOS.** Users can explicitly add a copy of an event to Calendar or a task to Reminders. It uses iOS 17 EventKit permission APIs and purpose strings.
- [ ] **No two-way Calendar / Reminders sync.** Exported copies are not linked back to Dailume; edits/deletions do not propagate, and repeated exports can create duplicates. This is intentionally disclosed in the UI. Full sync requires identifiers, conflict/deletion handling, and broader permission decisions.
- [ ] **Native data export/import is missing.** Web backup does not back up the native UserDefaults store.
- [ ] **Native persistence has no visible save-failure state.** UserDefaults writes are usually straightforward, but current save code cannot tell the user if encoding fails.
- [ ] **Notification delivery is not yet covered by device-level tests.** CI compilation does not prove real permission prompts, Focus modes, scheduled delivery, reboot behavior, or time-zone/DST transitions.
- [ ] **No recurring tasks, priority, tags/projects, or advanced filters.** These are not automatically bugs; add only after validating that the target audience needs them.
- [x] **Keyboard accessibility improved.** The web composer now traps focus, closes on Escape, and restores focus to the invoking control; regression test added.
- [ ] **No measured usability study or same-device competitor benchmark yet.** The current competitor comparison is research-based, not a claim of hands-on parity testing.
- [ ] **No App Store review / accessibility sign-off yet.** CI does not replace VoiceOver, large text, contrast, localization, offline, and real-device testing.

## Prioritization rule

Fix data loss, date/time correctness, reminder trust, accessibility, and broken deployment before feature breadth. Choose integrations based on a clearly defined source of truth and explicit user consent. Do not build login until account recovery, encryption in transit, backend authorization, deletion/export, privacy disclosures, and a real sync conflict strategy are designed.


## Verification after latest implementation pass

- Prior published build (commit `d317a591`): live smoke suite passed 3/3, including app load, privacy/support pages, and create-and-reload persistence.
- Native iOS simulator build, web typecheck/production build, and 18 Playwright E2E tests passed for commit `567284bd` before the latest focus-trap and CSS refinement.
- Latest changes add the keyboard-focus regression test, strict backup-size/field validation, EventKit one-way export, notification rescheduling, native date sorting/recovery, and dark-mode focus contrast. Their newest CI run must pass before these are considered verified.
- No actual device permission-prompt or notification-delivery test has been performed here. Simulator compilation alone does not prove those behaviors.


## App Store review sample (public storefront pages checked 25 October 2026)

Ratings below are storefront snapshots visible on the linked Apple App Store pages. Country, platform and review count differ, so these numbers are **not a controlled head-to-head score**.

| App | Storefront snapshot | Positive themes visible | Friction themes visible |
|---|---|---|---|
| Structured | Belgium iPhone: 4.7/5 from ~4K ratings; US: 4.8/5 from ~166K ratings | Clear daily planning, easy-to-use schedule, design appreciated | Some reviews report sync problems, lost/reappearing subtasks, lag and task movement bugs after OS updates; some report localization/grammar errors |
| TickTick | Belgium iPhone: 4.7/5 from ~723 ratings; US: 4.9/5 from ~46K ratings | Feature breadth, tasks in calendar, Pomodoro/habit tools, generous free tier | Some reviews want direct event creation; Reddit threads report inconsistent calendar integrations and search/sync problems |
| Things 3 | US iPhone: 4.8/5 from ~28K ratings; UK: 4.8/5 from ~4.3K ratings | Calm, uncluttered design; intuitive daily use; one-time purchase is appreciated | Some reviews find recurring-task setup confusing or want more explicit time/deadline handling and easier image capture |

Sources:
- Structured Belgium iPhone reviews: https://apps.apple.com/be/app/structured-daily-planner-todo/id1499198946?platform=iphone&see-all=reviews
- Structured US reviews: https://apps.apple.com/us/app/structured-daily-planner-todo/id1499198946?platform=iphone&see-all=reviews
- TickTick Belgium iPhone reviews: https://apps.apple.com/be/app/ticktick-to-do-list-calendar/id626144601?platform=iphone&see-all=reviews
- TickTick US reviews: https://apps.apple.com/us/app/ticktick-to-do-list-calendar/id626144601?platform=iphone&see-all=reviews
- Things 3 US reviews: https://apps.apple.com/us/app/things-3/id904237743?platform=iphone&see-all=reviews
- Things 3 UK reviews: https://apps.apple.com/gb/app/things-3/id904237743?platform=iphone&see-all=reviews

Method limitation: App Store pages surface selected reviews and counts can change; this is a qualitative sample, not an export of all reviews, sentiment analysis, or verified bug prevalence. Do not infer that a reported issue affects most users. The practical lesson for Dailume is to keep the calm visual language of Things, make day planning easier to understand than a plain list, and treat persistence, sync and date/time correctness as release-critical trust features.
