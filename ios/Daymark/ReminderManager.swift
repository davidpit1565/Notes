import Foundation
import UserNotifications

@MainActor
enum ReminderManager {
    static func requestPermissionAndSchedule(_ items: [PlannerItem]) async -> Bool {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        let allowed: Bool
        switch settings.authorizationStatus {
        case .authorized, .provisional, .ephemeral:
            allowed = true
        case .notDetermined:
            allowed = (try? await center.requestAuthorization(options: [.alert, .sound, .badge])) ?? false
        default:
            allowed = false
        }
        guard allowed else { return false }
        await scheduleUpcomingEvents(items)
        return true
    }

    static func refreshSchedule(_ items: [PlannerItem]) async {
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized ||
            settings.authorizationStatus == .provisional ||
            settings.authorizationStatus == .ephemeral else { return }
        await scheduleUpcomingEvents(items)
    }

    static func cancel(_ item: PlannerItem) async {
        UNUserNotificationCenter.current().removePendingNotificationRequests(
            withIdentifiers: ["dailume-event-\(item.id.uuidString)"]
        )
    }

    private static func schedule(_ item: PlannerItem) async {
        guard item.kind == .event else { return }
        let triggerDate = triggerDate(for: item)
        guard triggerDate > .now else { return }
        let content = UNMutableNotificationContent()
        content.title = item.title
        content.body = item.details.isEmpty ? "Your planned time starts now." : item.details
        content.sound = .default
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: triggerDate)
        let request = UNNotificationRequest(
            identifier: "dailume-event-\(item.id.uuidString)",
            content: content,
            trigger: UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        )
        do {
            try await UNUserNotificationCenter.current().add(request)
        } catch {
            // Notification scheduling is best-effort; the planner item remains saved.
        }
    }

    private static func triggerDate(for item: PlannerItem) -> Date {
        Calendar.current.date(
            bySettingHour: Calendar.current.component(.hour, from: item.start),
            minute: Calendar.current.component(.minute, from: item.start),
            second: 0,
            of: item.date
        ) ?? item.start
    }

    private static func scheduleUpcomingEvents(_ items: [PlannerItem]) async {
        let center = UNUserNotificationCenter.current()
        let pending = await center.pendingNotificationRequests()
        let ownedIDs = pending.map(\.identifier).filter { $0.hasPrefix("dailume-event-") }
        center.removePendingNotificationRequests(withIdentifiers: ownedIDs)

        // Keep within the practical per-app pending local-notification budget.
        let upcoming = items
            .filter { $0.kind == .event && triggerDate(for: $0) > .now }
            .sorted { triggerDate(for: $0) < triggerDate(for: $1) }
            .prefix(60)
        for item in upcoming {
            await schedule(item)
        }
    }
}
