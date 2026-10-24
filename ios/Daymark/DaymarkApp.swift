import SwiftUI

@main
struct DaymarkApp: App {
    @State private var store = PlannerStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .preferredColorScheme(nil)
        }
    }
}
