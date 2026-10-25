# Daymark / Dailume — competitor research and quality scorecard

Research date: 25 October 2026  
Scope: web planner + native iOS app; tasks, timed events, notes, local persistence, backup, Calendar/Reminders export, accessibility, reliability, pricing, SEO and product positioning.

## Evidence standard

- **Verified product facts** are linked to official product/pricing pages or App Store listings.
- **Review evidence** is a snapshot of ratings and selected public reviews, not a representative statistical study. Store ratings, features, and prices change by country, device, billing route, and date.
- **Reddit evidence** is anecdotal. Repeated complaints are hypotheses to investigate, not proof of a systemic defect.
- **Our implementation status** refers only to repository/CI evidence. A passing CI build is not equivalent to real-device usability testing.
- No competitor has been installed and exhaustively tested on every platform as part of this research. A true hands-on teardown needs device access and repeatable test scripts.

## Executive findings

1. The strongest differentiator available to Daymark is not feature count. It is a calm, fast, low-friction daily view that combines tasks, timed events and notes without making basic planning feel like project management.
2. The largest trust gap is data portability and continuity: the web app stores data in browser localStorage, while native iOS stores separately in UserDefaults. There is no shared account or cross-device sync. Web backup does not currently back up native iOS data.
3. Calendar and Reminders integrations currently create **copies** through EventKit. They are not linked records and do not provide two-way synchronization. Repeated exports may create duplicates.
4. Native notification delivery, permissions, VoiceOver, Dynamic Type on real devices, time-zone/DST behavior, and reboot behavior still require device-level verification.
5. SEO should be treated as a separate acquisition layer, not a reason to index private task content. The current site is a single JavaScript app with basic title/description; it is not yet a content-rich marketing site. Google recommends descriptive unique titles, crawlable links, and appropriate handling of JavaScript content. A sitemap helps discovery but does not guarantee indexing or ranking.
6. Current browser CI caught a real keyboard-focus regression. The fix passed the browser suite on `22f1bcdc` and later commits; the latest completed local E2E run before this documentation update passed 20/20 tests.

## Competitor 1 — Apple Reminders

### Product and pricing
- Native Apple app, no separate subscription fee for the core Reminders experience.
- System-level integration, Siri, shared lists, tags/Smart Lists, due dates and notifications are core strengths.
- Official help/product information: https://support.apple.com/guide/reminders/welcome/ios
- Review context: TechRadar's June 2025 review praised ease of use, syncing and location reminders, with caveats in its detailed review: https://www.techradar.com/pro/apple-reminders-review

### Why people choose it
- Free, preinstalled and deeply integrated with iPhone, Siri and Apple services.
- Little setup and familiar system conventions.
- Shared lists and native notification behavior make it a strong baseline for everyday tasks.

### Trade-offs / opportunities
- Its primary mental model is lists and reminders; a calm visual day plan combining tasks, timed events and freeform notes can be a different value proposition.
- Cross-device sync depends on the user's Apple account, settings and network. Reddit reports of delayed sync or completion-state drift exist, but are anecdotal and not proof of broad failure: https://www.reddit.com/r/AppleReminders/
- Daymark must not claim to be more reliable than Reminders without measured comparative tests.

### Product lesson
- Use familiar interaction patterns and reliable notifications, but keep a clearer single-day overview.
- Do not require users to pay for core planning or put basic export behind a paywall.
- Native integrations must explain permission requests and what data is written.

## Competitor 2 — Things 3

### Product and pricing
- Premium Apple-platform product sold as a one-time purchase separately for each platform; Things Cloud sync is included at no extra charge.
- Official purchase/sync explanation: https://culturedcode.com/things/support/articles/2803552/
- Belgian App Store listing for iPad: €22.99 at the time checked, 4.8/5 from 214 ratings; prices differ by device: https://apps.apple.com/be/app/things-3-for-ipad/id904244226
- US iPhone App Store snapshot: https://apps.apple.com/us/app/things-3/id904237743

