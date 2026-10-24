import SwiftUI

struct ContentView: View {
    @Environment(PlannerStore.self) private var store
    @State private var selectedDate = Calendar.current.startOfDay(for: .now)
    @State private var showingComposer = false
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
                VStack(alignment: .leading, spacing: 24) {
                    dateHeader
                    daySummary
                    if dayItems.isEmpty {
                        ContentUnavailableView("A little room to think", systemImage: "sun.max", description: Text("Add a task, a time block, or a note to shape your day."))
                            .padding(.top, 22)
                    } else {
                        LazyVStack(spacing: 10) {
                            ForEach(dayItems) { item in
                                PlannerRow(item: item, onToggle: { store.toggle(item) }, onDelete: { store.delete(item) })
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
            .navigationTitle("Daymark")
            .navigationBarTitleDisplayMode(.large)
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
                    Button { showingComposer = true } label: { Image(systemName: "plus") }
                        .accessibilityLabel("Add planner item")
                }
            }
            .safeAreaInset(edge: .bottom) {
                Button { showingComposer = true } label: {
                    Label("Plan something", systemImage: "plus")
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 15)
                }
                .buttonStyle(.borderedProminent)
                .tint(Color(red: 0.20, green: 0.32, blue: 0.24))
                .padding(.horizontal, 20)
                .padding(.top, 10)
                .background(.bar)
            }
            .sheet(isPresented: $showingComposer) {
                ItemComposer(selectedDate: selectedDate) { title, details, kind, date, start, end in
                    store.add(title: title, details: details, kind: kind, date: date, start: start, end: end)
                    if kind == .event {
                        let item = store.items(on: date).first(where: { $0.title == title && $0.kind == .event })
                        if let item { Task { await ReminderManager.schedule(item) } }
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
                        .font(.system(size: 30, weight: .semibold, design: .rounded))
                        .tracking(-0.7)
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
                                RoundedRectangle(cornerRadius: 18, style: .continuous).fill(Color(red: 0.20, green: 0.32, blue: 0.24))
                            }
                        }
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel(date.formatted(date: .complete, time: .omitted))
                }
            }
            .padding(7)
            .background(.regularMaterial, in: RoundedRectangle(cornerRadius: 24, style: .continuous))
        }
    }

    private var daySummary: some View {
        let tasks = dayItems.filter { $0.kind == .task }
        let completed = tasks.filter(\.isDone).count
        return HStack(spacing: 12) {
            Image(systemName: "sun.max.fill")
                .font(.title2)
                .foregroundStyle(Color(red: 0.56, green: 0.61, blue: 0.42))
                .frame(width: 48, height: 48)
                .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
            VStack(alignment: .leading, spacing: 3) {
                Text(Calendar.current.isDateInToday(selectedDate) ? "Your day, at your pace" : "A little room to think")
                    .font(.headline)
                Text(tasks.isEmpty ? "No tasks planned yet" : "\(completed) of \(tasks.count) tasks completed")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            Spacer(minLength: 0)
        }
        .padding(16)
        .background(Color(uiColor: .secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 22, style: .continuous))
    }
}

private struct PlannerRow: View {
    let item: PlannerItem
    let onToggle: () -> Void
    let onDelete: () -> Void

    var body: some View {
        HStack(alignment: .top, spacing: 13) {
            if item.kind == .task {
                Button(action: onToggle) {
                    Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                        .font(.title3)
                        .foregroundStyle(item.isDone ? .green : .secondary)
                }
                .buttonStyle(.plain)
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
                Button(role: .destructive, action: onDelete) { Label("Delete", systemImage: "trash") }
            } label: {
                Image(systemName: "ellipsis").foregroundStyle(.tertiary).padding(8).contentShape(Rectangle())
            }
            .accessibilityLabel("More actions for \(item.title)")
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(uiColor: .secondarySystemGroupedBackground), in: RoundedRectangle(cornerRadius: 20, style: .continuous))
    }
}

private struct ItemComposer: View {
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var details = ""
    @State private var kind: PlannerKind = .task
    @State private var date: Date
    @State private var start = Calendar.current.date(bySettingHour: 9, minute: 0, second: 0, of: .now) ?? .now
    @State private var end = Calendar.current.date(bySettingHour: 10, minute: 0, second: 0, of: .now) ?? .now

    let onSave: (String, String, PlannerKind, Date, Date, Date) -> Void

    init(selectedDate: Date, onSave: @escaping (String, String, PlannerKind, Date, Date, Date) -> Void) {
        _date = State(initialValue: selectedDate)
        self.onSave = onSave
    }

    var body: some View {
        NavigationStack {
            Form {
                Picker("Type", selection: $kind) {
                    ForEach(PlannerKind.allCases) { item in
                        Label(item.rawValue, systemImage: item.symbol).tag(item)
                    }
                }
                TextField("Title", text: $title)
                TextField("Details (optional)", text: $details, axis: .vertical)
                    .lineLimit(2...5)
                DatePicker("Date", selection: $date, displayedComponents: .date)
                if kind == .event {
                    DatePicker("Starts", selection: $start, displayedComponents: .hourAndMinute)
                    DatePicker("Ends", selection: $end, displayedComponents: .hourAndMinute)
                }
            }
            .navigationTitle("New plan")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        guard !title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
                        onSave(title.trimmingCharacters(in: .whitespacesAndNewlines), details.trimmingCharacters(in: .whitespacesAndNewlines), kind, date, start, end)
                        dismiss()
                    }
                    .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
}
