import UnifiedTimeline from "./components/UnifiedTimeline";
import { Event, Task } from "../types";

export default function Home() {
  const sampleEvents: Event[] = [
    { id: 'evt1', type: 'event', title: 'Team Meeting', start: new Date(2026, 0, 20, 10, 0).toISOString() },
    { id: 'evt2', type: 'event', title: 'Design Review', start: new Date(2026, 0, 20, 14, 30).toISOString() },
  ];

  const sampleTasks: Task[] = [
    { id: 'tsk1', type: 'task', title: 'Finish quarterly report', due: new Date(2026, 0, 20, 13, 0).toISOString() },
    { id: 'tsk2', type: 'task', title: 'Prepare for presentation', due: new Date(2026, 0, 20, 18, 0).toISOString() },
  ];

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left: Nav Sidebar */}
      <aside className="w-1/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4">
        {/* Content for Nav Sidebar will go here */}
      </aside>

      {/* Center: Unified Scrollable Timeline */}
      <main className="w-3/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4 overflow-y-auto">
        <UnifiedTimeline events={sampleEvents} tasks={sampleTasks} />
      </main>

      {/* Right: Info Panel */}
      <aside className="w-1/5 bg-white/10 backdrop-blur-lg rounded-lg m-2 p-4">
        {/* Content for Info Panel will go here */}
      </aside>
    </div>
  );
}
