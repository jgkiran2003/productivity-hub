import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  isMainStageExpanded: boolean;
  selectedItemId: string | null; // New state for selected item
  toggleMainStage: () => void;
  setSelectedItemId: (itemId: string | null) => void; // New action
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      isMainStageExpanded: false,
      selectedItemId: null, // Initialize
      toggleMainStage: () => set((state) => ({ isMainStageExpanded: !state.isMainStageExpanded })),
      setSelectedItemId: (itemId: string | null) => set({ selectedItemId: itemId }), // Implement action
    }),
    { name: 'nexus-workspace-config' }
  )
);