### Why people choose it
- Calm, polished interface; clear hierarchy; projects and areas; recurring tasks; thoughtful interactions.
- One-time purchase appeals to users who dislike recurring subscriptions.
- Reviewers praise the balance between design and functionality; product reviews are still subjective.

### Trade-offs / opportunities
- Separate purchases per platform increase initial cost if a user owns multiple Apple devices.
- Primarily Apple ecosystem; no general cross-platform web experience comparable to web-first tools.
- Some user discussions mention calendar visualization or time-planning limitations; treat these as use-case-specific anecdotes rather than universal defects: https://www.reddit.com/r/thingsapp/
- A beautiful interface is not enough if data recovery and portability are weak.

### Product lesson
- Prefer restrained visual hierarchy, careful spacing, predictable keyboard behavior, and purposeful motion.
- Keep paid positioning transparent. If Daymark remains free, it needs a sustainable plan before adding expensive infrastructure.

## Competitor 3 — Structured

### Product and pricing
- Visual timeline/day planner with tasks, calendar, routines and habits.
- Belgium App Store snapshot: 4.7/5 from about 4,000 ratings; free with in-app purchases; Pro includes calendar/Reminders connection, recurring tasks/routines, AI day planning and automatic replanning. Listed prices include €2.99 monthly, €19.99 yearly and €69.99 lifetime, with multiple price entries shown by the App Store: https://apps.apple.com/be/app/structured-daily-planner-todo/id1499198946
- App Store description claims 1.5 million active users and 400,000+ five-star ratings; those are developer claims, not independently audited metrics.

### Why people choose it
- Visual time-blocking timeline; helps users see how a day fits together.
- Strong iOS ecosystem support, widgets, Live Activities, Pomodoro and accessibility features.
- Specific audience positioning around ADHD-friendly planning and reducing overwhelm.

### Trade-offs / opportunities
- Advanced integrations, recurring routines, AI planning and automatic replanning are paywalled.
- A timeline can become visually dense as tasks grow; the app's own review snapshot should be revisited over time.
- Selected review evidence praises the concept but cannot prove usability across all workflows.

### Product lesson
- A strong daily timeline is a clear competitive benchmark.
- Daymark should prioritize readable density and fast rescheduling before adding AI features.
- Accessibility should be visible in the product design, not only in marketing copy.

## Competitor 4 — TickTick

### Product and pricing
- Free tier with list/task limits; Premium expands lists/tasks, calendar views, reminders, habits, countdowns, filters, themes and statistics.
- Official pricing snapshot: US$49.99/year on the web upgrade page: https://ticktick.com/upgrade?language=en_US
- Belgium App Store snapshot: 4.7/5 from about 722–723 ratings; €49.99/year and monthly price entries from €4.99–€5.99: https://apps.apple.com/be/app/ticktick-to-do-list-calendar/id626144601
- US App Store snapshot: 4.9/5 from about 46,000 ratings: https://apps.apple.com/us/app/ticktick-to-do-list-calendar/id626144601

### Why people choose it
- Broad toolkit: calendar, Pomodoro, habits, countdowns, recurring tasks, tags, priorities, collaboration and widgets.
- The free tier is useful enough to evaluate the product.
- Belgian App Store reviews praise feature breadth and value; some ask for direct event creation.

### Trade-offs / opportunities
- Breadth can increase visual complexity and learning cost.
- Reddit reports conflict about calendar integration: some users report date shifts/recurring-event problems, while others report successful use. This is anecdotal and could depend on integration mode or external calendar APIs: https://www.reddit.com/r/ticktick/comments/1wdle21/google_calendar_ticktick_sync_confusion/
- A Reddit discussion comparing Todoist, TickTick and Things mentions perceived small typography and slower performance for TickTick; one discussion is not representative: https://www.reddit.com/r/ProductivityApps/comments/1tht8ne/advice_for_todo_apps/

### Product lesson
- Don't copy every feature. Make the core flow more coherent than a broad toolkit.
- Calendar sync requires a documented conflict/duplicate policy and explicit tests for recurring events, time zones and deletion.

