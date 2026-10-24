export type PlannerItem = {
  id: string
  date: string
  title: string
  details: string
  kind: 'event' | 'task' | 'note'
  start: string
  end: string
  done: boolean
  category: string
  createdAt: number
}
export type PlannerState = { items: PlannerItem[] }
export const STORAGE_KEY = 'daymark:v1'
export const todayKey = (date = new Date()) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return y + '-' + m + '-' + d
}
const makeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return 'item-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}
export const newItem = (date: string, kind: PlannerItem['kind'] = 'task'): PlannerItem => ({
  id: makeId(), date, title: '', details: '', kind,
  start: '09:00', end: '09:30', done: false, category: 'Personal', createdAt: Date.now()
})