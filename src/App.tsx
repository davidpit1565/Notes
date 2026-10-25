import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, Circle, Clock3, FileText, Plus, X, Search, CalendarDays, Moon, Sun } from 'lucide-react'
import { newItem, STORAGE_KEY, todayKey, type PlannerItem } from './lib/types'

type Tab = 'Today' | 'Upcoming' | 'Notes'
const isDateKey = (value: unknown): value is string =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(value + 'T12:00:00').getTime())
const isTime = (value: unknown): value is string => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

const isPlannerItem = (item: unknown): item is PlannerItem => {
  if (!item || typeof item !== 'object') return false
  const x = item as Partial<PlannerItem>
  return typeof x.id === 'string' && isDateKey(x.date) && typeof x.title === 'string' &&
    typeof x.details === 'string' && typeof x.done === 'boolean' &&
    ['task', 'event', 'note'].includes(String(x.kind)) && isTime(x.start) && isTime(x.end) &&
    typeof x.category === 'string' && typeof x.createdAt === 'number' && Number.isFinite(x.createdAt)
}

const preserveRecoveryCopy = (raw: string) => {
  try { localStorage.setItem(STORAGE_KEY + ':recovery', raw) } catch { /* Best effort when storage is full. */ }
}

const readItems = (): PlannerItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('items' in value) || !Array.isArray(value.items)) {
      preserveRecoveryCopy(raw)
      return []
    }
    const valid = value.items.filter(isPlannerItem)
    if (valid.length !== value.items.length) preserveRecoveryCopy(raw)
    return valid
  } catch {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) preserveRecoveryCopy(raw)
    } catch { /* Storage itself may be unavailable. */ }
    return []
  }
}

const dateText = (date: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) => {
  const parsed = new Date(date + 'T12:00:00')
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString(undefined, options)
}
const dateInputValue = (date: Date) => todayKey(date)

