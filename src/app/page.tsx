'use client';

import { useEffect } from 'react';
import UnifiedTimeline from "./components/UnifiedTimeline";
import { sampleEvents, sampleTasks } from "../data/sampleData";
import GoogleSignInButton from "./components/GoogleSignInButton";
import GoogleTasksColumn from "./components/GoogleTasksColumn";
import GoogleCalendarColumn from "./components/GoogleCalendarColumn";

export default function Home() {
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
    <div className="flex h-screen bg-black text-white">
      {/* Left: Nav Sidebar */}
      <aside className="w-2/5 bg-white/10 backdrop-blur-lg rounded-2xl m-2 p-4 flex flex-col space-y-4">
        <div className="flex-1 overflow-hidden">
          <GoogleTasksColumn />
        </div>
        <div className="flex-1 overflow-hidden">
          <GoogleCalendarColumn />
        </div>
      </aside>

      {/* Center: Unified Scrollable Timeline */}
      <main className="w-2/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4 overflow-y-auto">
        <UnifiedTimeline events={sampleEvents} tasks={sampleTasks} />
      </main>

      {/* Right: Info Panel */}
      <aside className="w-1/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4">
        <GoogleSignInButton />
      </aside>
    </div>
  );
}
