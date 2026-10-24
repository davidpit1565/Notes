# Architecture and known limits

- React + TypeScript + Vite web app; GitHub Pages project path `/Notes/`.
- Local storage fallback. Data is private to this browser profile and can be cleared by the browser.
- Planned cloud sync: Supabase Auth + per-user Postgres row. GitHub Pages itself is static hosting and is not a database.
- Current data item: id, local date, title, details, kind, start/end, done, category.

## Production risks
The initial prototype stores all planner items in one JSON state. Concurrent edits across devices can overwrite each other. Before relying on it, migrate to one database row per item and implement conflict/version handling. A web app cannot silently read the user's Apple Calendar; it needs an explicit calendar integration and authorization. Browser notifications do not guarantee delivery when the app is closed or suspended. Reliable background reminders need a push backend or native notification scheduling.