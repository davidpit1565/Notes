import { useMemo, useState } from 'react'
import { Check, ChevronRight, Circle, Clock3, FileText, Plus, X } from 'lucide-react'
import { newItem, STORAGE_KEY, todayKey, type PlannerItem } from './lib/types'

type Tab = 'Today' | 'Upcoming' | 'Notes'

const readItems = (): PlannerItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const value: unknown = JSON.parse(raw)
    if (!value || typeof value !== 'object' || !('items' in value) || !Array.isArray(value.items)) return []
    return value.items.filter((item): item is PlannerItem => {
      if (!item || typeof item !== 'object') return false
      const x = item as Partial<PlannerItem>
      return typeof x.id === 'string' && typeof x.date === 'string' && typeof x.title === 'string' &&
        typeof x.details === 'string' && typeof x.done === 'boolean' &&
        ['task', 'event', 'note'].includes(String(x.kind))
    })
  } catch { return [] }
}

const dateText = (date: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) =>
  new Date(date + 'T12:00:00').toLocaleDateString(undefined, options)

export default function App() {
  const [items, setItems] = useState<PlannerItem[]>(readItems)
  const [tab, setTab] = useState<Tab>('Today')
  const [composerOpen, setComposerOpen] = useState(false)
  const [editing, setEditing] = useState<PlannerItem | null>(null)
  const [draft, setDraft] = useState<PlannerItem>(() => newItem(todayKey()))
  const [toast, setToast] = useState('')

  const save = (next: PlannerItem[]) => {
    setItems(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: next })) }
    catch { setToast('Could not save on this device.') }
  }

  const today = todayKey()
  const visibleItems = useMemo(() => {
    const filtered = items.filter(item => {
      if (tab === 'Today') return item.date === today && item.kind !== 'note'
      if (tab === 'Upcoming') return item.date > today && item.kind !== 'note'
      return item.kind === 'note'
    })
    return filtered.sort((a, b) => a.date.localeCompare(b.date) ||
      (a.kind === 'event' ? a.start : '99:99').localeCompare(b.kind === 'event' ? b.start : '99:99') ||
      a.createdAt - b.createdAt)
  }, [items, tab, today])

  const openNew = () => {
    const item = newItem(tab === 'Upcoming' ? todayKey(new Date(Date.now() + 86400000)) : today, tab === 'Notes' ? 'note' : 'task')
    setEditing(null)
    setDraft(item)
    setComposerOpen(true)
  }

  const openEdit = (item: PlannerItem) => {
    setEditing(item)
    setDraft({ ...item })
    setComposerOpen(true)
  }

  const saveDraft = () => {
    if (!draft.title.trim()) return
    const nextItem = { ...draft, title: draft.title.trim(), details: draft.details.trim() }
    save(editing ? items.map(item => item.id === editing.id ? nextItem : item) : [...items, nextItem])
    setComposerOpen(false)
    setToast(editing ? 'Updated' : tab === 'Notes' ? 'Note saved' : 'Task added')
    window.setTimeout(() => setToast(''), 1800)
  }

  const toggle = (item: PlannerItem) => save(items.map(x => x.id === item.id ? { ...x, done: !x.done } : x))
  const completed = visibleItems.filter(item => item.kind !== 'note' && item.done).length
  const tasks = visibleItems.filter(item => item.kind !== 'note').length
  const heading = tab === 'Today' ? 'Today' : tab

  return <div className="app-shell">
    <main className="planner">
      <header className="app-header">
        <div className="wordmark"><span className="wordmark-icon">d</span><span>dailume</span></div>
        <span className="private-label"><span /> Private by design</span>
      </header>

      <section className="welcome">
        <p className="date-label">{dateText(today, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        <h1>{heading}<span>.</span></h1>
        <p className="subtitle">{tab === 'Today' ? 'A little progress is enough.' : tab === 'Upcoming' ? 'One step at a time.' : 'Keep the thoughts worth keeping.'}</p>
      </section>

      {tab !== 'Notes' && <section className="progress-card" aria-label="Daily progress">
        <div className="progress-copy">
          <span className="progress-caption">{tab === 'Today' ? 'YOUR PROGRESS' : 'COMING UP'}</span>
          <strong>{tab === 'Today' ? (tasks ? `${completed} of ${tasks} done` : 'A fresh start') : `${tasks} ${tasks === 1 ? 'task' : 'tasks'} ahead`}</strong>
        </div>
        {tab === 'Today' && <div className="progress-track"><span style={{ width: (tasks ? completed / tasks * 100 : 0) + '%' }} /></div>}
        <div className="progress-mark">{tab === 'Today' ? <Check size={18} /> : <Clock3 size={18} />}</div>
      </section>}

      <div className="list-heading">
        <div><h2>{tab === 'Today' ? 'Your tasks' : tab === 'Upcoming' ? 'Coming up' : 'Your notes'}</h2><span>{visibleItems.length ? `${visibleItems.length} ${visibleItems.length === 1 ? 'item' : 'items'}` : 'Nothing here yet'}</span></div>
        
      </div>

      {visibleItems.length ? <div className="task-list">
        {visibleItems.map(item => <article className={'task-row ' + (item.done ? 'completed' : '')} key={item.id}>
          {item.kind === 'note'
            ? <div className="task-symbol note-symbol"><FileText size={18} /></div>
            : <button className="complete-button" onClick={() => toggle(item)} aria-label={item.done ? 'Mark as not done' : 'Mark as done'}>{item.done ? <span className="checked"><Check size={14} /></span> : <Circle size={23} strokeWidth={1.7} />}</button>}
          <button className="task-content" onClick={() => openEdit(item)}>
            <span className="task-title">{item.title}</span>
            {item.details && <span className="task-details">{item.details}</span>}
            {tab === 'Upcoming' && <span className="task-date">{dateText(item.date, { weekday: 'short', month: 'short', day: 'numeric' })}</span>}
            {item.kind === 'event' && tab === 'Today' && <span className="task-date">{item.start} – {item.end}</span>}
          </button>
          <button className="row-more" aria-label="Edit item" onClick={() => openEdit(item)}><ChevronRight size={18} /></button>
        </article>)}
      </div> : <div className="empty-state">
        <div className="empty-icon">{tab === 'Notes' ? <FileText size={25} /> : <Check size={25} />}</div>
        <h3>{tab === 'Today' ? 'Start with one thing.' : tab === 'Upcoming' ? 'Nothing waiting for you.' : 'A quiet place for your thoughts.'}</h3>
        <p>{tab === 'Today' ? 'Add the one thing you would like to get done today.' : tab === 'Upcoming' ? 'Tasks you schedule for later will appear here.' : 'Save an idea before it slips away.'}</p>
        
      </div>}

      <button className="floating-add" onClick={openNew} aria-label={tab === 'Notes' ? 'Add note' : 'Add task'}><Plus size={25} /><span>{tab === 'Notes' ? 'New note' : 'New task'}</span></button>

      <nav className="tab-bar" aria-label="Main navigation">
        {(['Today', 'Upcoming', 'Notes'] as Tab[]).map((name, index) => <button key={name} className={tab === name ? 'selected' : ''} onClick={() => setTab(name)}>
          {index === 0 ? <Check size={19} /> : index === 1 ? <Clock3 size={19} /> : <FileText size={19} />}
          <span>{name}</span>
        </button>)}
      </nav>
      <footer className="site-footer"><a href="./privacy.html">Privacy</a><span>·</span><a href="./support.html">Support</a><span>·</span><span>Saved on this device</span></footer>
    </main>

    {composerOpen && <div className="sheet-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) setComposerOpen(false) }}>
      <section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title">
        <div className="sheet-handle" />
        <header className="composer-header"><div><p>{editing ? 'MAKE A CHANGE' : tab === 'Notes' ? 'SAVE A THOUGHT' : 'ONE THING AT A TIME'}</p><h2 id="composer-title">{editing ? 'Edit item' : tab === 'Notes' ? 'New note' : 'New task'}</h2></div><button className="close-sheet" onClick={() => setComposerOpen(false)} aria-label="Close"><X size={20} /></button></header>
        <label className="input-label">What’s on your mind?
          <input autoFocus value={draft.title} onChange={event => setDraft(current => ({ ...current, title: event.target.value }))} placeholder={tab === 'Notes' ? 'Write a thought…' : 'e.g. Finish the assignment'} onKeyDown={event => { if (event.key === 'Enter') saveDraft() }} />
        </label>
        <label className="input-label">A little more detail <span>OPTIONAL</span>
          <textarea rows={3} value={draft.details} onChange={event => setDraft(current => ({ ...current, details: event.target.value }))} placeholder="Add a note if you need one…" />
        </label>
        <label className="input-label date-input">{tab === 'Notes' ? 'Date' : 'When'}<input type="date" value={draft.date} onChange={event => setDraft(current => ({ ...current, date: event.target.value }))} /></label>
        {editing && <div className="sheet-secondary-actions">{draft.done && <span>Completed</span>}<button onClick={() => { save(items.filter(item => item.id !== draft.id)); setComposerOpen(false) }}>Delete</button></div>}
        <div className="composer-actions"><button className="cancel-button" onClick={() => setComposerOpen(false)}>Cancel</button><button className="save-button" onClick={saveDraft} disabled={!draft.title.trim()}><Check size={18} /> Save</button></div>
        <p className="local-note">Your items stay on this device.</p>
      </section>
    </div>}
    {toast && <div className="toast">{toast}</div>}
  </div>
}
