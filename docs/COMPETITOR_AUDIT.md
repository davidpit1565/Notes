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
