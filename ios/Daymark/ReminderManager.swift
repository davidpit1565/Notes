import EventKit
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


@MainActor
enum AppleIntegrationManager {
    static func addCopyToCalendar(_ item: PlannerItem) async -> String {
        guard item.kind == .event else { return "Only events can be added to Apple Calendar." }
        let store = EKEventStore()
        do {
            let granted = try await store.requestWriteOnlyAccessToEvents()
            guard granted else { return "Calendar access was not granted. You can change it in Settings." }
            guard let calendar = store.defaultCalendarForNewEvents else {
                return "No writable Apple Calendar is available on this device."
            }
            let calendarItem = EKEvent(eventStore: store)
            calendarItem.title = item.title
            calendarItem.notes = item.details
            calendarItem.calendar = calendar
            let startParts = Calendar.current.dateComponents([.hour, .minute], from: item.start)
            let endParts = Calendar.current.dateComponents([.hour, .minute], from: item.end)
            guard
                let startHour = startParts.hour, let startMinute = startParts.minute,
                let endHour = endParts.hour, let endMinute = endParts.minute,
                let startDate = Calendar.current.date(bySettingHour: startHour, minute: startMinute, second: 0, of: item.date),
                let endDate = Calendar.current.date(bySettingHour: endHour, minute: endMinute, second: 0, of: item.date),
                endDate > startDate
            else { return "This event has an invalid date or time. Edit it and try again." }
            calendarItem.startDate = startDate
            calendarItem.endDate = endDate
            try store.save(calendarItem, span: .thisEvent, commit: true)
            return "A copy was added to Apple Calendar. Future edits in Dailume will not sync automatically."
        } catch {
            return "Could not add this event to Apple Calendar. Check Calendar access in Settings and try again."
        }
    }

    static func addCopyToReminders(_ item: PlannerItem) async -> String {
        guard item.kind == .task else { return "Only tasks can be added to Apple Reminders." }
        let store = EKEventStore()
        do {
            let granted = try await store.requestFullAccessToReminders()
            guard granted else { return "Reminders access was not granted. You can change it in Settings." }
            guard let calendar = store.defaultCalendarForNewReminders() else {
                return "No writable Apple Reminders list is available on this device."
            }
            let reminder = EKReminder(eventStore: store)
            reminder.title = item.title
            reminder.notes = item.details.isEmpty ? nil : item.details
            reminder.calendar = calendar
            reminder.dueDateComponents = Calendar.current.dateComponents([.year, .month, .day], from: item.date)
            try store.save(reminder, commit: true)
            return "A copy was added to Apple Reminders. Future edits in Dailume will not sync automatically."
        } catch {
            return "Could not add this task to Apple Reminders. Check Reminders access in Settings and try again."
        }
    }
}
