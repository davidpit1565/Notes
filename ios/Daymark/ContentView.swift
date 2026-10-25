import SwiftUI

struct ContentView: View {
    @Environment(PlannerStore.self) private var store
    @State private var selectedDate = Calendar.current.startOfDay(for: .now)
    @State private var showingComposer = false
    @State private var editingItem: PlannerItem?
    @State private var searchText = ""
    @State private var reminderMessage = ""

    private var dayItems: [PlannerItem] {
        store.items(on: selectedDate).filter {
            searchText.isEmpty || $0.title.localizedCaseInsensitiveContains(searchText) || $0.details.localizedCaseInsensitiveContains(searchText)
        }
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    dateHeader
                    daySummary
                    if dayItems.isEmpty {
                        ContentUnavailableView("A little room to think", systemImage: "sun.max", description: Text("Add a task, a time block, or a note to shape your day."))
                            .padding(.top, 22)
                    } else {
                        LazyVStack(spacing: 10) {
                            ForEach(dayItems) { item in
                                PlannerRow(
                                    item: item,
                                    onToggle: { store.toggle(item) },
                                    onEdit: { editingItem = item; showingComposer = true },
                                    onDelete: {
                                        store.delete(item)
                                        Task { await ReminderManager.cancel(item) }
                                    }
                                )
                            }
                        }
                    }
                }
                .frame(maxWidth: 760, alignment: .leading)
                .padding(.horizontal, 20)
                .padding(.top, 20)
                .padding(.bottom, 110)
                .frame(maxWidth: .infinity)
            }
            .background(Color(uiColor: .systemGroupedBackground))
            .navigationTitle("Dailume")
            .navigationBarTitleDisplayMode(.large)
            .tint(Color(red: 0.20, green: 0.32, blue: 0.24))
            .searchable(text: $searchText, prompt: "Search your day")
            .alert("Event reminders", isPresented: Binding(get: { !reminderMessage.isEmpty }, set: { if !$0 { reminderMessage = "" } })) {
                Button("OK") { reminderMessage = "" }
            } message: { Text(reminderMessage) }
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button {
                        Task {
                            let enabled = await ReminderManager.requestPermissionAndSchedule(store.items)
                            reminderMessage = enabled ? "Event reminders are enabled on this device." : "Notifications are off. You can enable them in Settings."
                        }
                    } label: { Image(systemName: "bell.badge") }
                        .accessibilityLabel("Enable event reminders")
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Menu {
                        Link("Privacy Policy", destination: URL(string: "https://davidpit1565.github.io/Notes/privacy.html")!)
                        Link("Support", destination: URL(string: "https://davidpit1565.github.io/Notes/support.html")!)
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                    .accessibilityLabel("Privacy and support")
                }
                ToolbarItem(placement: .primaryAction) {
                    Button { editingItem = nil; showingComposer = true } label: { Image(systemName: "plus") }
                        .accessibilityLabel("Add planner item")
                }
            }
            .sheet(isPresented: $showingComposer, onDismiss: { editingItem = nil }) {
                Group {
                    if let item = editingItem {
                        ItemComposer(selectedDate: selectedDate, item: item) { updated in
                            store.update(updated)
                            if updated.kind == .event {
                                Task { await ReminderManager.schedule(updated) }
                            } else {
                                Task { await ReminderManager.cancel(updated) }
                            }
                        }
                    } else {
                        ItemComposer(selectedDate: selectedDate) { created in
                            let item = store.add(title: created.title, details: created.details, kind: created.kind, date: created.date, start: created.start, end: created.end)
                            if item.kind == .event { Task { await ReminderManager.schedule(item) } }
                        }
                    }
                }
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
            }
        }
    }

    private var dateHeader: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .firstTextBaseline) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(selectedDate, format: .dateTime.weekday(.wide))
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.secondary)
                    Text(selectedDate, format: .dateTime.month(.wide).day())
                        .font(.system(size: 30, weight: .semibold))
                        .tracking(-0.6)
                }
                Spacer()
                DatePicker("Choose date", selection: $selectedDate, displayedComponents: .date)
                    .labelsHidden()
                    .datePickerStyle(.compact)
                    .accessibilityLabel("Choose day")
            }
            HStack(spacing: 8) {
                ForEach(-2...2, id: \.self) { offset in
                    let date = Calendar.current.date(byAdding: .day, value: offset, to: selectedDate) ?? selectedDate
                    Button { selectedDate = Calendar.current.startOfDay(for: date) } label: {
                        VStack(spacing: 7) {
                            Text(date, format: .dateTime.weekday(.narrow))
                                .font(.caption.weight(.medium))
                                .foregroundStyle(Calendar.current.isDate(date, inSameDayAs: selectedDate) ? .white.opacity(0.8) : .secondary)
                            Text(date, format: .dateTime.day())
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(Calendar.current.isDate(date, inSameDayAs: selectedDate) ? .white : .primary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                        .background {
                            if Calendar.current.isDate(date, inSameDayAs: selectedDate) {
                                RoundedRectangle(cornerRadius: 12, style: .continuous).fill(Color.accentColor)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(date.formatted(date: .complete, time: .omitted))
                }
            }
            .padding(.top, 2)
        }
    }

    private var daySummary: some View {
        let tasks = dayItems.filter { $0.kind == .task }
        let completed = tasks.filter(\.isDone).count
        return HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(Calendar.current.isDateInToday(selectedDate) ? "Your day" : "Daily overview")
                    .font(.headline.weight(.semibold))
                Text(tasks.isEmpty ? "No tasks planned" : "\(completed) of \(tasks.count) completed")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer(minLength: 0)
            if !tasks.isEmpty {
                Text("\(Int((Double(completed) / Double(tasks.count) * 100).rounded()))%")
                    .font(.subheadline.weight(.medium).monospacedDigit())
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 4)
    }
}

private struct PlannerRow: View {
    let item: PlannerItem
    let onToggle: () -> Void
    let onEdit: () -> Void
    let onDelete: () -> Void
    @State private var showingDeleteConfirmation = false

    var body: some View {
        HStack(alignment: .top, spacing: 13) {
            if item.kind == .task {
                Button(action: onToggle) {
                    Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                        .font(.title3)
                        .foregroundStyle(item.isDone ? .green : .secondary)
                }
                .buttonStyle(.plain)
                .frame(width: 44, height: 44)
                .contentShape(Rectangle())
                .accessibilityLabel(item.isDone ? "Mark task incomplete" : "Mark task complete")
            } else {
                Image(systemName: item.kind.symbol)
                    .font(.title3)
                    .foregroundStyle(Color(red: 0.32, green: 0.43, blue: 0.34))
                    .frame(width: 24)
            }
            VStack(alignment: .leading, spacing: 5) {
                Text(item.title)
                    .font(.body.weight(.medium))
                    .strikethrough(item.isDone)
                    .foregroundStyle(item.isDone ? .secondary : .primary)
                if item.kind == .event {
                    Text("\(item.start.formatted(date: .omitted, time: .shortened)) – \(item.end.formatted(date: .omitted, time: .shortened))")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if !item.details.isEmpty {
                    Text(item.details).font(.subheadline).foregroundStyle(.secondary).fixedSize(horizontal: false, vertical: true)
                }
            }
            Spacer(minLength: 4)
            Menu {
                Button(action: onEdit) { Label("Edit", systemImage: "pencil") }
                Button(role: .destructive) { showingDeleteConfirmation = true } label: { Label("Delete", systemImage: "trash") }
            } label: {
                Image(systemName: "ellipsis").foregroundStyle(.tertiary).frame(width: 44, height: 44).contentShape(Rectangle())
            }
            .accessibilityLabel("More actions for \(item.title)")
            .confirmationDialog("Delete this item?", isPresented: $showingDeleteConfirmation, titleVisibility: .visible) {
                Button("Delete", role: .destructive, action: onDelete)
                Button("Cancel", role: .cancel) { }
            } message: {
                Text("This action cannot be undone.")
            }
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 2)
        .frame(maxWidth: .infinity, alignment: .leading)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(Color(uiColor: .separator).opacity(0.25))
                .frame(height: 1)
        }
    }
}

private struct ItemComposer: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: PlannerItem
    private let isEditing: Bool
    let onSave: (PlannerItem) -> Void

    init(selectedDate: Date, item: PlannerItem? = nil, onSave: @escaping (PlannerItem) -> Void) {
        let day = Calendar.current.startOfDay(for: selectedDate)
        let defaultStart = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: day) ?? day
        let defaultEnd = Calendar.current.date(bySettingHour: 10, minute: 0, second: 0, of: day) ?? day
        _draft = State(initialValue: item ?? PlannerItem(date: day, title: "", start: defaultStart, end: defaultEnd))
        self.isEditing = item != nil
        self.onSave = onSave
    }

    private var validTitle: Bool {
        !draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    private var validEventTime: Bool {
        let start = Calendar.current.dateComponents([.hour, .minute], from: draft.start)
        let end = Calendar.current.dateComponents([.hour, .minute], from: draft.end)
        let startMinutes = (start.hour ?? 0) * 60 + (start.minute ?? 0)
        let endMinutes = (end.hour ?? 0) * 60 + (end.minute ?? 0)
        return endMinutes > startMinutes
    }

    var body: some View {
        NavigationStack {
            Form {
                Picker("Type", selection: $draft.kind) {
                    ForEach(PlannerKind.allCases) { item in
                        Label(item.rawValue, systemImage: item.symbol).tag(item)
                    }
                }
                TextField("Title", text: $draft.title)
                    .textInputAutocapitalization(.sentences)
                TextField("Details (optional)", text: $draft.details, axis: .vertical)
                    .lineLimit(2...5)
                DatePicker("Date", selection: $draft.date, displayedComponents: .date)
                if draft.kind == .event {
                    DatePicker("Starts", selection: $draft.start, displayedComponents: .hourAndMinute)
                    DatePicker("Ends", selection: $draft.end, displayedComponents: .hourAndMinute)
                    if !validEventTime {
                        Text("The end time must be later than the start time.")
                            .font(.footnote)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle(isEditing ? "Edit plan" : "New plan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        var saved = draft
                        saved.title = draft.title.trimmingCharacters(in: .whitespacesAndNewlines)
                        saved.details = draft.details.trimmingCharacters(in: .whitespacesAndNewlines)
                        saved.date = Calendar.current.startOfDay(for: draft.date)
                        onSave(saved)
                        dismiss()
                    }
                    .disabled(!validTitle || (draft.kind == .event && !validEventTime))
                }
            }
        }
    }
}
