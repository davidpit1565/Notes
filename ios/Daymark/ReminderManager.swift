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

    static func schedule(_ item: PlannerItem) async {
        guard item.kind == .event else { return }
        let center = UNUserNotificationCenter.current()
        let settings = await center.notificationSettings()
        guard settings.authorizationStatus == .authorized || settings.authorizationStatus == .provisional else { return }
        let triggerDate = Calendar.current.date(
            bySettingHour: Calendar.current.component(.hour, from: item.start),
            minute: Calendar.current.component(.minute, from: item.start),
            second: 0,
            of: item.date
        ) ?? item.start
        guard triggerDate > .now else { return }
        let content = UNMutableNotificationContent()
        content.title = item.title
        content.body = item.details.isEmpty ? "Your planned time starts now." : item.details
        content.sound = .default
        let components = Calendar.current.dateComponents([.year, .month, .day, .hour, .minute], from: triggerDate)
        let request = UNNotificationRequest(
            identifier: "daymark-event-\(item.id.uuidString)",
            content: content,
            trigger: UNCalendarNotificationTrigger(dateMatching: components, repeats: false)
        )
        try? await center.add(request)
    }

    private static func scheduleUpcomingEvents(_ items: [PlannerItem]) async {
        for item in items where item.kind == .event {
            await schedule(item)
        }
    }
}