## Competitor 5 — Todoist

### Product and pricing
- Free Beginner tier; official page lists 5 personal projects and 3 filter views. Pro lists US$60/year ($5/month billed yearly) and adds calendar layout, task duration, custom reminders, more projects/filters and more reporting history. Business lists US$96/year per user ($8/month billed yearly): https://www.todoist.com/pricing/
- Belgium App Store snapshot: 4.7/5 from about 3,100 ratings; Pro in-app purchases listed at €59.99/year or €6.99/month: https://apps.apple.com/be/app/todoist-to-do-list-calendar/id572688855
- US App Store snapshot: 4.8/5 from about 130,000 ratings: https://apps.apple.com/us/app/todoist-to-do-list-calendar/id572688855

### Why people choose it
- Natural-language quick entry, priorities, labels, projects, filters, collaboration and broad integrations.
- Clear path from personal use to teams.
- Large user base and broad ecosystem.

### Trade-offs / opportunities
- Free tier limits project count and filters; calendar layout and some advanced features are paid.
- Pricing change in late 2025 generated visible user frustration about increases and legacy-plan communication. This is a community discussion, not a full churn analysis: https://www.reddit.com/r/todoist/comments/1otieep/todoist_pricing_update_addressing_your_questions/
- Additional AI features are not automatically valuable to every user; Daymark should not add them just to match marketing.

### Product lesson
- Capture speed and predictable organization matter more than feature count.
- Explain paid boundaries simply and avoid locking basic data portability behind an upgrade.

## Competitor 6 — Microsoft To Do

### Product and pricing
- Core Microsoft To Do is free and integrates with Microsoft accounts and Outlook/Exchange.
- Official overview: https://support.microsoft.com/en-us/todo/welcome-to-microsoft-to-do
- Official My Day and Outlook workflow: https://support.microsoft.com/en-us/todo/plan-and-connect-with-microsoft-to-do
- Belgium App Store snapshot: Free, 4.6/5 from about 9,900 ratings: https://apps.apple.com/be/app/microsoft-to-do/id1212616790

### Why people choose it
- Free, familiar lists, reminders, steps, notes and a daily My Day workflow.
- Useful for users already living in Outlook/Microsoft 365.
- Tasks remain connected to the Microsoft account rather than only one browser's local storage.

### Trade-offs / opportunities
- Best value is strongest inside the Microsoft ecosystem.
- Its list-centric design is less specifically positioned around a single calm visual timeline.
- Sync and account dependency are inherent to the cloud model; no claims about comparative reliability without tests.

### Product lesson
- A free competitor with account sync sets a high expectation for continuity. Daymark must either add sync or state clearly that data remains local and can be lost with browser/device storage.

## Competitor 7 — Any.do

### Product and pricing
- Personal free tier includes tasks/lists, reminders, calendar, daily planner and cross-device sync.
- Official pricing page currently lists Premium at US$4.99/month billed annually or US$7.99 month-to-month; Family at US$8.33/month for four members billed annually; Teams at US$4.99/user/month billed annually: https://www.any.do/pricing
- Prices and feature entitlements may vary by region/platform.

### Why people choose it
- Combines task lists, calendar and daily planner, plus family/team options.
- Recurring tasks, location reminders, color tags and AI features are Premium.

### Trade-offs / opportunities
- More advanced features and collaboration require paid tiers.
- Multi-tier pricing can complicate the decision for a user who only needs a simple personal planner.

### Product lesson
- Make the core value and free tier obvious. Do not force users to understand a complicated pricing matrix to plan a day.

## Competitor 8 — Google Tasks

### Product and pricing
- Core Google Tasks is available through Google's task apps and integrates with Gmail and Google Calendar; tasks sync across devices when signed in.
- Official overview: https://support.google.com/tasks/answer/7675772?hl=en

### Why people choose it
- Simple, low-friction, tightly connected to Gmail and Calendar.
- No separate paid task-app tier required for core use in a personal Google account.

