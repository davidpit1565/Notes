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
    private let storageKey = "daymark.native.items.v1"

    init() { load() }

    func items(on day: Date) -> [PlannerItem] {
        items.filter { Calendar.current.isDate($0.date, inSameDayAs: day) }
            .sorted {
                if $0.kind == .note && $1.kind != .note { return false }
                if $1.kind == .note && $0.kind != .note { return true }
                return $0.start < $1.start
            }
    }

    @discardableResult
    func add(title: String, details: String, kind: PlannerKind, date: Date, start: Date, end: Date) -> PlannerItem {
        let item = PlannerItem(date: Calendar.current.startOfDay(for: date), title: title, details: details, kind: kind, start: start, end: end)
        items.append(item)
        save()
        return item
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
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let decoded = try? JSONDecoder().decode([PlannerItem].self, from: data) else { return }
        items = decoded
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(items) else { return }
        UserDefaults.standard.set(data, forKey: storageKey)
    }
}