export default function App() {
  const [items, setItems] = useState<PlannerItem[]>(readItems)
  const [tab, setTab] = useState<Tab>('Today')
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [searchText, setSearchText] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [editing, setEditing] = useState<PlannerItem | null>(null)
  const [draft, setDraft] = useState<PlannerItem>(() => newItem(todayKey()))
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try { return localStorage.getItem('dailume:theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' }
  })
  const importInputRef = useRef<HTMLInputElement>(null)

  const today = todayKey()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('dailume:theme', theme) } catch { /* Theme still works for this session. */ }
  }, [theme])
  const selectedDay = dateInputValue(selectedDate)
  const save = (next: PlannerItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: next }))
      setItems(next)
      return true
    } catch {
      setToast('Could not save. Your device storage may be full or unavailable.')
      return false
    }
  }

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    if (!composerOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setComposerOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [composerOpen])

  const visibleItems = useMemo(() => {
    const query = searchText.trim().toLocaleLowerCase()
    return items.filter(item => {
      const inTab = tab === 'Today'
        ? item.date === selectedDay && item.kind !== 'note'
        : tab === 'Upcoming'
          ? item.date > today && item.kind !== 'note'
          : item.kind === 'note'
      const matches = !query || item.title.toLocaleLowerCase().includes(query) ||
        item.details.toLocaleLowerCase().includes(query) || item.category.toLocaleLowerCase().includes(query)
      return inTab && matches
    }).sort((a, b) => a.date.localeCompare(b.date) ||
      (a.kind === 'event' ? a.start : '99:99').localeCompare(b.kind === 'event' ? b.start : '99:99') ||
      a.createdAt - b.createdAt)
  }, [items, tab, selectedDay, today, searchText])

  const openNew = () => {
    const date = tab === 'Upcoming' ? todayKey(new Date(Date.now() + 86400000)) : selectedDay
    const kind = tab === 'Notes' ? 'note' : 'task'
    setEditing(null)
    setDraft(newItem(date, kind))
    setComposerOpen(true)
  }

  const openEdit = (item: PlannerItem) => {
    setEditing(item)
    setDraft({ ...item })
    setComposerOpen(true)
  }

  const saveDraft = () => {
    const title = draft.title.trim()
    if (!title) return
    if (draft.kind === 'event' && draft.end <= draft.start) {
      setToast('Choose an end time later than the start time.')
      return
    }
    const nextItem = { ...draft, title, details: draft.details.trim() }
    const next = editing
      ? items.map(item => item.id === editing.id ? nextItem : item)
      : [...items, nextItem]
    if (!save(next)) return
    setComposerOpen(false)
    setToast(editing ? 'Changes saved' : draft.kind === 'note' ? 'Note saved' : draft.kind === 'event' ? 'Event added' : 'Task added')
  }

  const exportBackup = () => {
    try {
      const backup = { app: 'Dailume', schemaVersion: 1, exportedAt: new Date().toISOString(), items }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `dailume-backup-${today}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setToast('Backup exported')
    } catch {
      setToast('Could not export a backup in this browser.')
    }
  }

  const restoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    try {
      const parsed: unknown = JSON.parse(await file.text())
      if (!parsed || typeof parsed !== 'object' || !('schemaVersion' in parsed) ||
          parsed.schemaVersion !== 1 || !('items' in parsed) || !Array.isArray(parsed.items) ||
          !parsed.items.every(isPlannerItem)) {
        setToast('This backup file is not valid for Dailume.')
        return
      }
      if (!window.confirm('Restore this backup and replace the items currently saved in this browser? Export a backup first if you need the current items.')) return
      if (save(parsed.items)) setToast(`Restored ${parsed.items.length} ${parsed.items.length === 1 ? 'item' : 'items'}`)
    } catch {
      setToast('Could not read this backup file. Your current items were not changed.')
    }
  }

  const toggle = (item: PlannerItem) => save(items.map(x => x.id === item.id ? { ...x, done: !x.done } : x))
  const deleteDraft = () => {
    if (!editing) return
    if (!window.confirm('Delete this item? This cannot be undone.')) return
    if (save(items.filter(item => item.id !== editing.id))) {
      setComposerOpen(false)
      setToast('Item deleted')
    }
  }

  const completed = visibleItems.filter(item => item.kind !== 'note' && item.done).length
  const tasks = visibleItems.filter(item => item.kind !== 'note').length
  const heading = tab === 'Today' && selectedDay !== today
    ? dateText(selectedDay, { weekday: 'long', month: 'long', day: 'numeric' })
    : tab

  return <div className="app-shell">
    <main className="planner">
      <header className="app-header">
        <div className="wordmark"><span className="wordmark-icon">d</span><span>dailume</span></div>
        <div className="header-actions"><span className="private-label"><span /> Saved on this device</span><button className="theme-toggle" type="button" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Dark mode' : 'Light mode'} onClick={() => setTheme(value => value === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button></div>
      </header>

      <section className="welcome">
        {tab === 'Today'
          ? <label className="date-picker-label"><CalendarDays size={15} /><span>{selectedDay === today ? 'YOUR DAY' : 'SELECTED DAY'}</span><input aria-label="Choose a day" type="date" value={selectedDay} onChange={event => {
              if (isDateKey(event.target.value)) setSelectedDate(new Date(event.target.value + 'T12:00:00'))
            }} /></label>
          : <p className="date-label">{dateText(today, { weekday: 'long', month: 'long', day: 'numeric' })}</p>}
        <h1>{heading}<span>.</span></h1>
        <p className="subtitle">{tab === 'Today' ? 'A little progress is enough.' : tab === 'Upcoming' ? 'One step at a time.' : 'Keep the thoughts worth keeping.'}</p>
      </section>

      {tab !== 'Notes' && <section className="progress-card" aria-label="Daily progress">
        <div className="progress-copy">
          <span className="progress-caption">{tab === 'Today' ? 'YOUR PROGRESS' : 'COMING UP'}</span>
          <strong>{tab === 'Today' ? (tasks ? `${completed} of ${tasks} done` : 'A fresh start') : `${tasks} ${tasks === 1 ? 'item' : 'items'} ahead`}</strong>
        </div>
        {tab === 'Today' && <div className="progress-track" role="progressbar" aria-label="Tasks completed" aria-valuemin={0} aria-valuemax={tasks || 1} aria-valuenow={completed}><span style={{ width: (tasks ? completed / tasks * 100 : 0) + '%' }} /></div>}
        <div className="progress-mark">{tab === 'Today' ? <Check size={18} /> : <Clock3 size={18} />}</div>
      </section>}

      <div className="list-heading">
        <div><h2>{tab === 'Today' ? 'Your plan' : tab === 'Upcoming' ? 'Coming up' : 'Your notes'}</h2><span>{visibleItems.length ? `${visibleItems.length} ${visibleItems.length === 1 ? 'item' : 'items'}` : searchText ? 'No matches' : 'Nothing here yet'}</span></div>
      </div>

      <label className="search-field"><Search size={17} /><input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder={tab === 'Notes' ? 'Search your notes' : 'Search your plan'} aria-label="Search items" />{searchText && <button onClick={() => setSearchText('')} aria-label="Clear search"><X size={16} /></button>}</label>

      {visibleItems.length ? <div className="task-list">
        {visibleItems.map(item => <article className={'task-row ' + (item.done ? 'completed' : '')} key={item.id}>
          {item.kind === 'note'
            ? <div className="task-symbol note-symbol"><FileText size={18} /></div>
            : <button className="complete-button" onClick={() => toggle(item)} aria-label={item.done ? 'Mark as not done' : 'Mark as done'}>{item.done ? <span className="checked"><Check size={14} /></span> : <Circle size={23} strokeWidth={1.7} />}</button>}
          <button className="task-content" onClick={() => openEdit(item)}>
            <span className="task-title">{item.title}</span>
            {item.details && <span className="task-details">{item.details}</span>}
            {item.kind === 'note' && <span className="task-date">{dateText(item.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>}
            {tab === 'Upcoming' && <span className="task-date">{dateText(item.date, { weekday: 'short', month: 'short', day: 'numeric' })}{item.kind === 'event' ? ` · ${item.start}–${item.end}` : ''}</span>}
            {item.kind === 'event' && tab === 'Today' && <span className="task-date">{item.start} – {item.end}</span>}
          </button>
          <button className="row-more" aria-label="Edit item" onClick={() => openEdit(item)}><ChevronRight size={18} /></button>
        </article>)}
      </div> : <div className="empty-state">
        <div className="empty-icon">{tab === 'Notes' ? <FileText size={25} /> : searchText ? <Search size={25} /> : <Check size={25} />}</div>
        <h3>{searchText ? 'Nothing found.' : tab === 'Today' ? 'Start with one thing.' : tab === 'Upcoming' ? 'Nothing waiting for you.' : 'A quiet place for your thoughts.'}</h3>
        <p>{searchText ? 'Try another word, or clear your search.' : tab === 'Today' ? 'Add the one thing you would like to get done today.' : tab === 'Upcoming' ? 'Tasks and events scheduled for later will appear here.' : 'Save an idea before it slips away.'}</p>
      </div>}

      <button className="floating-add" onClick={openNew} aria-label={tab === 'Notes' ? 'New note' : 'New item'}><Plus size={25} /><span>{tab === 'Notes' ? 'New note' : 'New item'}</span></button>

      <nav className="tab-bar" aria-label="Main navigation">
        {(['Today', 'Upcoming', 'Notes'] as Tab[]).map((name, index) => <button key={name} className={tab === name ? 'selected' : ''} aria-current={tab === name ? 'page' : undefined} onClick={() => { setTab(name); setSearchText('') }}>
          {index === 0 ? <Check size={19} /> : index === 1 ? <Clock3 size={19} /> : <FileText size={19} />}
          <span>{name}</span>
        </button>)}
      </nav>
      <footer className="site-footer">
        <a href="./privacy.html">Privacy</a><span>·</span><a href="./support.html">Support</a><span>·</span>
        <button type="button" className="footer-action" onClick={exportBackup}>Export backup</button><span>·</span>
        <button type="button" className="footer-action" onClick={() => importInputRef.current?.click()}>Restore</button>
        <input ref={importInputRef} className="visually-hidden-file" type="file" accept="application/json,.json" aria-label="Import backup" onChange={restoreBackup} />
        <span>Local only</span>
      </footer>
    </main>

    {composerOpen && <div className="sheet-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setComposerOpen(false) }}>
      <section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="sheet-handle" />
        <header className="composer-header"><div><p>{editing ? 'MAKE A CHANGE' : draft.kind === 'note' ? 'SAVE A THOUGHT' : draft.kind === 'event' ? 'MAKE TIME FOR IT' : 'ONE THING AT A TIME'}</p><h2 id="composer-title">{editing ? 'Edit item' : draft.kind === 'note' ? 'New note' : draft.kind === 'event' ? 'New event' : 'New task'}</h2></div><button className="close-sheet" onClick={() => setComposerOpen(false)} aria-label="Close"><X size={20} /></button></header>
        <div className="kind-picker" aria-label="Item type">
          {(['task', 'event', 'note'] as PlannerItem['kind'][]).map(kind => <button key={kind} type="button" className={draft.kind === kind ? 'active' : ''} onClick={() => setDraft(current => ({ ...current, kind }))}>{kind === 'task' ? <Check size={16} /> : kind === 'event' ? <Clock3 size={16} /> : <FileText size={16} />}{kind === 'task' ? 'Task' : kind === 'event' ? 'Event' : 'Note'}</button>)}
        </div>
        <label className="input-label">What’s on your mind?
          <input autoFocus value={draft.title} maxLength={180} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder={draft.kind === 'note' ? 'Write a thought…' : draft.kind === 'event' ? 'e.g. Meeting with Sarah' : 'e.g. Finish the assignment'} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); saveDraft() } }} />
        </label>
        <label className="input-label">A little more detail <span>OPTIONAL</span>
          <textarea rows={3} maxLength={3000} value={draft.details} onChange={event => setDraft(current => ({ ...current, details: event.target.value }))} placeholder="Add a note if you need one…" />
        </label>
        <label className="input-label date-input">{draft.kind === 'note' ? 'Date for this note' : 'When'}<input type="date" required value={draft.date} onChange={event => { if (isDateKey(event.target.value)) setDraft(current => ({ ...current, date: event.target.value })) }} /></label>
        {draft.kind === 'event' && <div className="time-fields">
          <label className="input-label">Starts<input type="time" value={draft.start} onChange={event => setDraft(current => ({ ...current, start: event.target.value }))} required /></label>
          <label className="input-label">Ends<input type="time" value={draft.end} onChange={event => setDraft(current => ({ ...current, end: event.target.value }))} required /></label>
        </div>}
        {editing && <div className="sheet-secondary-actions">{draft.done && <span>Completed</span>}<button onClick={deleteDraft}>Delete item</button></div>}
        <div className="composer-actions"><button className="cancel-button" onClick={() => setComposerOpen(false)}>Cancel</button><button className="save-button" onClick={saveDraft} disabled={!draft.title.trim() || !isDateKey(draft.date) || (draft.kind === 'event' && (!isTime(draft.start) || !isTime(draft.end) || draft.end <= draft.start))}><Check size={18} /> Save</button></div>
        <p className="local-note">Your items stay in this browser on this device.</p>
      </section>
    </div>}
    {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
  </div>
}
