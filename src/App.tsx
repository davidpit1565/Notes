import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { ArrowLeft, ArrowRight, Bell, CalendarDays, Check, Circle, Clock3, FileText, ListTodo, Menu, Plus, Search, Settings2, Sparkles, StickyNote, Sun, X } from 'lucide-react'
import { newItem, STORAGE_KEY, todayKey, type PlannerItem, type PlannerState } from './lib/types'

type View = 'Today' | 'Upcoming' | 'Notes' | 'All tasks'
const readLocal = (): PlannerState => {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw) as PlannerState } catch { /* use empty state */ }
  return { items: [] }
}
const fmtDay = (key: string, options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'long', day: 'numeric' }) => new Date(key + 'T12:00:00').toLocaleDateString(undefined, options)
const shiftDay = (key: string, n: number) => { const d = new Date(key + 'T12:00:00'); d.setDate(d.getDate() + n); return todayKey(d) }

export default function App() {
  const [items, setItems] = useState<PlannerItem[]>(() => readLocal().items)
  const [selectedDate, setSelectedDate] = useState(todayKey())
  const [view, setView] = useState<View>('Today')
  const [query, setQuery] = useState('')
  const [showComposer, setShowComposer] = useState(false)
  const [draft, setDraft] = useState<PlannerItem>(() => newItem(todayKey()))
  const [kind, setKind] = useState<PlannerItem['kind']>('task')
  const [toast, setToast] = useState('')
  const [mobileNav, setMobileNav] = useState(false)
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [month, setMonth] = useState(todayKey().slice(0, 7))

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const persist = useCallback((next: PlannerItem[]) => {
    setItems(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: next })) } catch { notify('Could not save locally. Check available browser storage.') }
  }, [])
  const dayItems = useMemo(() => items.filter(i => i.date === selectedDate), [items, selectedDate])
  const visibleItems = useMemo(() => {
    let list = items
    if (view === 'Today') list = list.filter(i => i.date === selectedDate)
    if (view === 'Upcoming') list = list.filter(i => i.date >= todayKey())
    if (view === 'Notes') list = list.filter(i => i.kind === 'note')
    if (view === 'All tasks') list = list.filter(i => i.kind === 'task')
    if (query.trim()) { const q = query.toLowerCase(); list = list.filter(i => (i.title + ' ' + i.details + ' ' + i.category).toLowerCase().includes(q)) }
    return [...list].sort((a,b) => a.date.localeCompare(b.date) || (a.kind === 'note' ? 1 : b.kind === 'note' ? -1 : a.start.localeCompare(b.start)) || a.createdAt-b.createdAt)
  }, [items, view, selectedDate, query])
  const completed = dayItems.filter(i => i.done && i.kind === 'task').length
  const tasks = dayItems.filter(i => i.kind === 'task').length
  const openComposer = (k: PlannerItem['kind'] = 'task', date = selectedDate) => { setKind(k); setDraft({ ...newItem(date, k), ...(k === 'event' ? { start: '09:00', end: '10:00' } : {}) }); setShowComposer(true) }
  const saveDraft = () => {
    if (!draft.title.trim()) { notify('Give it a title first.'); return }
    const normalized = { ...draft, title: draft.title.trim(), details: draft.details.trim() }
    persist(items.some(i => i.id === normalized.id) ? items.map(i => i.id === normalized.id ? normalized : i) : [...items, normalized])
    setShowComposer(false); notify(kind === 'note' ? 'Note saved' : 'Added to your day')
  }
  const editItem = (item: PlannerItem) => { setDraft({ ...item }); setKind(item.kind); setShowComposer(true) }
  const toggleDone = (id: string) => persist(items.map(i => i.id === id ? { ...i, done: !i.done } : i))
  const deleteItem = (id: string) => { persist(items.filter(i => i.id !== id)); notify('Removed') }
  const askNotifications = () => {
    notify('Scheduled reminders are not available on the website yet.')
  }
  const dateHeading = view === 'Today' ? (selectedDate === todayKey() ? 'Today' : selectedDate === shiftDay(todayKey(),1) ? 'Tomorrow' : fmtDay(selectedDate,{weekday:'long'})) : view
  const dateLabel = fmtDay(selectedDate, { month: 'long', day: 'numeric', year: 'numeric' })
  const dayNames = ['M','T','W','T','F','S','S']
  const monthDate = new Date(month + '-01T12:00:00')
  const firstDay = (monthDate.getDay() + 6) % 7
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth()+1, 0).getDate()
  const dayKeys = Array.from({length:firstDay+daysInMonth},(_,i)=> i<firstDay ? '' : month+'-'+String(i-firstDay+1).padStart(2,'0'))
  const itemCount = (key: string) => items.filter(i=>i.date===key).length

  return <div className="app-shell">
    <aside className={'sidebar '+(mobileNav?'sidebar-open':'')}>
      <div className="brand"><div className="brand-mark"><span> a </span></div><span>dailume</span><span className="beta">BETA</span><button className="icon-btn mobile-close" onClick={()=>setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
      <div className="profile-switch" aria-label="Local workspace"><div className="avatar">D</div><div className="profile-text"><strong>My workspace</strong><small>Saved on this device</small></div></div>
      <button className="new-plan" onClick={()=>openComposer('task')}><Plus size={17}/><span>New item</span><kbd>⌘ K</kbd></button>
      <div className="nav-label">WORKSPACE</div>
      <nav className="nav-list">
        <button className={view==='Today'?'active':''} onClick={()=>{setView('Today');setMobileNav(false)}}><Sun size={17}/><span>My day</span><span className="nav-count">{dayItems.length||''}</span></button>
        <button className={view==='Upcoming'?'active':''} onClick={()=>{setView('Upcoming');setMobileNav(false)}}><CalendarDays size={17}/><span>Upcoming</span></button>
        <button className={view==='All tasks'?'active':''} onClick={()=>{setView('All tasks');setMobileNav(false)}}><ListTodo size={17}/><span>All tasks</span><span className="nav-count">{items.filter(i=>i.kind==='task'&&!i.done).length||''}</span></button>
        <button className={view==='Notes'?'active':''} onClick={()=>{setView('Notes');setMobileNav(false)}}><StickyNote size={17}/><span>Notes</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="sync-status"><span>Saved privately on this device</span><i className="dot green"/></div><button className="nav-settings" onClick={askNotifications}><Bell size={16}/><span>Reminders</span><span className="settings-pill">Later</span></button><div className="sidebar-footer">A little more room for what matters.</div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={()=>setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main-panel">
      <header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{view==='Today'?'My day':view}</strong></div><div className="top-actions"><label className="search-box"><Search size={16}/><input placeholder="Search anything…" value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ /</kbd></label><button className="icon-btn top-bell" onClick={askNotifications} aria-label="Reminders not yet available"><Bell size={18}/></button><div className="top-avatar">D</div></div></header>
      <div className="page-content">
        {view==='Today' && <div className="day-header"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR SPACE TO FOCUS</div><h1>{dateHeading}<span className="heading-period">.</span></h1><p className="date-subtitle">{dateLabel} <span>·</span> {new Date(selectedDate+'T12:00:00').toLocaleDateString(undefined,{year:'numeric'})===new Date().toLocaleDateString(undefined,{year:'numeric'})?'Make today count, one thing at a time.':'A plan that can flex with you.'}</p></div><div className="date-controls"><button className="icon-btn date-arrow" onClick={()=>setSelectedDate(shiftDay(selectedDate,-1))} aria-label="Previous day"><ArrowLeft size={17}/></button><button className="date-picker-btn" onClick={()=>setCalendarOpen(!calendarOpen)}><CalendarDays size={16}/><span>Pick a day</span></button><button className="icon-btn date-arrow" onClick={()=>setSelectedDate(shiftDay(selectedDate,1))} aria-label="Next day"><ArrowRight size={17}/></button>{calendarOpen&&<div className="calendar-pop"><div className="calendar-month"><button className="icon-btn" onClick={()=>setMonth(m=>{const d=new Date(m+'-01T12:00:00');d.setMonth(d.getMonth()-1);return todayKey(d).slice(0,7)})}><ArrowLeft size={15}/></button><strong>{monthDate.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</strong><button className="icon-btn" onClick={()=>setMonth(m=>{const d=new Date(m+'-01T12:00:00');d.setMonth(d.getMonth()+1);return todayKey(d).slice(0,7)})}><ArrowRight size={15}/></button></div><div className="calendar-grid">{dayNames.map((d,i)=><span className="calendar-dayname" key={i}>{d}</span>)}{dayKeys.map((key,i)=>key?<button key={key} className={'calendar-day '+(key===selectedDate?'chosen ':'')+(key===todayKey()?'is-today':'')} onClick={()=>{setSelectedDate(key);setCalendarOpen(false)}}>{Number(key.slice(-2))}{itemCount(key)>0&&<i/>}</button>:<span key={'blank'+i}/>)}</div><button className="today-link" onClick={()=>{setSelectedDate(todayKey());setMonth(todayKey().slice(0,7));setCalendarOpen(false)}}>Back to today</button></div>}</div></div>}
        {view!=='Today'&&<div className="day-header compact-header"><div><div className="eyebrow"><span className="eyebrow-dot"/> YOUR WORKSPACE</div><h1>{view}<span className="heading-period">.</span></h1><p className="date-subtitle">{view==='Notes'?'Thoughts, saved alongside your days.':view==='Upcoming'?'Everything ahead, with the details that matter.':'One clear list of the things to do.'}</p></div><button className="primary-btn header-add" onClick={()=>openComposer(view==='Notes'?'note':'task')}><Plus size={16}/> Add {view==='Notes'?'note':'item'}</button></div>}
        {view==='Today'&&<section className="focus-card"><div className="focus-copy"><div className="focus-kicker"><Sparkles size={14}/> A GENTLER WAY TO PLAN</div><h2>{tasks===0?'What would make today feel good?':completed===tasks?'Look at you. You did it.':'Small steps make a good day.'}</h2><p>{tasks===0?'Start with one thing you want to make space for. Add a time, a thought, or just a task.':completed+' of '+tasks+' tasks complete. Keep your focus on what matters next.'}</p></div><div className="progress-ring" style={{'--progress':(tasks?completed/tasks*100:0)+'%'} as CSSProperties}><div><strong>{tasks?Math.round(completed/tasks*100):0}<small>%</small></strong><span>done</span></div></div><div className="focus-decoration">✳</div></section>}
        {view==='Today'&&<div className="section-heading"><div><h2>Your plan</h2><span>{dayItems.length===0?'An open page':dayItems.length+' '+(dayItems.length===1?'item':'items')+' planned'}</span></div><div className="quick-adds"><button onClick={()=>openComposer('event')}><Clock3 size={15}/> Time block</button><button onClick={()=>openComposer('task')}><Plus size={15}/> Task</button><button onClick={()=>openComposer('note')}><FileText size={15}/> Note</button></div></div>}
        {view==='Today' && dayItems.length>0 && <div className="day-strip"><span className="strip-label">YOUR DAY AT A GLANCE</span><div className="strip-items">{dayItems.filter(i=>i.kind==='event').slice(0,4).map(i=><button key={i.id} className="strip-event" onClick={()=>editItem(i)}><i/>{i.start} · {i.title}</button>)}</div></div>}
        {visibleItems.length===0 ? <div className="empty-state"><div className="empty-illustration"><div className="empty-paper"><span/><span/><span/></div><div className="empty-spark">✳</div></div><h3>{query?'Nothing found':view==='Notes'?'A place for your thoughts.':view==='Upcoming'?'Your future is still unwritten.':view==='All tasks'?'One thing at a time.':'A fresh page, just for you.'}</h3><p>{query?'Try another search, or clear the search field.':view==='Notes'?'Save ideas, reminders, and little things you do not want to forget.':'Add a time block, a flexible task, or a note. They all live together here.'}</p><button className="primary-btn" onClick={()=>openComposer(view==='Notes'?'note':'task')}><Plus size={16}/> {view==='Notes'?'Write a note':'Plan something'}</button></div> : <div className="item-list">{visibleItems.map((item)=><article className={'plan-item '+(item.done?'is-done ':'')+(item.kind==='note'?'note-item':'')} key={item.id}><div className="item-time">{view==='Today'?(item.kind==='event'?<><strong>{item.start}</strong><span>{item.end}</span></>:item.kind==='task'?<button className="check-btn" onClick={()=>toggleDone(item.id)} aria-label={item.done?'Mark incomplete':'Mark complete'}>{item.done?<Check size={14}/>:<Circle size={16}/>}</button>:<span className="note-time"><StickyNote size={15}/></span>):<><strong>{fmtDay(item.date,{weekday:'short',month:'short',day:'numeric'})}</strong>{item.kind==='event'&&<span>{item.start}</span>}</>}</div><div className={'item-marker marker-'+item.kind}>{item.kind==='event'?<Clock3 size={15}/>:item.kind==='note'?<StickyNote size={15}/>:<Circle size={15}/>}</div><button className="item-body" onClick={()=>editItem(item)}><div className="item-title-row"><h3>{item.title}</h3><span className={'kind-tag tag-'+item.kind}>{item.kind==='event'?'TIME BLOCK':item.kind==='note'?'NOTE':'TASK'}</span></div>{item.details&&<p>{item.details}</p>}<div className="item-meta"><span className="category-pill"><i/>{item.category}</span>{item.kind==='event'&&<span className="duration"><Clock3 size={12}/>{item.start}–{item.end}</span>}</div></button><div className="item-actions"><button className="icon-btn" onClick={()=>editItem(item)} aria-label="Edit item"><Settings2 size={15}/></button><button className="icon-btn delete-action" onClick={()=>deleteItem(item.id)} aria-label="Delete item"><X size={15}/></button></div></article>)}</div>}
        {visibleItems.length>0&&<div className="bottom-add"><button onClick={()=>openComposer(view==='Notes'?'note':'task')}><Plus size={16}/> Add another {view==='Notes'?'note':'item'}</button><span>Your plan is allowed to change.</span></div>}
        {view==='Today'&&<div className="end-note"><span>✳</span><p>Leave a little room for the unexpected.</p></div>}
      </div>
      <footer className="main-footer"><span>DAILUME <i>·</i> YOUR DAY, YOUR PACE</span><span>Private to this browser <span className="footer-dot">●</span> · <a href="./privacy.html">Privacy</a> · <a href="./support.html">Support</a></span></footer>
    </main>
    {showComposer&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowComposer(false)}}><section className="composer" role="dialog" aria-modal="true" aria-labelledby="composer-title"><header className="composer-header"><div><span className="eyebrow">MAKE SPACE FOR IT</span><h2 id="composer-title">{items.some(i=>i.id===draft.id)?'Edit your item':'Add to your day'}</h2></div><button className="icon-btn" onClick={()=>setShowComposer(false)} aria-label="Close"><X size={19}/></button></header><div className="kind-switch">{(['task','event','note'] as const).map(k=><button key={k} className={kind===k?'selected':''} onClick={()=>{setKind(k);setDraft(d=>({...d,kind:k}))}}>{k==='task'?<ListTodo size={15}/>:k==='event'?<Clock3 size={15}/>:<StickyNote size={15}/>} {k==='event'?'Time block':k==='note'?'Note':'Task'}</button>)}</div><label className="field-label">Title<input autoFocus value={draft.title} onChange={e=>setDraft(d=>({...d,title:e.target.value}))} placeholder={kind==='event'?'e.g. Work on the presentation':kind==='note'?'A thought to keep…':'e.g. Finish project outline'} onKeyDown={e=>{if(e.key==='Enter'&&e.metaKey)saveDraft()}}/></label><label className="field-label">Date<input type="date" value={draft.date} onChange={e=>setDraft(d=>({...d,date:e.target.value}))}/></label>{kind==='event'&&<div className="time-fields"><label className="field-label">Starts<input type="time" value={draft.start} onChange={e=>setDraft(d=>({...d,start:e.target.value}))}/></label><label className="field-label">Ends<input type="time" value={draft.end} onChange={e=>setDraft(d=>({...d,end:e.target.value}))}/></label></div>}<label className="field-label">Details <span className="optional">OPTIONAL</span><textarea value={draft.details} onChange={e=>setDraft(d=>({...d,details:e.target.value}))} placeholder={kind==='note'?'Write freely. Add context, ideas, links…':'Anything you want to remember about this?'} rows={4}/></label><label className="field-label">Area<select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))}>{['Personal','Work','Study','Health','Errands','Ideas','Other'].map(c=><option key={c}>{c}</option>)}</select></label>{kind==='task'&&<label className="done-toggle"><input type="checkbox" checked={draft.done} onChange={e=>setDraft(d=>({...d,done:e.target.checked}))}/> Mark as completed</label>}<div className="composer-actions"><button className="secondary-btn" onClick={()=>setShowComposer(false)}>Cancel</button><button className="primary-btn" onClick={saveDraft}><Check size={16}/> Save {kind==='note'?'note':kind==='event'?'time block':'task'}</button></div><p className="composer-hint">Tip: use details for anything that does not belong on a calendar.</p></section></div>}
    {toast&&<div className="toast"><span className="toast-check"><Check size={14}/></span>{toast}</div>}
  </div>
}