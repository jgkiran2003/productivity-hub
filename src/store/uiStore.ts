import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  viewMode: 'list' | 'spatial';
  toggleSidebar: () => void;
  setViewMode: (mode: 'list' | 'spatial') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false,
      viewMode: 'list',
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'nexus-ui-config' }
  )
);