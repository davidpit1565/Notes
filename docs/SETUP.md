# Setup: Dailume web and native iOS

## Website / PWA
Requirements: Node.js 20+.

```sh
npm install
npm run dev
```

The website is local-only. Planner items are stored in browser local storage; no account or server sync is configured.

## Publish with GitHub Pages
1. Open repository Settings → Pages.
2. Choose **GitHub Actions** as the deployment source.
3. Push to `main` or run the deployment workflow manually.
4. Check [GitHub Actions](https://github.com/davidpit1565/Notes/actions). The expected URL is https://davidpit1565.github.io/Notes/.

The public privacy policy is https://davidpit1565.github.io/Notes/privacy.html and support page is https://davidpit1565.github.io/Notes/support.html.

## Native iOS app
1. On your Mac, install/open a compatible Xcode version.
2. Open `ios/Daymark.xcodeproj`.
3. Select the `Daymark` scheme and an iPhone Simulator.
4. Build and test. The app's home-screen display name is Dailume.
5. For TestFlight, select your Apple Developer team in Signing & Capabilities, confirm the bundle ID `com.davidpitchkhadze.dailume` is available to your team, increment the build number, archive for Any iOS Device, validate, and upload through Xcode Organizer or the authorized Transporter/App Store Connect API workflow.
6. Wait for Apple processing, complete the required Test Information and Beta App Review fields, then invite testers.

## Data limits
The native app stores data locally on the device. The website stores data in that browser. They do not sync with each other. Do not assume iCloud/CloudKit sync exists until it is implemented, configured for the correct Apple Developer team/container, and verified on at least two devices signed in to the same iCloud account.

## Troubleshooting
- Website 404 or blank screen: check Pages source, then inspect the latest deploy and build workflows.
- iOS build fails: open the project in current Xcode, check signing/team and build logs.
- TestFlight upload fails: confirm the bundle ID exists in App Store Connect, the Apple Developer membership is active, the build/version is unique, and signing credentials are valid.
