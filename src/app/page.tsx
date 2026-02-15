'use client';

import { useEffect, useState } from 'react';
import UnifiedTimeline from "./components/UnifiedTimeline";
import { sampleEvents, sampleTasks } from "../data/sampleData";
import GoogleTasksColumn from "./components/GoogleTasksColumn";
import GoogleCalendarColumn from "./components/GoogleCalendarColumn";
import CollapsibleSidebar from "./components/CollapsibleSidebar"; 

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
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

  return (
    <div className="relative flex h-screen bg-black text-white overflow-hidden">
      <CollapsibleSidebar isOpen={isSidebarOpen} />
      
      {/* Fixed settings button in top right corner */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg z-50"
      >
        ⚙
      </button>

      <aside className="hidden lg:flex w-1/3 bg-white/[0.02] backdrop-blur-2xl border-r border-white/5 flex-col p-6 space-y-8">
        <div className="h-10 flex items-center px-2">
          <span className="text-blue-500 font-bold text-xl tracking-tighter">NEXUS</span>
        </div>
        
        <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
          <section> 
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">Task Sync</h3>
            <GoogleTasksColumn />
          </section>
          <section>
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold mb-4">Calendar Events</h3>
            <GoogleCalendarColumn />
          </section>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <header className="mb-12">
            <h2 className="text-3xl font-bold text-white">Your Day</h2>
            <p className="text-slate-400 text-sm mt-1">Synced from Google Tasks & Calendar</p>
          </header>

          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            <UnifiedTimeline events={sampleEvents} tasks={sampleTasks} />
          </div>
        </div>
      </main>
    </div>
  );
}
