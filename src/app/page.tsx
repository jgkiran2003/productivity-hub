'use client';

import { useEffect, useState } from 'react';

import Sidebar from './components/workspace/Sidebar'; // New Sidebar
import FullCalendarView from './components/calendar/FullCalendarView'; // New Calendar View

import { useUIStore } from '@/store/uiStore';
import { useWorkspaceStore } from '@/store/workspaceStore'; // New workspace store
import { useTimeline } from '@/hooks/useTimeline';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { isSidebarOpen, toggleSidebar } = useUIStore(); 
  const { isMainStageExpanded, toggleMainStage } = useWorkspaceStore(); // From new store
  const { data: unifiedData, isLoading, error } = useTimeline();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Trigger background sync
    fetch('/api/sync/trigger')
      .then(response => {
        if (!response.ok) {
          console.error('Failed to trigger background sync:', response.statusText);
        } else {
          console.log('Background sync triggered successfully.');
        }
      })
      .catch(error => {
        console.error('Error triggering background sync:', error);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading your Nexus data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="relative flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      {!isMainStageExpanded && <Sidebar unifiedData={unifiedData ?? []} />}

      {/* Main Stage */}
      <main className="flex-1 relative flex flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-black">
        {isMainStageExpanded && (
          <button
            onClick={toggleMainStage}
            className="absolute top-4 left-4 p-2 bg-blue-600 text-white rounded-full shadow-lg z-50"
            aria-label="Collapse sidebar"
          >
            ☰ 
          </button>
        )}
        <div className="flex-1 p-4 lg:p-8">
          <FullCalendarView unifiedData={unifiedData ?? []} />
        </div>
      </main>
    </div>
  );
}