# Apple-inspired design research for Dailume

Research notes based on Apple's public developer documentation and Human Interface Guidelines, not leaked or private Apple assets.

## Primary references
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Meet Liquid Glass — WWDC25](https://developer.apple.com/videos/play/wwdc2025/323/)
- [App Review Guidelines — Design](https://developer.apple.com/app-store/review/guidelines/#design)
- [Accessibility — HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)

## Practical design direction
- Prefer native SwiftUI system components and platform behaviors over imitating screenshots or copying Apple's private/internal assets.
- Use system materials and Liquid Glass selectively for navigation and controls where the OS design calls for it; keep reading surfaces and planner content calm and legible.
- Respect safe areas, Dynamic Type, VoiceOver labels, keyboard navigation, contrast, reduced motion, and iPad split/landscape layouts.
- Keep the website responsive with system font stacks, restrained translucent navigation, clear touch targets, and accessible focus states. Web CSS can approximate visual material effects but is not the native Liquid Glass rendering engine.

## Brand
- The working name is **Dailume**, selected after finding existing App Store listings using Daymark variants.
- Search results are not legal clearance. Confirm the exact name in App Store Connect and perform trademark/domain checks before launch.
- The repository includes a draft icon; inspect the rendered 1024px AppIcon in Xcode and on a real device before calling it final.

## Release note
The website and native app are separate implementations. The website uses local browser storage; the SwiftUI app uses local device storage. They do not sync. Native iCloud/CloudKit sync is a separate feature and must not be advertised until implemented and tested.
