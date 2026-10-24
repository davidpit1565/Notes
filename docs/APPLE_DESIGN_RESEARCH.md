# Apple design research and cross-platform strategy

Research checked: 25 October 2026. Re-check current Apple documentation before release; Apple changes APIs and review rules over time.

## Primary sources (official Apple)
- [Meet Liquid Glass — WWDC25](https://developer.apple.com/videos/play/wwdc2025/219/)
- [Build a SwiftUI app with the new design — WWDC25](https://developer.apple.com/videos/play/wwdc2025/323/)
- [Get to know the new design system — WWDC25](https://developer.apple.com/videos/play/wwdc2025/356/)
- [Human Interface Guidelines: Designing for iOS](https://developer.apple.com/design/human-interface-guidelines/designing-for-ios)
- [Apple Design Resources](https://developer.apple.com/design/resources/)
- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/)
- [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)

## What this means for Daymark
Apple describes Liquid Glass as a dynamic material primarily for the functional layer: navigation, toolbars, tab bars, search and controls. The app's actual content should remain readable and visually primary. Avoid putting glass behind every card or paragraph; use system materials where possible instead of approximating Apple's material with heavy CSS blur.

### Native SwiftUI
- Use native NavigationStack, TabView and toolbar controls so the current OS appearance can adapt automatically.
- Use Liquid Glass for navigation/action controls; keep planner content opaque and high-contrast.
- Support system appearance, Dynamic Type, VoiceOver, keyboard navigation on iPad with keyboard, safe areas and compact widths.
- Build and test with current Xcode/iOS SDK on actual hardware.
- Do not copy leaked or private assets. Use public Apple Design Resources, system SF Symbols and documented APIs.

### Website / PWA
- A website cannot access SwiftUI's Liquid Glass API. CSS backdrop-filter can create a similar translucent visual language, but it is only a visual approximation and differs by browser/device.
- Keep glass to navigation/toolbars, use @supports fallbacks and readable opaque content surfaces. Respect reduced motion, contrast, safe-area insets and touch target sizes.
- Responsive targets: narrow iPhone (320–390 CSS px), larger iPhone, iPad portrait/landscape, MacBook, and large iMac display. Use a sidebar on wide screens, compact bottom navigation or a menu on phones, and fluid content widths on tablet.

## Architecture decision
Maintain two front ends:
1. React/Vite PWA for browser access on MacBook/iMac/iPhone/iPad.
2. A true SwiftUI iOS target for native iPhone/iPad behavior and eventual App Store distribution.

These are not the same executable. SwiftUI's native Liquid Glass implementation cannot simply be used as a website. To keep both fronts consistent, share product behavior and design tokens, and connect both to the same backend only after the sync contract, authentication, conflict handling and privacy model are validated.

## Explicitly not yet verified
- No local Xcode build or real-device test has been completed by this automated workflow.
- No App Store submission, TestFlight distribution, Apple signing, or review approval has occurred.
- No cross-device native/web sync test has been completed.