### Trade-offs / opportunities
- Best fit for Google-centric workflows; a standalone rich day-planning interface is not its main differentiator.
- Account and cloud sync are required for cross-device continuity.

### Product lesson
- Capture and calendar context are expected baseline capabilities, not premium magic.

## Competitive positioning matrix

| Capability | Apple Reminders | Things 3 | Structured | TickTick | Todoist | Microsoft To Do | Any.do | Google Tasks | Daymark current |
|---|---|---|---|---|---|---|---|---|---|
| Tasks | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Timed events/day timeline | System calendar context | Calendar integration | Core strength | Calendar views | Pro calendar view | Outlook context | Calendar/day planner | Google Calendar context | Basic event items |
| Notes | Notes/details | Notes in items/projects | Notes/subtasks | Memos/details | Descriptions | Notes | Details | Details | Yes |
| Cross-device sync | Apple ecosystem | Things Cloud | Sync across Apple devices | Cloud sync | Cloud sync | Microsoft account | Cloud sync | Google account | **No** |
| Web app | Limited to Apple web services, not a full Reminders web client | No general web app | Web offering may vary; verify current plan/platform | Yes | Yes | Yes | Yes | Yes | GitHub Pages web app |
| Backup/restore controlled by user | iCloud/system mechanisms | Cloud service | Cloud/account mechanisms | Cloud/account | Cloud/account | Cloud/account | Cloud/account | Cloud/account | Web backup only; native backup missing |
| Calendar/Reminders two-way sync | Native | Calendar shown in Things; behavior depends on setup | Pro integrations | Calendar integration modes | Integrations; capabilities vary | Outlook integration | Calendar integration | Native Google Calendar | **No; one-way export copies** |
| Recurrence | Yes | Strong | Pro | Yes | Yes | Basic recurring support | Premium | Yes | Not implemented |
| Price model | Free | One-time per Apple platform | Free + Pro subscription/lifetime | Free + Premium subscription | Free + Pro/Business | Free | Free + paid tiers | Free core | Free currently; no sustainability plan |
| Main lesson | Native simplicity | Calm polish | Timeline and routines | Feature breadth | Capture and organization | Free ecosystem integration | Combined daily planner | Calendar context | Win through calm simplicity, privacy clarity, reliability |

## Public reviews and user sentiment — how to interpret them

- App Store star averages are not comparable across regions or storefronts: review counts differ greatly by country, device, and date.
- Positive reviews tend to highlight perceived usefulness, convenience, visual clarity, cross-device availability, and feature breadth.
- Public complaints that recur in task-app discussions include sync inconsistency, recurring-task edge cases, date shifts, excessive complexity, small typography, price increases, and features users feel are unnecessary.
- These themes are a prioritization signal, not measured prevalence. The research does not support claims such as “most users hate X.”
- Relevant discussion samples:
  - Todoist pricing communication: https://www.reddit.com/r/todoist/comments/1otieep/todoist_pricing_update_addressing_your_questions/
  - TickTick calendar integration conflict reports: https://www.reddit.com/r/ticktick/comments/1wdle21/google_calendar_ticktick_sync_confusion/
  - General comparison of TickTick, Todoist and Things: https://www.reddit.com/r/ProductivityApps/comments/1tht8ne/advice_for_todo_apps/
  - Apple Reminders discussion hub (anecdotal): https://www.reddit.com/r/AppleReminders/
  - Things discussion hub (anecdotal): https://www.reddit.com/r/thingsapp/

## Design review requirements

### Visual quality
- No generic dashboard template feel; keep a distinct, coherent visual identity.
- One clear primary action per view; avoid competing buttons and excessive cards.
- Consistent type scale, line height, spacing, icon weight, corner radii, and elevation.
- Content density must remain readable at 320 px width and at large text sizes.
- Light and dark themes need independent contrast checks, not only color inversion.
- Motion should communicate state; respect reduced-motion preferences.
- No decorative icon should be announced by VoiceOver if it conveys no information.
- Use native-feeling controls and touch targets. Apple's accessibility guidance recommends 44 × 44 pt controls for touch interaction: https://developer.apple.com/design/human-interface-guidelines/

