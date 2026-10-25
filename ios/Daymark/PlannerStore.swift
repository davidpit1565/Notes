import Foundation
import Observation
import SwiftUI

enum PlannerKind: String, CaseIterable, Codable, Identifiable {
    case event = "Event"
    case task = "Task"
    case note = "Note"

    var id: String { rawValue }
    var symbol: String {
        switch self {
        case .event: "calendar"
        case .task: "checkmark.circle"
        case .note: "note.text"
        }
    }
}

struct PlannerItem: Identifiable, Codable, Equatable {
    var id: UUID = UUID()
    var date: Date = Calendar.current.startOfDay(for: .now)
    var title: String
    var details: String = ""
    var kind: PlannerKind = .task
    var start: Date = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: .now) ?? .now
    var end: Date = Calendar.current.date(bySettingHour: 9, minute: 30, second: 0, of: .now) ?? .now
    var isDone: Bool = false
}

@Observable
final class PlannerStore {
    private(set) var items: [PlannerItem] = []
    private let storageKey = "dailume.native.items.v1"

    init() { load() }

    func items(on day: Date) -> [PlannerItem] {
        items.filter { Calendar.current.isDate($0.date, inSameDayAs: day) }
            .sorted {
                if $0.kind == .note && $1.kind != .note { return false }
                if $1.kind == .note && $0.kind != .note { return true }
                let firstMinutes = Calendar.current.component(.hour, from: $0.start) * 60 +
                    Calendar.current.component(.minute, from: $0.start)
                let secondMinutes = Calendar.current.component(.hour, from: $1.start) * 60 +
                    Calendar.current.component(.minute, from: $1.start)
                if firstMinutes != secondMinutes { return firstMinutes < secondMinutes }
                return $0.title.localizedCaseInsensitiveCompare($1.title) == .orderedAscending
            }
    }

    @discardableResult
    func add(title: String, details: String, kind: PlannerKind, date: Date, start: Date, end: Date) -> PlannerItem {
        let item = PlannerItem(date: Calendar.current.startOfDay(for: date), title: title, details: details, kind: kind, start: start, end: end)
        items.append(item)
        save()
        return item
    }

    func update(_ item: PlannerItem) {
        guard let index = items.firstIndex(where: { $0.id == item.id }) else { return }
        var updated = item
        updated.date = Calendar.current.startOfDay(for: item.date)
        items[index] = updated
        save()
    }

    func toggle(_ item: PlannerItem) {
        guard let index = items.firstIndex(where: { $0.id == item.id }) else { return }
        items[index].isDone.toggle()
        save()
    }

    func delete(_ item: PlannerItem) {
        items.removeAll { $0.id == item.id }
        save()
    }

    private func load() {
        guard let data = UserDefaults.standard.data(forKey: storageKey) else { return }
        guard let decoded = try? JSONDecoder().decode([PlannerItem].self, from: data) else {
            // Preserve unreadable saved data before a later save can overwrite it.
            UserDefaults.standard.set(data, forKey: storageKey + ".recovery")
            return
        }
        items = decoded
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(items) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
