'use client';

import { useEffect, useState } from 'react';
import ListTimeline from './components/ListTimeline';
import GoogleTasksColumn from "./components/GoogleTasksColumn";
import GoogleCalendarColumn from "./components/GoogleCalendarColumn";
import CollapsibleSidebar from "./components/CollapsibleSidebar";
import { supabase } from '@/lib/supabase/client';
import { NexusEvent, NexusTask } from '@/types/nexus'; 
import SpatialTimeline from "./components/SpatialTimeline";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'spatial'>('list');
  const [nexusEvents, setNexusEvents] = useState<NexusEvent[]>([]);
  const [nexusTasks, setNexusTasks] = useState<NexusTask[]>([]);
  const [loadingNexusData, setLoadingNexusData] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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

    // Fetch data from Supabase for the timeline
    async function fetchNexusData() {
      setLoadingNexusData(true);
      const { data: { user } = { user: null } } = await supabase.auth.getUser();

      if (!user) {
        console.warn('No user found, cannot fetch Nexus data.');
        setLoadingNexusData(false);
        return;
      }

      // Fetch Nexus Events
      const { data: eventsData, error: eventsError } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id);

      if (eventsError) {
        console.error('Error fetching Nexus events:', eventsError);
      } else {
        setNexusEvents(eventsData || []);
      }

      // Fetch Nexus Tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (tasksError) {
        console.error('Error fetching Nexus tasks:', tasksError);
      } else {
        setNexusTasks(tasksData || []);
      }
      setLoadingNexusData(false);
    }

    fetchNexusData();
  }, []); 

  // Display loading state for timeline data
  if (loadingNexusData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        Loading your Nexus data...
      </div>
    );
  }

  return (
    <div className="relative flex h-screen bg-black text-white overflow-hidden">
      <CollapsibleSidebar isOpen={isSidebarOpen} />
      
      {/* Fixed settings button in top right corner */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg z-50"
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        ⚙
      </button>

      <aside className="hidden lg:flex w-2/5 bg-white/[0.02] backdrop-blur-2xl border-r border-white/5 flex-col p-6 space-y-8">
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

      <main className="w-3/5 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-black p-4 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <header className="mb-12">
            <h2 className="text-3xl font-bold text-white">Your Day</h2>
            <p className="text-slate-400 text-sm mt-1">Synced from Google Tasks & Calendar</p>
            {/* Segmented Control for View Mode */}
            <div className="flex mt-4 p-1 bg-white/10 rounded-lg">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'spatial' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/5'
                }`}
                onClick={() => setViewMode('spatial')}
              >
                Spatial View
              </button>
            </div>
          </header>

          <div className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl">
            {viewMode === 'list' ? (
              <ListTimeline events={nexusEvents} tasks={nexusTasks} /> 
            ) : (
              <SpatialTimeline events={nexusEvents} tasks={nexusTasks} /> 
            )}
          </div>
        </div>
      </main>
    </div>
  );
}