### Interaction and page-by-page inventory
The current web app is a single-page planner, not a multi-page product with separate Profile, Settings, Projects, or Account pages. Do not claim those screens exist. Audit each current view/state:
1. Today tab: empty state, tasks, events, completed tasks, mixed ordering, date selection.
2. Upcoming tab: future dates, empty state, date boundaries, moving items between dates.
3. Notes tab: empty state, long notes, search, editing and deletion.
4. Create/edit composer: task/event/note variants, validation, keyboard-only navigation, Escape, cancel, backdrop click, focus return.
5. Search: empty query, no results, Unicode/case behavior, long text.
6. Theme: light, dark, reload persistence, system settings behavior.
7. Backup: export, valid import, cancellation, malformed JSON, duplicate IDs, invalid dates, oversized file, storage full.
8. Recovery: corrupted saved data, recovery-copy availability, recovery copy not silently overwritten.
9. Responsive behavior: 320 px, common iPhone sizes, tablet and desktop widths, landscape, safe-area insets.
10. Error/loading states: slow startup, JS failure, storage blocked/full, offline load.
11. Native iOS: notifications, permissions, EventKit exports, denied permission, Dynamic Type, VoiceOver, app background/foreground, reboot, DST/time-zone changes.
12. Privacy: local-storage explanation, backup implications, export copy semantics, no implied cloud sync.

## Engineering and trust gaps in current Daymark

### Confirmed from repository design
- Web data uses browser localStorage; native iOS uses UserDefaults. These are separate data stores.
- There is no login or backend sync service.
- Native Calendar and Reminders actions create copies; future edits are not synchronized.
- Web backup/import exists; native iOS backup/import is not yet implemented.
- Automated Playwright coverage exists for key web flows; it cannot prove real iPhone notification delivery or VoiceOver behavior.
- The focus-restoration fix is commit `22f1bcdc`; it passed the 20-test browser suite on `12ac526d` and the subsequent 20-test suite on `37b2052a`.
- A live smoke run on `6e0de132` exposed a deployment inconsistency: the browser received raw `src/main.tsx` with an incorrect JavaScript MIME type and showed the startup fallback. A later live smoke run on `37b2052a` passed 4/4 checks after the custom build/deploy workflow completed.
- Both the custom `.github/workflows/deploy.yml` workflow and a GitHub-generated `pages build and deployment` workflow are running for the same pushes. This creates a potential race where the root-source deployment can overwrite the built Vite output. Confirm the Pages source is set to **GitHub Actions** and that the dynamic branch-source deployment is no longer triggered; this cannot be resolved by editing the app code alone.

### Do not do without a decision
- Do not add authentication before choosing backend, authorization rules, deletion/export, privacy disclosures, conflict resolution, offline behavior and ongoing cost.
- Do not advertise two-way Calendar sync unless updates, deletions, recurring events, duplicate handling and time zones are all implemented and tested.
- Do not advertise native backup until an actual export/import flow is present and tested.
- Do not add AI, habit tracking, tags, projects or recurrence merely because competitors have them. Prioritize based on observed user needs.

## SEO audit — current scope

### Current known state
- `index.html` has `lang="en"`, viewport metadata, a descriptive meta description, a title, canonical URL, Open Graph basics, manifest and SVG icon (SEO metadata changes in commits after the first audit pass).
- A sitemap was added at `public/sitemap.xml` for the planner, privacy policy and support page; a live check is still required before treating it as verified on the deployed site.
- No `robots.txt` is added: a file under a GitHub Pages project path would be served at `/Notes/robots.txt`, not the host-level `/robots.txt` crawlers normally consult. Avoid pretending that a project-level file controls the whole host.
- The product is a client-rendered React app and needs JavaScript to use the planner.
- There are no separate indexable URLs for Today, Upcoming, Notes, Settings, or Profile because those are app states, not separate pages.
- A planner's user data should not be made crawlable. Do not expose user-created tasks/notes in SEO content or structured data.
- Google guidance: descriptive unique titles and meaningful headings: https://developers.google.com/search/docs/appearance/title-link
- JavaScript SEO, crawlable links, and URL architecture: https://developers.google.com/search/docs/fundamentals/get-started-developers
- Sitemaps help discovery but don't guarantee indexing: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Core Web Vitals and overall page experience matter, but perfect scores do not guarantee ranking: https://developers.google.com/search/docs/appearance/page-experience

