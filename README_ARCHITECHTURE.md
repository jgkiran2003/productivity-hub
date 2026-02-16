# Nexus Tech Stack Mindmap

## 1. Data Layer (Server State)
- **Tool:** TanStack Query
- **Job:** Fetch from Supabase, cache results, handle background sync.
- **Source:** `/src/hooks/useTimeline.ts`

## 2. Global UI (Client State)
- **Tool:** Zustand + Persist
- **Job:** Remember 'viewMode' and 'isSidebarOpen'.
- **Source:** `/src/store/uiStore.ts`

## 3. Realtime Updates
- **Tool:** Supabase Realtime
- **Job:** Listen for DB changes and ping TanStack to refresh.

## 4. Visual Layer
- **Tool:** Tailwind + Framer Motion
- **Job:** Glassmorphism and smooth view transitions.