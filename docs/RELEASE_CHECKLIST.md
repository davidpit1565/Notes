# Release readiness — checklist, not a claim of completion

## Web/PWA
- [ ] GitHub Pages build and deployment succeeds.
- [ ] Test Safari/Chrome desktop and iPhone Safari at 320px+.
- [ ] Test create/edit/delete, search, date navigation, task completion, refresh persistence.
- [ ] Test accessibility, keyboard use, VoiceOver, reduced motion, daylight-saving/timezone edges.
- [ ] Implement and test authentication and two-device sync before describing cloud sync as available.
- [ ] Resolve concurrent-write conflicts and offline/reconnect behavior.
- [ ] Add privacy policy, support contact, and data deletion flow before public launch.
- [ ] Define reminder semantics; implement and test background delivery if promised.

## Future native iOS/App Store
- [ ] Choose SwiftUI native app or Capacitor wrapper; website alone is not an Xcode project.
- [ ] Create Xcode project, bundle ID, app icon asset catalog, launch experience, version/build, signing and entitlements.
- [ ] Implement native notifications and request permission contextually.
- [ ] Request EventKit calendar access only with clear purpose and explicit permission.
- [ ] Provide privacy policy URL, support URL, metadata, screenshots, age rating and review notes.
- [ ] Complete App Privacy disclosures accurately; audit SDKs and data collection.
- [ ] If account creation is supported, implement in-app account deletion as required.
- [ ] Build/archive in current Xcode, validate upload, distribute and test TestFlight on real hardware.
- [ ] Re-check current App Review Guidelines and App Store Connect requirements at release time.