### Recommended SEO decision
If this is primarily a private personal tool, prioritize reliability, accessibility, privacy, and sharing/installation over search ranking. If organic acquisition is a goal, build a separate, crawlable marketing landing page with clear value proposition, feature list, screenshots, privacy and support pages, and appropriate metadata. Do not create empty thin pages just to inflate SEO. Revisit whether the GitHub Pages project path is the right long-term public domain.

## Quality scorecard — baseline, not a vanity score

Scores are deliberately not filled in without executing the relevant test. Mark each item PASS, FAIL, BLOCKED, or NOT TESTED and attach evidence.

| Area | Required evidence | Current status |
|---|---|---|
| Production build / TypeScript | GitHub Actions green on current SHA | Build workflow passed on `22f1bcdc`; verify full current run |
| Browser E2E | All Playwright tests green | Rerun pending after focus fix |
| Live deployment smoke | Latest deployed SHA loaded and key flows passed | 4/4 passed on `37b2052a`; deployment race remains a risk because two deployment workflows run |
| SEO metadata | Inspect deployed HTML, canonical decision, title, description, social preview | 20-test E2E passed on `12ac526d`, including canonical metadata and sitemap; live metadata test passed 4/4 on `37b2052a` |
| Performance | Lighthouse on production URL, mobile and desktop; record LCP/CLS/INP | Not tested in this pass |
| Accessibility | Automated audit + keyboard + VoiceOver + Dynamic Type on device | Partial web keyboard test; native device testing not done |
| Responsive | Automated 320 px and device/tablet checks | 320 px overflow test exists; broader coverage needed |
| Security/privacy | Storage threat model, CSP/security headers where supported, privacy copy | Partial; no backend, but local data loss risk needs clearer copy |
| Data portability | Web and native export/import, corrupt-file recovery, schema versioning | Web partial; native backup missing |
| Sync integrity | Conflict/duplicate/offline/retry/time-zone tests | Blocked: no cross-device sync |
| Notifications | Real device, denied permissions, time changes, reboot | Not tested on device |
| Calendar/Reminders | Create/update/delete, duplicates, recurrence, permissions | Export copies only; no linked updates |
| Visual polish | Screenshot review of all views, light/dark, sizes | Not independently visually reviewed in this pass |
| User validation | 5–8 target-user sessions and task completion notes | Not done |
| Competitor validation | Repeatable hands-on scenarios on each target competitor | Desk research only; not a full hands-on teardown |

## Recommended order of work

1. Get latest browser E2E and live smoke green.
2. Do a production Lighthouse + accessibility audit and review screenshots at mobile/tablet/desktop widths.
3. Fix the highest-risk trust gaps: native backup/export, clearer local-data warning, and clear copy semantics for EventKit.
4. Decide whether cross-device sync is a core requirement. If yes, design the backend and conflict model before implementing it.
5. Add real-device verification for notifications, permissions, VoiceOver, Dynamic Type and date/time changes.
6. Make a product decision on SEO: personal tool first vs public acquisition landing page. Then implement the right metadata and crawlable public content.
7. Run user tests; compare task completion time, error rate, and perceived clarity against the same scenarios in competitors.

## Research limitations
This is a sourced desk-research baseline. It does not establish a universal winner, prove prevalence of anecdotal complaints, certify legal compliance, or guarantee App Store acceptance or Google rankings. Prices and features should be rechecked before a monetization or positioning decision.
